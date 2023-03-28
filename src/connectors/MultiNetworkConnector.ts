import { NetworkConnector } from './NetworkConnector'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId, SUPPORTED_NETWORKS } from '../constants/chain'

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
        [chainId]: rpc
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
