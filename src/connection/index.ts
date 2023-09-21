import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { Actions, Connector } from '@web3-react/types'
import GNOSIS_ICON from 'assets/walletIcon/gnosis.png'
import COINBASE_ICON from 'assets/walletIcon/coinbaseWalletIcon.svg'
import UNIWALLET_ICON from 'assets/walletIcon/uniswap-wallet-icon.png'
import WALLET_CONNECT_ICON from 'assets/walletIcon/walletConnectIcon.svg'
import OkxIcon_ICON from 'assets/walletIcon/okxIcon.png'
import BinanceWallet_ICON from 'assets/walletIcon/BinanceWalletIcon.svg'
import { isMobile, isNonIOSPhone } from 'utils/userAgent'
import { Connection, ConnectionType } from './types'
import { getInjection, getIsCoinbaseWallet, getIsInjected, getIsMetaMaskWallet, getIsOkxWallet } from './utils'
import { UniwalletConnect as UniwalletWCV2Connect, WalletConnectV2 } from './WalletConnectV2'
import { ChainId } from 'constants/chain'
import { RPC_PROVIDERS, getRpcUrl } from 'connection/MultiNetworkConnector'
import { OKXWallet } from '@okwallet/web3-react-okxwallet'
import { BinanceWallet } from 'web3-react-binance-wallet'
import { SELECTABLE_ENABLE_WALLETS } from '../constants'
import { toast } from 'react-toastify'

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`)
}

const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
  actions => new Network({ actions, urlMap: RPC_PROVIDERS, defaultChainId: 1 })
)
export const networkConnection: Connection = {
  getName: () => 'Network',
  connector: web3Network,
  hooks: web3NetworkHooks,
  type: ConnectionType.NETWORK,
  shouldDisplay: () => false
}

const getIsCoinbaseWalletBrowser = () => isMobile && getIsCoinbaseWallet()
const getIsMetaMaskBrowser = () => isMobile && getIsMetaMaskWallet()
const getIsOkxWalletBrowser = () => isMobile && getIsOkxWallet()
const getIsInjectedMobileBrowser = () =>
  getIsCoinbaseWalletBrowser() || getIsMetaMaskBrowser() || getIsOkxWalletBrowser()

const getShouldAdvertiseMetaMask = () =>
  !getIsMetaMaskWallet() && !isMobile && (!getIsInjected() || getIsCoinbaseWallet())
const getIsGenericInjector = () => getIsInjected() && !getIsMetaMaskWallet() && !getIsCoinbaseWallet()

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>(actions => new MetaMask({ actions, onError }))

const injectedConnection: Connection = {
  getName: () => getInjection().name,
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
  getIcon: (isDarkMode: boolean) => getInjection(isDarkMode).icon,
  shouldDisplay: () => true,
  // If on non-injected, non-mobile browser, prompt user to install Metamask
  overrideActivate: () => {
    // if (getShouldAdvertiseMetaMask()) {
    //   window.open('https://metamask.io/', 'inst_metamask')
    //   return true
    // }

    if (!getIsMetaMaskWallet() || !getIsGenericInjector() || !getShouldAdvertiseMetaMask()) {
      toast('Please open in the wallet')
      !isMobile && window.open('https://metamask.io/', 'inst_metamask')
      return true
    }

    return false
  }
}
const [web3GnosisSafe, web3GnosisSafeHooks] = initializeConnector<GnosisSafe>(actions => new GnosisSafe({ actions }))
export const gnosisSafeConnection: Connection = {
  getName: () => 'Gnosis Safe',
  connector: web3GnosisSafe,
  hooks: web3GnosisSafeHooks,
  type: ConnectionType.GNOSIS_SAFE,
  getIcon: () => GNOSIS_ICON,
  shouldDisplay: () => false
}

export const walletConnectV2Connection: Connection = new (class implements Connection {
  private initializer = (actions: Actions, defaultChainId = ChainId.MAINNET) =>
    new WalletConnectV2({ actions, defaultChainId, onError })

  type = ConnectionType.WALLET_CONNECT_V2
  getName = () => 'WalletConnect'
  getIcon = () => WALLET_CONNECT_ICON
  shouldDisplay = () => !getIsInjectedMobileBrowser()

  private _connector = initializeConnector<WalletConnectV2>(this.initializer)
  overrideActivate = (chainId?: ChainId) => {
    // Always re-create the connector, so that the chainId is updated.
    this._connector = initializeConnector(actions => this.initializer(actions, chainId))
    return false
  }
  get connector() {
    return this._connector[0]
  }
  get hooks() {
    return this._connector[1]
  }
})()

const [web3WCV2UniwalletConnect, web3WCV2UniwalletConnectHooks] = initializeConnector<UniwalletWCV2Connect>(
  actions => new UniwalletWCV2Connect({ actions, onError })
)
export const uniwalletWCV2ConnectConnection: Connection = {
  getName: () => 'Uniswap Wallet',
  connector: web3WCV2UniwalletConnect,
  hooks: web3WCV2UniwalletConnectHooks,
  type: ConnectionType.UNISWAP_WALLET_V2,
  getIcon: () => UNIWALLET_ICON,
  shouldDisplay: () => Boolean(!getIsInjectedMobileBrowser() && !isNonIOSPhone)
}

const [web3CoinbaseWallet, web3CoinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  actions =>
    new CoinbaseWallet({
      actions,
      options: {
        url: getRpcUrl(ChainId.MAINNET),
        appName: 'Bounce',
        reloadOnDisconnect: false
      },
      onError
    })
)
const coinbaseWalletConnection: Connection = {
  getName: () => 'Coinbase Wallet',
  connector: web3CoinbaseWallet,
  hooks: web3CoinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET,
  getIcon: () => COINBASE_ICON,
  shouldDisplay: () =>
    Boolean((isMobile && !getIsInjectedMobileBrowser()) || !isMobile || getIsCoinbaseWalletBrowser()),
  // If on a mobile browser that isn't the coinbase wallet browser, deeplink to the coinbase wallet app
  overrideActivate: () => {
    if (isMobile && !getIsInjectedMobileBrowser()) {
      window.open('https://go.cb-w.com/mtUDhEZPy1', 'cbwallet')
      return true
    }
    return false
  }
}

export const [okxWallet, okxWalletHooks] = initializeConnector<OKXWallet>(
  actions =>
    new OKXWallet({
      actions,
      options: {
        mustBeOKXWallet: true
      },
      onError
    })
)

const OKXWalletConnection: Connection = {
  getName: () => 'OKX Wallet',
  connector: okxWallet,
  hooks: okxWalletHooks,
  type: ConnectionType.OKX_WALLET,
  getIcon: () => OkxIcon_ICON,
  shouldDisplay: () => true,
  overrideActivate: () => {
    if (!getIsOkxWallet()) {
      window.open('https://www.okx.com/download')
      return true
    }
    return false
  }
}

export const [binanceWallet, BinanceWalletHooks] = initializeConnector<BinanceWallet>(
  actions =>
    new BinanceWallet({
      actions,
      options: {
        mustBeBinanceWallet: true
      },
      onError
    })
)

const binanceWalletConnection: Connection = {
  getName: () => 'Binance Wallet',
  connector: binanceWallet,
  hooks: BinanceWalletHooks,
  type: ConnectionType.BINANCE_WALLET,
  getIcon: () => BinanceWallet_ICON,
  shouldDisplay: () => true
}

export function getConnections() {
  return [
    injectedConnection,
    walletConnectV2Connection,
    OKXWalletConnection,
    coinbaseWalletConnection,
    binanceWalletConnection,
    uniwalletWCV2ConnectConnection,
    gnosisSafeConnection,
    networkConnection
  ].filter(v => SELECTABLE_ENABLE_WALLETS.includes(v.type))
}

export function getConnection(c: Connector | ConnectionType) {
  if (c instanceof Connector) {
    const connection = getConnections().find(connection => connection.connector === c)
    if (!connection) {
      throw Error('unsupported connector')
    }
    return connection
  } else {
    switch (c) {
      case ConnectionType.INJECTED:
        return injectedConnection
      case ConnectionType.COINBASE_WALLET:
        return coinbaseWalletConnection
      case ConnectionType.WALLET_CONNECT_V2:
        return walletConnectV2Connection
      case ConnectionType.UNISWAP_WALLET_V2:
        return uniwalletWCV2ConnectConnection
      case ConnectionType.NETWORK:
        return networkConnection
      case ConnectionType.GNOSIS_SAFE:
        return gnosisSafeConnection
      case ConnectionType.BINANCE_WALLET:
        return binanceWalletConnection
      case ConnectionType.OKX_WALLET:
        return OKXWalletConnection
    }
  }
}
