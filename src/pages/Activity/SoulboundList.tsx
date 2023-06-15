import { Box, Typography, styled } from '@mui/material'
import Image from 'components/Image'
import { DaoAvatars } from 'components/Avatars'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'
const StyledItem = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.bgColor.bg2}`,
  boxShadow: theme.boxShadow.bs1,
  borderRadius: theme.borderRadius.default,
  padding: '20px 56px 20px 24px',
  display: 'grid',
  gridTemplateColumns: '180px 1fr',
  gap: 34,
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    padding: '10px 15px 16px'
  }
}))
const ContentBoxStyle = styled(Box)(() => ({
  display: 'grid',
  flexDirection: 'column',
  gap: 20
}))
const ContentTitleStyle = styled(Typography)(() => ({
  fontSize: ' 14px',
  lineHeight: '16px',
  color: '#80829F'
}))
const ContentStyle = styled(Typography)(() => ({
  fontSize: ' 16px',
  lineHeight: '20px',
  color: '#3F5170'
}))
const ContentLayout = styled(Box)(() => ({
  display: 'grid',
  flexDirection: 'column',
  gap: 10
}))
const StatusStyle = styled(Box)(({ color }: { color?: string }) => ({
  width: 70,
  height: 30,
  padding: '6px 0 6px 13px',
  background: color ? (color == 'active' ? '#EBFFD2' : '#E9FAFF') : '#E9FAFF',
  borderRadius: '20px',
  display: 'flex',
  gap: 5,
  alignItems: 'center',
  fontWeight: 600,
  fontSize: 12,
  lineHeight: '18px',
  color: color ? (color == 'active' ? '#21C431' : '#0049C6') : '#0049C6',
  '&:before': {
    content: `''`,
    width: 5,
    height: 5,
    background: color ? (color == 'active' ? '#21C431' : '#0049C6') : '#0049C6',
    borderRadius: '50%'
  }
}))

export default function SoulboundList() {
  const history = useHistory()
  const sbtId = 87
  return (
    <StyledItem
      onClick={() => {
        history.push(routes._SoulboundDetail + '/' + sbtId)
      }}
    >
      <Image
        src={''}
        style={{
          height: 180,
          width: 180,
          backgroundColor: '#bcbc',
          border: ' 1px solid #D4D7E2',
          borderRadius: '8px '
        }}
      />
      <ContentBoxStyle>
        <Box sx={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <DaoAvatars size={24} />
          <Typography variant="h6" lineHeight={'19px'}>
            Dao Name
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" lineHeight={'27px'}>
            The STP protocol is open to anyone, and project configurations can vary widely. There are risks associated
            with interacting with all projects on the protocol...
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 300px' }}>
          <ContentLayout>
            <ContentTitleStyle>Items</ContentTitleStyle>
            <ContentStyle>999</ContentStyle>
          </ContentLayout>
          <ContentLayout>
            <ContentTitleStyle>Network</ContentTitleStyle>
            <ContentStyle>Ethereum</ContentStyle>
          </ContentLayout>
          <ContentLayout>
            <ContentTitleStyle>Status</ContentTitleStyle>
            <StatusStyle color="active">Active</StatusStyle>
          </ContentLayout>
          <ContentLayout>
            <ContentTitleStyle>Claimable Period</ContentTitleStyle>
            <ContentStyle>06/06/2023 14:00 - 06/09/2023 14:00</ContentStyle>
          </ContentLayout>
        </Box>
      </ContentBoxStyle>
    </StyledItem>
  )
}
