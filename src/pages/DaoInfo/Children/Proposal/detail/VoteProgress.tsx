import { Box, Link, Stack, styled, Typography } from '@mui/material'
import EmptyData from 'components/EmptyData'
import Modal from 'components/Modal'
import Pagination from 'components/Pagination'
import { SimpleProgress } from 'components/Progress'
import { routes } from 'constants/routes'
import { useProposalDetailInfoProps, useProposalVoteList, VoteStatus } from 'hooks/useBackedProposalServer'
import useBreakpoint from 'hooks/useBreakpoint'
import useModal from 'hooks/useModal'
import { ProposalOptionProp } from 'hooks/useProposalInfo'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useHistory } from 'react-router'
import { formatNumberWithCommas, shortenAddress } from 'utils'
// import { RowCenter } from '../ProposalItem'
import { VoteWrapper } from './Vote'
import { BlackButton } from 'components/Button/Button'
import { useVoteModalToggle } from 'state/application/hooks'
// import { VotingTypes } from 'state/buildingGovDao/actions'
import VoteModal from './VoteModal'
import { formatMillion } from 'utils/dao'
import { useActiveWeb3React } from 'hooks'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { Dots } from 'theme/components'

const StyledItem = styled(Box)(({}) => ({
  borderRadius: '8px',
  backgroundColor: '#F8FBFF',
  padding: '21px 30px'
}))

const StyledBody = styled(Box)(({ theme }) => ({
  minHeight: 200,
  padding: '40px 32px',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'unset',
    padding: '20px 16px'
  }
}))

const StyledListText = styled(Typography)({
  fontSize: 13,
  fontWeight: 600
})

