import { Box, Typography } from '@mui/material'
import { SxProps } from '@mui/system'
import { ReactComponent as ArrowBackIcon } from 'assets/svg/arrow_back.svg'

export default function Back({ text, event, sx }: { text?: string; event?: () => void; sx?: SxProps }) {
  return (
    <Box sx={{ marginLeft: { sm: 20, xs: 0 }, marginTop: { sm: 20, xs: 10 }, ...sx }}>
      <Typography
        sx={{ cursor: 'pointer' }}
        fontWeight={600}
        display={'inline-flex'}
        onClick={event ?? (() => window.history.back())}
        alignItems="center"
      >
        <ArrowBackIcon style={{ marginRight: 10 }}></ArrowBackIcon>
        {text || 'Back'}
      </Typography>
    </Box>
  )
}
