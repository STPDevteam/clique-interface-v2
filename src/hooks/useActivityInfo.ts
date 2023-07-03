import { ChainId } from 'constants/chain'
import { Token, TokenAmount } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useNativeAndToken } from 'state/wallet/hooks'
import isZero from 'utils/isZero'
import { useAirdropContract } from './useContract'

export enum ActivityStatus {
  SOON = 'Soon',
  // OPEN = 'Open',
  Active = 'Active',
  ENDED = 'Ended',
  AIRDROP = 'Airdrop',
  CLOSED = 'Closed'
}

export interface AirdropInfoProp {
  isEth: boolean
  tokenAddress: string
  tokenStaked: TokenAmount
  tokenClaimed: TokenAmount
  airdropToken: Token
  airdropStartTime: number
  airdropEndTime: number
  airdropId: number
  creator: string
  merkleRoot: string
  airdropChainId: ChainId
}

export function useAirdropInfos(airdropId: number, airdropChainId: ChainId | undefined): AirdropInfoProp | undefined {
  const contract = useAirdropContract(airdropChainId)
  const airdropsRes = useSingleCallResult(
    airdropChainId ? contract : null,
    'airdrops',
    [airdropId],
    undefined,
    airdropChainId
  ).result

  const airdropsData = useMemo(() => {
    if (!airdropsRes) return undefined
    return {
      tokenAddress: airdropsRes.token,
      tokenStaked: airdropsRes.tokenStaked.toString(),
      tokenClaimed: airdropsRes.tokenClaimed.toString(),
      merkleRoot: airdropsRes.merkleRoot.toString(),
      startTime: Number(airdropsRes.startTime.toString()),
      endTime: Number(airdropsRes.endTime.toString()),
      creator: airdropsRes.creator
    }
  }, [airdropsRes])

  const airdropToken = useNativeAndToken(airdropsData?.tokenAddress, airdropChainId)

  return useMemo(() => {
    if (!airdropToken || !airdropsData || !airdropChainId) return undefined
    return {
      isEth: isZero(airdropsData?.tokenAddress || ''),
      tokenAddress: airdropsData.tokenAddress,
      tokenStaked: new TokenAmount(airdropToken, airdropsData.tokenStaked),
      tokenClaimed: new TokenAmount(airdropToken, airdropsData.tokenClaimed),
      airdropToken,
      airdropId,
      merkleRoot: airdropsData.merkleRoot,
      airdropStartTime: airdropsData.startTime,
      airdropEndTime: airdropsData.endTime,
      creator: airdropsData.creator,
      airdropChainId: airdropChainId
    }
  }, [airdropToken, airdropsData, airdropChainId, airdropId])
}

export function useAirdropClaimed(airdropId: number, chainId: ChainId | undefined): boolean | undefined {
  const { account } = useActiveWeb3React()
  const contract = useAirdropContract(chainId)
  const claimedRes = useSingleCallResult(
    chainId && account ? contract : null,
    'isClaimed',
    [airdropId, account || ''],
    undefined,
    chainId
  ).result

  return claimedRes?.[0]
}
