import { ChainId } from 'constants/chain'
import { Token, TokenAmount } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useToken } from 'state/wallet/hooks'
import { currentTimeStamp } from 'utils'
import { useGovernanceDaoContract } from './useContract'

export enum ActivityStatus {
  SOON = 1,
  OPEN = 2,
  CLOSED = 3
}

export interface AirdropBaseInfoProp {
  tokenAddress: string
  remainderAmount: TokenAmount
  airdropToken: Token
  startTime: number
  endTime: number
  creator: string
  chainId: ChainId
  status: ActivityStatus
}

export function useAirdropBaseInfo(
  daoAddress: string,
  daoChainId: ChainId,
  airdropId: number
): AirdropBaseInfoProp | undefined {
  const daoContract = useGovernanceDaoContract(daoAddress, daoChainId)
  const airdropsRes = useSingleCallResult(daoContract, 'airdrops', [airdropId], undefined, daoChainId).result

  const airdropsData = useMemo(() => {
    if (!airdropsRes) return undefined
    return {
      tokenAddress: airdropsRes.token,
      remainderAmount: airdropsRes.tokenReserve.toString(),
      startTime: Number(airdropsRes.startTime.toString()),
      endTime: Number(airdropsRes.endTime.toString()),
      creator: airdropsRes.creator
    }
  }, [airdropsRes])

  const airdropToken = useToken(airdropsData?.tokenAddress, daoChainId)

  return useMemo(() => {
    if (!airdropToken || !airdropsData) return undefined
    const curTime = currentTimeStamp()
    return {
      tokenAddress: airdropsData.tokenAddress,
      remainderAmount: new TokenAmount(airdropToken, airdropsData.remainderAmount),
      airdropToken,
      startTime: airdropsData.startTime,
      endTime: airdropsData.endTime,
      creator: airdropsData.creator,
      chainId: daoChainId,
      status:
        airdropsData.startTime <= curTime && airdropsData.endTime > curTime
          ? ActivityStatus.OPEN
          : airdropsData.startTime > curTime
          ? ActivityStatus.SOON
          : ActivityStatus.CLOSED
    }
  }, [airdropToken, airdropsData, daoChainId])
}

export function useAirdropClaimed(daoAddress: string, daoChainId: ChainId, airdropId: number): boolean | undefined {
  const { account } = useActiveWeb3React()
  const daoContract = useGovernanceDaoContract(daoAddress, daoChainId)
  const claimedRes = useSingleCallResult(
    account ? daoContract : null,
    'isClaimed',
    [airdropId, account || ''],
    undefined,
    daoChainId
  ).result

  return claimedRes?.[0]
}
