import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { CurrencyAmount, Percent } from '../constants/token/fractions'
import JSBI from 'jsbi'
import { ChainId } from '../constants/chain'
import emojiRegex from 'emoji-regex'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function isEmail(value: any): boolean {
  return /^[A-Za-z\d]+([-_\.][A-Za-z\d]+)*@([A-Za-z\d]+[-\.])+[A-Za-z\d]{2,4}(,[A-Za-z\d]+([-_\.][A-Za-z\d]+)*@([A-Za-z\d]+[-\.])+[A-Za-z\d]{2,4})*$/.test(
    value
  )
}

const explorers = {
  etherscan: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },

  blockscout: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      case 'token':
        return `${link}/tokens/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },

  harmony: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      case 'token':
        return `${link}/address/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },

  okex: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      case 'token':
        return `${link}/tokenAddr/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  }
}

interface ChainObject {
  [chainId: number]: {
    link: string
    builder: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => string
  }
}

const chains: ChainObject = {
  [ChainId.MAINNET]: {
    link: 'https://etherscan.io',
    builder: explorers.etherscan
  },
  [ChainId.ROPSTEN]: {
    link: 'https://ropsten.etherscan.io',
    builder: explorers.etherscan
  },
  [ChainId.RINKEBY]: {
    link: 'https://rinkeby.etherscan.io',
    builder: explorers.etherscan
  },
  [ChainId.KOVAN]: {
    link: 'https://kovan.etherscan.io',
    builder: explorers.etherscan
  },
  [ChainId.GOERLI]: {
    link: 'https://goerli.etherscan.io',
    builder: explorers.etherscan
  },
  [ChainId.BSCTEST]: {
    link: 'https://testnet.bscscan.com',
    builder: explorers.etherscan
  },
  [ChainId.BSC]: {
    link: 'https://bscscan.com',
    builder: explorers.etherscan
  },
  [ChainId.KLAYTN_BAOBAB]: {
    link: 'https://baobab.scope.klaytn.com',
    builder: explorers.etherscan
  },
  [ChainId.KLAYTN]: {
    link: 'https://scope.klaytn.com',
    builder: explorers.etherscan
  },
  [ChainId.POLYGON]: {
    link: 'https://polygonscan.com',
    builder: explorers.etherscan
  },
  [ChainId.POLYGON_MUMBAI]: {
    link: 'https://mumbai.polygonscan.com',
    builder: explorers.etherscan
  },
  [ChainId.POLYGON_MANGO]: {
    link: 'https://explorer.public.zkevm-test.net',
    builder: explorers.etherscan
  },
  [ChainId.COINBASE_TESTNET]: {
    link: 'https://goerli.basescan.org',
    builder: explorers.etherscan
  },
  [ChainId.ZetaChain_TESTNET]: {
    link: 'https://explorer.zetachain.com',
    builder: explorers.etherscan
  },
  [ChainId.SEPOLIA]: {
    link: 'https://sepolia.etherscan.io',
    builder: explorers.etherscan
  }
}

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const chain = chains[chainId]
  return chain.builder(chain.link, data, type)
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}
export function calculateGasPriceMargin(value: string): string {
  return JSBI.add(JSBI.BigInt(value), JSBI.divide(JSBI.BigInt(value), JSBI.BigInt(10))).toString()
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000))
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function removeEmoji(text: string) {
  const regex = emojiRegex()
  return text.replace(regex, '')
}

export function currentTimeStamp() {
  return Number((new Date().getTime() / 1000).toFixed())
}

export function getTargetTimeString(fromTime: number, toTime: number) {
  const _sec = toTime - fromTime
  const direction = _sec >= 0 ? true : false

  const sec = Math.abs(_sec)
  const days = Math.floor(sec / 86400)
  const hours = Math.floor(sec / 3600)
  const mins = Math.ceil(sec / 60)
  const hourText = hours > 1 ? `${hours} hours left` : `${hours} hour left`
  const agoHourText = hours > 1 ? `${hours} hours ago` : `${hours} hour ago`
  return direction
    ? days
      ? `${days} days left`
      : hours
      ? hourText
      : `${mins} mins left`
    : days
    ? `${days} days ago`
    : hours
    ? agoHourText
    : `${mins} mins ago`
}

export function getAllTargetTimeString(fromTime: number, toTime: number) {
  const _sec = toTime - fromTime
  const direction = _sec >= 0 ? true : false

  const sec = Math.abs(_sec)
  const days = Math.floor(sec / 86400)
  const hours = Math.floor((sec / 3600) % 24)
  const mins = Math.floor((sec / 60) % 60)
  const secs = Math.floor((sec / 1000) % 60)
  if (direction) {
    if (days) {
      return `${days} d ${hours} h ${mins} m ${secs} s`
    } else {
      return `${hours} h ${mins} m ${secs} s`
    }
  } else {
    if (days) {
      return `${days} d ${hours} h ${mins} m ${secs} s`
    } else {
      return `${hours} h ${mins} m ${secs} s`
    }
  }
}
