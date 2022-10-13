import { ChainId } from 'constants/chain'
import { Token, TokenAmount } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import JSBI from 'jsbi'
import { useEffect, useMemo, useState } from 'react'
import { VotingTypes } from 'state/buildingGovDao/actions'
import { useSingleCallResult } from 'state/multicall/hooks'
import { currentTimeStamp, getTargetTimeString } from 'utils'
import { getProposalContent, sign } from 'utils/fetch/server'
import { retry } from 'utils/retry'
import { useGovernanceDaoContract } from './useContract'
import { useDaoInfo } from './useDaoInfo'
import { SignType } from './useProposalCallback'

export enum ProposalStatus {
  SOON = 1,
  OPEN = 2,
  CLOSED = 3,
  CANCEL = 4,
  SUCCESS = 5
}

export interface ProposalSignProp {
  account: string
  balance: string
  signature: string
  tokenAddress: string
  tokenChainId: ChainId
}

interface ProposalBaseProp {
  status: ProposalStatus
  creator: string
  title: string
  cancel: boolean
  introduction: string
  uuid: string
  startTime: number
  endTime: number
  votingType: VotingTypes
  targetTimeString: string
  proposalId: number
  votingThresholdSnapshot: string
}
export interface ProposalOptionProp {
  name: string
  amount: TokenAmount
  per: number
}
export interface ProposalDetailProp {
  status: ProposalStatus
  creator: string
  title: string
  cancel: boolean
  introduction: string
  uuid: string
  startTime: number
  endTime: number
  votingType: VotingTypes
  targetTimeString: string
  content: string | undefined
  proposalOptions: ProposalOptionProp[]
  myVoteInfo:
    | {
        name: string
        amount: TokenAmount
      }[]
    | undefined
  proposalId: number
  votingThreshold: TokenAmount | undefined
}

export function useProposalSign(
  daoAddress: string,
  chainId: ChainId,
  signType = SignType.CREATE_PROPOSAL,
  proposalId?: number
) {
  const { account } = useActiveWeb3React()
  const [ret, setRet] = useState<ProposalSignProp>()

  useEffect(() => {
    ;(async () => {
      if (!account || !daoAddress || (signType === SignType.VOTE && proposalId === undefined)) {
        setRet(undefined)
        return
      }
      const { promise } = retry(
        () =>
          sign(
            chainId,
            account,
            daoAddress,
            signType,
            signType === SignType.CREATE_PROPOSAL ? 0 : (proposalId as number)
          ),
        {
          n: 100,
          minWait: 1000,
          maxWait: 2500
        }
      )
      try {
        const returnData = await promise
        setRet(returnData.data.data as ProposalSignProp)
      } catch (error) {
        setRet(undefined)
      }
    })()
  }, [account, chainId, daoAddress, proposalId, signType])

  return ret
}

function useProposalBaseInfo(
  daoAddress: string,
  daoChainId: ChainId,
  proposalId: number
): undefined | ProposalBaseProp {
  const daoContract = useGovernanceDaoContract(daoAddress, daoChainId)
  const proposalInfoRes = useSingleCallResult(daoContract, 'proposals', [proposalId], undefined, daoChainId).result

  return useMemo(() => {
    if (!proposalInfoRes) return undefined
    const now = currentTimeStamp()
    const startTime = Number(proposalInfoRes.startTime.toString()) as number
    const endTime = Number(proposalInfoRes.endTime.toString()) as number

    let _status: ProposalStatus = ProposalStatus.CLOSED
    if (proposalInfoRes.cancel) {
      _status = ProposalStatus.CANCEL
    } else if (now >= proposalInfoRes.startTime && now <= proposalInfoRes.endTime) {
      _status = ProposalStatus.OPEN
    } else if (now < proposalInfoRes.startTime) {
      _status = ProposalStatus.SOON
    } else {
      _status = ProposalStatus.CLOSED
    }

    let targetTimeString = ''
    if (_status === ProposalStatus.SOON) {
      targetTimeString = getTargetTimeString(now, startTime)
    } else if (_status === ProposalStatus.OPEN) {
      targetTimeString = getTargetTimeString(now, endTime)
    } else if (proposalInfoRes.cancel) {
      targetTimeString = 'User closed'
    } else {
      targetTimeString = 'Closed ' + getTargetTimeString(now, endTime)
    }

    return {
      cancel: proposalInfoRes.cancel,
      status: _status,
      creator: proposalInfoRes.creator as string,
      title: proposalInfoRes.title as string,
      introduction: proposalInfoRes.introduction as string,
      uuid: proposalInfoRes.content as string,
      startTime,
      endTime,
      proposalId,
      votingType: proposalInfoRes.votingType as VotingTypes,
      votingThresholdSnapshot: proposalInfoRes.votingThresholdSnapshot.toString(),
      targetTimeString
    }
  }, [proposalInfoRes, proposalId])
}

