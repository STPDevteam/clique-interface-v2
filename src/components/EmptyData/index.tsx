import { Typography } from '@mui/material'
import { SxProps } from '@mui/system'

export default function EmptyData({ sx, children }: { sx?: SxProps; children?: any }) {
  return (
    <Typography
      fontWeight={400}
      padding={'40px 0 '}
      fontSize={14}
      color={'#80829F'}
      textAlign={'center'}
      sx={{ backgroundColor: '#F8FBFF', ...sx }}
    >
      {children || 'No Data'}
    </Typography>
  )
}
