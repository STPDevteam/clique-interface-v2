import Modal from '../../../components/Modal/index'
import { Box, Stack } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import useModal from 'hooks/useModal'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'

export default function DoubleCheckModal({ action }: { action: () => void }) {
  const { hideModal } = useModal()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Modal maxWidth="480px" width="100%" closeIcon padding="13px 28px">
      <Box display="grid" textAlign={'center'} width="100%" height="180px">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          color={'#3F5170'}
          sx={{
            fontSize: 30,
            fontWeight: 500
          }}
        >
          Transfer Confirm?
        </Box>
        <Stack gridTemplateColumns={'1fr 1fr'} justifyContent={'space-between'} flexDirection={'row'} mt={10}>
          <OutlineButton onClick={hideModal} noBold color="#0049C6" width={'200px'} height="40px">
            Close
          </OutlineButton>
          <LoadingButton
            loading={isLoading}
            loadingPosition="center"
            startIcon={<></>}
            variant="contained"
            color="primary"
            sx={{ width: 200, height: 40, textAlign: 'center' }}
            onClick={() => {
              setIsLoading(true)
              action()
            }}
          >
            Confirm
          </LoadingButton>
        </Stack>
      </Box>
    </Modal>
  )
}