export function useProposalDetailInfo(
  daoAddress: string,
  daoChainId: ChainId,
  proposalId: number,
  account?: string
): undefined | ProposalDetailProp {
  const [content, setContent] = useState<string>()
  const daoInfo = useDaoInfo(daoAddress, daoChainId)
  const daoContract = useGovernanceDaoContract(daoAddress, daoChainId)
  const proposalOptionRes = useSingleCallResult(
    daoContract,
    'getProposalOptionById',
    [proposalId],
    undefined,
    daoChainId
  ).result?.[0]
  const proposalBaseInfo = useProposalBaseInfo(daoAddress, daoChainId, proposalId)

  const totalVoteAmount: TokenAmount | undefined = useMemo(() => {
    if (!proposalOptionRes || !daoInfo?.token) {
      return undefined
    }
    const _total = proposalOptionRes
      .map((item: any) => item.amount.toString() as string)
      .reduce((a: string, b: string) => JSBI.ADD(JSBI.BigInt(a), JSBI.BigInt(b)))
    return new TokenAmount(daoInfo?.token, _total.toString())
  }, [proposalOptionRes, daoInfo?.token])

  const votingThreshold = useMemo(() => {
    if (!proposalBaseInfo?.votingThresholdSnapshot || !daoInfo?.token) return undefined
    return new TokenAmount(daoInfo.token, proposalBaseInfo.votingThresholdSnapshot)
  }, [daoInfo?.token, proposalBaseInfo?.votingThresholdSnapshot])

  const proposalOptions:
    | {
        name: string
        amount: TokenAmount
        per: number
      }[]
    | undefined = useMemo(() => {
    if (!proposalOptionRes || !daoInfo?.token || !totalVoteAmount) {
      return undefined
    }
    return proposalOptionRes.map((item: any) => {
      const _amount = new TokenAmount(daoInfo?.token as Token, item.amount.toString())
      return {
        name: item.name as string,
        amount: _amount,
        per: Number(_amount.divide(totalVoteAmount).toSignificant(6))
      }
    })
  }, [proposalOptionRes, daoInfo?.token, totalVoteAmount])

  const isSuccess = useMemo(() => {
    if (!votingThreshold || !totalVoteAmount) return undefined
    return !votingThreshold.greaterThan(totalVoteAmount)
  }, [votingThreshold, totalVoteAmount])

  useEffect(() => {
    ;(async () => {
      if (!proposalBaseInfo?.uuid) {
        setContent(undefined)
        return
      }
      const { promise } = retry(() => getProposalContent(proposalBaseInfo.uuid), {
        n: 100,
        minWait: 1000,
        maxWait: 2500
      })
      try {
        const returnData = await promise
        setContent(returnData.data.data.content)
      } catch (error) {
        setContent(undefined)
      }
    })()
  }, [proposalBaseInfo?.uuid])

  const accountVoteInfoRes = useSingleCallResult(
    account ? daoContract : undefined,
    'getVoteInfoByAccountAndProposalId',
    [account, proposalId],
    undefined,
    daoChainId
  ).result?.[0]

  const myVoteInfo:
    | {
        name: string
        amount: TokenAmount
      }[]
    | undefined = useMemo(() => {
    if (!daoInfo?.token || !accountVoteInfoRes || !proposalOptions?.length) {
      return undefined
    }
    return accountVoteInfoRes.map((item: any) => ({
      name: proposalOptions[item.index].name,
      amount: new TokenAmount(daoInfo?.token as Token, item.amount)
    }))
  }, [accountVoteInfoRes, proposalOptions, daoInfo?.token])

  return useMemo(() => {
    if (!proposalBaseInfo || !proposalOptions) {
      return undefined
    }
    const _proposalBaseInfo =
      isSuccess && proposalBaseInfo.status === ProposalStatus.CLOSED
        ? Object.assign(proposalBaseInfo, { status: ProposalStatus.SUCCESS })
        : proposalBaseInfo
    return {
      content,
      myVoteInfo,
      proposalOptions,
      votingThreshold,
      ..._proposalBaseInfo
    }
  }, [proposalBaseInfo, proposalOptions, isSuccess, content, myVoteInfo, votingThreshold])
}
