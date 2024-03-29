import { Box, Link, Stack, styled, Typography, Tooltip, useTheme } from '@mui/material'
import EmptyData from 'components/EmptyData'
import Modal from 'components/Modal'
import Pagination from 'components/Pagination'
import { SimpleProgress } from 'components/Progress'
import { routes } from 'constants/routes'
import {
  useProposalDetailInfoProps,
  useProposalVoteList,
  VoteListProp,
  VoteStatus
} from 'hooks/useBackedProposalServer'
import useBreakpoint from 'hooks/useBreakpoint'
import useModal from 'hooks/useModal'
import { ProposalOptionProp } from 'hooks/useProposalInfo'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { formatNumberWithCommas, getEtherscanLink, shortenAddress } from 'utils'
// import { RowCenter } from '../ProposalItem'
import { VoteWrapper } from './Vote'
import { BlackButton } from 'components/Button/Button'
import { useModalOpen, useVoteModalToggle } from 'state/application/hooks'
// import { VotingTypes } from 'state/buildingGovDao/actions'
import VoteModal from './VoteModal'
import { formatNumber } from 'utils/dao'
import { useActiveWeb3React } from 'hooks'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
// import { Dots } from 'theme/components'
import { useUserInfo } from 'state/userInfo/hooks'
import TooltipStyle from 'components/Tooltip'
import { ApplicationModal } from 'state/application/actions'
import { Dots } from 'theme/components'
import { useNavigate } from 'react-router-dom'

const StyledItem = styled(Box)(({}) => ({
  borderRadius: '8px',
  backgroundColor: '#F8FBFF',
  padding: '21px 30px'
}))

