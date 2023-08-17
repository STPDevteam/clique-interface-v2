import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { Connector } from '@web3-react/types'
import { ChainId, isSupportedChain } from 'constants/chain'
import { useWalletDeactivate } from 'connection/activate'

export function useActiveWeb3React(): {
  chainId?: ChainId
  account?: string
  connector?: Connector
  provider?: Web3Provider
  library?: Web3Provider
  active?: boolean
  deactivate: () => void
  errorNetwork: boolean | undefined
} {
  const deactivate = useWalletDeactivate()
  // const { connector, hooks } = useWeb3ReactCore()
  const { chainId, account: _account, connector, provider } = useWeb3React()

  return useMemo(() => {
    let account = _account
    if (chainId && !isSupportedChain(chainId)) {
      account = undefined
    }

    return {
      chainId,
      account,
      connector: connector,
      provider: provider,
      library: provider,
      active: !!_account,
      deactivate,
      errorNetwork: chainId === undefined ? undefined : !isSupportedChain(chainId)
    }
  }, [_account, chainId, connector, deactivate, provider])
}
