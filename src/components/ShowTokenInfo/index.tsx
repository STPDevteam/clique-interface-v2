import { Link, Stack, Typography } from '@mui/material'
import Copy from 'components/essential/Copy'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ChainId } from 'constants/chain'
import { useTotalSupply } from 'data/TotalSupply'
import useBreakpoint from 'hooks/useBreakpoint'
import { useToken } from 'state/wallet/hooks'
import { getEtherscanLink, shortenAddress } from 'utils'

export function ShowTokenInfo({ address, chainId }: { address: string; chainId: ChainId }) {
  const token = useToken(address, chainId)
  const isSmDown = useBreakpoint('sm')
  return token ? (
    <Stack direction={'row'} spacing={4} justifyContent="center" alignItems={'center'}>
      <CurrencyLogo currency={token} size={isSmDown ? '30px' : '40px'} />
      <Stack>
        <Typography fontSize={14} fontWeight={600} textAlign="left">
          {token.name}
        </Typography>
        <Typography variant="body2" fontWeight={500} alignSelf="baseline" textAlign="left">
          {token.symbol}
        </Typography>
      </Stack>
    </Stack>
  ) : (
    <>--</>
  )
}

export function ShowTokenSupply({ address, chainId }: { address: string; chainId: ChainId }) {
  const token = useToken(address, chainId)
  const supply = useTotalSupply(token || undefined)

  return supply ? (
    <>
      {supply.toSignificant(18, { groupSeparator: ',' })} {token?.symbol}
    </>
  ) : (
    <>--</>
  )
}

export function ShowCopyTokenAddress({ address, chainId }: { address: string; chainId: ChainId }) {
  return (
    <Stack direction={'row'} spacing={8} justifyContent="center">
      <Link fontWeight={600} fontSize={13} target="_blank" href={getEtherscanLink(chainId, address, 'address')}>
        {shortenAddress(address)}
      </Link>
      <Copy toCopy={address} margin="0" />
    </Stack>
  )
}
