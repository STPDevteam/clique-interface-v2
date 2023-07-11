import { Box, Link, Stack, styled, Typography, useTheme } from '@mui/material'
// import { DaoAvatars } from 'components/Avatars'
import OutlineButton from 'components/Button/OutlineButton'
import Pagination from 'components/Pagination'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import {
  NotificationProp,
  // NotificationTypes,
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
  // padding: '34px 39px',
  borderTop: `1px solid ${theme.bgColor.bg2}`,
  // borderRadius: theme.borderRadius.default,
  // boxShadow: theme.boxShadow.bs1,
  [theme.breakpoints.down('sm')]: {
    padding: '16px'
  }
}))

const Text = styled(Stack)(({ theme, color }: { theme?: any; color?: string }) => ({
  fontSize: 13,
  fontWeight: 600,
  color: color || theme.palette.text.secondary
}))

const LinkStyle = styled(Link)(() => ({
  color: ' #0049C6',
  fontSize: '14px',
  fontWeight: '700',
  lineHeight: '20px'
}))

const ContentStyle = styled(Typography)(() => ({
  color: ' #80829F',
  fontSize: '14px',
  fontWeight: '700',
  lineHeight: '20px'
}))

const TitleStyle = styled(Typography)(() => ({
  color: ' #80829F',
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '20px'
}))

// function TypeTitle({ isRead, type }: { isRead: boolean; type: NotificationTypes }) {
//   const theme = useTheme()
//   const title = useMemo(
//     () =>
//       type === 'Airdrop'
//         ? 'Airdrop'
//         : type === 'NewProposal'
//         ? 'New active proposal'
//         : type === 'ReserveToken'
//         ? 'Reserve token'
//         : type === 'PublicSaleCreated'
//         ? 'Create swap'
//         : type === 'PublicSalePurchased'
//         ? 'Purchased a swap'
//         : type === 'PublicSaleCanceled'
//         ? 'Cancelled a swap'
//         : 'message',
//     [type]
//   )
//   return isRead ? (
//     <Text>{title}</Text>
//   ) : (
//     <Box display={'flex'} alignItems="center">
//       <Box
//         sx={{
//           width: 6,
//           height: 6,
//           borderRadius: '50%',
//           marginRight: 12,
//           backgroundColor: theme.palette.primary.main
//         }}
//       />
//       <Text color={theme.palette.text.primary}>{title}</Text>
//     </Box>
//   )
// }

