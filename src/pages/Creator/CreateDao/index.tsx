import { Box, Typography, styled } from '@mui/material'
import CrateBg from 'assets/images/cratedao_bg.png'
import { ReactComponent as WelcomeTitle } from 'assets/svg/web3title.svg'
import UploadImage from 'components/UploadImage'
import Button from 'components/Button/Button'
import Input from 'components/Input'

const TitleStyle = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '16px',
  color: '#80829F'
}))

export default function index() {
  const imgupdata = (value: any) => {
    console.log(value)
  }
  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex' }}>
      <Box
        sx={{
          padding: '77px 108px 0 61px',
          height: 'calc(100vh - 80px)',
          width: '700px',
          backgroundImage: `url(${CrateBg})`,
          backgroundSize: '100% 100%'
        }}
      >
        <WelcomeTitle />
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: '18px',
            lineHeight: '24px',
            color: ' #FFFFFF',
            mt: 10
          }}
        >
          Elevate the blockchain space.
        </Typography>
      </Box>
      <Box
        sx={{
          boxSizing: 'border-box',
          maxWidth: 644,
          padding: '70px 0 0 80px'
        }}
      >
        <Typography variant="h3" sx={{ lineHeight: '56px', fontWeight: 700 }}>
          Build a DAO
        </Typography>
        <Box sx={{ display: 'flex', mt: 20 }}>
          <UploadImage sx={{ mr: 42 }} size={125} onChange={val => imgupdata(val)} />
          <Box>
            <Typography variant="h6" sx={{ fontSize: 18 }}>
              LOGO
            </Typography>
            <TitleStyle sx={{ width: '150px', lineHeight: '17px', fontWeight: 400 }}>
              File types supported: JPG, PNG, GIF.
            </TitleStyle>
            <Button width="125px" height="40px" style={{ marginTop: 25 }}>
              + Upload
            </Button>
          </Box>
        </Box>
        <Box sx={{ mt: 30 }}>
          <TitleStyle>Organization Name</TitleStyle>
          <Input value="" placeholder="Enter name" style={{ width: '564px', marginTop: 10 }} />
        </Box>
        <Box sx={{ mt: 20 }}>
          <TitleStyle>Organization Username</TitleStyle>
          <Typography variant="body2" sx={{ lineHeight: '20px', fontSize: 14, mt: 8 }}>
            Organize username must be between 4-20 characters and contain letters, numbers and underscores only.
          </Typography>
          <Input value="" placeholder="Enter organize username" style={{ width: '564px', marginTop: 10 }} />
        </Box>
        <Box sx={{ mt: 16 }}>
          <TitleStyle>Introduction </TitleStyle>
          <Input value="" placeholder="Write a description" style={{ width: '564px', marginTop: 10 }} />
        </Box>
        <Box sx={{ mt: 20 }}>
          <TitleStyle>Type of Organization</TitleStyle>
          <Input value="" placeholder="Select type" style={{ width: '564px', marginTop: 10 }} />
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button style={{ width: '270px', height: '40px', marginTop: 46 }}>Create Now</Button>
        </Box>
      </Box>
    </Box>
  )
}
