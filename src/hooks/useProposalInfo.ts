import { ChainId } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { useEffect, useMemo, useState } from 'react'
import { VotingTypes } from 'state/buildingGovDao/actions'
import { useSingleCallResult } from 'state/multicall/hooks'
import { currentTimeStamp, getTargetTimeString } from 'utils'
import { sign } from 'utils/fetch/server'
import { retry } from 'utils/retry'
import { useGovernanceDaoContract } from './useContract'
import { SignType } from './useCreateProposalCallback'

export enum ProposalStatus {
  SOON = 1,
  OPEN = 2,
  CLOSED = 3
}

export interface CreateProposalSignProp {
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
  uuid: string
  startTime: number
  endTime: number
  votingType: VotingTypes
  targetTimeString: string
}

export function useCreateProposalSign(daoAddress: string) {
  const { account } = useActiveWeb3React()
  const [ret, setRet] = useState<CreateProposalSignProp>()

  useEffect(() => {
    ;(async () => {
      if (!account || !daoAddress) {
        setRet(undefined)
        return
      }
      const { promise } = retry(() => sign(account, daoAddress, SignType.CREATE_PROPOSAL), {
        n: 100,
        minWait: 1000,
        maxWait: 2500
      })
      try {
        const returnData = await promise
        setRet(returnData.data.data as CreateProposalSignProp)
      } catch (error) {
        setRet(undefined)
      }
    })()
  }, [account, daoAddress])

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
      targetTimeString = ''
    } else {
      targetTimeString = 'Closed ' + getTargetTimeString(now, endTime)
    }

    return {
      status: _status,
      creator: proposalInfoRes.creator as string,
      title: proposalInfoRes.title as string,
      uuid: proposalInfoRes.content as string,
      startTime,
      endTime,
      votingType: proposalInfoRes.votingType as VotingTypes,
      targetTimeString
    }
  }, [proposalInfoRes])
}
