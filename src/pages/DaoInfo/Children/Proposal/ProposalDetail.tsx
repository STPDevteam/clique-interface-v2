import { Box, Grid } from '@mui/material'
import Back from 'components/Back'
import Loading from 'components/Loading'
import { routes } from 'constants/routes'
import { useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import DetailContent from './detail'
import DetailVote from './detail/Vote'
import VoteProgress from './detail/VoteProgress'
import VoteInfo from './detail/Info'
import DaoContainer from 'components/DaoContainer'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { useProposalDetailsInfo } from 'hooks/useBackedProposalServer'

export default function ProposalDetail() {
  const { daoId: daoId, proposalId } = useParams<{
    daoId: string
    proposalId: string
  }>()
  const curDaoId = Number(daoId)
  const daoInfo = useSelector((state: AppState) => state.buildingGovernanceDao.createDaoData)

  return daoInfo ? (
    <DaoContainer>
      <DetailBox daoId={curDaoId} proposalId={Number(proposalId)} />
    </DaoContainer>
  ) : (
    <Loading />
  )
}

function DetailBox({ daoId, proposalId }: { daoId: number; proposalId: number }) {
  const history = useHistory()
  const { result: proposalDetailInfo } = useProposalDetailsInfo(proposalId)
  console.log('🚀 ~ file: ProposalDetail.tsx:39 ~ DetailBox ~ proposalDetailInfo:', proposalDetailInfo)

  const toList = useCallback(() => {
    history.replace(routes._DaoInfo + `/${daoId}/proposal`)
  }, [daoId, history])

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
            <VoteProgress proposalOptions={proposalDetailInfo.options} proposalId={proposalId} />
          </Grid>
          <Grid item md={4} xs={12}>
            <VoteInfo proposalInfo={proposalDetailInfo} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  ) : (
    <Loading />
  )
}
