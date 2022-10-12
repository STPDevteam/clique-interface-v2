import { Box, Link as MuiLink, Typography, useTheme, styled, Stack } from '@mui/material'
import { DaoAvatars } from 'components/Avatars'
import DelayLoading from 'components/DelayLoading'
import EmptyData from 'components/EmptyData'
import Loading from 'components/Loading'
import Pagination from 'components/Pagination'
import { ChainId } from 'constants/chain'
import { routes } from 'constants/routes'
import {
  AccountBackedSendRecordTypesProp,
  AccountSendRecordProp,
  useAccountSendRecordList
} from 'hooks/useBackedProfileServer'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import { useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useToken } from 'state/wallet/hooks'
import { getEtherscanLink } from 'utils'
import { timeStampToFormat } from 'utils/dao'

const StyledBox = styled(Box)(({ theme }) => ({
  padding: '28px 40px',
  border: `1px solid ${theme.bgColor.bg2}`,
  boxShadow: theme.boxShadow.bs1,
  borderRadius: theme.borderRadius.default
}))

export default function MyRecords({ account }: { account: string }) {
  const theme = useTheme()
  const { result: list, page, loading } = useAccountSendRecordList(account)
  return (
    <ContainerWrapper maxWidth={1150} margin={'0 auto'}>
      <Box display={'flex'} justifyContent="space-between">
        <Typography variant="h6" fontSize={16} fontWeight={600}>
          My activity
        </Typography>
        <Typography fontSize={16} fontWeight={500} color={theme.palette.text.secondary}>
          Only visible to yourself
        </Typography>
      </Box>
      <StyledBox mt={25}>
        <Box>
          {!loading && !list.length && <EmptyData>No data</EmptyData>}
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
    </ContainerWrapper>
  )
}

const accountBackedSendRecordTypesText = {
  [AccountBackedSendRecordTypesProp.EvCreateDao]: 'Create DAO',
  [AccountBackedSendRecordTypesProp.EvCreateProposal]: 'Create proposal',
  [AccountBackedSendRecordTypesProp.EvVote]: 'Vote',
  [AccountBackedSendRecordTypesProp.EvCancelProposal]: 'Cancel proposal',
  [AccountBackedSendRecordTypesProp.EvAdmin]: 'Set admin',
  [AccountBackedSendRecordTypesProp.EvOwnershipTransferred]: 'Admin transferred',
  [AccountBackedSendRecordTypesProp.EvCreateERC20]: 'Create token',
  [AccountBackedSendRecordTypesProp.EvClaimReserve]: 'Claim reserve Token',
  [AccountBackedSendRecordTypesProp.EvCreateAirdrop]: 'Create DAOdrop',
  [AccountBackedSendRecordTypesProp.EvSettleAirdrop]: 'Publish DAOdrop',
  [AccountBackedSendRecordTypesProp.EvClaimed]: 'Claim DAOdrop'
}

function RecordItem({ item }: { item: AccountSendRecordProp }) {
  const history = useHistory()
  const isAboutToken = useMemo(
    () =>
      [AccountBackedSendRecordTypesProp.EvCreateERC20, AccountBackedSendRecordTypesProp.EvClaimReserve].includes(
        item.types
      ),
    [item.types]
  )

  const link = useMemo(() => {
    if (
      [
        AccountBackedSendRecordTypesProp.EvCreateProposal,
        AccountBackedSendRecordTypesProp.EvVote,
        AccountBackedSendRecordTypesProp.EvCancelProposal
      ].includes(item.types)
    ) {
      return routes._DaoInfo + `/${item.chainId}/${item.address}/proposal/detail/${item.activityId}`
    }
    if (
      [
        AccountBackedSendRecordTypesProp.EvCreateDao,
        AccountBackedSendRecordTypesProp.EvAdmin,
        AccountBackedSendRecordTypesProp.EvOwnershipTransferred
      ].includes(item.types)
    ) {
      return routes._DaoInfo + `/${item.chainId}/${item.address}`
    }
    if (
      [
        AccountBackedSendRecordTypesProp.EvCreateAirdrop,
        AccountBackedSendRecordTypesProp.EvSettleAirdrop,
        AccountBackedSendRecordTypesProp.EvClaimed
      ].includes(item.types)
    ) {
      return routes._ActivityAirdropDetail + `/${item.chainId}/${item.address}/${item.activityId}`
    }
    return undefined
  }, [item.activityId, item.address, item.chainId, item.types])

  const theme = useTheme()
  return (
    <div>
      <RowCenter>
        <Typography fontSize={13} fontWeight={600}>
          {accountBackedSendRecordTypesText[item.types]}
        </Typography>
        <Typography fontSize={13} fontWeight={600} color={theme.palette.text.secondary}>
          {timeStampToFormat(item.time)}
        </Typography>
      </RowCenter>
      <RowCenter mt={4}>
        <Box display={'flex'} alignItems="center">
          <DaoAvatars size={64} src={item.avatar} />
          <Typography fontSize={14} fontWeight={600} color={theme.palette.text.secondary} ml={16}>
            {isAboutToken ? (
              <ShowTokenName chainId={item.chainId} address={item.address} />
            ) : (
              <span style={{ cursor: link ? 'pointer' : 'auto' }} onClick={() => link && history.push(link)}>
                {item.titles || item.daoName}
              </span>
            )}
          </Typography>
        </Box>
        {!isAboutToken && item.daoName && (
          <Link to={routes._DaoInfo + `/${item.chainId}/${item.address}`} style={{ fontSize: 12 }}>
            {item.daoName}
          </Link>
        )}
      </RowCenter>
    </div>
  )
}

function ShowTokenName({ chainId, address }: { chainId: ChainId; address: string }) {
  const theme = useTheme()
  const token = useToken(address, chainId)
  return (
    <MuiLink
      underline="none"
      color={theme.palette.text.secondary}
      href={getEtherscanLink(chainId, address, 'token')}
      target="_blank"
    >
      {token ? `${token.name}(${token.symbol})` : '--'}
    </MuiLink>
  )
}
