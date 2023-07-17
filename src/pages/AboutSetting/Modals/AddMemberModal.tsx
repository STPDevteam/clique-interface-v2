import Button from 'components/Button/Button'
import Modal from '../../../components/Modal/index'
import { Box, Stack, MenuItem, Alert } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import Input from 'components/Input'
import { useCallback, useState } from 'react'
import Select from 'components/Select/Select'
import useModal from 'hooks/useModal'
import { isAddress } from 'ethers/lib/utils'
import { useChangeAdminRole } from 'hooks/useBackedDaoServer'
import { toast } from 'react-toastify'
import { useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
import { useActiveWeb3React } from 'hooks'

const guestList = [
  { value: 1, label: 'Owner' },
  { value: 2, label: 'Admin' }
]

export default function AddMemberModal({ onClose, daoId }: { onClose: () => void; daoId: number }) {
  const { hideModal } = useModal()
  const { account } = useActiveWeb3React()
  const [address, setAddress] = useState('')
  const [currentStatus, setCurrentStatus] = useState<number>(1)
  const add = useChangeAdminRole()
  const [btnDisable, setBtnDisable] = useState(false)
  const { myJoinDaoData: isJoined } = useUpdateDaoDataCallback()
  const createNewMember = useCallback(() => {
    setBtnDisable(true)
    add(address, currentStatus, daoId)
      .then((res: any) => {
        setBtnDisable(false)
        if (
          res.data.code !== 200 &&
          account === address &&
          (isJoined?.job === 'owner' || isJoined?.job === 'superAdmin')
        ) {
          if (isJoined?.job === 'owner') {
            toast.error('Add error you are already a owner.')
          }
          if (isJoined?.job === 'superAdmin') {
            toast.error('Add error you are already a superAdmin.')
          }
          return
        } else if (res.data.code !== 200) {
          toast.error(res.data.msg || 'Add error')
          return
        }
        hideModal()
        toast.success('Add member success')
      })
      .catch((err: any) => {
        hideModal()
        toast.error(err?.data?.message || err?.error?.message || err?.message || 'Unknown error')
      })
  }, [account, add, address, currentStatus, daoId, hideModal, isJoined?.job])

  return (
    <Modal maxWidth="480px" width="100%" closeIcon padding="13px 28px">
      <Box display="flex" flexDirection={'column'} textAlign={'center'} width="100%" height="480px">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          color={'#3F5170'}
          mb={27}
          sx={{
            fontSize: 14,
            fontWeight: 500
          }}
        >
          Add member
        </Box>
        <Box mb={20}>
          <Input value={address} onChange={e => setAddress(e.target.value)} label="Wallet address" />
        </Box>
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
        <Box height={48}>
          {(!isAddress(address) || !address.trim()) && (
            <Alert severity="error" sx={{ marginTop: 15 }}>
              Wrong address
            </Alert>
          )}
        </Box>
        <Stack
          gridTemplateColumns={'1fr 1fr'}
          justifyContent={'space-between'}
          flexDirection={'row'}
          mt={!isAddress(address) ? 176 : 224}
        >
          <OutlineButton onClick={onClose} noBold color="#0049C6" width={'125px'} height="40px">
            Close
          </OutlineButton>
          <Button onClick={createNewMember} width="125px" height="40px" disabled={btnDisable || !isAddress(address)}>
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
