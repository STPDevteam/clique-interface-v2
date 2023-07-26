import Button from 'components/Button/Button'
import Modal from 'components/Modal/index'
import { Box, Stack } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import { useCallback } from 'react'
import { joinDAO } from 'utils/fetch/server'
import { toast } from 'react-toastify'
import useModal from 'hooks/useModal'
// import { useActiveWeb3React } from 'hooks'

export default function JoinDaoClaimModal({
  onClose,
  daoId,
  setIsJoin,
  setUpdateIsClaim
}: {
  onClose: () => void
  daoId: number
  setIsJoin: React.Dispatch<React.SetStateAction<boolean>>
  setUpdateIsClaim: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { hideModal } = useModal()

  const JoinDaoCallback = useCallback(async () => {
    await joinDAO(Number(daoId))
      .then(() => {
        setIsJoin(true)
        setUpdateIsClaim(true)
        hideModal()
        toast.success('Join success')
      })
      .catch(() => {
        setIsJoin(false)
        console.log('error')
      })
  }, [daoId, hideModal, setIsJoin, setUpdateIsClaim])

  return (
    <Modal maxWidth="480px" width="100%" closeIcon padding="13px 28px">
      <Box display="flex" flexDirection={'column'} width="100%" height="200px">
        <Box
          sx={{
            height: 145,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: '500 16px/20px "Inter"',
            color: '#3F5170'
          }}
        >
          Join DAO to claim
        </Box>
        <Stack gridTemplateColumns={'1fr 1fr'} justifyContent={'space-between'} flexDirection={'row'}>
          <OutlineButton onClick={onClose} noBold color="#0049C6" width={'200px'} height="40px">
            Cancel
          </OutlineButton>
          <Button onClick={JoinDaoCallback} width="200px" height="40px">
            Join
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
