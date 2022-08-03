import { Box, CircularProgress, Typography } from '@mui/material'
import { SxProps } from '@mui/system'
import { Dots } from 'theme/components'

export default function Loading({ sx }: { sx?: SxProps }) {
  return (
    <Box sx={sx} display="grid" justifyContent={'center'} justifyItems="center">
      <CircularProgress />
      <Typography textAlign={'center'}>
        Loading
        <Dots />
      </Typography>
    </Box>
  )
}
