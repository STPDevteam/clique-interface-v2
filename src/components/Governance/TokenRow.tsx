import { Box, styled, Typography } from '@mui/material'
import { TokenAmount } from 'constants/token'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  [`& .label`]: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.palette.text.secondary,
    marginBottom: 10
  },
  [`& .value`]: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.palette.text.secondary
  }
}))

export default function TokenRow({ totalSupply }: { totalSupply?: TokenAmount }) {
  return (
    <Wrapper>
      <Box>
        <Typography className="label">Token name</Typography>
        <Typography className="value">{totalSupply?.token?.name || '--'}</Typography>
      </Box>
      <Box>
        <Typography className="label">Symbol</Typography>
        <Typography className="value">{totalSupply?.token?.symbol || '--'}</Typography>
      </Box>
      <Box>
        <Typography className="label">Token supply</Typography>
        <Typography className="value">{totalSupply?.toSignificant(6, { groupSeparator: ',' }) || '--'}</Typography>
      </Box>
    </Wrapper>
  )
}
