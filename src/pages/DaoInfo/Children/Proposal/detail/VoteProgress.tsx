import { Box, Link, Stack, styled, Typography, useTheme } from '@mui/material'
import EmptyData from 'components/EmptyData'
import Modal from 'components/Modal'
import Pagination from 'components/Pagination'
import { SimpleProgress } from 'components/Progress'
import { ChainId } from 'constants/chain'
import { routes } from 'constants/routes'
import { TokenAmount } from 'constants/token'
import { useProposalVoteList } from 'hooks/useBackedProposalServer'
import useBreakpoint from 'hooks/useBreakpoint'
import useModal from 'hooks/useModal'
import { ProposalOptionProp } from 'hooks/useProposalInfo'
import JSBI from 'jsbi'
import { useMemo } from 'react'
import { useHistory } from 'react-router'
import { shortenAddress } from 'utils'
import { RowCenter } from '../ProposalItem'
import { VoteWrapper } from './Vote'

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
  daoAddress,
  daoChainId,
  proposalId
}: {
  proposalOptions: ProposalOptionProp[]
  daoAddress: string
  daoChainId: ChainId
  proposalId: number
}) {
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')
  const allVotes = useMemo(() => {
    let ret = new TokenAmount(proposalOptions[0].amount.token, JSBI.BigInt(0))
    for (const { amount } of proposalOptions) {
      ret = ret.add(amount)
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
            showModal(
              <VoteListModal
                allVotes={allVotes}
                daoChainId={daoChainId}
                daoAddress={daoAddress}
                proposalId={proposalId}
                proposalOptions={proposalOptions}
              />
            )
          }
          variant="body1"
          sx={{ cursor: 'pointer' }}
          color={theme.palette.primary.main}
        >
          View All Votes ({allVotes.toSignificant(6, { groupSeparator: ',' })})
        </Typography>
      </RowCenter>
      <Stack mt={16} spacing={10}>
        {proposalOptions.map((item, index) => (
          <StyledItem key={index} style={{ padding: isSmDown ? '16px' : '' }}>
            <Typography mb={5}>{item.name}</Typography>
            <Box
              display={'grid'}
              sx={{
                gridTemplateColumns: { sm: '1fr 180px', xs: '1fr' }
              }}
              columnGap="24px"
              rowGap={'5px'}
            >
              <SimpleProgress width="100%" per={Math.floor(item.per * 100)} />
              <Typography color={theme.palette.text.secondary} fontSize={14} fontWeight={600}>
                {(item.per * 100).toFixed(1)}%({item.amount.toSignificant(6, { groupSeparator: ',' })} Votes)
              </Typography>
            </Box>
          </StyledItem>
        ))}
      </Stack>
    </VoteWrapper>
  )
}

function VoteListModal({
  daoAddress,
  daoChainId,
  proposalId,
  allVotes,
  proposalOptions
}: {
  daoAddress: string
  daoChainId: ChainId
  proposalId: number
  allVotes: TokenAmount
  proposalOptions: ProposalOptionProp[]
}) {
  const { hideModal } = useModal()
  const { result: proposalVoteList, page } = useProposalVoteList(daoChainId, daoAddress, proposalId)
  const token = useMemo(() => proposalOptions[0].amount.token, [proposalOptions])
  const showList = useMemo(() => {
    if (!token) return []
    return proposalVoteList.map(item => ({
      optionName: proposalOptions[item.optionIndex].name,
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
            Votes ({allVotes.toSignificant(6, { groupSeparator: ',' })})
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
