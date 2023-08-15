import { Box, Link, Stack, styled, Typography, useTheme } from '@mui/material'
import { DaoAvatars } from 'components/Avatars'
import Pagination from 'components/Pagination'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import { NotificationProp, NotificationTypes, useNotificationListInfo } from 'hooks/useBackedNotificationServer'
import EmptyData from 'components/EmptyData'
import DelayLoading from 'components/DelayLoading'
import Loading from 'components/Loading'
import { timeStampToFormat } from 'utils/dao'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

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

function MsgItem({ item, isReadAll }: { item: NotificationProp; isReadAll: boolean }) {
  const navigate = useNavigate()
  const showData: {
    text: string
    link?: string
  } = useMemo(() => {
    return {
      text:
        item.types === 'Airdrop'
          ? 'You have a new DAO Rewards can be claimed'
          : item.types === 'NewProposal'
          ? item.activityTitle || ''
          : item.types === 'ReserveToken'
          ? 'You have a new token can be claimed'
          : 'message',
      link:
        item.types === 'Airdrop'
          ? item.activityId && item.daoId
            ? routes._ActivityAirdropDetail + `/${item.daoId}/${item.activityId}`
            : ''
          : item.types === 'NewProposal'
          ? item.daoId && item.activityId
            ? routes._DaoInfo + `/${item.daoId}/proposal/detail/${item.activityId || 0}`
            : ''
          : item.types === 'ReserveToken'
          ? routes._Profile
          : ''
    }
  }, [item.activityId, item.activityTitle, item.daoId, item.types])

  return (
    <Box sx={{ cursor: isReadAll ? 'auto' : 'pointer' }}>
      <RowCenter mb={16}>
        <TypeTitle isRead={isReadAll} type={item.types} />
        <Text>{timeStampToFormat(item.notificationTime)}</Text>
      </RowCenter>
      {item.types === 'Airdrop' || item.types === 'NewProposal' ? (
        <Box display={'flex'} alignItems="center">
          <DaoAvatars size={64} src={item.daoLogo} />
          <Box ml={16}>
            <Text>{item.daoName}</Text>
            <Text display={'inline-block'}>
              {showData.text}
              {'. '}
              {showData.link && (
                <Link onClick={() => navigate(showData.link as string)} sx={{ cursor: 'pointer' }}>
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
              <Link onClick={() => navigate(showData.link as string)} sx={{ cursor: 'pointer' }}>
                View
              </Link>
            )}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default function PushList() {
  const { result: notificationList, loading, page } = useNotificationListInfo()

  return (
    <Box
      sx={{
        padding: { sm: '40px 20px', xs: '0 16px' }
      }}
    >
      <ContainerWrapper maxWidth={1150}>
        <RowCenter>
          <Typography mr={10} variant="h6">
            Push Message
          </Typography>
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
                notificationList.map(item => <MsgItem key={item.notificationId} isReadAll={true} item={item} />)}
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
