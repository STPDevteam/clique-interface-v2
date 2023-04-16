import { useEffect } from 'react'
import { Close } from '@mui/icons-material'
import Button from 'components/Button/Button'
import Modal from './index'
import { Typography, Box } from '@mui/material'
import useModal from 'hooks/useModal'
import cliqueIcon from 'assets/images/cliqueIcon.png'
import cereIcon from 'assets/images/cereIcon.png'
import Image from 'components/Image'

export default function JoinDAOModal() {
  const { showModal, hideModal } = useModal()

  useEffect(() => {
    showModal(<JoinDAOModalContent onDismiss={hideModal} />)
  }, [hideModal, showModal])

  return <></>
}

export function JoinDAOModalContent({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Modal maxWidth="608px" width="100%">
      <Box
        display="grid"
        gap="24px"
        width="100%"
        padding="32px"
        textAlign={'center'}
        sx={{
          '& img': {
            margin: 'auto'
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <div />
          <Image width={83} src={cliqueIcon}></Image>
          <Close onClick={onDismiss} sx={{ cursor: 'pointer' }} />
        </Box>
        <Image width={147} src={cereIcon}></Image>
        <Typography variant="inherit" fontSize={24} fontWeight={600}>
          Cere
        </Typography>
        <Typography variant="inherit" fontSize={14} fontWeight={600} color="#80829F">
          Verse Network by STP brings a full suite of native tools and infrastructures facilitating efficient
          decentralized decision-making for users, communities and organizations.
        </Typography>
        <Typography variant="inherit">Member 3.3k</Typography>
        <Button onClick={onDismiss}>Join DAO</Button>
      </Box>
    </Modal>
  )
}
