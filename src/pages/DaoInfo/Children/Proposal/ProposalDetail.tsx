import { Box, Grid, Typography } from '@mui/material'
import Back from 'components/Back'
import Loading from 'components/Loading'
import { routes } from 'constants/routes'
import { useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import DetailContent from './detail'
// import DetailVote from './detail/Vote'
import VoteProgress, { VoteListModal } from './detail/VoteProgress'
import VoteInfo from './detail/Info'
import DaoContainer from 'components/DaoContainer'
import { useProposalDetailsInfo } from 'hooks/useBackedProposalServer'
import { VotingTypes } from 'state/buildingGovDao/actions'
import { formatNumberWithCommas } from 'utils'
import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'
import { useActiveWeb3React } from 'hooks'
import useModal from 'hooks/useModal'

export default function ProposalDetail() {
  const { daoId: daoId, proposalId } = useParams<{
    daoId: string
    proposalId: string
  }>()
  const curDaoId = Number(daoId)
  const { buildingDaoData: daoInfo } = useBuildingDaoDataCallback()

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
  const { account } = useActiveWeb3React()
  const [rand, setRand] = useState<number>(Math.random())
  const { result: proposalDetailInfo } = useProposalDetailsInfo(proposalId, rand)
  const { showModal } = useModal()

  const toList = useCallback(() => {
    history.replace(routes._DaoInfo + `/${daoId}/proposal`)
  }, [daoId, history])

  useEffect(() => {
    setRand(Math.random())
  }, [account])

  const allVotes = proposalDetailInfo?.options.map(item => item.votes).reduce((pre, val) => pre + val)

  return proposalDetailInfo ? (
    <Box>
      <Back sx={{ marginLeft: 0 }} text="All Proposals" event={toList} />
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
              // proposalId={proposalId}
              proposalInfo={proposalDetailInfo}
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
              <Box display={'flex'} gap={60}>
                <Typography>
                  Voting types:{' '}
                  {proposalDetailInfo.votingType === VotingTypes.SINGLE ? 'Single-voting' : 'Multi-voting'}
                </Typography>
                <Typography>
                  Your votes:{' '}
                  {(account &&
                    formatNumberWithCommas(proposalDetailInfo.yourVotes - proposalDetailInfo.alreadyVoted)) ||
                    '--'}
                </Typography>
              </Box>
              <Typography
                onClick={() => showModal(<VoteListModal allVotes={allVotes} proposalId={proposalId} />)}
                variant="body1"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                color={'#80829F'}
              >
                View all votes ({allVotes && formatNumberWithCommas(allVotes)})
              </Typography>
            </Box>
          </Grid>
          <Grid item md={12} xs={12}>
            <VoteInfo proposalInfo={proposalDetailInfo} refresh={setRand} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  ) : (
    <Loading />
  )
}
