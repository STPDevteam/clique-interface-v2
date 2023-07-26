import { AbstractConnector } from '@web3-react/abstract-connector'
import { Token } from './token'
import { fortmatic, injected, portis, walletconnect, walletlink } from '../connectors'
import JSBI from 'jsbi'
import { ChainId } from './chain'

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const BAST_TOKEN: { [chainId in ChainId]?: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'USDT', 'USDT')
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C'
]

export const DAO_FACTORY_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: process.env.REACT_APP_ETH_DAO_FACTORY_ADDRESS || '',
  [ChainId.POLYGON]: process.env.REACT_APP_POLYGON_DAO_FACTORY_ADDRESS || '',
  [ChainId.KLAYTN]: process.env.REACT_APP_KLAYTN_DAO_FACTORY_ADDRESS || '',
  [ChainId.BSC]: process.env.REACT_APP_BSC_DAO_FACTORY_ADDRESS || '',
  [ChainId.GOERLI]: process.env.REACT_APP_GOERLI_DAO_FACTORY_ADDRESS || '',
  [ChainId.POLYGON_MUMBAI]: process.env.REACT_APP_POLYGON_MUMBAI_DAO_FACTORY_ADDRESS || '',
  [ChainId.KLAYTN_BAOBAB]: process.env.REACT_APP_KLAYTN_BAOBAB_DAO_FACTORY_ADDRESS || '',
  [ChainId.BSCTEST]: process.env.REACT_APP_BSC_TESTNET_DAO_FACTORY_ADDRESS || '',
  [ChainId.ZKSYNC_ERA]: '0xeb0C7B105998c88678f8A86Efc0bbD0Aa807A891',
  [ChainId.ZKSYNC_ERA_TESTNET]: '0x59db4F4e81E7cE00eB26B4638c2234d959dd05e0',
  [ChainId.POLYGON_MANGO]: process.env.REACT_APP_POLYGON_ZKEVM_TESTNET_DAO_FACTORY_ADDRESS || '',
  [ChainId.ZetaChain_TESTNET]: '0x626f936D28D758c9566d3EBC3A79491C23EB1015',
  [ChainId.COINBASE_TESTNET]: process.env.REACT_APP_COINBASE_TESTNET_DAO_FACTORY_ADDRESS || '',
  [ChainId.SEPOLIA]: '0x626f936D28D758c9566d3EBC3A79491C23EB1015'
}

export const AIRDROP_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: process.env.REACT_APP_ETH_AIRDROP_ADDRESS || '',
  [ChainId.POLYGON]: process.env.REACT_APP_POLYGON_AIRDROP_ADDRESS || '',
  [ChainId.KLAYTN]: process.env.REACT_APP_KLAYTN_AIRDROP_ADDRESS || '',
  [ChainId.BSC]: process.env.REACT_APP_BSC_AIRDROP_ADDRESS || '',
  [ChainId.GOERLI]: process.env.REACT_APP_GOERLI_AIRDROP_ADDRESS || '',
  [ChainId.POLYGON_MUMBAI]: process.env.REACT_APP_POLYGON_MUMBAI_AIRDROP_ADDRESS || '',
  [ChainId.KLAYTN_BAOBAB]: process.env.REACT_APP_KLAYTN_BAOBAB_AIRDROP_ADDRESS || '',
  [ChainId.ZKSYNC_ERA]: '0x4Ee940aBA04AA89D98adA57311d60519fc3154C0',
  [ChainId.ZKSYNC_ERA_TESTNET]: '0x8a636039F6981ED727Ff049e259A01E6E97be04E',
  [ChainId.BSCTEST]: process.env.REACT_APP_BSC_TESTNET_AIRDROP_ADDRESS || '',
  [ChainId.POLYGON_MANGO]: process.env.REACT_APP_POLYGON_ZKEVM_TESTNET_AIRDROP_ADDRESS || '',
  [ChainId.ZetaChain_TESTNET]: '0xA7eFe998463f65A49080c848510698158C64500d',
  [ChainId.COINBASE_TESTNET]: process.env.REACT_APP_COINBASE_TESTNET_AIRDROP_ADDRESS || ''
}

export const PUBLICSALE_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: process.env.REACT_APP_ETH_PUBLICSALE_ADDRESS || '',
  [ChainId.POLYGON]: process.env.REACT_APP_POLYGON_PUBLICSALE_ADDRESS || '',
  [ChainId.KLAYTN]: process.env.REACT_APP_KLAYTN_PUBLICSALE_ADDRESS || '',
  [ChainId.BSC]: process.env.REACT_APP_BSC_PUBLICSALE_ADDRESS || '',
  [ChainId.GOERLI]: process.env.REACT_APP_GOERLI_PUBLICSALE_ADDRESS || '',
  [ChainId.POLYGON_MUMBAI]: process.env.REACT_APP_POLYGON_MUMBAI_PUBLICSALE_ADDRESS || '',
  [ChainId.KLAYTN_BAOBAB]: process.env.REACT_APP_KLAYTN_BAOBAB_PUBLICSALE_ADDRESS || '',
  [ChainId.BSCTEST]: process.env.REACT_APP_BSC_TESTNET_PUBLICSALE_ADDRESS || '',
  [ChainId.POLYGON_MANGO]: process.env.REACT_APP_POLYGON_ZKEVM_TESTNET_PUBLICSALE_ADDRESS || '',
  [ChainId.COINBASE_TESTNET]: process.env.REACT_APP_COINBASE_TESTNET_PUBLICSALE_ADDRESS || '',
  [ChainId.SEPOLIA]: process.env.REACT_APP_SEPOLIA_PUBLICSALE_ADDRESS || ''
}

export const CREATE_SBT: { [chainId in ChainId]?: string } = {
  [ChainId.GOERLI]: '0xE7D3553e20fE2f41569456EE8980b49C6Da3A27b',
  [ChainId.SEPOLIA]: '0x507e6585455e4C68748D8c623Ad45dA4Ee2a6272',
  [ChainId.BSC]: process.env.REACT_APP_BSC_SBT_FACTORY_ADDRESS || ''
}

export const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL
export const serverUploadImage = serverBaseUrl + 'stpdao/v3/img/upload'
export const signMessage = 'Welcome to Clique'
export const myCliqueV1Domain = 'https://v1.myclique.io/'

enum ENV {
  PROD = 'prod',
  STAGING = 'staging',
  DEV = 'dev'
}
export const PUSH_CONFIG = {
  channelAddress: '0xC7BBDed82767c2eEcA8a9C9E03a1F63c5725DaBa',
  env: ENV.STAGING,
  app: ''
}
