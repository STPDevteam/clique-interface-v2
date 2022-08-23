import { NetworkConnector } from './NetworkConnector'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId, SUPPORTED_NETWORKS } from '../constants/chain'

const MainNetwork = new NetworkConnector({
  urls: {
    [ChainId.MAINNET]: 'https://mainnet.infura.io/v3/169a2f10743f4afdaa0a17e148552867'
  }
})
const RinkebyNetwork = new NetworkConnector({
  urls: {
    [ChainId.RINKEBY]: 'https://rinkeby.infura.io/v3/169a2f10743f4afdaa0a17e148552867'
  }
})
const GoerliNetwork = new NetworkConnector({
  urls: {
    [ChainId.GOERLI]: 'https://goerli.infura.io/v3/169a2f10743f4afdaa0a17e148552867'
  }
})

export function getOtherNetworkLibrary(chainId: ChainId) {
  switch (chainId) {
    case ChainId.MAINNET:
      return new Web3Provider(MainNetwork.provider as any)
    case ChainId.RINKEBY:
      return new Web3Provider(RinkebyNetwork.provider as any)
    case ChainId.GOERLI:
      return new Web3Provider(GoerliNetwork.provider as any)
    default:
      if (SUPPORTED_NETWORKS?.[chainId]?.rpcUrls.length) {
        const network = new NetworkConnector({
          urls: {
            [chainId]: SUPPORTED_NETWORKS[chainId]?.rpcUrls[0] || ''
          }
        })
        return new Web3Provider(network.provider as any)
      }
      return undefined
  }
}