const StyledBody = styled(Box)(({ theme }) => ({
  minHeight: 200,
  padding: '30px',
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
  setUpDateVoteList,
  proposalOptions,
  voteList,
  proposalId,
  proposalInfo
}: {
  refresh: Dispatch<SetStateAction<number>>
  setUpDateVoteList: Dispatch<SetStateAction<number>>
  proposalOptions: ProposalOptionProp[]
  voteList: VoteListProp[]
  proposalId: number
  proposalInfo: useProposalDetailInfoProps
}) {
  const voteModalOpen = useModalOpen(ApplicationModal.VOTE)
  const { account } = useActiveWeb3React()
  const userSignature = useUserInfo()
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')
  const [optionId, setOptionId] = useState(0)
  const voteModalToggle = useVoteModalToggle()
  const { claimedSubmitSuccess: isVoteSuccess } = useUserHasSubmittedClaim(`${account}_Chain_Proposal${proposalId}`)
  const [timeRefresh, setTimeRefresh] = useState(-1)
  const toTimeRefresh = () => setTimeout(() => setTimeRefresh(Math.random()), 15000)

  const allVotes = proposalInfo?.options.map(item => item.votes).reduce((pre, val) => pre + val)

  const voteStatus = useMemo(() => {
    if (voteList.find(v => v.status === VoteStatus.SUCCESS)) {
      return VoteStatus.SUCCESS
    }
    if (voteList.find(v => v.status === VoteStatus.PENDING)) {
      return VoteStatus.PENDING
    }
    return 'Close'
  }, [voteList])

  useEffect(() => {
    if (timeRefresh === -1) {
      toTimeRefresh()
      return
    }
    if (isVoteSuccess && voteStatus === VoteStatus.PENDING) {
      setUpDateVoteList(Math.random())
    }
    refresh(Math.random())
    toTimeRefresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRefresh])

  useEffect(() => {
    if (isVoteSuccess && voteStatus === VoteStatus.PENDING) {
      setUpDateVoteList(Math.random())
      refresh(Math.random())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoteSuccess])

  useEffect(() => {
    if (isVoteSuccess && voteStatus === VoteStatus.SUCCESS && voteModalOpen) {
      voteModalToggle()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voteList])

  const isPending = useMemo(() => {
    if (
      voteList.find(v => v.status === VoteStatus.PENDING)?.voter.toLowerCase() === account?.toLowerCase() &&
      account &&
      proposalInfo.status === 'Active'
    ) {
      return true
    }
    return false
  }, [account, proposalInfo.status, voteList])

  return (
    <VoteWrapper>
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
              <Box
                sx={{
                  maxWidth: 600,
                  display: 'grid',
                  [theme.breakpoints.down('sm')]: {
                    maxWidth: '100%'
                  }
                }}
              >
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 0.3fr', gap: 10 }}>
                  <Typography
                    mb={5}
                    sx={{
                      maxWidth: isSmDown ? '220px' : '450px',
                      wordWrap: 'break-word'
                    }}
                  >
                    {item.optionContent}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: 'right'
                    }}
                    color={'#3F5170'}
                    fontSize={14}
                    fontWeight={600}
                    whiteSpace={'nowrap'}
                  >
                    {formatNumber(item.votes)}, {allVotes && ((item.votes / allVotes) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                {item.votes === 0 ? (
                  <SimpleProgress width="100%" per={0} />
                ) : (
                  <SimpleProgress width="100%" per={Math.floor((item.votes / allVotes) * 100)} />
                )}
              </Box>

              {proposalInfo.alreadyVoted !== 0 && account && voteList.length ? (
                item.userVote.status === VoteStatus.SUCCESS ? (
                  <Typography
                    sx={{
                      fontFamily: 'Inter',
                      fontWeight: 700,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#97B7EF'
                    }}
                  >
                    {'You voted ' + formatNumberWithCommas(item.userVote.votes)}
                  </Typography>
                ) : item.userVote.status === VoteStatus.PENDING ? (
                  <>
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontWeight: 700,
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#97B7EF',
                        display: 'flex',
                        gap: 6
                      }}
                    >
                      <TooltipStyle placement="top" value="The votes have not been executed on the blockchain yet." />
                      {'You voted ' + formatNumberWithCommas(item.userVote.votes)}
                    </Typography>
                  </>
                ) : null
              ) : !account || proposalInfo.yourVotes === 0 ? (
                <Tooltip title="No available votes" placement="top">
                  <Box
                    sx={{
                      height: 36,
                      width: 125,
                      backgroundColor: '#b4b2b2',
                      color: '#fff',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      font: '700 14px/20px "Inter"',
                      borderRadius: '8px',
                      userSelect: 'none'
                    }}
                  >
                    Vote
                  </Box>
                </Tooltip>
              ) : (
                <BlackButton
                  height="36px"
                  disabled={
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
      {(isPending || !account || proposalInfo.yourVotes === 0) && (
        <Box
          sx={{
            width: '100%',
            height: 65,
            mt: 15,
            backgroundColor: 'rgba(255, 186, 10, 0.18)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '8px',
            padding: '15px 20px'
          }}
        >
          <Typography variant="body1" lineHeight={'16px'} color={'#9F8644'}>
            {!account
              ? 'Please connect your wallet first.'
              : proposalInfo.yourVotes === 0
              ? 'Insufficient votes.'
              : isVoteSuccess
              ? 'The votes are currently being confirmed.'
              : 'You have votes pending to confirm, the votes will take effect after confirmation.'}
          </Typography>
          {isPending && (
            <>
              {isVoteSuccess ? (
                <BlackButton disabled width="100px" height="36px">
                  Confirming <Dots />
                </BlackButton>
              ) : (
                <BlackButton
                  style={{
                    height: 36,
                    width: 100,
                    fontWeight: 500,
                    color: '#C5954F',
                    backgroundColor: '#fff !important',
                    border: '1px solid #F1DEAB !important',
                    ':hover': {
                      backgroundColor: '#F5F5F5 !important',
                      color: '#9F8644'
                    }
                  }}
                  onClick={() => {
                    console.log('status=>', voteModalOpen, isVoteSuccess)
                    voteModalToggle()
                  }}
                >
                  PUSH
                </BlackButton>
              )}
            </>
          )}
        </Box>
      )}
      {userSignature && proposalInfo.status === 'Active' && (
        <VoteModal
          refresh={refresh}
          proposalInfo={proposalInfo}
          proposalOptions={proposalOptions}
          proposalOptionId={optionId}
          setUpDateVoteList={setUpDateVoteList}
          proposalVoteList={voteList}
        />
      )}
    </VoteWrapper>
  )
}

export function VoteListModal({ proposalId, allVotes }: { proposalId: number; allVotes: number | undefined }) {
  const { hideModal } = useModal()
  const { result: proposalVoteList, page } = useProposalVoteList(proposalId, VoteStatus.SUCCESS, true)
  const navigate = useNavigate()

  const userVoteList = useMemo(() => {
    if (!proposalVoteList) return
    const list = proposalVoteList.filter(item => item.status !== VoteStatus.PENDING)
    return list
  }, [proposalVoteList])

  return (
    <Modal maxWidth="480px" closeIcon width="100%">
      <StyledBody>
        <Stack spacing={19}>
          <Typography variant="h6" fontWeight={500}>
            Votes ({(allVotes && formatNumberWithCommas(allVotes)) || '--'})
          </Typography>

          {userVoteList?.map((item, index) => (
            <Box
              key={item.optionId + index.toString()}
              display={'grid'}
              gridTemplateColumns={item.chainId && item.txHash ? '1fr 1fr 1fr 0.6fr' : '1fr 1fr 0.8fr'}
              gap={'10px 5px'}
              alignItems={'center'}
              justifyContent="center"
              sx={{
                '& .link': {
                  textDecoration: 'none',
                  ':hover': {
                    textDecoration: 'underline'
                  }
                }
              }}
            >
              <Link
                underline="none"
                target={'_blank'}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  hideModal()
                  navigate(routes._Profile + `/${item.voter}`)
                }}
              >
                <StyledListText>{shortenAddress(item.voter)}</StyledListText>
              </Link>
              <StyledListText noWrap align="center">
                {item.optionContent}
              </StyledListText>
              <StyledListText align="center">{formatNumberWithCommas(item.votes)}</StyledListText>
              {item.chainId && item.txHash ? (
                <Link
                  underline="none"
                  target={'_blank'}
                  href={getEtherscanLink(item.chainId, item.txHash, 'transaction')}
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  <StyledListText align="center">Hash</StyledListText>
                </Link>
              ) : null}
              {item.arHash ? (
                <a href={item.arHash} target="_blank" rel="noreferrer" className="link">
                  <StyledListText align="center">Arweave Hash</StyledListText>
                </a>
              ) : null}
            </Box>
          ))}

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
