import { Box, Typography } from '@mui/material'
import Spinner from 'components/Spinner'
import theme from 'theme'
import Modal from 'components/Modal'

export default function PushManagementModal() {
  return (
    <Modal>
      <Box display="grid" padding="40px 24px" gap="24px" justifyItems="center">
        <Spinner size="40px" />
        <Typography fontWeight={400} fontSize={18}>
          Waiting For Confirmation
        </Typography>
        <Typography fontWeight={400} fontSize={14} textAlign="center" color={theme.textColor.text3}></Typography>
      </Box>
    </Modal>
  )
}
