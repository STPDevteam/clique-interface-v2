import { Box, Link, Stack, styled, Typography, useTheme } from '@mui/material'
import { DaoAvatars } from 'components/Avatars'
import OutlineButton from 'components/Button/OutlineButton'
import Pagination from 'components/Pagination'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import {
  NotificationProp,
  NotificationTypes,
  useNotificationListInfo,
  useNotificationToRead
} from 'hooks/useBackedNotificationServer'
import EmptyData from 'components/EmptyData'
import DelayLoading from 'components/DelayLoading'
import Loading from 'components/Loading'
import { timeStampToFormat } from 'utils/dao'
import { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useNotificationListPaginationCallback } from 'state/pagination/hooks'
import { useActiveWeb3React } from 'hooks'

const Wrapper = styled(Stack)(({ theme }) => ({
  marginTop: 24,
  padding: '34px 39px',
  border: `1px solid ${theme.bgColor.bg2}`,
  borderRadius: theme.borderRadius.default,
  boxShadow: theme.boxShadow.bs1,
  [theme.breakpoints.down('sm')]: {
    padding: '16px'
  }
}))

const Text = styled(Stack)(({ theme, color }: { theme?: any; color?: string }) => ({
  fontSize: 13,
  fontWeight: 600,
  color: color || theme.palette.text.secondary
}))

function TypeTitle({ isRead, type }: { isRead: boolean; type: NotificationTypes }) {
  const theme = useTheme()
  const title = useMemo(
    () =>
      type === 'Airdrop'
        ? 'Airdrop'
        : type === 'NewProposal'
        ? 'New active proposal'
        : type === 'ReserveToken'
        ? 'Reserve token'
        : type === 'PublicSaleCreated'
        ? 'Create swap'
        : type === 'PublicSalePurchased'
        ? 'Purchased a swap'
        : type === 'PublicSaleCanceled'
        ? 'Cancelled a swap'
        : 'message',
    [type]
  )
  return isRead ? (
    <Text>{title}</Text>
  ) : (
    <Box display={'flex'} alignItems="center">
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          marginRight: 12,
          backgroundColor: theme.palette.primary.main
        }}
      />
      <Text color={theme.palette.text.primary}>{title}</Text>
    </Box>
  )
}

