import Button from 'components/Button/Button'
import Modal from '../../../components/Modal/index'
import { Box, Stack, MenuItem, Alert } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import Input from 'components/Input'
import { useCallback, useState } from 'react'
import Select from 'components/Select/Select'
import useModal from 'hooks/useModal'
import { toast } from 'react-toastify'
import { useAddTeamspace } from 'hooks/useBackedDaoServer'

const guestList = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' }
]

export default function AddTeamspaceModal({
  isEdit,
  daoId,
  originTitle,
  originContent,
  originAccess,
  onDimiss
}: {
  isEdit: boolean
  daoId: number
  originContent?: string
  originTitle?: string
  originAccess?: string
  onDimiss: () => void
}) {
  const [title, setTitle] = useState(originTitle ?? '')
  const [des, setDes] = useState(originContent ?? '')
  const [currentStatus, setCurrentStatus] = useState<string>(originAccess ?? 'public')
  const { hideModal } = useModal()
  const create = useAddTeamspace()

  const onCreateClick = useCallback(() => {
    create(currentStatus, des, daoId, title)
      .then((res: any) => {
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'network error')
          return
        }
        toast.success('Create success')
        hideModal()
        onDimiss()
      })
      .catch(err => {
        console.log(err)
        toast.error('create error')
      })
  }, [create, currentStatus, daoId, des, hideModal, onDimiss, title])

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
          {isEdit ? 'Edit Workspace' : 'Add Workspace'}
        </Box>
        <Input value={title} maxLength={200} onChange={e => setTitle(e.target.value)} label="Title" />
        <Input
          height={138}
          style={{
            padding: '5px 20px'
          }}
          value={des}
          maxLength={200}
          multiline
          rows={6}
          label="Job description"
          onChange={e => setDes(e.target.value)}
        />
        <Select
          placeholder=""
          width={'422px'}
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
              selected={currentStatus === item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
        {!title.trim() ? (
          <Alert severity="error">Title required</Alert>
        ) : !des ? (
          <Alert severity="error">Description required</Alert>
        ) : (
          ''
        )}
        <Stack gridTemplateColumns={'1fr 1fr'} justifyContent={'space-between'} flexDirection={'row'} mt={10}>
          <OutlineButton onClick={hideModal} noBold color="#0049C6" width={'125px'} height="40px">
            Close
          </OutlineButton>
          <Button onClick={onCreateClick} width="125px" height="40px" disabled={!title || !des}>
            {isEdit ? 'Save' : 'Add'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
