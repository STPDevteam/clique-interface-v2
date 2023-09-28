import { Box, styled } from '@mui/material'
import ETHIcon from 'assets/tokens/ETH.svg'
import STPTIcon from 'assets/tokens/STPT.svg'
import USDCIcon from 'assets/tokens/USDC.svg'
import USDTIcon from 'assets/tokens/USDT.svg'
import WETHIcon from 'assets/tokens/WETH.svg'
import Image from 'components/Image'

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
      <Image src={STPTIcon} />
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
      <Image src={WETHIcon} />
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
