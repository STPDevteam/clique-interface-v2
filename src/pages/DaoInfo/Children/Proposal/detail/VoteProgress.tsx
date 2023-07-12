import { Box, Link, Stack, styled, Typography } from '@mui/material'
import EmptyData from 'components/EmptyData'
import Modal from 'components/Modal'
import Pagination from 'components/Pagination'
import { SimpleProgress } from 'components/Progress'
import { routes } from 'constants/routes'
import { useProposalDetailInfoProps, useProposalVoteList } from 'hooks/useBackedProposalServer'
import useBreakpoint from 'hooks/useBreakpoint'
import useModal from 'hooks/useModal'
import { ProposalOptionProp } from 'hooks/useProposalInfo'
import { Dispatch, SetStateAction, useState } from 'react'
import { useHistory } from 'react-router'
import { formatNumberWithCommas, shortenAddress } from 'utils'
// import { RowCenter } from '../ProposalItem'
import { VoteWrapper } from './Vote'
import { BlackButton } from 'components/Button/Button'
import { useVoteModalToggle } from 'state/application/hooks'
// import { VotingTypes } from 'state/buildingGovDao/actions'
import VoteModal from './VoteModal'

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
  // proposalId,
  proposalInfo
}: {
  refresh: Dispatch<SetStateAction<number>>
  proposalOptions: ProposalOptionProp[]
  // proposalId: number
  proposalInfo: useProposalDetailInfoProps
}) {
  const isSmDown = useBreakpoint('sm')
  // const { showModal } = useModal()
  const [optionId, setOptionId] = useState(0)
  const voteModalToggle = useVoteModalToggle()
  const allVotes = proposalInfo?.options.map(item => item.votes).reduce((pre, val) => pre + val)

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
      <Stack mt={16} spacing={10}>
        {proposalOptions.map((item, index) => (
          <StyledItem key={index} style={{ padding: isSmDown ? '16px' : '' }}>
            <Box
              display={'grid'}
              sx={{
                gridTemplateColumns: { sm: '1fr 125px', xs: '1fr' }
              }}
              justifyContent={'space-between'}
              alignItems={'center'}
              columnGap="24px"
              rowGap={'5px'}
            >
              <Box display={'grid'}>
                <Box display={'flex'} justifyContent={'space-between'} justifyItems={'center'}>
                  <Typography mb={5}>{item.optionContent}</Typography>
                  <Typography color={'#3F5170'} fontSize={14} fontWeight={600}>
                    {allVotes && ((item.votes / allVotes) * 100).toFixed(1)}%({formatNumberWithCommas(item.votes)}{' '}
                    Votes)
                  </Typography>
                </Box>
                {item.votes === 0 ? (
                  <SimpleProgress width="100%" per={0} />
                ) : (
                  <SimpleProgress width="100%" per={Math.floor((item.votes / allVotes) * 100)} />
                )}
              </Box>
              <BlackButton
                height="36px"
                disabled={
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
                {proposalInfo.alreadyVoted > 0 && proposalInfo.votingType === 1 ? 'Voted' : 'Vote'}
              </BlackButton>
            </Box>
          </StyledItem>
        ))}
      </Stack>
      <VoteModal refresh={refresh} proposalInfo={proposalInfo} proposalOptions={optionId} />
    </VoteWrapper>
  )
}

export function VoteListModal({ proposalId, allVotes }: { proposalId: number; allVotes: number | undefined }) {
  const { hideModal } = useModal()
  const { result: proposalVoteList, page } = useProposalVoteList(proposalId)
  const history = useHistory()

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
            {proposalVoteList.map(item => (
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
          {!proposalVoteList.length && <EmptyData />}
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
              count={page.totalPage}
              page={page.currentPage}
              onChange={(_, value) => page.setCurrentPage(value)}
            />
          </Box>
        </Stack>
      </StyledBody>
    </Modal>
  )
}
