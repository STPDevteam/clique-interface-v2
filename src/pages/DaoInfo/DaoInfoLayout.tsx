import { Box } from '@mui/material'
import LeftMenu from './LeftSider'
import { useActiveWeb3React } from 'hooks'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { useCallback, useEffect, useState } from 'react'
import { useApplyMember, useIsJoined } from 'hooks/useBackedDaoServer'
import { useParams } from 'react-router-dom'
import { ChainId } from 'constants/chain'
import JoinDAOModal from './Children/JoinDAOModal'

export default function DaoInfoLayout({ children }: { children: any }) {
  const [btnDisabled, setBtnDisabled] = useState(false)
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const { account } = useActiveWeb3React()
  const curDaoChainId = Number(daoChainId) as ChainId
  const [open, setOpen] = useState(true)
  const { joinApply } = useApplyMember()
  const { isJoined } = useIsJoined(curDaoChainId, daoAddress)
  const toggleWalletModal = useWalletModalToggle()
  const userSignature = useUserInfo()
  const loginSignature = useLoginSignature()

  const joinDAOCallback = useCallback(() => {
    if (!account) {
      toggleWalletModal()
      return
    }
    if (!userSignature) {
      loginSignature()
      return
    }
    setBtnDisabled(true)
    joinApply('C_member', curDaoChainId, daoAddress, '')
      .then(() => {
        setOpen(false)
        setBtnDisabled(false)
      })
      .catch(() => setBtnDisabled(false))
  }, [account, curDaoChainId, daoAddress, joinApply, loginSignature, toggleWalletModal, userSignature])
  console.log(isJoined)

  useEffect(() => {
    if (!account || !userSignature || isJoined === '') {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [account, isJoined, userSignature])

  return (
    <Box
      sx={{
        display: 'grid',
        // gridTemplateColumns: { xs: '1fr', sm: '80px 1fr' },
        minHeight: '100%',
        width: '100%'
      }}
    >
      <JoinDAOModal
        onClick={joinDAOCallback}
        open={open}
        disable={btnDisabled}
        daoChainId={curDaoChainId}
        daoAddress={daoAddress}
      />
      <LeftMenu />
      <Box
        sx={{
          padding: { sm: '24px 32px 24px 284px', xs: '20px 16px' }
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
