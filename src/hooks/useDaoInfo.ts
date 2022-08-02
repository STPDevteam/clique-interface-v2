import { useMemo } from 'react'
import { ChainId } from '../constants/chain'
import {
  useSingleCallResult
  // useSingleContractMultipleData
} from '../state/multicall/hooks'
import { useGovernanceDaoContract } from './useContract'

export interface DaoBaseInfoProp {
  name: string
  handle: string
  category: string
  description: string
  twitter: string
  github: string
  discord: string
  daoLogo: string
  daoTokenAddress: string
  daoTokenChainId: ChainId
}

export function useDaoBaseInfo(daoAddress?: string, chainId?: ChainId): DaoBaseInfoProp | undefined {
  const daoContract = useGovernanceDaoContract(daoAddress, chainId)
  const daoInfoRes = useSingleCallResult(daoContract, 'daoInfo', [], undefined, chainId)
  const daoTokenRes = useSingleCallResult(daoContract, 'daoToken', [], undefined, chainId)

  return useMemo(() => {
    const infoRes = daoInfoRes.result
    const tokenRes = daoTokenRes.result
    if (!infoRes || !tokenRes) return undefined
    return {
      name: infoRes.name,
      handle: infoRes.handle,
      category: infoRes.category,
      description: infoRes.description,
      twitter: infoRes.twitter,
      github: infoRes.github,
      discord: infoRes.discord,
      daoLogo: infoRes.daoLogo,
      daoTokenAddress: tokenRes.tokenAddress,
      daoTokenChainId: tokenRes.chainId
    }
  }, [daoInfoRes.result, daoTokenRes.result])
}
