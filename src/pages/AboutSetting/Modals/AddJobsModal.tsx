import Button from 'components/Button/Button'
import Modal from '../../../components/Modal/index'
import { Box, Stack, MenuItem } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import Input from 'components/Input'
import { useCallback, useState } from 'react'
import Select from 'components/Select/Select'
import { useCreateNewJob, useDeleteJob, useUpdateNewJob } from 'hooks/useBackedTaskServer'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'

const guestList = [{ value: 'B_admin', label: 'Admin' }]

export default function AddJobsModal({
  isEdit,
  publishId,
  chainId,
  daoAddress,
  originTitle,
  originContent,
  onDimiss
}: {
  isEdit: boolean
  publishId?: number
  chainId: number
  daoAddress: string
  originContent?: string
  originTitle?: string
  onDimiss: () => void
}) {
  const [title, setTitle] = useState(originTitle ?? '')
  const [des, setDes] = useState(originContent ?? '')
  const [currentStatus, setCurrentStatus] = useState('B_admin')
  const { showModal, hideModal } = useModal()
  const create = useCreateNewJob()
  const deleteFn = useDeleteJob()
  const update = useUpdateNewJob()

  const onCreateClick = useCallback(() => {
    create(currentStatus, chainId, daoAddress, des, title)
      .then(res => {
        console.log(res)
        showModal(<MessageBox type="success">Add success</MessageBox>)
        onDimiss()
      })
      .catch(err => {
        console.log(err)
        showModal(<MessageBox type="error">Update error</MessageBox>)
      })
  }, [chainId, create, currentStatus, daoAddress, des, onDimiss, showModal, title])

  const onUpdateClick = useCallback(() => {
    if (!publishId) return
    update(des, publishId, title)
      .then(res => {
        showModal(<MessageBox type="success">Update success</MessageBox>)
        console.log(res)
        onDimiss()
      })
      .catch(err => {
        console.log(err)
        showModal(<MessageBox type="error">Update error</MessageBox>)
      })
  }, [des, onDimiss, publishId, showModal, title, update])

  const onDelete = useCallback(() => {
    if (!publishId) return
    deleteFn(publishId)
      .then(res => {
        console.log(res)
        showModal(<MessageBox type="success">Delete success</MessageBox>)
        onDimiss()
      })
      .catch(err => {
        showModal(<MessageBox type="error">Delete error</MessageBox>)
        console.log(err)
      })
  }, [deleteFn, onDimiss, publishId, showModal])

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
        <Stack gridTemplateColumns={'1fr 1fr'} justifyContent={'space-between'} flexDirection={'row'} mt={10}>
          {isEdit ? (
            <>
              <OutlineButton onClick={onDelete} noBold color="#E46767" width={'125px'} height="40px">
                Delete
              </OutlineButton>
              <Button onClick={onUpdateClick} width="125px" height="40px">
                Save
              </Button>
            </>
          ) : (
            <>
              <OutlineButton onClick={hideModal} noBold color="#0049C6" width={'125px'} height="40px">
                Close
              </OutlineButton>
              <Button onClick={onCreateClick} width="125px" height="40px">
                Add
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Modal>
  )
}
