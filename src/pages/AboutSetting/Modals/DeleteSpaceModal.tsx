// import Button from 'components/Button/Button'
import Modal from '../../../components/Modal/index'
import { Box, Stack, Typography, styled } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import { useCallback } from 'react'
import { useDeleteSpace } from 'hooks/useBackedTaskServer'
import useModal from 'hooks/useModal'
import { toast } from 'react-toastify'

const Text = styled(Typography)({
  marginTop: 20,
  width: '100%',
  textAlign: 'left',
  fontFamily: 'Inter',
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px'
})

export default function DeleteSpaceModal({ spacesId, onDimiss }: { spacesId: number; onDimiss: () => void }) {
  const { hideModal } = useModal()
  const del = useDeleteSpace()

  const onDelete = useCallback(() => {
    del(spacesId)
      .then((res: any) => {
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'network error')
          return
        }
        toast.success('Delete success')
        hideModal()
        onDimiss()
      })
      .catch(err => {
        console.log(err)
        toast.error('delete error')
      })
  }, [del, hideModal, onDimiss, spacesId])

  return (
    <Modal maxWidth="480px" width="100%" closeIcon padding="13px 28px">
      <Box display="grid" textAlign={'center'} width="100%" height="200px">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          color={'#3F5170'}
          sx={{
            fontSize: 14,
            fontWeight: 500
          }}
        >
          Delete workspace
        </Box>
        <Text>All files in the team space will be cleared. Do you want to delete this team space?</Text>
        <Stack gridTemplateColumns={'1fr 1fr'} justifyContent={'space-between'} flexDirection={'row'} mt={30}>
          <OutlineButton onClick={hideModal} noBold color="#0049C6" width={'200px'} height="40px">
            Cancel
          </OutlineButton>
          <OutlineButton onClick={onDelete} noBold color="#E46767" width="200px" height="40px">
            Delete
          </OutlineButton>
        </Stack>
      </Box>
    </Modal>
  )
}
