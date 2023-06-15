import { Box, Grid, Typography } from '@mui/material'
import Back from 'components/Back'
import Loading from 'components/Loading'
import { routes } from 'constants/routes'
import { useCallback, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import DetailContent from './detail'
// import DetailVote from './detail/Vote'
import VoteProgress from './detail/VoteProgress'
import VoteInfo from './detail/Info'
import DaoContainer from 'components/DaoContainer'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { useProposalDetailsInfo } from 'hooks/useBackedProposalServer'
import { VotingTypes } from 'state/buildingGovDao/actions'
import { formatNumberWithCommas } from 'utils'

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
  const [rand, setRand] = useState(Math.random())
  const { result: proposalDetailInfo } = useProposalDetailsInfo(proposalId, rand)

  const toList = useCallback(() => {
    history.replace(routes._DaoInfo + `/${daoId}/proposal`)
  }, [daoId, history])

  return proposalDetailInfo ? (
    <Box>
      <Back sx={{ margin: 0 }} text="All Proposals" event={toList} />
      <Box mt={20}>
        <Grid container spacing={20}>
          <Grid item md={12} xs={12}>
            <DetailContent proposalInfo={proposalDetailInfo} />
          </Grid>
          {/* <Grid item md={12} xs={12}>
            <DetailVote proposalInfo={proposalDetailInfo} />
          </Grid> */}
        </Grid>
      </Box>
      <Box mt={20}>
        <Grid container spacing={20}>
          <Grid item md={12} xs={12}>
            <VoteProgress
              refresh={setRand}
              proposalOptions={proposalDetailInfo.options}
              proposalId={proposalId}
              proposalInfo={proposalDetailInfo}
              proposalDetailInfo={proposalDetailInfo}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              sx={{
                backgroundColor: '#F8FBFF',
                height: 80,
                borderRadius: '8px',
                padding: 30,
                color: '#80829F'
              }}
            >
              <Typography>
                Voting types: {proposalDetailInfo.votingType === VotingTypes.SINGLE ? 'Single-voting' : 'Multi-voting'}
              </Typography>
              <Typography>Your votes: {formatNumberWithCommas(proposalDetailInfo.yourVotes) || '--'}</Typography>
            </Box>
          </Grid>
          <Grid item md={12} xs={12}>
            <VoteInfo proposalInfo={proposalDetailInfo} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  ) : (
    <Loading />
  )
}
