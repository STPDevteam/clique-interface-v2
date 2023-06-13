import { Box, Link, Stack, styled, Typography, useTheme } from '@mui/material'
import EmptyData from 'components/EmptyData'
import Modal from 'components/Modal'
import Pagination from 'components/Pagination'
import { SimpleProgress } from 'components/Progress'
import { ChainId } from 'constants/chain'
import { routes } from 'constants/routes'
import { Token, TokenAmount } from 'constants/token'
import { useProposalVoteList } from 'hooks/useBackedProposalServer'
import useBreakpoint from 'hooks/useBreakpoint'
import useModal from 'hooks/useModal'
import { ProposalOptionProp } from 'hooks/useProposalInfo'
import { useMemo } from 'react'
import { useHistory } from 'react-router'
import { shortenAddress } from 'utils'
import { RowCenter } from '../ProposalItem'
import { VoteWrapper } from './Vote'
import { useSelector } from 'react-redux'
import { AppState } from 'state'

const StyledItem = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.bgColor.bg2}`,
  borderRadius: '12px',
  padding: '12px 32px 15px'
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
  proposalOptions,
  proposalId
}: {
  proposalOptions: ProposalOptionProp[]
  proposalId: number
}) {
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')
  const allVotes = useMemo(() => {
    let ret = 0
    for (const { votes } of proposalOptions) {
      ret = ret + votes
    }
    return ret
  }, [proposalOptions])
  const { showModal } = useModal()

  return (
    <VoteWrapper style={{ padding: isSmDown ? '20px 16px' : '' }}>
      <RowCenter flexWrap={'wrap'}>
        <Typography variant="h6" fontWeight={500}>
          Current Results
        </Typography>
        <Typography
          onClick={() =>
            showModal(<VoteListModal allVotes={allVotes} proposalId={proposalId} proposalOptions={proposalOptions} />)
          }
          variant="body1"
          sx={{ cursor: 'pointer' }}
          color={theme.palette.primary.main}
        >
          View All Votes ({allVotes})
        </Typography>
      </RowCenter>
      <Stack mt={16} spacing={10}>
        {proposalOptions.map((item, index) => (
          <StyledItem key={index} style={{ padding: isSmDown ? '16px' : '' }}>
            <Typography mb={5}>{item.optionContent}</Typography>
            <Box
              display={'grid'}
              sx={{
                gridTemplateColumns: { sm: '1fr 180px', xs: '1fr' }
              }}
              columnGap="24px"
              rowGap={'5px'}
            >
              <SimpleProgress width="100%" per={Math.floor(item.votes * 100)} />
              <Typography color={theme.palette.text.secondary} fontSize={14} fontWeight={600}>
                {(item.votes * 100).toFixed(1)}%({allVotes} Votes)
              </Typography>
            </Box>
          </StyledItem>
        ))}
      </Stack>
    </VoteWrapper>
  )
}

function VoteListModal({
  proposalId,
  allVotes,
  proposalOptions
}: {
  proposalId: number
  allVotes: number
  proposalOptions: ProposalOptionProp[]
}) {
  const { hideModal } = useModal()
  const chainId = 0 as ChainId
  const daoInfo = useSelector((state: AppState) => state.buildingGovernanceDao.createDaoData)
  const { result: proposalVoteList, page } = useProposalVoteList(chainId, '', proposalId)
  const token = useMemo(() => {
    return new Token(daoInfo.governance[0].chainId, daoInfo.governance[0].tokenAddress, daoInfo.governance[0].decimals)
  }, [daoInfo.governance])
  const showList = useMemo(() => {
    if (!token) return []
    return proposalVoteList.map(item => ({
      optionName: proposalOptions[item.optionIndex].optionContent,
      voter: item.voter,
      amount: new TokenAmount(token, item.amount)
    }))
  }, [proposalOptions, proposalVoteList, token])
  const history = useHistory()

  return (
    <Modal maxWidth="460px" closeIcon width="100%">
      <StyledBody>
        <Stack spacing={19}>
          <Typography variant="h6" fontWeight={500}>
            Votes ({allVotes})
          </Typography>
          <Box
            display={'grid'}
            gridTemplateColumns="1fr 1fr 0.8fr"
            gap={'10px 5px'}
            alignItems={'center'}
            justifyContent="center"
          >
            {showList.map(item => (
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
                <StyledListText noWrap>{item.optionName}</StyledListText>
                <StyledListText>{item.amount.toSignificant(6, { groupSeparator: ',' })}</StyledListText>
              </>
            ))}
          </Box>
          {!showList.length && <EmptyData />}
          <Box display={'flex'} justifyContent="center">
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
