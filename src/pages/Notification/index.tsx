import { Badge, Box, Stack, Typography } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import useBreakpoint from 'hooks/useBreakpoint'
import useModal from 'hooks/useModal'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import PushManagementModal from './PushManagementModal'
// import * as PushAPI from '@pushprotocol/restapi'
// import { NotificationItem, chainNameType } from '@pushprotocol/uiweb'
// import { useState } from 'react'

export default function Index() {
  const isSmDown = useBreakpoint('sm')
  const { showModal } = useModal()
  // const [notifications, setNotifications] = useState([])

  // useEffect(() => {
  //   ;async () => {
  //     const notifications = await PushAPI.user.getFeeds({
  //       user: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681',
  //       env: 'staging'
  //     })
  //     setNotifications(notifications)
  //   }
  // }, [notifications])

  return (
    <Box
      paddingBottom={40}
      sx={{
        padding: { sm: '0 0 40px 0', xs: '0 16px 20px' }
      }}
    >
      <ContainerWrapper maxWidth={1248} margin={isSmDown ? '0 auto 24px' : '24px auto 40px'}>
        <Box display={'flex'} justifyContent={'space-between'} flexDirection={'row'}>
          <Typography variant="h3">Notification</Typography>
          <Stack display={'grid'} gridTemplateColumns="1fr 1fr" gap={16}>
            <Badge badgeContent={4} color="primary">
              <BlackButton width="252px" onClick={() => showModal(<PushManagementModal />)}>
                Push management
              </BlackButton>
            </Badge>
            <BlackButton width="252px" onClick={() => {}}>
              Make all as read
            </BlackButton>
          </Stack>
        </Box>
        <Box display={'grid'} gap="48px">
          <div>
            {/* {notifications.map(oneNotification => {
              const { cta, title, message, app, icon, image, url, blockchain } = oneNotification

              return (
                <NotificationItem
                  key={''}
                  notificationTitle={title}
                  notificationBody={message}
                  cta={cta}
                  app={app}
                  icon={icon}
                  image={image}
                  url={url}
                  theme={''}
                  chainName={blockchain as chainNameType}
                />
              )
            })} */}
          </div>
        </Box>
      </ContainerWrapper>
    </Box>
  )
}
