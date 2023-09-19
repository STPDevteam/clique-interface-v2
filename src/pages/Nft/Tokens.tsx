import { Box, styled } from '@mui/material'
import { ReactComponent as ETHIcon } from 'assets/tokens/ETH.svg'
import { ReactComponent as STPTIcon } from 'assets/tokens/STPT.svg'
import { ReactComponent as USDCIcon } from 'assets/tokens/USDC.svg'
import { ReactComponent as USDTIcon } from 'assets/tokens/USDT.svg'
import { ReactComponent as WETHIcon } from 'assets/tokens/WETH.svg'

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
      <ETHIcon />
      ETH
    </>
  ),
  WETH: (
    <>
      <WETHIcon />
      WETH
    </>
  ),
  USDT: (
    <>
      <USDTIcon />
      USDT
    </>
  ),

  USDC: (
    <>
      <USDCIcon />
      USDC
    </>
  ),

  STPT: (
    <>
      <STPTIcon />
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
