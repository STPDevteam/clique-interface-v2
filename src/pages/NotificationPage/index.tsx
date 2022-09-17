import { Box, Stack, styled, Typography, useTheme } from '@mui/material'
import { DaoAvatars } from 'components/Avatars'
import OutlineButton from 'components/Button/OutlineButton'
import Pagination from 'components/Pagination'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import { Link } from 'react-router-dom'

const Wrapper = styled(Stack)(({ theme }) => ({
  marginTop: 24,
  padding: '34px 39px',
  border: `1px solid ${theme.bgColor.bg2}`,
  borderRadius: theme.borderRadius.default,
  boxShadow: theme.boxShadow.bs1
}))

const Text = styled(Stack)(({ theme, color }: { theme?: any; color?: string }) => ({
  fontSize: 13,
  fontWeight: 600,
  color: color || theme.palette.text.secondary
}))

function TypeTitle({ read }: { read?: boolean }) {
  const theme = useTheme()
  return read ? (
    <Text>Airdrop</Text>
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
      <Text color={theme.palette.text.primary}>Airdrop</Text>
    </Box>
  )
}

function MsgItem() {
  return (
    <Box>
      <RowCenter mb={16}>
        <TypeTitle />
        <Text>2022-05-12 15:09:48</Text>
      </RowCenter>
      <Box display={'flex'} alignItems="center">
        <DaoAvatars size={64} />
        <Box ml={16}>
          <Text>DAO Name</Text>
          <Text display={'inline-block'}>
            Title of proposal.{' '}
            <Link to={'/'} style={{ textDecoration: 'none' }}>
              View
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default function NotificationPage() {
  return (
    <Box padding="40px 20px">
      <ContainerWrapper maxWidth={1150}>
        <RowCenter>
          <Typography variant="h6">Notifications</Typography>
          <OutlineButton height={24} width={140} noBold>
            Mark all as read
          </OutlineButton>
        </RowCenter>
        <Wrapper spacing={26}>
          <MsgItem />
          <MsgItem />
          <Box display={'flex'} justifyContent="center">
            <Pagination count={1} page={1} onChange={() => {}} />
          </Box>
        </Wrapper>
      </ContainerWrapper>
    </Box>
  )
}
