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
import Image from 'components/Image'
import NotiIcon from 'assets/images/notiIcon.png'
// import PushManagementModal from './PushManagementModal'

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
          ? item.daoId
            ? routes._DaoInfo + `/${item.daoId}/proposal/detail/${item.activityId}`
            : ''
          : item.types === 'ReserveToken'
          ? routes._Profile
          : item.types === 'PublicSaleCreated' ||
            item.types === 'PublicSalePurchased' ||
            item.types === 'PublicSaleCanceled'
          ? routes._SaleDetails + `/${item.activityId || 0}`
          : ''
    }
  }, [item.activityId, item.activityTitle, item.daoId, item.types])

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
          <DaoAvatars size={64} src={item.daoLogo} />
          <Box ml={16}>
            <Text>{item.daoName}</Text>
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
          <DaoAvatars size={64} src={item.daoLogo} />
          <Box ml={16}>
            <Text>{item.daoName}</Text>
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
    data,
    data: { unReadCount }
  } = useNotificationListPaginationCallback()
  const { toBackedReadAll, toBackedReadOnce } = useNotificationToRead()
  console.log('notificationList', notificationList, unReadCount, data)

  return (
    <Box
      sx={{
        padding: { sm: '40px 20px', xs: '0 16px' }
      }}
    >
      <ContainerWrapper maxWidth={1150}>
        <RowCenter>
          <RowCenter>
            <Image width={38} src={NotiIcon} />
            <Typography mr={10} color={'#3F5170'} fontSize={30} fontWeight={600}>
              Notifications
            </Typography>
            {/* <OutlineButton height={24} width={140} noBold onClick={() => history.push(routes.PushList)}>
              Push Message
            </OutlineButton> */}
          </RowCenter>
          <Stack display={'grid'} gridTemplateColumns="1fr" gap={16}>
            {/* <Badge badgeContent={4} color="primary">
              <OutlineButton noBold height={24} width={140} onClick={() => showModal(<PushManagementModal />)}>
                Push management
              </OutlineButton>
            </Badge> */}
            <OutlineButton
              height={36}
              width={150}
              noBold
              color="#0049C6"
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
          </Stack>
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

// function MsgItems({
//   item,
//   setReadOnce,
//   isReadAll,
//   toBackedReadOnce
// }: {
//   item: NotificationProp
//   setReadOnce: () => void
//   isReadAll: boolean
//   toBackedReadOnce: (notificationId: number) => Promise<any>
// }) {
//   const [isRead, setIsRead] = useState(item.alreadyRead)

//   const history = useHistory()
//   const showData: {
//     text: string
//     link?: string
//   } = useMemo(() => {
//     return {
//       text:
//         item.types === 'Airdrop'
//           ? 'DAO Rewards'
//           : item.types === 'NewProposal'
//           ? 'Active Proposal'
//           : item.types === 'JobReject' || item.types === 'JobApply'
//           ? 'Open job'
//           : item.types === 'BecomeOwner' || item.types === 'BecomeSuperAdmin' || item.types === 'BecomeAdmin'
//           ? 'DAO Members'
//           : item.types === 'TaskAssigned' || item.types === 'TaskDone'
//           ? 'Workspace'
//           : 'message',
//       link:
//         item.types === 'Airdrop'
//           ? item.activityId && item.daoId
//             ? routes._ActivityAirdropDetail + `/${item.daoId}/${item.activityId}`
//             : ''
//           : item.types === 'NewProposal'
//           ? item.daoId
//             ? routes._DaoInfo + `/${item.daoId}/proposal/detail/${item.activityId}`
//             : ''
//           : item.types === 'ReserveToken'
//           ? routes._Profile
//           : item.types === 'PublicSaleCreated' ||
//             item.types === 'PublicSalePurchased' ||
//             item.types === 'PublicSaleCanceled'
//           ? routes._SaleDetails + `/${item.activityId || 0}`
//           : ''
//     }
//   }, [item.activityId, item.daoId, item.types])

//   return (
//     <Box
//       sx={{ cursor: isRead || isReadAll ? 'auto' : 'pointer' }}
//       onClick={() => {
//         if (!isRead || !isReadAll) {
//           toBackedReadOnce(item.notificationId).then(() => {
//             setIsRead(true)
//             setReadOnce()
//           })
//         }
//       }}
//     >
//       <RowCenter mb={16}>
//         <TypeTitle isRead={isRead || isReadAll} type={item.types} />
//         <Text>{timeStampToFormat(item.notificationTime)}</Text>
//       </RowCenter>
//       {item.types === 'Airdrop' || item.types === 'NewProposal' ? (
//         <Box display={'flex'} alignItems="center">
//           <DaoAvatars size={64} src={item.daoLogo} />
//           <Box ml={16}>
//             <Text>{item.daoName}</Text>
//             <Text display={'inline-block'}>
//               {showData.text}
//               {'. '}
//               {showData.link && (
//                 <Link onClick={() => history.push(showData.link as string)} sx={{ cursor: 'pointer' }}>
//                   View
//                 </Link>
//               )}
//             </Text>
//           </Box>
//         </Box>
//       ) : item.types === 'PublicSaleCreated' ||
//         item.types === 'PublicSalePurchased' ||
//         item.types === 'PublicSaleCanceled' ? (
//         <Box display={'flex'} alignItems="center">
//           <DaoAvatars size={64} src={item.daoLogo} />
//           <Box ml={16}>
//             <Text>{item.daoName}</Text>
//             <Text display={'inline-block'}>
//               {showData.text}
//               {'. '}
//               {showData.link && (
//                 <Link onClick={() => history.push(showData.link as string)} sx={{ cursor: 'pointer' }}>
//                   View
//                 </Link>
//               )}
//             </Text>
//           </Box>
//         </Box>
//       ) : (
//         <Box>
//           <Text display={'inline-block'}>
//             {showData.text}
//             {'. '}
//             {showData.link && (
//               <Link onClick={() => history.push(showData.link as string)} sx={{ cursor: 'pointer' }}>
//                 View
//               </Link>
//             )}
//           </Text>
//         </Box>
//       )}
//     </Box>
//   )
// }
