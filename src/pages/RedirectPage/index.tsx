import { Box } from '@mui/material'
import { useHistory } from 'react-router'
import JoinDAOModal from '../DaoInfo/Children/JoinDAOModal'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import { useWalletModalToggle } from 'state/application/hooks'
import { useIsJoined, useJoinDAO } from 'hooks/useBackedDaoServer'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import { useParams } from 'react-router-dom'
import { ChainId } from 'constants/chain'
import { routes } from 'constants/routes'

export default function Page() {
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const history = useHistory()
  const [open, setOpen] = useState(false)
  const curDaoChainId = Number(daoChainId) as ChainId
  const { account } = useActiveWeb3React()
  const [status, setStatus] = useState<string | undefined>()
  const [btnDisabled, setBtnDisabled] = useState(false)
  const joinDAO = useJoinDAO()
  const toggleWalletModal = useWalletModalToggle()
  const loginSignature = useLoginSignature()
  const userSignature = useUserInfo()
  const { isJoined } = useIsJoined(curDaoChainId, daoAddress)

  const joinDAOCallback = useCallback(() => {
    setBtnDisabled(true)
    if (!account) {
      toggleWalletModal()
      setBtnDisabled(false)
      return
    }
    if (!userSignature) {
      loginSignature()
        .then(() => {
          joinDAO(curDaoChainId, daoAddress)
            .then(() => {
              history.replace(routes._DaoInfo + '/' + daoChainId + '/' + daoAddress + '/proposal')
              setBtnDisabled(false)
            })
            .catch(() => setBtnDisabled(false))
        })
        .catch(err => {
          console.log(err)
          setBtnDisabled(false)
        })
    } else {
      joinDAO(curDaoChainId, daoAddress)
        .then(() => {
          history.replace(routes._DaoInfo + '/' + daoChainId + '/' + daoAddress + '/proposal')
          setBtnDisabled(false)
        })
        .catch(() => setBtnDisabled(false))
    }
  }, [
    account,
    curDaoChainId,
    daoAddress,
    daoChainId,
    history,
    joinDAO,
    loginSignature,
    toggleWalletModal,
    userSignature
  ])

  useEffect(() => {
    if (!account) setStatus('Connect Wallet')
    else if (!userSignature) {
      setStatus('Join DAO')
    } else if (isJoined === '' || isJoined === undefined) setStatus('Join DAO')
    if (!account || !userSignature || isJoined === '' || isJoined === undefined) {
    } else {
      setOpen(false)
      return history.replace(routes.Proposal.replace(':chainId', daoChainId).replace(':address', daoAddress))
    }
  }, [account, daoAddress, daoChainId, history, isJoined, loginSignature, userSignature])

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
