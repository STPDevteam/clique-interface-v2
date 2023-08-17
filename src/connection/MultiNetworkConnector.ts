import { NetworkConnector } from './NetworkConnector'
import { StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { ChainId, SUPPORTED_NETWORKS, SUPPORT_NETWORK_CHAIN_IDS } from '../constants/chain'
import { AppJsonRpcProvider } from 'connection/providers'

export function getRpcUrl(chainId: ChainId) {
  switch (chainId) {
    case ChainId.MAINNET:
      return `https://rpc.ankr.com/eth`
    // return `https://mainnet.infura.io/v3/169a2f10743f4afdaa0a17e148552867`
    case ChainId.RINKEBY:
      return 'https://rinkeby.infura.io/v3/169a2f10743f4afdaa0a17e148552867'
    case ChainId.GOERLI:
      return 'https://goerli.infura.io/v3/169a2f10743f4afdaa0a17e148552867'
    case ChainId.SEPOLIA:
      return 'https://sepolia.infura.io/v3/169a2f10743f4afdaa0a17e148552867'
    default:
      return SUPPORTED_NETWORKS[chainId]?.rpcUrls[0] || ''
  }
}

export function getOtherNetworkLibrary(chainId: ChainId, countryCode?: string) {
  const rpc = getRpcUrlByCountryCode(chainId, countryCode)
  if (!rpc) return undefined
  return new Web3Provider(
    new NetworkConnector({
      urls: {
        [chainId]: getRpcUrl(chainId)
      }
    }).provider as any
  )
}

function getRpcUrlByCountryCode(chainId: ChainId, countryCode?: string) {
  switch (chainId) {
    case ChainId.MAINNET:
      if (countryCode === 'KR') {
        return `https://mainnet.infura.io/v3/169a2f10743f4afdaa0a17e148552867`
      }
      return `https://rpc.ankr.com/eth`
    case ChainId.POLYGON:
      if (countryCode && ['KR'].includes(countryCode)) {
        return `https://polygon-rpc.com/`
      }
      return `https://rpc.ankr.com/polygon`
    case ChainId.RINKEBY:
      return 'https://rinkeby.infura.io/v3/169a2f10743f4afdaa0a17e148552867'
    case ChainId.GOERLI:
      return 'https://goerli.infura.io/v3/169a2f10743f4afdaa0a17e148552867'
    default:
      return SUPPORTED_NETWORKS[chainId]?.rpcUrls[0] || ''
  }
}

/**
 * These are the only JsonRpcProviders used directly by the interface.
 */

const _RPC_PROVIDERS: any = {}
const _RPC_URLS_MAPS: any = {}
SUPPORT_NETWORK_CHAIN_IDS.map(c => {
  _RPC_PROVIDERS[c] = new AppJsonRpcProvider(c)
  _RPC_URLS_MAPS[c] = getRpcUrl(c)
})
export const RPC_PROVIDERS = _RPC_PROVIDERS as { [key in ChainId]: StaticJsonRpcProvider }
export const RPC_URLS_MAPS = _RPC_URLS_MAPS as { [key in ChainId]: string }
