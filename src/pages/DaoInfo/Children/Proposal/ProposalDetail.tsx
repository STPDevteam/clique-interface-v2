import { Box, Grid } from '@mui/material'
import Back from 'components/Back'
import Loading from 'components/Loading'
import { ChainId } from 'constants/chain'
import { routes } from 'constants/routes'
import { DaoInfoProp, useDaoInfo } from 'hooks/useDaoInfo'
import { useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import DetailContent from './detail'
import DetailVote from './detail/Vote'
import VoteProgress from './detail/VoteProgress'
import VoteInfo from './detail/Info'
import { useProposalDetailInfo } from 'hooks/useProposalInfo'

export default function ProposalDetail() {
  const { chainId: daoChainId, address: daoAddress, proposalId } = useParams<{
    chainId: string
    address: string
    proposalId: string
  }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const daoInfo = useDaoInfo(daoAddress, curDaoChainId)

  return daoInfo ? (
    <DetailBox daoChainId={curDaoChainId} daoInfo={daoInfo} proposalId={Number(proposalId)} />
  ) : (
    <Loading />
  )
}

function DetailBox({
  daoInfo,
  daoChainId,
  proposalId
}: {
  daoInfo: DaoInfoProp
  daoChainId: ChainId
  proposalId: number
}) {
  const history = useHistory()

  const proposalDetailInfo = useProposalDetailInfo(daoInfo.daoAddress, daoChainId, proposalId, daoInfo.token)
  console.log('🚀 ~ file: ProposalDetail.tsx ~ line 43 ~ proposalDetailInfo', proposalDetailInfo)

  const toList = useCallback(() => {
    history.replace(routes._DaoInfo + `/${daoChainId}/${daoInfo.daoAddress}`)
  }, [daoChainId, daoInfo.daoAddress, history])

  return proposalDetailInfo ? (
    <Box>
      <Back sx={{ margin: 0 }} text="All Proposals" event={toList} />
      <Box mt={30}>
        <Grid container spacing={40}>
          <Grid item md={8} xs={12}>
            <DetailContent proposalInfo={proposalDetailInfo} />
          </Grid>
          <Grid item md={4} xs={12}>
            <DetailVote proposalInfo={proposalDetailInfo} />
          </Grid>
        </Grid>
      </Box>
      <Box mt={40}>
        <Grid container spacing={40}>
          <Grid item md={8} xs={12}>
            <VoteProgress />
          </Grid>
          <Grid item md={4} xs={12}>
            <VoteInfo proposalInfo={proposalDetailInfo} daoAddress={daoInfo.daoAddress} daoChainId={daoChainId} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  ) : (
    <Loading />
  )
}
