import { Box, Typography } from '@mui/material'
import { ReactComponent as ArrowBackIcon } from 'assets/svg/arrow_back.svg'
import { useHistory } from 'react-router-dom'

export default function Back({ text, event }: { text?: string; event?: () => void }) {
  const history = useHistory()
  return (
    <Box mt={40} ml={40}>
      <Typography
        sx={{ cursor: 'pointer' }}
        fontWeight={500}
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
