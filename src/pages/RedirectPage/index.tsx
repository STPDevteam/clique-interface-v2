import { Box } from '@mui/material'
import { useHistory } from 'react-router'
import JoinDAOModal from '../DaoInfo/Children/JoinDAOModal'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import { useWalletModalToggle } from 'state/application/hooks'
import { useApplyMember, useIsJoined } from 'hooks/useBackedDaoServer'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import { useParams } from 'react-router-dom'
import { ChainId } from 'constants/chain'
import { routes } from 'constants/routes'

export default function Page() {
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const history = useHistory()
  const [open, setOpen] = useState(true)
  const curDaoChainId = Number(daoChainId) as ChainId
  const { account } = useActiveWeb3React()
  const [status, setStatus] = useState<string | undefined>()
  const [btnDisabled, setBtnDisabled] = useState(false)
  const { joinApply } = useApplyMember()
  const toggleWalletModal = useWalletModalToggle()
  const loginSignature = useLoginSignature()
  const userSignature = useUserInfo()
  const { isJoined } = useIsJoined(curDaoChainId, daoAddress)

  console.log(isJoined)

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
        history.push(routes._DaoInfo + '/' + daoChainId + '/' + daoAddress + '/proposal')
        setBtnDisabled(false)
      })
      .catch(() => setBtnDisabled(false))
  }, [
    account,
    curDaoChainId,
    daoAddress,
    daoChainId,
    history,
    joinApply,
    loginSignature,
    toggleWalletModal,
    userSignature
  ])

  useEffect(() => {
    if (!account) setStatus('Connect Wallet')
    else if (!userSignature) setStatus('Sign In')
    else if (isJoined === '' || isJoined === undefined) setStatus('Join DAO')
    if (!account || !userSignature || isJoined === '' || isJoined === undefined) {
      setOpen(true)
    } else {
      setOpen(false)
      history.push(routes._DaoInfo + '/' + daoChainId + '/' + daoAddress + '/proposal')
    }
  }, [account, daoAddress, daoChainId, history, isJoined, userSignature])

  return (
    <Box
      sx={{
        maxWidth: 964,
        width: '100%',
        margin: '30px auto 20px',
        textAlign: 'center',
        fontSize: 12,
        padding: { xs: '0 16px', sm: undefined }
      }}
    >
      <JoinDAOModal
        onClick={joinDAOCallback}
        open={open}
        disable={btnDisabled}
        daoChainId={curDaoChainId}
        daoAddress={daoAddress}
        status={status}
      />
    </Box>
  )
}
