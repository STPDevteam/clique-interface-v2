import { useModalOpen, useSignLoginModalToggle } from 'state/application/hooks'
import Modal from '../Modal'
import { ApplicationModal } from 'state/application/actions'
import { Box, Button, Typography } from '@mui/material'
import { useCallback, useEffect } from 'react'
// import { setInjectedConnected } from 'utils/isInjectedConnectedPrev'
import { useWeb3React } from '@web3-react/core'
import { useActiveWeb3React } from 'hooks'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import logo from '../../assets/svg/logo.svg'
import Image from 'components/Image'

export default function LoginModal() {
  const { connector, deactivate } = useWeb3React()
  const { account } = useActiveWeb3React()
  const walletModalOpen = useModalOpen(ApplicationModal.SIGN_LOGIN)
  const toggleSignLoginModal = useSignLoginModalToggle()
  const login = useLoginSignature()

  const userInfo = useUserInfo()

  const closeModal = useCallback(() => {
    if (userInfo?.loggedToken && walletModalOpen) {
      toggleSignLoginModal()
    }
  }, [toggleSignLoginModal, userInfo?.loggedToken, walletModalOpen])

  const openModal = useCallback(() => {
    if (!userInfo?.loggedToken && !walletModalOpen && account) {
      toggleSignLoginModal()
    }
  }, [account, toggleSignLoginModal, userInfo?.loggedToken, walletModalOpen])

  useEffect(() => {
    closeModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.loggedToken])

  useEffect(() => {
    openModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const cancel = useCallback(() => {
    // setInjectedConnected()
    deactivate()
    connector?.deactivate()
    toggleSignLoginModal()
  }, [connector, deactivate, toggleSignLoginModal])

  return (
    <Modal customIsOpen={walletModalOpen && !userInfo?.loggedToken} customOnDismiss={cancel} maxWidth="480px">
      <Box width={'100%'} padding="48px" display="flex" flexDirection="column" alignItems="center" gap={20}>
        <Image src={logo}></Image>
        <Typography variant="h4">Welcome to Myclique</Typography>
        <Box width={'100%'} display={'grid'} gridTemplateColumns={'1fr 1fr'} gap="20px">
          <Button variant="outlined" onClick={cancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={login}>
            Accept and sign
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
