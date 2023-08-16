import { Box, Typography, useTheme, styled, Stack } from '@mui/material'
import { DaoAvatars } from 'components/Avatars'
import DelayLoading from 'components/DelayLoading'
import EmptyData from 'components/EmptyData'
import Loading from 'components/Loading'
import Pagination from 'components/Pagination'
import { routes } from 'constants/routes'
import {
  AccountBackedSendRecordTypesProp,
  AccountSendRecordProp,
  useAccountSendRecordList
} from 'hooks/useBackedProfileServer'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { timeStampToFormat } from 'utils/dao'

const StyledBox = styled(Box)(({ theme }) => ({
  padding: '28px 40px',
  border: `1px solid ${theme.bgColor.bg2}`,
  boxShadow: theme.boxShadow.bs1,
  borderRadius: theme.borderRadius.default,
  [theme.breakpoints.down('sm')]: {
    padding: '20px'
  }
}))

export default function MyRecords({ account }: { account: string }) {
  const theme = useTheme()
  const { result: list, page, loading } = useAccountSendRecordList(account)
  return (
    <ContainerWrapper maxWidth={1150} margin={'0 auto'}>
      <Box display={'flex'} justifyContent="space-between">
        <Typography variant="h6" fontSize={16} fontWeight={600}>
          My Activity
        </Typography>
        <Typography fontSize={16} fontWeight={500} color={theme.palette.text.secondary}>
          Only Visible To Yourself
        </Typography>
      </Box>
      {!loading && !list.length && (
        <Box mt={25}>
          <EmptyData></EmptyData>
        </Box>
      )}
      {list.length ? (
        <StyledBox mt={25}>
          <Box>
            <DelayLoading loading={loading}>
              <Loading sx={{ marginTop: 30 }} />
            </DelayLoading>
          </Box>
          {!loading && (
            <Stack spacing={19} width="100%">
              {list.map((item, index) => (
                <RecordItem key={index} item={item} />
              ))}
            </Stack>
          )}

          <Box mt={40} display={'flex'} justifyContent="center">
            <Pagination
              count={page.totalPage}
              page={page.currentPage}
              onChange={(_, value) => page.setCurrentPage(value)}
            />
          </Box>
        </StyledBox>
      ) : (
        ''
      )}
    </ContainerWrapper>
  )
}

const accountBackedSendRecordTypesText = {
  [AccountBackedSendRecordTypesProp.EvCreateDao]: 'Create DAO',
  [AccountBackedSendRecordTypesProp.EvCreateProposal]: 'Create Proposal',
  [AccountBackedSendRecordTypesProp.EvVote]: 'Vote',
  [AccountBackedSendRecordTypesProp.EvCancelProposal]: 'Cancel Proposal',
  [AccountBackedSendRecordTypesProp.EvAdmin]: 'Set Admin',
  [AccountBackedSendRecordTypesProp.EvOwnershipTransferred]: 'Admin Transferred',
  [AccountBackedSendRecordTypesProp.EvCreateERC20]: 'Create Token',
  [AccountBackedSendRecordTypesProp.EvClaimReserve]: 'Claim Reserve Token',
  [AccountBackedSendRecordTypesProp.EvCreateAirdrop]: 'Create DAO Rewards',
  [AccountBackedSendRecordTypesProp.EvSettleAirdrop]: 'Publish DAO Rewards',
  [AccountBackedSendRecordTypesProp.EvClaimed]: 'Claim DAO Rewards'
}

function RecordItem({ item }: { item: AccountSendRecordProp }) {
  const navigate = useNavigate()
  const link = useMemo(() => {
    if (
      [
        AccountBackedSendRecordTypesProp.EvCreateProposal,
        AccountBackedSendRecordTypesProp.EvVote,
        AccountBackedSendRecordTypesProp.EvCancelProposal
      ].includes(item.types)
    ) {
      return routes._DaoInfo + `/${item.daoId}/proposal/detail/${item.proposalId}`
    }
    if (
      [
        AccountBackedSendRecordTypesProp.EvCreateDao,
        AccountBackedSendRecordTypesProp.EvAdmin,
        AccountBackedSendRecordTypesProp.EvOwnershipTransferred
      ].includes(item.types)
    ) {
      return routes._DaoInfo + `/${item.daoId}/proposal`
    }
    return undefined
  }, [item.daoId, item.proposalId, item.types])

  const theme = useTheme()
  return (
    <div>
      <RowCenter>
        <Typography fontSize={13} fontWeight={600}>
          {accountBackedSendRecordTypesText[item.types]}
        </Typography>
        <Typography fontSize={13} fontWeight={600} color={theme.palette.text.secondary}>
          {timeStampToFormat(item.timestamp || item.time)}
        </Typography>
      </RowCenter>
      <RowCenter mt={4}>
        <Box display={'flex'} alignItems="center">
          <DaoAvatars size={64} src={item.daoLogo} />
          <Typography fontSize={14} fontWeight={600} color={theme.palette.text.secondary} ml={16}>
            <span style={{ cursor: link ? 'pointer' : 'auto' }} onClick={() => link && navigate(link)}>
              {item.titles || item.daoName}
            </span>
          </Typography>
        </Box>
        {item.daoName && (
          <Link to={routes._DaoInfo + `/${item.daoId}/proposal`} style={{ fontSize: 12 }}>
            {item.daoName}
          </Link>
        )}
      </RowCenter>
    </div>
  )
}
