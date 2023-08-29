import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { getConnection } from 'connection'
import useEagerlyConnect from 'hooks/useEagerlyConnect'
import useOrderedConnections from 'hooks/useOrderedConnections'
import usePrevious from 'hooks/usePrevious'
import { ReactNode, useEffect, useMemo } from 'react'
import { useConnectedWallets } from 'state/wallet/hooks'

export default function Web3Provider({ children }: { children: ReactNode }) {
  useEagerlyConnect()
  const connections = useOrderedConnections()
  const connectors: [Connector, Web3ReactHooks][] = useMemo(
    () => connections.map(({ hooks, connector }) => [connector, hooks]),
    [connections]
  )

  // Force a re-render when our connection state changes.
  // const [index, setIndex] = useState(0)
  // useEffect(() => setIndex(index => index + 1), [connections])
  const key = useMemo(() => connections.map(connection => connection.getName()).join('-'), [connections])

  return (
    <Web3ReactProvider connectors={connectors} key={key}>
      <Updater />
      {children}
    </Web3ReactProvider>
  )
}

/** A component to run hooks under the Web3ReactProvider context. */
function Updater() {
  const { account, chainId, connector, provider } = useWeb3React()

  // Send analytics events when the active account changes.
  const previousAccount = usePrevious(account)
  const [connectedWallets, addConnectedWallet] = useConnectedWallets()
  useEffect(() => {
    if (account && account !== previousAccount) {
      const walletType = getConnection(connector).getName()

      addConnectedWallet({ account, walletType })
    }
  }, [account, addConnectedWallet, chainId, connectedWallets, connector, previousAccount, provider])

  return null
}
