import { Box } from '@mui/material'
import LeftMenu from './LeftSider'
import { useActiveWeb3React } from 'hooks'
import { useUserInfo } from 'state/userInfo/hooks'
import { useEffect } from 'react'
import { useIsJoined } from 'hooks/useBackedDaoServer'
import { useHistory, useParams } from 'react-router-dom'
import { ChainId } from 'constants/chain'

export default function DaoInfoLayout({ children }: { children: any }) {
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const { account } = useActiveWeb3React()
  const curDaoChainId = Number(daoChainId) as ChainId
  const history = useHistory()
  const { isJoined } = useIsJoined(curDaoChainId, daoAddress)
  const userSignature = useUserInfo()

  useEffect(() => {
    if (!account || !userSignature || isJoined === '') {
      history.replace('/page/' + daoChainId + '/' + daoAddress)
    }
  }, [account, daoAddress, daoChainId, history, isJoined, userSignature])

  return (
    <Box
      sx={{
        display: 'grid',
        // gridTemplateColumns: { xs: '1fr', sm: '80px 1fr' },
        minHeight: '100%',
        width: '100%'
      }}
    >
      <LeftMenu />
      <Box
        sx={{
          padding: { sm: '0 0 0 260px', xs: '20px 16px' }
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
