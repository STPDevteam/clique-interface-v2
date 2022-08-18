import { Box, Typography } from '@mui/material'
import { SxProps } from '@mui/system'
import { ReactComponent as ArrowBackIcon } from 'assets/svg/arrow_back.svg'
import { useHistory } from 'react-router-dom'

export default function Back({ text, event, sx }: { text?: string; event?: () => void; sx?: SxProps }) {
  const history = useHistory()
  return (
    <Box sx={{ marginLeft: 40, marginTop: 40, ...sx }}>
      <Typography
        sx={{ cursor: 'pointer' }}
        fontWeight={600}
        display={'inline-flex'}
        onClick={event ?? (() => history.goBack())}
        alignItems="center"
      >
        <ArrowBackIcon style={{ marginRight: 10 }}></ArrowBackIcon>
        {text || 'Back'}
      </Typography>
    </Box>
  )
}