function MsgItem({
  item,
  setReadOnce,
  isReadAll,
  toBackedReadOnce
}: {
  item: NotificationProp
  setReadOnce: () => void
  isReadAll: boolean
  toBackedReadOnce: (notificationId: number) => Promise<any>
}) {
  const [isRead, setIsRead] = useState(item.alreadyRead)
  const { account } = useActiveWeb3React()

  const history = useHistory()
  const showData: {
    text: string
    link?: string
  } = useMemo(() => {
    return {
      text:
        item.types === 'Airdrop'
          ? 'You have a new DAO Rewards can be claimed'
          : item.types === 'NewProposal'
          ? item.info.proposalName || ''
          : item.types === 'ReserveToken'
          ? 'You have a new token can be claimed'
          : item.types === 'PublicSaleCreated'
          ? 'You created a new swap'
          : account?.toLowerCase() === item.info.creator?.toLowerCase()
          ? `${item.info.buyer ?? ''} purchased your swap`
          : item.info.creator?.toLowerCase() !== account?.toLowerCase()
          ? 'You purchased a swap'
          : item.types === 'PublicSaleCanceled'
          ? 'You cancelled a swap'
          : 'message',
      link:
        item.types === 'Airdrop'
          ? item.info.activityId && item.info.chainId && item.info.daoAddress
            ? routes._ActivityAirdropDetail + `/${item.info.chainId}/${item.info.daoAddress}/${item.info.activityId}`
            : ''
          : item.types === 'NewProposal'
          ? item.info.chainId && item.info.daoAddress
            ? routes._DaoInfo +
              `/${item.info.chainId}/${item.info.daoAddress}/proposal/detail/${item.info.proposalId || 0}`
            : ''
          : item.types === 'ReserveToken'
          ? routes._Profile
          : item.types === 'PublicSaleCreated' ||
            item.types === 'PublicSalePurchased' ||
            item.types === 'PublicSaleCanceled'
          ? routes._SaleDetails + `/${item.info.activityId || 0}`
          : ''
    }
  }, [
    account,
    item.info.activityId,
    item.info.buyer,
    item.info.chainId,
    item.info.creator,
    item.info.daoAddress,
    item.info.proposalId,
    item.info.proposalName,
    item.types
  ])

  return (
    <Box
      sx={{ cursor: isRead || isReadAll ? 'auto' : 'pointer' }}
      onClick={() => {
        if (!isRead || !isReadAll) {
          toBackedReadOnce(item.notificationId).then(() => {
            setIsRead(true)
            setReadOnce()
          })
        }
      }}
    >
      <RowCenter mb={16}>
        <TypeTitle isRead={isRead || isReadAll} type={item.types} />
        <Text>{timeStampToFormat(item.notificationTime)}</Text>
      </RowCenter>
      {item.types === 'Airdrop' || item.types === 'NewProposal' ? (
        <Box display={'flex'} alignItems="center">
          <DaoAvatars size={64} src={item.info.daoLogo} />
          <Box ml={16}>
            <Text>{item.info.daoName}</Text>
            <Text display={'inline-block'}>
              {showData.text}
              {'. '}
              {showData.link && (
                <Link onClick={() => history.push(showData.link as string)} sx={{ cursor: 'pointer' }}>
                  View
                </Link>
              )}
            </Text>
          </Box>
        </Box>
      ) : item.types === 'PublicSaleCreated' ||
        item.types === 'PublicSalePurchased' ||
        item.types === 'PublicSaleCanceled' ? (
        <Box display={'flex'} alignItems="center">
          <DaoAvatars size={64} src={item.info.tokenLogo} />
          <Box ml={16}>
            <Text>{item.info.activityName}</Text>
            <Text display={'inline-block'}>
              {showData.text}
              {'. '}
              {showData.link && (
                <Link onClick={() => history.push(showData.link as string)} sx={{ cursor: 'pointer' }}>
                  View
                </Link>
              )}
            </Text>
          </Box>
        </Box>
      ) : (
        <Box>
          <Text display={'inline-block'}>
            {showData.text}
            {'. '}
            {showData.link && (
              <Link onClick={() => history.push(showData.link as string)} sx={{ cursor: 'pointer' }}>
                View
              </Link>
            )}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default function NotificationPage() {
  const [isReadAll, setIsReadAll] = useState(false)
  const { result: notificationList, loading, page } = useNotificationListInfo()
  const {
    setReadOnce,
    setReadAll,
    data: { unReadCount }
  } = useNotificationListPaginationCallback()
  const { toBackedReadAll, toBackedReadOnce } = useNotificationToRead()

  return (
    <Box
      sx={{
        padding: { sm: '40px 20px', xs: '0 16px' }
      }}
    >
      <ContainerWrapper maxWidth={1150}>
        <RowCenter>
          <Typography variant="h6">Notifications</Typography>
          <OutlineButton
            height={24}
            width={140}
            noBold
            onClick={() => {
              if (unReadCount) {
                toBackedReadAll().then(() => {
                  setReadAll()
                  setIsReadAll(true)
                })
              }
            }}
          >
            Mark all as read
          </OutlineButton>
        </RowCenter>
        <Wrapper spacing={26}>
          <Box minHeight={150}>
            {!loading && !notificationList.length && (
              <EmptyData sx={{ marginTop: 30 }}>You did not receive any message</EmptyData>
            )}
            <DelayLoading loading={loading}>
              <Loading sx={{ marginTop: 30 }} />
            </DelayLoading>
            <Stack spacing={16}>
              {!loading &&
                notificationList.map(item => (
                  <MsgItem
                    setReadOnce={setReadOnce}
                    toBackedReadOnce={toBackedReadOnce}
                    key={item.notificationId}
                    isReadAll={isReadAll}
                    item={item}
                  />
                ))}
            </Stack>
          </Box>
          <Box display={'flex'} justifyContent="center">
            <Pagination
              count={page.totalPage}
              page={page.currentPage}
              onChange={(_, value) => page.setCurrentPage(value)}
            />
          </Box>
        </Wrapper>
      </ContainerWrapper>
    </Box>
  )
}