export default function VoteProgress({
  refresh,
  proposalOptions,
  proposalId,
  proposalInfo
}: {
  refresh: Dispatch<SetStateAction<number>>
  proposalOptions: ProposalOptionProp[]
  proposalId: number
  proposalInfo: useProposalDetailInfoProps
}) {
  const { account } = useActiveWeb3React()
  const isSmDown = useBreakpoint('sm')
  const [optionId, setOptionId] = useState(0)
  const voteModalToggle = useVoteModalToggle()
  const { claimSubmitted: isVoting } = useUserHasSubmittedClaim(`${account}_Chain_Proposal${proposalInfo.proposalId}`)
  const { claimedSubmitSuccess: isVoteSuccess } = useUserHasSubmittedClaim(
    `${account}_Chain_Proposal${proposalInfo.proposalId}`
  )
  const allVotes = proposalInfo?.options.map(item => item.votes).reduce((pre, val) => pre + val)
  const { result: proposalVoteList, setUpDateVoteList } = useProposalVoteList(proposalId)
  const userVote = useMemo(() => {
    if (!proposalVoteList.length) return
    return proposalVoteList
  }, [proposalVoteList])

  return (
    <VoteWrapper style={{ padding: isSmDown ? '20px 16px' : '' }}>
      {/* <RowCenter flexWrap={'wrap'}>
        <Typography fontSize={14} color={'#80829F'} fontWeight={500}>
          {proposalInfo.votingType === VotingTypes.SINGLE ? 'single-vote' : 'multi-vote'}
        </Typography>
        <Typography
          onClick={() => showModal(<VoteListModal allVotes={allVotes} proposalId={proposalId} />)}
          variant="body1"
          sx={{ cursor: 'pointer' }}
          color={'#80829F'}
        >
          View all votes ({allVotes && formatNumberWithCommas(allVotes)})
        </Typography>
      </RowCenter> */}
      <Stack spacing={10}>
        {proposalOptions.map((item, index) => (
          <StyledItem key={index} style={{ padding: isSmDown ? '16px' : '' }}>
            <Box
              display={'grid'}
              sx={{
                gridTemplateColumns: { sm: '1fr 150px', xs: '1fr' }
              }}
              justifyContent={'space-between'}
              alignItems={'center'}
              columnGap="24px"
              rowGap={'5px'}
            >
              <Box display={'grid'} maxWidth={600}>
                <Box display={'flex'} justifyContent={'space-between'} justifyItems={'center'}>
                  <Typography mb={5}>{item.optionContent}</Typography>
                  <Typography color={'#3F5170'} fontSize={14} fontWeight={600}>
                    {formatMillion(item.votes)}, {allVotes && ((item.votes / allVotes) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                {item.votes === 0 ? (
                  <SimpleProgress width="100%" per={0} />
                ) : (
                  <SimpleProgress width="100%" per={Math.floor((item.votes / allVotes) * 100)} />
                )}
              </Box>

              {proposalInfo.yourVotes !== 0 && proposalInfo.alreadyVoted !== 0 && account ? (
                userVote?.filter(v => v.optionId === item.optionId && v.status === VoteStatus.SUCCESS).length ? (
                  <Typography
                    sx={{
                      fontFamily: 'Inter',
                      fontWeight: 700,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#97B7EF'
                    }}
                  >
                    {userVote?.map(val => {
                      if (val.optionId === item.optionId) {
                        return 'You voted ' + formatNumberWithCommas(val.votes)
                      }
                      return null
                    })}
                  </Typography>
                ) : userVote?.filter(v => v.optionId === item.optionId && v.status === VoteStatus.PENDING).length ? (
                  <BlackButton
                    height="36px"
                    disabled={isVoting || isVoteSuccess}
                    onClick={() => {
                      setOptionId(proposalOptions[index].optionId)
                      voteModalToggle()
                    }}
                    width="125px"
                  >
                    {isVoting ? (
                      <>
                        Vote
                        <Dots />
                      </>
                    ) : isVoteSuccess ? (
                      <>
                        Confirm
                        <Dots />
                      </>
                    ) : (
                      'Vote'
                    )}
                  </BlackButton>
                ) : null
              ) : (
                <BlackButton
                  height="36px"
                  disabled={
                    !account ||
                    proposalInfo.yourVotes === 0 ||
                    proposalInfo.yourVotes === proposalInfo.alreadyVoted ||
                    proposalInfo.status === 'Soon' ||
                    proposalInfo.status === 'Cancel' ||
                    proposalInfo.status === 'Failed' ||
                    proposalInfo.status === 'Success' ||
                    (proposalInfo.alreadyVoted > 0 && proposalInfo.votingType === 1)
                  }
                  onClick={() => {
                    setOptionId(proposalOptions[index].optionId)
                    voteModalToggle()
                  }}
                  width="125px"
                >
                  Vote
                </BlackButton>
              )}
            </Box>
          </StyledItem>
        ))}
      </Stack>
      <VoteModal
        refresh={refresh}
        proposalInfo={proposalInfo}
        proposalOptions={optionId}
        setUpDateVoteList={setUpDateVoteList}
        proposalVoteList={proposalVoteList}
      />
    </VoteWrapper>
  )
}

export function VoteListModal({ proposalId, allVotes }: { proposalId: number; allVotes: number | undefined }) {
  const { hideModal } = useModal()
  const { result: proposalVoteList, page } = useProposalVoteList(proposalId)
  const history = useHistory()

  const userVoteList = useMemo(() => {
    if (!proposalVoteList) return
    const list = proposalVoteList.filter(item => item.status !== VoteStatus.PENDING)
    return list
  }, [proposalVoteList])

  return (
    <Modal maxWidth="460px" closeIcon width="100%">
      <StyledBody>
        <Stack spacing={19}>
          <Typography variant="h6" fontWeight={500}>
            Votes ({(allVotes && formatNumberWithCommas(allVotes)) || '--'})
          </Typography>
          <Box
            display={'grid'}
            gridTemplateColumns="1fr 1fr 0.8fr"
            gap={'10px 5px'}
            alignItems={'center'}
            justifyContent="center"
          >
            {userVoteList?.map(item => (
              <>
                {/* href={getEtherscanLink(daoChainId, item.voter, 'address')} */}
                <Link
                  underline="none"
                  target={'_blank'}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    hideModal()
                    history.push(routes._Profile + `/${item.voter}`)
                  }}
                >
                  <StyledListText>{shortenAddress(item.voter)}</StyledListText>
                </Link>
                <StyledListText noWrap align="center">
                  {item.optionContent}
                </StyledListText>
                <StyledListText align="right">{formatNumberWithCommas(item.votes)}</StyledListText>
              </>
            ))}
          </Box>
          {!userVoteList?.length && <EmptyData />}
          <Box
            display={'flex'}
            justifyContent="center"
            sx={{
              '& .MuiPaginationItem-previousNext': {
                background: '#fff !important'
              },
              '& .MuiPaginationItem-page.Mui-selected': {
                color: '#3F5170'
              }
            }}
          >
            <Pagination
              count={!userVoteList?.length ? 0 : page.totalPage}
              page={page.currentPage}
              onChange={(_, value) => page.setCurrentPage(value)}
            />
          </Box>
        </Stack>
      </StyledBody>
    </Modal>
  )
}
