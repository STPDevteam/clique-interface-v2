import Button from 'components/Button/Button'
import Modal from '../../../components/Modal/index'
import { Box, Stack, MenuItem, Alert } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import Input from 'components/Input'
import { useCallback, useState } from 'react'
import Select from 'components/Select/Select'
import { useCreateNewJob, useDeleteJob, useUpdateNewJob } from 'hooks/useBackedTaskServer'
import useModal from 'hooks/useModal'
import { toast } from 'react-toastify'

const guestList = [
  { value: 1, label: 'superAdmin' },
  { value: 2, label: 'Admin' }
]

export default function AddJobsModal({
  isEdit,
  publishId,
  chainId,
  originTitle,
  originContent,
  originLevel,
  onDimiss
}: {
  isEdit: boolean
  publishId?: number
  chainId: number
  originContent?: string
  originTitle?: string
  originLevel: number
  onDimiss: () => void
}) {
  const [title, setTitle] = useState(originTitle ?? '')
  const [des, setDes] = useState(originContent ?? '')
  const [currentStatus, setCurrentStatus] = useState<number>(originLevel ?? 1)
  const { hideModal } = useModal()
  const create = useCreateNewJob()
  const deleteFn = useDeleteJob()
  const update = useUpdateNewJob()

  const onCreateClick = useCallback(() => {
    create(chainId, des, currentStatus, title)
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
  }, [chainId, create, currentStatus, des, hideModal, onDimiss, title])

  const onUpdateClick = useCallback(() => {
    if (!publishId) return
    update(des, publishId, currentStatus, title)
      .then((res: any) => {
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'network error')
          return
        }
        toast.success('Update success')
        hideModal()
        onDimiss()
      })
      .catch(err => {
        console.log(err)
        toast.error('update error')
      })
  }, [currentStatus, des, hideModal, onDimiss, publishId, title, update])

  const onDelete = useCallback(() => {
    if (!publishId) return
    deleteFn(publishId)
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
  }, [deleteFn, hideModal, onDimiss, publishId])

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
          {isEdit ? (
            <>
              <OutlineButton onClick={onDelete} noBold color="#E46767" width={'125px'} height="40px">
                Delete
              </OutlineButton>
              <Button onClick={onUpdateClick} width="125px" height="40px" disabled={!title || !des}>
                Save
              </Button>
            </>
          ) : (
            <>
              <OutlineButton onClick={hideModal} noBold color="#0049C6" width={'125px'} height="40px">
                Close
              </OutlineButton>
              <Button onClick={onCreateClick} width="125px" height="40px" disabled={!title || !des}>
                Add
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Modal>
  )
}
