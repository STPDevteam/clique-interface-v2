import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import DAO_FACTORY_ABI from '../constants/abis/daoFactory.json'
import SBT_FACTORY_ABI from '../constants/abis/sbt_factory.json'
import SBT_ABI from '../constants/abis/sbt.json'
import PROPOSAL_ABI from '../constants/abis/proposal.json'
import AIRDROP_ABI from '../constants/abis/airdrop.json'
import ERC721_ABI from '../constants/abis/ERC721.json'
import ERC1155_ABI from '../constants/abis/ERC1155.json'
import PUBLICSALE_ABI from '../constants/abis/publicsale.json'
import GOVERNANCE_DAO_ABI from '../constants/abis/governanceDao.json'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'
import UNISOCKS_ABI from '../constants/abis/unisocks.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import { ChainId } from '../constants/chain'
import { getOtherNetworkLibrary } from 'connection/MultiNetworkConnector'
import { AIRDROP_ADDRESS, DAO_FACTORY_ADDRESS, PUBLICSALE_ADDRESS, SBT_FACTORY, PROPOSAL_VOTING } from '../constants'
import { useUserLocation } from 'state/application/hooks'

// returns null on errors
function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
  queryChainId?: ChainId
): Contract | null {
  const { library, account, chainId } = useActiveWeb3React()
  const userLocation = useUserLocation()

  return useMemo(() => {
    if (!address || !ABI) return null
    if (!queryChainId && !chainId) return null

    if (queryChainId && chainId !== queryChainId) {
      const web3Library = getOtherNetworkLibrary(queryChainId, userLocation?.country || undefined)
      if (!web3Library) return null
      try {
        return getContract(address, ABI, web3Library, undefined)
      } catch (error) {
        console.error('Failed to get contract', error)
        return null
      }
    }
    if (chainId && library) {
      try {
        return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
      } catch (error) {
        console.error('Failed to get contract', error)
        return null
      }
    }
    return null
  }, [ABI, account, address, chainId, library, queryChainId, userLocation?.country, withSignerIfPossible])
}

export function useV2MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean,
  chainId?: ChainId
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible, chainId)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.GOERLI:
      case ChainId.ROPSTEN:
      case ChainId.RINKEBY:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useMulticallContract(queryChainId?: ChainId): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    queryChainId || chainId ? MULTICALL_NETWORKS[(queryChainId || chainId) as ChainId] : undefined,
    MULTICALL_ABI,
    false,
    queryChainId
  )
}

export function useSocksController(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId === ChainId.MAINNET ? '0x65770b5283117639760beA3F867b69b3697a91dd' : undefined,
    UNISOCKS_ABI,
    false
  )
}

export function useGovernanceDaoContract(daoAddress?: string, queryChainId?: ChainId): Contract | null {
  return useContract(daoAddress, GOVERNANCE_DAO_ABI, true, queryChainId)
}

export function useDaoFactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId && DAO_FACTORY_ADDRESS[chainId] ? DAO_FACTORY_ADDRESS[chainId] : undefined,
    DAO_FACTORY_ABI,
    true
  )
}

export function useAirdropContract(queryChainId?: ChainId): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    queryChainId || chainId ? AIRDROP_ADDRESS[(queryChainId || chainId) as ChainId] : undefined,
    AIRDROP_ABI,
    true,
    queryChainId
  )
}

export function usePublicSaleContract(queryChainId?: ChainId): Contract | null {
  const { chainId } = useActiveWeb3React()

  return useContract(
    queryChainId || chainId ? PUBLICSALE_ADDRESS[(queryChainId || chainId) as ChainId] : undefined,
    PUBLICSALE_ABI,
    true,
    queryChainId
  )
}

export function useSbtFactoryContract(queryChainId?: ChainId): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    queryChainId || chainId ? SBT_FACTORY[(queryChainId || chainId) as ChainId] : undefined,
    SBT_FACTORY_ABI,
    true,
    queryChainId
  )
}

export function useSbtContract(address?: string, queryChainId?: ChainId): Contract | null {
  return useContract(address, SBT_ABI, true, queryChainId)
}

export function useProposalContract(queryChainId?: ChainId): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    queryChainId || chainId ? PROPOSAL_VOTING[(queryChainId || chainId) as ChainId] : undefined,
    PROPOSAL_ABI,
    true,
    queryChainId
  )
}

// export function useErcContract(
//   address?: string,
//   queryChainId?: ChainId,
//   ErcType?: 'ERC721' | 'ERC1155'
// ): Contract | null {
//   console.log('contract=>', address, ErcType, queryChainId)
//   // return useContract(address, ErcType === 'ERC1155' ? ERC1155_ABI : ERC721_ABI, true, queryChainId)
//   return useContract('0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85', ERC721_ABI, true, 1)
// }

export function useERC721Contract(address: string | undefined, queryChainId?: ChainId): Contract | null {
  return useContract(address, ERC721_ABI, true, queryChainId)
}

export function useERC1155Contract(address: string | undefined, queryChainId?: ChainId): Contract | null {
  return useContract(address, ERC1155_ABI, true, queryChainId)
}
