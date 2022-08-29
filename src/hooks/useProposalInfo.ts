import { ChainId } from 'constants/chain'
import { Token, TokenAmount } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import JSBI from 'jsbi'
import { useEffect, useMemo, useState } from 'react'
import { VotingTypes } from 'state/buildingGovDao/actions'
import { NEVER_RELOAD, useSingleCallResult } from 'state/multicall/hooks'
import { currentTimeStamp, getTargetTimeString } from 'utils'
import { getProposalContent, sign } from 'utils/fetch/server'
import { retry } from 'utils/retry'
import { useGovernanceDaoContract } from './useContract'
import { SignType } from './useProposalCallback'

export enum ProposalStatus {
  SOON = 1,
  OPEN = 2,
  CLOSED = 3
}

export interface ProposalSignProp {
  account: string
  balance: string
  signature: string
  tokenAddress: string
  tokenChainId: ChainId
}

export interface ProposalBaseProp {
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
      if (!account || !daoAddress) {
        setRet(undefined)
        return
      }
      const { promise } = retry(() => sign(chainId, account, daoAddress, signType, proposalId), {
        n: 100,
        minWait: 1000,
        maxWait: 2500
      })
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

export function useProposalBaseInfo(
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
      _status = ProposalStatus.CLOSED
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
      targetTimeString
    }
  }, [proposalInfoRes, proposalId])
}

export function useProposalDetailInfo(
  daoAddress: string,
  daoChainId: ChainId,
  proposalId: number,
  token?: Token,
  account?: string
): undefined | ProposalDetailProp {
  const [content, setContent] = useState<string>()
  const daoContract = useGovernanceDaoContract(daoAddress, daoChainId)
  const proposalOptionRes = useSingleCallResult(
    daoContract,
    'getProposalOptionById',
    [proposalId],
    NEVER_RELOAD,
    daoChainId
  ).result?.[0]
  const proposalBaseInfo = useProposalBaseInfo(daoAddress, daoChainId, proposalId)

  const totalVoteAmount: TokenAmount | undefined = useMemo(() => {
    if (!proposalOptionRes || !token) {
      return undefined
    }
    const _total = proposalOptionRes
      .map((item: any) => item.amount.toString() as string)
      .reduce((a: string, b: string) => JSBI.ADD(JSBI.BigInt(a), JSBI.BigInt(b)))
    return new TokenAmount(token, _total.toString())
  }, [proposalOptionRes, token])

  const proposalOptions:
    | {
        name: string
        amount: TokenAmount
        per: number
      }[]
    | undefined = useMemo(() => {
    if (!proposalOptionRes || !token || !totalVoteAmount) {
      return undefined
    }
    return proposalOptionRes.map((item: any) => {
      const _amount = new TokenAmount(token, item.amount.toString())
      return {
        name: item.name as string,
        amount: _amount,
        per: Number(_amount.divide(totalVoteAmount).toSignificant(6))
      }
    })
  }, [proposalOptionRes, token, totalVoteAmount])

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
    if (!token || !accountVoteInfoRes || !proposalOptions?.length) {
      return undefined
    }
    return accountVoteInfoRes.map((item: any) => ({
      name: proposalOptions[item.index].name,
      amount: new TokenAmount(token, item.amount)
    }))
  }, [accountVoteInfoRes, proposalOptions, token])

  return useMemo(() => {
    if (!proposalBaseInfo || !proposalOptions) {
      return undefined
    }
    return {
      content,
      myVoteInfo,
      proposalOptions,
      ...proposalBaseInfo
    }
  }, [content, proposalBaseInfo, proposalOptions, myVoteInfo])
}
