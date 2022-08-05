import { Box, Typography } from '@mui/material'
import EmptyData from 'components/EmptyData'
import Loading from 'components/Loading'
import { ChainId } from 'constants/chain'
import { useBackedDaoAdmins } from 'hooks/useBackedDaoServer'
import { ShowAdminTag } from 'pages/DaoInfo/ShowAdminTag'
import { useParams } from 'react-router-dom'
import { StyledItem } from '../About'

export default function Admin() {
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId

  const { result: daoAdminList, loading: daoAdminLoading } = useBackedDaoAdmins(daoAddress, curDaoChainId)

  return (
    <StyledItem>
      {daoAdminLoading ? (
        <Loading />
      ) : (
        <Box display={'grid'} gridTemplateColumns="1fr 1fr" alignItems={'center'} gap="10px 20px">
          {daoAdminList?.map(address => (
            <>
              <Typography fontWeight={600} key={address}>
                {address}
              </Typography>
              <div>
                <ShowAdminTag chainId={curDaoChainId} daoAddress={daoAddress} account={address} />
              </div>
            </>
          ))}
        </Box>
      )}
      {!daoAdminLoading && !daoAdminList?.length && <EmptyData />}
    </StyledItem>
  )
}
