import { Chain } from 'models/chain'
import { ReactComponent as ETH } from 'assets/svg/eth_logo.svg'
import EthUrl from 'assets/svg/eth_logo.svg'
import BSCUrl from 'assets/svg/binance.svg'
import { ReactComponent as BSC } from 'assets/svg/binance.svg'
import MaticSvg from 'assets/svg/matic.svg'
import { ReactComponent as MaticLogo } from 'assets/svg/matic.svg'
import KlaytnSvg from '../assets/svg/klaytn_logo.svg'
import { ReactComponent as KlaytnLogo } from '../assets/svg/klaytn_logo.svg'

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  BSC = 56,
  BSCTEST = 97,
  KLAYTN_BAOBAB = 1001,
  POLYGON = 137,
  KLAYTN = 8217,
  POLYGON_MUMBAI = 80001
}

export const NETWORK_CHAIN_ID: ChainId = process.env.REACT_APP_CHAIN_ID
  ? parseInt(process.env.REACT_APP_CHAIN_ID)
  : ChainId.BSC

export const SUPPORT_NETWORK_CHAIN_IDS: ChainId[] = process.env.REACT_APP_CHAIN_IDS
  ? process.env.REACT_APP_CHAIN_IDS.split(',').map(v => Number(v) as ChainId)
  : [ChainId.BSC]

export const IS_TEST_NET = !!(NETWORK_CHAIN_ID === ChainId.ROPSTEN)

export const AllChainList = [
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'ETH',
    name: 'Ethereum Mainnet',
    id: ChainId.MAINNET,
    hex: '0x1'
  },
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'Ropsten',
    name: 'Ropsten Test Network',
    id: ChainId.ROPSTEN,
    hex: '0x3'
  },
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'Rinkeby',
    name: 'Rinkeby Testnet',
    id: ChainId.RINKEBY,
    hex: '0x4'
  },
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'Goerli',
    name: 'Goerli Testnet',
    id: ChainId.GOERLI,
    hex: '0x5'
  },
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'Kovan',
    name: 'Kovan Testnet',
    id: ChainId.KOVAN,
    hex: '0x2a'
  },
  {
    icon: <BSC height={20} width={20} />,
    logo: BSCUrl,
    symbol: 'BSC',
    name: 'Binance Smart Chain',
    id: ChainId.BSC,
    hex: '0x38'
  },
  {
    icon: <BSC />,
    logo: BSCUrl,
    symbol: 'BSCTEST',
    name: 'Binance Testnet',
    id: ChainId.BSCTEST,
    hex: '0x61'
  },
  {
    icon: <KlaytnLogo />,
    logo: KlaytnSvg,
    symbol: 'Klaytn Baobab',
    name: 'Klaytn Baobab',
    id: ChainId.KLAYTN_BAOBAB,
    hex: '0x3e9'
  },
  {
    icon: <KlaytnLogo />,
    logo: KlaytnSvg,
    symbol: 'Klaytn',
    name: 'Klaytn Mainnet',
    id: ChainId.KLAYTN,
    hex: '0x2019'
  },
  {
    icon: <MaticLogo />,
    logo: MaticSvg,
    symbol: 'Polygon',
    name: 'Polygon',
    id: ChainId.POLYGON,
    hex: '0x89'
  },
  {
    icon: <MaticLogo />,
    logo: MaticSvg,
    symbol: 'Polygon mumbai',
    name: 'Polygon mumbai',
    id: ChainId.POLYGON_MUMBAI,
    hex: '0x13881'
  }
]

export const ChainList = AllChainList.filter(v => SUPPORT_NETWORK_CHAIN_IDS.includes(v.id))

export const ChainListMap: {
  [key: number]: { icon: JSX.Element; link?: string; selectedIcon?: JSX.Element } & Chain
} = ChainList.reduce((acc, item) => {
  acc[item.id] = item
  return acc
}, {} as any)

export const SUPPORTED_NETWORKS: {
  [chainId in ChainId]?: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com']
  },
  [ChainId.ROPSTEN]: {
    chainId: '0x3',
    chainName: 'Ropsten',
    nativeCurrency: {
      name: 'Ropsten',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://ropsten.infura.io/v3/'],
    blockExplorerUrls: ['https://ropsten.etherscan.io/']
  },
  [ChainId.RINKEBY]: {
    chainId: '0x4',
    chainName: 'Rinkeby',
    nativeCurrency: {
      name: 'Rinkeby',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://rinkeby.infura.io/v3/'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io/']
  },
  [ChainId.GOERLI]: {
    chainId: '0x5',
    chainName: 'Goerli',
    nativeCurrency: {
      name: 'Goerli ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://goerli.infura.io/v3/'],
    blockExplorerUrls: ['https://goerli.etherscan.io/']
  },
  [ChainId.KOVAN]: {
    chainId: '0x2a',
    chainName: 'Kovan',
    nativeCurrency: {
      name: 'Kovan',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://kovan.infura.io/v3/'],
    blockExplorerUrls: ['https://kovan.etherscan.io/']
  },
  [ChainId.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  [ChainId.BSCTEST]: {
    chainId: '0x61',
    chainName: 'Binance TEST Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com/']
  },
  [ChainId.KLAYTN_BAOBAB]: {
    chainId: '0x3e9',
    chainName: 'Klaytn Baobab',
    nativeCurrency: {
      name: 'Klaytn Baobab',
      symbol: 'KLAY',
      decimals: 18
    },
    rpcUrls: ['https://api.baobab.klaytn.net:8651/'],
    blockExplorerUrls: ['https://baobab.scope.klaytn.com/']
  },
  [ChainId.KLAYTN]: {
    chainId: '0x2019',
    chainName: 'Klaytn Mainnet',
    nativeCurrency: {
      name: 'Klaytn',
      symbol: 'KLAY',
      decimals: 18
    },
    rpcUrls: ['https://klaytn05.fandom.finance'],
    blockExplorerUrls: ['https://scope.klaytn.com/']
  },
  [ChainId.POLYGON]: {
    chainId: '0x89',
    chainName: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://rpc.ankr.com/polygon'],
    blockExplorerUrls: ['https://polygonscan.com/']
  },
  [ChainId.POLYGON_MUMBAI]: {
    chainId: '0x13881',
    chainName: 'Polygon Testnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://rpc.ankr.com/polygon_mumbai'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/']
  }
}
