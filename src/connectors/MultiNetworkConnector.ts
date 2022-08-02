import { NetworkConnector } from './NetworkConnector'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId, SUPPORTED_NETWORKS } from '../constants/chain'

const MainNetwork = new NetworkConnector({
  urls: {
    [ChainId.MAINNET]: 'https://mainnet.infura.io/v3/cf75b84907824c98bf013c5de408ff25'
  }
})
const RinkebyNetwork = new NetworkConnector({
  urls: {
    [ChainId.RINKEBY]: 'https://rinkeby.infura.io/v3/cf75b84907824c98bf013c5de408ff25'
  }
})

export function getOtherNetworkLibrary(chainId: ChainId) {
  switch (chainId) {
    case ChainId.MAINNET:
      return new Web3Provider(MainNetwork.provider as any)
    case ChainId.RINKEBY:
      return new Web3Provider(RinkebyNetwork.provider as any)
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
