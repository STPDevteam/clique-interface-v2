import Button from 'components/Button/Button'
import Modal from '../../../components/Modal/index'
import { Box, MenuItem, Stack, Typography, styled } from '@mui/material'
import { useCallback, useState } from 'react'
import { useDeleteSpace } from 'hooks/useBackedTaskServer'
import useModal from 'hooks/useModal'
import { toast } from 'react-toastify'
import Select from 'components/Select/Select'

const Text = styled(Typography)({
  marginTop: 0,
  color: '#80829F',
  width: '100%',
  textAlign: 'left',
  fontFamily: 'Inter',
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px'
})

const Title = styled(Typography)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  color: '#3F5170',
  fontSize: 14,
  fontWeight: 500
})

const adminList = [
  {
    account: '0x5159ed45c75C406CFCd832caCEE5B5E48eaD568E',
    nickname: 'Niko'
  },
  {
    account: '0x5159ed45c75C406CFCd832caCEE5B5E48eaD568E',
    nickname: 'Taiko'
  },
  {
    account: '0x5159ed45c75C406CFCd832caCEE5B5E48eaD568E',
    nickname: 'wuxidixi'
  }
]

export default function TransferAdminModal({ spacesId, onDimiss }: { spacesId: number; onDimiss: () => void }) {
  const { hideModal } = useModal()
  const [currentStatus, setCurrentStatus] = useState('')
  const del = useDeleteSpace()

  const transferClick = useCallback(() => {
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
      <Box display="grid" textAlign={'center'} width="100%" height="180px">
        <Title>Leave workspace</Title>
        <Text>Transfer this workspace to an admin.</Text>
        <Select
          placeholder=""
          width={'422px'}
          height={40}
          noBold
          label=""
          value={currentStatus}
          style={{ borderRadius: '8px', borderColor: '#D4D7E2', fontSize: 14 }}
          onChange={e => {
            setCurrentStatus(e.target.value)
          }}
        >
          {adminList.map((item: any) => (
            <MenuItem
              key={item.account}
              sx={{ fontWeight: 500, fontSize: '13px !important' }}
              value={item.value}
              selected={currentStatus === item.value}
            >
              {item.account}
            </MenuItem>
          ))}
        </Select>
        <Stack justifyContent={'center'} mt={20}>
          <Button width="100%" height="40px" onClick={transferClick}>
            Transfer and leave
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
