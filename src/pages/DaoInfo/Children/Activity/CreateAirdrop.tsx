import { Box } from '@mui/material'
import Back from 'components/Back'
import Loading from 'components/Loading'
import { ChainId } from 'constants/chain'
import { routes } from 'constants/routes'
import { DaoInfoProp, useDaoInfo } from 'hooks/useDaoInfo'
import { useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'

export default function CreateAirdrop() {
  const { chainId: daoChainId, address: daoAddress } = useParams<{ chainId: string; address: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const daoInfo = useDaoInfo(daoAddress, curDaoChainId)

  return daoInfo ? <CreateAirdropForm daoChainId={curDaoChainId} daoInfo={daoInfo} /> : <Loading />
}

function CreateAirdropForm({ daoInfo, daoChainId }: { daoInfo: DaoInfoProp; daoChainId: ChainId }) {
  const history = useHistory()
  const toList = useCallback(() => {
    history.replace(routes._DaoInfo + `/${daoChainId}/${daoInfo.daoAddress}/active_info`)
  }, [daoChainId, daoInfo.daoAddress, history])

  return (
    <Box>
      <Back sx={{ margin: 0 }} text="All Proposals" event={toList} />
    </Box>
  )
}
