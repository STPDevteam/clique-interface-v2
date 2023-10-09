import { Box, styled } from '@mui/material'
import ETHIcon from 'assets/tokens/ETH.svg'
import STPTIcon from 'assets/tokens/STPT.svg'
import USDCIcon from 'assets/tokens/USDC.svg'
import USDTIcon from 'assets/tokens/USDT.svg'
import WETHIcon from 'assets/tokens/WETH.svg'
import Image from 'components/Image'
import MaticSvg from 'assets/svg/matic.svg'
import BSCUrl from 'assets/svg/binance.svg'

const TokenContentStyle = styled(Box)(() => ({
  color: 'var(--word-color, #3f5170)',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px',
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  svg: {
    height: '24px',
    width: '24px'
  }
}))

const TokenList = {
  ETH: (
    <>
      <Image src={ETHIcon} />
      ETH
    </>
  ),
  WETH: (
    <>
      <Image src={WETHIcon} />
      WETH
    </>
  ),
  USDT: (
    <>
      <Image src={USDCIcon} />
      USDT
    </>
  ),

  USDC: (
    <>
      <Image src={USDTIcon} />
      USDC
    </>
  ),

  STPT: (
    <>
      <Image src={STPTIcon} />
      STPT
    </>
  )
}

const tokensSymbol = ['ETH', 'WETH', 'USDT', 'USDC', 'STPT'] as const
type TokenSymbol = typeof tokensSymbol[number]
export const Tokens = ({ Symbol }: { Symbol: TokenSymbol }) => {
  return (
    <>
      <TokenContentStyle>{TokenList[Symbol]}</TokenContentStyle>
    </>
  )
}

export function TokenListMap(chainId: number | undefined) {
  return TestTokens.filter(v => v.chainId === chainId)
}

export const TestTokens: {
  address: string
  chainId: number
  decimals: number
  symbol?: string
  name?: string
  logo?: string
  urlCoingecko?: string
  urlCoinmarketcap?: string
}[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    chainId: 1,
    decimals: 18,
    logo: ETHIcon,
    name: 'Ethereum',
    symbol: 'ETH',
    urlCoingecko: undefined,
    urlCoinmarketcap: undefined
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    chainId: 137,
    decimals: 16,
    logo: MaticSvg,
    symbol: 'Polygon',
    name: 'Polygon',
    urlCoingecko: undefined,
    urlCoinmarketcap: undefined
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    chainId: 1,
    decimals: 18,
    logo: WETHIcon,
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    urlCoingecko: undefined,
    urlCoinmarketcap: undefined
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    chainId: 1,
    decimals: 6,
    logo: USDCIcon,
    name: 'Tether USD',
    symbol: 'USDT',
    urlCoingecko: undefined,
    urlCoinmarketcap: undefined
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainId: 1,
    decimals: 6,
    logo: USDTIcon,
    name: 'USDC',
    symbol: 'USDC',
    urlCoingecko: undefined,
    urlCoinmarketcap: undefined
  },
  {
    address: '0xCdb80b55fd17eA4951f37Fa0542a419302bf8E81',
    chainId: 137,
    decimals: 16,
    logo: STPTIcon,
    name: 'Ruae',
    symbol: 'RXX',
    urlCoingecko: undefined,
    urlCoinmarketcap: undefined
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    chainId: 56,
    decimals: 18,
    logo: BSCUrl,
    symbol: 'BNB Chain',
    name: 'BNB Chain',
    urlCoingecko: undefined,
    urlCoinmarketcap: undefined
  }
]
