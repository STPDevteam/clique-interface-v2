import { Badge, Box, Stack, Typography } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import useBreakpoint from 'hooks/useBreakpoint'
import useModal from 'hooks/useModal'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import PushManagementModal from './PushManagementModal'

export default function Index() {
  const isSmDown = useBreakpoint('sm')
  const { showModal } = useModal()

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
        <Box display={'grid'} gap="48px"></Box>
      </ContainerWrapper>
    </Box>
  )
}
