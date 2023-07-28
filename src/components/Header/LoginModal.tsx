import { useModalOpen, useSignLoginModalControl } from 'state/application/hooks'
import Modal from '../Modal'
import { ApplicationModal } from 'state/application/actions'
import { Box, Button, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
// import { setInjectedConnected } from 'utils/isInjectedConnectedPrev'
import { useWeb3React } from '@web3-react/core'
import { useActiveWeb3React } from 'hooks'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import logo from '../../assets/svg/logo.svg'
import Image from 'components/Image'
import useModal from 'hooks/useModal'
import UpdateProfileModal from 'pages/Profile/UpdateProfileModal'

export const UserType = {
  NEW_ENTER: 1
}

export default function LoginModal() {
  const [btnDisable, setBtnDisable] = useState(false)
  const { connector, deactivate } = useWeb3React()
  const { account } = useActiveWeb3React()
  const walletModalOpen = useModalOpen(ApplicationModal.SIGN_LOGIN)
  const { open, close } = useSignLoginModalControl()
  const { showModal, hideModal } = useModal()
  const login = useLoginSignature()
  const userInfo = useUserInfo()

  const loginClick = useCallback(() => {
    login().then(res => {
      if (Number(res) === UserType.NEW_ENTER) showModal(<UpdateProfileModal refreshProfile={hideModal} />)
    })
  }, [hideModal, login, showModal])

  const closeModal = useCallback(() => {
    if (userInfo?.loggedToken && walletModalOpen) {
      close()
      setBtnDisable(false)
      return
    }
    setBtnDisable(true)
  }, [close, userInfo?.loggedToken, walletModalOpen])

  const openModal = useCallback(() => {
    //TODO while account !== previous account
    if (!userInfo?.loggedToken && !walletModalOpen && account) {
      setTimeout(() => open())
      setBtnDisable(false)
      return
    }
    setBtnDisable(false)
  }, [account, open, userInfo?.loggedToken, walletModalOpen])

  useEffect(() => {
    if (userInfo?.loggedToken) {
      closeModal()
    }
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
    close()
  }, [close, connector, deactivate])

  console.log('walletModalOpen && !userInfo?.loggedToken', walletModalOpen, !userInfo?.loggedToken)
  return (
    <Modal customIsOpen={walletModalOpen && !userInfo?.loggedToken} closeIcon customOnDismiss={cancel} maxWidth="480px">
      <Box width={'100%'} padding="48px" display="flex" flexDirection="column" alignItems="center" gap={20}>
        <Image src={logo}></Image>
        <Typography variant="h5" my={10}>
          Welcome to Myclique
        </Typography>
        <Box
          width={'100%'}
          display={'grid'}
          gridTemplateColumns={'1fr 1fr'}
          gap="20px"
          sx={{
            '& button': {
              height: 40
            }
          }}
        >
          <Button variant="outlined" onClick={cancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={loginClick} disabled={btnDisable}>
            Accept and sign
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
