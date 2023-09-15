import { Box, Grid, Typography, styled, useTheme } from '@mui/material'
import Back from 'components/Back'
import Loading from 'components/Loading'
import { routes } from 'constants/routes'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DetailContent from './detail'
// import DetailVote from './detail/Vote'
import VoteProgress, { VoteListModal } from './detail/VoteProgress'
import VoteInfo from './detail/Info'
import DaoContainer from 'components/DaoContainer'
import { useProposalDetailsInfo, useProposalVoteList } from 'hooks/useBackedProposalServer'
import { VotingTypes } from 'state/buildingGovDao/actions'
import { formatNumberWithCommas } from 'utils'
// import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'
import { useActiveWeb3React } from 'hooks'
import useModal from 'hooks/useModal'
import { BlackButton } from 'components/Button/Button'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import Modal from 'components/Modal'
import OutlineButton from 'components/Button/OutlineButton'
import { toast } from 'react-toastify'
import { useCancelProposalCallback } from 'hooks/useProposalCallback'
import { Dots } from 'theme/components'
import { RowCenter } from './ProposalItem'
import useBreakpoint from 'hooks/useBreakpoint'

const StyledBody = styled(Box)({
  minHeight: 200,
  padding: '40px 32px'
})

export default function ProposalDetail() {
  const { daoId: daoId, proposalId } = useParams<{
    daoId: string
    proposalId: string
  }>()
  const curDaoId = Number(daoId)
  // const { buildingDaoData: daoInfo } = useBuildingDaoDataCallback()

  return (
    <DaoContainer>
      <DetailBox daoId={curDaoId} proposalId={Number(proposalId)} />
    </DaoContainer>
  )
}

function DetailBox({ daoId, proposalId }: { daoId: number; proposalId: number }) {
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()
  const [rand, setRand] = useState<number>(-1)
  const { result: proposalDetailInfo } = useProposalDetailsInfo(proposalId, rand)
  const { showModal, hideModal } = useModal()
  const { claimSubmitted: isCancel } = useUserHasSubmittedClaim(`_cancelProposal`)
  const cancelProposalCallback = useCancelProposalCallback()

  const toList = useCallback(() => {
    navigate(routes._DaoInfo + `/${daoId}/proposal`, { replace: true })
  }, [daoId, navigate])

  useEffect(() => {
    setRand(Math.random())
  }, [account])
  const { result: proposalVoteList, setUpDateVoteList } = useProposalVoteList(proposalId)

  const allVotes = proposalDetailInfo?.options.map(item => item.votes).reduce((pre, val) => pre + val)

  const userVoteList = useMemo(() => {
    const arr = [] as any

    proposalDetailInfo?.options.map(item => {
      arr.push({
        optionContent: item.optionContent,
        optionId: item.optionId,
        optionIndex: item.optionIndex,
        votes: item.votes,
        userVote: {
          optionContent: proposalVoteList.find(v => v.optionId == item.optionId)?.optionContent,
          account: proposalVoteList.find(v => v.optionId == item.optionId)?.voter,
          votes: proposalVoteList.find(v => v.optionId == item.optionId)?.votes,
          status: proposalVoteList.find(v => v.optionId == item.optionId)?.status
        }
      })
    })
    return arr
  }, [proposalDetailInfo?.options, proposalVoteList])

  const onCancelProposalCallback = useCallback(() => {
    cancelProposalCallback(proposalDetailInfo?.proposalId).then((res: any) => {
      if (res.data.code !== 200) {
        toast.error(res.data.msg || 'Network error')
        hideModal()
        return
      }
      hideModal()
      setRand(Math.random())
      toast.success('Cancel success')
    })
  }, [cancelProposalCallback, hideModal, proposalDetailInfo?.proposalId, setRand])

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
              setUpDateVoteList={setUpDateVoteList}
              proposalOptions={userVoteList}
              voteList={proposalVoteList}
              proposalId={proposalId}
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
                color: '#80829F',
                [theme.breakpoints.down('sm')]: {
                  padding: 5
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 60,
                  [theme.breakpoints.down('sm')]: {
                    display: 'grid',
                    gap: 5
                  }
                }}
              >
                <Typography>
                  Voting types:
                  {proposalDetailInfo.votingType === VotingTypes.SINGLE ? 'Single-voting' : 'Multi-voting'}
                </Typography>
                <Typography>
                  Your votes:
                  {(account && formatNumberWithCommas(proposalDetailInfo.yourVotes)) || '--'}
                </Typography>
              </Box>

              {proposalDetailInfo.status !== 'Soon' && (
                <OutlineButton
                  color="#0049C6"
                  style={{
                    borderColor: '#97B7EF',
                    fontWeight: 600,
                    width: isSmDown ? '130px' : '190px'
                  }}
                  noBold
                  height={40}
                  borderRadius="8px"
                  onClick={() => showModal(<VoteListModal allVotes={allVotes} proposalId={proposalId} />)}
                >
                  View all votes ({allVotes && formatNumberWithCommas(allVotes)})
                </OutlineButton>
              )}

              {account?.toLowerCase() === proposalDetailInfo.proposer.account.toLowerCase() &&
                proposalDetailInfo.status === 'Soon' && (
                  <BlackButton
                    height="40px"
                    width="190px"
                    disabled={isCancel}
                    onClick={() => {
                      showModal(<CancelProposalModal Callback={onCancelProposalCallback} />)
                    }}
                  >
                    Cancel Proposal
                  </BlackButton>
                )}
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

function CancelProposalModal({ Callback }: { Callback: () => void }) {
  const { hideModal } = useModal()
  const [loading, setLoading] = useState<boolean>(false)
  return (
    <Modal maxWidth="480px" closeIcon width="100%">
      <StyledBody sx={{ paddingTop: 55, paddingBottom: 30 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
              lineHeight: '20px',
              color: '#3F5170',
              maxWidth: 285,
              textAlign: 'center'
            }}
          >
            Canceled proposals cannot be restored, do you want to proceed?
          </Typography>
        </Box>
        <RowCenter mt={30}>
          <OutlineButton
            width={200}
            color="#0049C6"
            style={{
              borderColor: '#0049C6'
            }}
            noBold
            height={40}
            borderRadius="8px"
            onClick={() => {
              hideModal()
            }}
          >
            Later
          </OutlineButton>
          <BlackButton
            disabled={loading}
            width="200px"
            height="40px"
            borderRadius="8px"
            onClick={() => {
              setLoading(true)
              Callback()
            }}
          >
            {loading ? (
              <>
                Cancel
                <Dots />
              </>
            ) : (
              'Cancel'
            )}
          </BlackButton>
        </RowCenter>
      </StyledBody>
    </Modal>
  )
}
