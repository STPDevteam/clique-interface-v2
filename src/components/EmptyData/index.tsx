import { Typography } from '@mui/material'
import { SxProps } from '@mui/system'

export default function EmptyData({ sx, children }: { sx?: SxProps; children?: any }) {
  return (
    <Typography fontWeight={500} padding={'40px 0 '} textAlign={'center'} sx={{ backgroundColor: '#F8FBFF', ...sx }}>
      {children || 'No data'}
    </Typography>
  )
}
