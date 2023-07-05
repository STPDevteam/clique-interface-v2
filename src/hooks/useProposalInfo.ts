import { ChainId } from 'constants/chain'
import { TokenAmount } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { useEffect, useMemo, useState } from 'react'
import { VotingTypes } from 'state/buildingGovDao/actions'
import { useSingleCallResult } from 'state/multicall/hooks'
import { currentTimeStamp, getTargetTimeString } from 'utils'
import { sign } from 'utils/fetch/server'
import { retry } from 'utils/retry'
import { useGovernanceDaoContract } from './useContract'
import { SignType } from './useProposalCallback'

export enum ProposalStatus {
  SOON = 1,
  OPEN = 2,
  CLOSED = 3,
  CANCEL = 4,
  SUCCESS = 5,
  FAILED = 6
}

export interface ProposalSignProp {
  account: string
  balance: string
  signature: string
  tokenAddress: string
  tokenChainId: ChainId
  deadline: number
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
  optionContent: string
  optionId: number
  optionIndex: number
  votes: number
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
  myVoteInfo: any | undefined
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
  const [errRetry, setErrRetry] = useState(0)

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
        setTimeout(() => setErrRetry(Math.random()), 1000)
        setRet(undefined)
      }
    })()
  }, [account, chainId, daoAddress, proposalId, signType, errRetry])

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
      targetTimeString = 'User Closed'
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
