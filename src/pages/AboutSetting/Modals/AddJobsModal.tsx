import Button from 'components/Button/Button'
import Modal from '../../../components/Modal/index'
import { Box, Stack, MenuItem } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import Input from 'components/Input'
import { useState } from 'react'
import Select from 'components/Select/Select'

const guestList = [
  { value: undefined, label: 'Member' },
  { value: 'admin', label: 'Admin' },
  { value: 'superAdmin', label: 'Super Admin' }
]

export default function AddJobsModal({
  onClose,
  onClick,
  isEdit
}: {
  onClose: () => void
  onClick: () => void
  isEdit?: boolean
}) {
  const [title, setTitle] = useState('')
  const [des, setDes] = useState('')
  const [currentStatus, setCurrentStatus] = useState()

  return (
    <Modal maxWidth="480px" width="100%" closeIcon padding="13px 28px">
      <Box display="grid" textAlign={'center'} width="100%" height="480px">
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
          {isEdit ? 'Edit job' : 'Add job'}
        </Box>
        <Input value={title} onChange={e => setTitle(e.target.value)} label="Title" />
        <Input value={des} multiline rows={6} label="Job description" onChange={e => setDes(e.target.value)} />
        <Select
          placeholder=""
          width={'420px'}
          height={40}
          noBold
          label="Guests"
          value={currentStatus}
          style={{ borderRadius: '8px', borderColor: '#D4D7E2' }}
          onChange={e => {
            setCurrentStatus(e.target.value)
          }}
        >
          {guestList.map(item => (
            <MenuItem
              key={item.value}
              sx={{ fontWeight: 500, fontSize: 10 }}
              value={item.value}
              selected={currentStatus && currentStatus === item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
        <Stack gridTemplateColumns={'1fr 1fr'} justifyContent={'space-between'} flexDirection={'row'}>
          {isEdit ? (
            <>
              <OutlineButton onClick={onClose} noBold color="#E46767" width={'125px'} height="40px">
                Delete
              </OutlineButton>
              <Button onClick={onClick} width="125px" height="40px">
                Save
              </Button>
            </>
          ) : (
            <>
              <OutlineButton onClick={onClose} noBold color="#0049C6" width={'125px'} height="40px">
                Close
              </OutlineButton>
              <Button onClick={onClick} width="125px" height="40px">
                Add
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Modal>
  )
}
