import { Box, Typography, LinearProgress, linearProgressClasses, styled } from '@mui/material'

const StyledLinearProgress = styled(LinearProgress)(({}) => ({
  height: 24,
  borderRadius: '40px',
  border: '1px solid #D4D7E2',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'rgba(37, 37, 37, 0.1)'
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: '40px',
    backgroundColor: '#21C331'
  }
}))

export default function Progress({ val, total, unit }: { val: number; total: number; unit: string }) {
  const value = (val / total) * 100

  return (
    <Box display="grid" sx={{ width: 'max-content' }} columnGap={6} rowGap={4}>
      <Typography
        fontSize={12}
        sx={{ gridRowStart: 1, gridRowEnd: 'span 2', textAlign: 'center', display: 'flex', alignItems: 'flex-end' }}
      >
        {value | 0}%
      </Typography>
      <Typography
        fontSize={12}
        sx={{ gridColumnStart: 2, gridColumnEnd: 'span 1', textAlign: 'center' }}
      >{`${val} ${unit} / ${total} ${unit}`}</Typography>
      <StyledLinearProgress variant="determinate" value={value} sx={{ width: 120 }} />
    </Box>
  )
}

export function SimpleProgress({ per, width }: { per: number; width?: string }) {
  return (
    <Box display="flex" sx={{ width: width ?? 'max-content' }} alignItems="center">
      <StyledLinearProgress variant="determinate" value={per} sx={{ width: width ?? '100px' }} />
    </Box>
  )
}
