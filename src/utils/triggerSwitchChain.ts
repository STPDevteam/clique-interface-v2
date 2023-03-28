import { Web3Provider } from '@ethersproject/providers'
import { ChainId, SUPPORTED_NETWORKS } from '../constants/chain'

export function triggerSwitchChain(library: Web3Provider | undefined, chainId: ChainId, account: string) {
  if ([1, 3, 4, 5, 42, 11155111].includes(chainId)) {
    library?.send('wallet_switchEthereumChain', [{ chainId: SUPPORTED_NETWORKS[chainId as ChainId]?.chainId }, account])
  } else {
    const params = SUPPORTED_NETWORKS[chainId as ChainId]
    const obj: any = {}
    obj.chainId = params?.chainId
    obj.chainName = params?.chainName
    obj.nativeCurrency = params?.nativeCurrency
    obj.rpcUrls = params?.rpcUrls
    obj.blockExplorerUrls = params?.blockExplorerUrls

    library?.send('wallet_addEthereumChain', [obj, account])
  }
}