// function MsgItem({
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
//           ? 'You have a new DAO Rewards can be claimed'
//           : item.types === 'NewProposal'
//           ? item.activityTitle || ''
//           : item.types === 'ReserveToken'
//           ? 'You have a new token can be claimed'
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
//   }, [item.activityId, item.activityTitle, item.daoId, item.types])

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
            <Stack>
              {!loading &&
                notificationList.map(item => (
                  <MsgItems
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

function MsgItems({
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
  const theme = useTheme()

  const history = useHistory()
  const showData: {
    content: JSX.Element | string
    link?: string
  } = useMemo(() => {
    return {
      content:
        item.types === 'Airdrop' ? (
          <ContentStyle>You have a new DAO Rewards can be claimed,</ContentStyle>
        ) : item.types === 'NewProposal' ? (
          <>
            <ContentStyle
              maxWidth={540}
              noWrap
              onClick={() => history.push(showData.link as string)}
              sx={{ cursor: 'pointer' }}
            >
              {item.activityTitle},
            </ContentStyle>
          </>
        ) : item.types === 'JobReject' || item.types === 'JobApply' ? (
          <>
            <LinkStyle
              underline="hover"
              onClick={() => history.push(showData.link as string)}
              sx={{ cursor: 'pointer' }}
            >
              {item.daoName}
            </LinkStyle>
            <ContentStyle>You have received a job application, </ContentStyle>
          </>
        ) : item.types === 'BecomeOwner' || item.types === 'BecomeSuperAdmin' || item.types === 'BecomeAdmin' ? (
          <>
            <ContentStyle>
              You have become the
              {item.types === 'BecomeOwner'
                ? ' Owner '
                : item.types === 'BecomeSuperAdmin'
                ? ' SuperAdmin '
                : item.types === 'BecomeAdmin'
                ? ' Admin '
                : ''}
              of {` `}
            </ContentStyle>
            <LinkStyle
              underline="hover"
              onClick={() => history.push(showData.link as string)}
              sx={{ cursor: 'pointer' }}
            >
              {item.daoName}
            </LinkStyle>
          </>
        ) : item.types === 'TaskAssigned' || item.types === 'TaskDone' ? (
          <>
            {item.types === 'TaskAssigned' ? (
              <>
                <ContentStyle> You have been assigned a task {` `}</ContentStyle>
                <ContentStyle>
                  {' '}
                  {item.activityTitle.length > 50 ? item.activityTitle.slice(0, 50) + '...' : item.activityTitle},
                </ContentStyle>
              </>
            ) : (
              <ContentStyle>
                {item.activityTitle.length > 50 ? item.activityTitle.slice(0, 50) + '...' : item.activityTitle},{` `} is
                marked as done,
              </ContentStyle>
            )}
          </>
        ) : item.types === 'ReserveToken' ? (
          <>
            <ContentStyle>You have a new token can be claimed,</ContentStyle>
          </>
        ) : (
          'message'
        ),
      link:
        item.types === 'Airdrop'
          ? item.activityId && item.daoId
            ? routes._ActivityAirdropDetail + `/${item.daoId}/${item.activityId}`
            : ''
          : item.types === 'ReserveToken'
          ? routes._Profile
          : item.types === 'NewProposal'
          ? item.activityId && item.daoId
            ? routes._DaoInfo + `/${item.daoId}/proposal/detail/${item.activityId}`
            : ''
          : item.types === 'BecomeOwner' || item.types === 'BecomeSuperAdmin' || item.types === 'BecomeAdmin'
          ? item.daoId
            ? routes._DaoInfo + `/${item.daoId}/member`
            : ''
          : item.types === 'JobReject' || item.types === 'JobApply'
          ? item.daoId
            ? routes._DaoInfo + `/${item.daoId}/member`
            : ''
          : item.types === 'TaskAssigned' || item.types === 'TaskDone'
          ? item.daoId
            ? routes._DaoInfo + `/${item.daoId}/workspace/task/${item.activityId}`
            : ''
          : ''
    }
  }, [history, item.activityId, item.activityTitle, item.daoId, item.daoName, item.types])

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
      <RowCenter sx={{ height: 60, borderBottom: '1px solid #D4D7E2' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150 }}>
            {!isRead && (
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  marginRight: 12,
                  backgroundColor: theme.palette.primary.main
                }}
              />
            )}
            <TitleStyle>{titleFilter(item.types)}</TitleStyle>
          </Box>
          <Box sx={{ display: 'flex', gap: 6 }}>{showData.content}</Box>
          {showData.link && titleFilter(item.types) !== 'DAO Members' && (
            <Link underline="hover" onClick={() => history.push(showData.link as string)} sx={{ cursor: 'pointer' }}>
              View
            </Link>
          )}
        </Box>
        <Text>{timeStampToFormat(item.notificationTime)}</Text>
      </RowCenter>
    </Box>
  )
}

function titleFilter(title: string) {
  if (title === 'Airdrop') {
    return 'DAO Rewards'
  } else if (title === 'NewProposal') {
    return 'Active Proposal'
  } else if (title === 'ReserveToken') {
    return 'Dao Token'
  } else if (title === 'BecomeOwner' || title === 'BecomeSuperAdmin' || title === 'BecomeAdmin') {
    return 'DAO Members'
  } else if (title === 'JobReject' || title === 'JobApply') {
    return 'Open job'
  } else if (title === 'TaskAssigned' || title === 'TaskDone') {
    return 'Workspace'
  }

  return 'message'
}
