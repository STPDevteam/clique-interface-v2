import { Typography } from '@mui/material'
import { SxProps } from '@mui/system'

export default function EmptyData({ sx, children }: { sx?: SxProps; children?: any }) {
  return (
    <Typography fontWeight={500} textAlign={'center'} sx={sx}>
      {children || 'No data'}
    </Typography>
  )
}
