import Button from 'components/Button/Button'
import Modal from '../../../components/Modal/index'
import { Box, Stack, MenuItem } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import Input from 'components/Input'
import { useCallback, useState } from 'react'
import Select from 'components/Select/Select'
import { useSetDaoAdminCallback } from 'hooks/useGovernanceDaoCallback'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from 'hooks/useModal'
import { useActiveWeb3React } from 'hooks'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'

const guestList = [{ value: 'B_admin', label: 'Admin' }]

export default function AddMemberModal({
  onClose,
  daoAddress,
  curDaoChainId
}: {
  onClose: () => void
  daoAddress: string
  curDaoChainId: number
}) {
  const { chainId, library, account } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()
  const [address, setAddress] = useState('')
  const [currentStatus, setCurrentStatus] = useState<string>('B_admin')
  const setDaoAdminCallback = useSetDaoAdminCallback(daoAddress)
  const [btnDisable, setBtnDisable] = useState(false)

  const switchNetwork = useCallback(() => {
    triggerSwitchChain(library, curDaoChainId, account || '')
  }, [account, curDaoChainId, library])

  const createNewMember = useCallback(() => {
    setBtnDisable(true)
    setDaoAdminCallback(address, true)
      .then(() => {
        hideModal()
        setAddress('')
        setBtnDisable(false)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [address, hideModal, setDaoAdminCallback, showModal])

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
        <Stack gridTemplateColumns={'1fr 1fr'} justifyContent={'space-between'} flexDirection={'row'} mt={224}>
          <OutlineButton onClick={onClose} noBold color="#0049C6" width={'125px'} height="40px">
            Close
          </OutlineButton>
          <Button
            onClick={curDaoChainId === chainId ? createNewMember : switchNetwork}
            width="125px"
            height="40px"
            disabled={btnDisable}
          >
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
