import { Token, TokenAmount } from 'constants/token'
import { useEffect, useMemo, useState } from 'react'
import { useBlockNumber } from 'state/application/hooks'
import { VotingTypes } from 'state/buildingGovDao/actions'
import { useToken } from 'state/wallet/hooks'
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
  website: string
  discord: string
  daoLogo: string
  daoTokenAddress: string
  daoTokenChainId: ChainId
}

export interface DaoInfoProp {
  daoAddress: string
  name: string
  handle: string
  category: string
  description: string
  twitter: string
  github: string
  website: string
  discord: string
  daoLogo: string
  daoTokenAddress: string
  daoTokenChainId: ChainId
  token: Token | undefined
  proposalThreshold: TokenAmount | undefined
  votingThreshold: TokenAmount | undefined
  votingPeriod: number
  votingType: VotingTypes
  isCustomVotes: boolean
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
      website: infoRes.website,
      daoLogo: infoRes.daoLogo,
      daoTokenAddress: tokenRes.tokenAddress,
      daoTokenChainId: Number(tokenRes.chainId)
    }
  }, [daoInfoRes.result, daoTokenRes.result])
}

export function useDaoInfo(daoAddress?: string, chainId?: ChainId): DaoInfoProp | undefined {
  const daoContract = useGovernanceDaoContract(daoAddress, chainId)
  const daoBaseInfo = useDaoBaseInfo(daoAddress, chainId)
  const token = useToken(daoBaseInfo?.daoTokenAddress || '', daoBaseInfo?.daoTokenChainId)
  const daoGovernanceRes = useSingleCallResult(daoContract, 'daoGovernance', [], undefined, chainId)

  return useMemo(() => {
    const governanceRes = daoGovernanceRes.result
    if (!daoBaseInfo || !governanceRes || !daoAddress) return undefined
    return {
      ...daoBaseInfo,
      daoAddress: daoAddress,
      token: token || undefined,
      proposalThreshold: token ? new TokenAmount(token, governanceRes.proposalThreshold) : undefined,
      votingThreshold: token ? new TokenAmount(token, governanceRes.votingThreshold) : undefined,
      votingPeriod: Number(governanceRes.votingPeriod),
      votingType: Number(governanceRes.votingType),
      isCustomVotes: Number(governanceRes.votingPeriod) === 0
    }
  }, [daoAddress, daoBaseInfo, daoGovernanceRes.result, token])
}

export enum DaoAdminLevelProp {
  SUPER_ADMIN,
  ADMIN,
  NORMAL
}

export function useDaoAdminLevel(daoAddress?: string, chainId?: ChainId, account?: string) {
  const daoContract = useGovernanceDaoContract(daoAddress, chainId)

  const adminsRes = useSingleCallResult(account ? daoContract : null, 'admins', [account], undefined, chainId)
    .result?.[0]
  const ownerRes = useSingleCallResult(daoContract, 'owner', [], undefined, chainId).result?.[0]

  return useMemo(() => {
    if (!account || ownerRes === undefined || adminsRes === undefined) return undefined
    if (account && ownerRes && ownerRes.toLowerCase() === account.toLowerCase()) {
      return DaoAdminLevelProp.SUPER_ADMIN
    }
    if (adminsRes) {
      return DaoAdminLevelProp.ADMIN
    }
    return DaoAdminLevelProp.NORMAL
  }, [ownerRes, adminsRes, account])
}

export function useDaoAdminLevelList(daoAddress?: string, chainId?: ChainId, account?: string) {
  const daoContract = useGovernanceDaoContract(daoAddress, chainId)

  const adminsRes = useSingleCallResult(account ? daoContract : null, 'admins', [account], undefined, chainId)
    .result?.[0]
  const ownerRes = useSingleCallResult(daoContract, 'owner', [], undefined, chainId).result?.[0]

  return useMemo(() => {
    const retArr: DaoAdminLevelProp[] = []
    if (!account || ownerRes === undefined || adminsRes === undefined) return undefined
    if (account && ownerRes && ownerRes.toLowerCase() === account.toLowerCase()) {
      retArr.push(DaoAdminLevelProp.SUPER_ADMIN)
    }
    if (adminsRes) {
      retArr.push(DaoAdminLevelProp.ADMIN)
    }
    return retArr
  }, [ownerRes, adminsRes, account])
}

export function useDaoVersion(daoAddress: string, chainId: ChainId) {
  const daoContract = useGovernanceDaoContract(daoAddress, chainId)
  const blockNumber = useBlockNumber(chainId)
  const [latest, setLatest] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    daoContract
      ?.daoVersion()
      .then((res: string) => {
        if (res === 'v0.2.1') setLatest(true)
        else setLatest(false)
      })
      .catch(() => {
        setLatest(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, daoContract])

  return latest
}
