import { styled, Typography, Box, useTheme, MenuItem, Link } from '@mui/material'
import soulboundBgimg from 'assets/images/soulbound_bg.png'
import { ReactComponent as CalendarIcon } from 'assets/svg/calendar_icon.svg'
import Input from 'components/Input'
import UploadFile from 'components/UploadFile'
import { useState } from 'react'
import Select from 'components/Select/Select'
import DateTimePicker from 'components/DateTimePicker'
import BlackButton from 'components/Button/Button'
import Button from 'components/Button/Button'
import Back from 'components/Back'

const InputTitleStyle = styled(Typography)(() => ({
  fontSize: 14,
  lineHeight: '16px',
  color: ' #80829F'
}))
const ContentHintStyle = styled(Typography)(() => ({
  fontSize: 14,
  lineHeight: '16px',
  color: ' #B5B7CF'
}))
const ContentBoxStyle = styled(Box)(() => ({
  padding: '30px 120px 70px 70px'
}))

const DateBoxStyle = styled(Box)(() => ({
  padding: '0 10px',
  width: '100%',
  height: 40,
  border: '1px solid #D4D7E2',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& .MuiInputBase-input': {
    height: 40,
    backgroundColor: 'transparent',
    color: '#3F5170',
    cursor: 'pointer',
    '&::placeholder': {
      color: '#80829F',
      textAlign: 'center'
    }
  }
}))

const UploadButtonStyle = styled(Button)(() => ({
  width: 158,
  height: 36,
  background: ' #FFFFFF',
  border: ' 1px solid #0049C6',
  borderRadius: ' 8px',
  color: '#0049C6',
  '&:hover': {
    color: '#fff',
    background: ' #0049C6'
  }
}))

const UploadBoxStyle = styled(Box)(() => ({
  marginTop: 15,
  height: 87,
  background: 'rgba(0, 91, 198, 0.06)',
  borderRadius: '8px',
  padding: '20px 27px 20px 40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

export default function Index() {
  const theme = useTheme()
  const [inputvalue, setinputvalue] = useState('')
  const eligibilityList = [
    { id: 1, value: 'Anyone', label: 'Anyone' },
    { id: 2, value: 'DAO Members', label: 'DAO Members' },
    { id: 3, value: 'Upload Addresses', label: 'Upload Addresses' }
  ]
  const [eligibilityValue, seteligibilityValue] = useState(eligibilityList[0].label)
  const [eventStartTime, setEventStartTime] = useState<number>()
  const [eventEndTime, setEventEndTime] = useState<number>()
  return (
    <Box sx={{ display: 'flex', maxWidth: '1440px', width: '100%' }}>
      <Box
        sx={{
          width: 600,
          // height: 'calc(100% - 80px)',
          display: 'flex',
          flexGrow: 1
        }}
      >
        <img
          src={soulboundBgimg}
          alt=""
          style={{
            width: 600,
            height: '100%'
          }}
        />
      </Box>
      <ContentBoxStyle>
        <Back />
        <Typography style={{ marginTop: 30 }} variant="h3" lineHeight={'56px'} fontWeight={'700'}>
          Create Soulbound Token of DAO
        </Typography>
        <Typography variant="body1" fontWeight={'400'} fontSize={16}>
          The SBT only represents a status symbol, cannot be transferred, and has no financial attributes.
        </Typography>
        <Box sx={{ mt: 20, display: 'grid', flexDirection: 'column', gap: 10 }}>
          <InputTitleStyle>Select a DAO</InputTitleStyle>
          <ContentHintStyle>An identity token based on the DAO</ContentHintStyle>
          <Input value={''} />
        </Box>
        <Box sx={{ mt: 15, display: 'grid', flexDirection: 'column', gap: 10 }}>
          <Select label="Blockchain" value={eligibilityValue} onChange={e => seteligibilityValue(e.target.value)}>
            {eligibilityList.map(item => (
              <MenuItem
                key={item.id}
                sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                value={item.value}
              >
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ mt: 20, mb: 20 }}>
          <UploadFile size={150} />
        </Box>
        <Box sx={{ display: 'grid', flexDirection: 'column', gap: 15 }}>
          <Input
            value={''}
            label="Item Name"
            placeholder="Write a description"
            maxLength={50}
            endAdornment={
              <Typography color={theme.palette.text.secondary} lineHeight={'20px'} variant="body1">
                0/50
              </Typography>
            }
          />
          <Input
            value={inputvalue}
            rows={5}
            multiline
            label="Introduction (Optional)"
            placeholder="Write a description"
            maxLength={2000}
            endAdornment={
              <Typography color={theme.palette.text.secondary} lineHeight={'20px'} variant="body1">
                {inputvalue.length}/2000
              </Typography>
            }
            onChange={e => {
              setinputvalue(e.target.value)
            }}
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <Input value={''} label="Organization Name" placeholder="Enter name" />
            <Input value={''} label="Organization Username" placeholder="Enter handle name" />
          </Box>
          <Input value={''} label="Total supply" placeholder="Enter Total" />
          <Box>
            <Select
              label="Set Token Eligibility"
              value={eligibilityValue}
              onChange={e => seteligibilityValue(e.target.value)}
            >
              {eligibilityList.map(item => (
                <MenuItem
                  key={item.id}
                  sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                  value={item.value}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            {eligibilityValue == 'Upload Addresses' ? (
              <>
                <UploadBoxStyle>
                  {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Typography variant="body1" lineHeight="20px" color="#0049C6">
                      Filename001
                    </Typography>
                    <Typography variant="body1" lineHeight="20px">
                      Total 1311 addresses
                    </Typography>
                  </Box>
                  <UploadButtonStyle >
                    Re-upload
                  </UploadButtonStyle> */}

                  <Typography variant="body1" lineHeight={'20px'}>
                    Download this <Link sx={{ cursor: 'pointer' }}>Reference template.</Link>
                  </Typography>
                  <UploadButtonStyle>Upload File</UploadButtonStyle>
                </UploadBoxStyle>
              </>
            ) : null}
          </Box>
          <Box sx={{ display: 'grid', flexDirection: 'column', gap: 10 }}>
            <InputTitleStyle>Claimable Period</InputTitleStyle>
            <ContentHintStyle>Items outside the time frame will stop being claimed</ContentHintStyle>
            <DateBoxStyle>
              <CalendarIcon />
              <DateTimePicker
                label={'Start time'}
                value={eventStartTime ? new Date(eventStartTime * 1000) : null}
                onValue={timestamp => setEventStartTime(timestamp)}
              />
              <ContentHintStyle>--</ContentHintStyle>
              <DateTimePicker
                label={'End time'}
                minDateTime={eventStartTime ? new Date(eventStartTime * 1000) : undefined}
                value={eventEndTime ? new Date(eventEndTime * 1000) : null}
                onValue={timestamp => setEventEndTime(timestamp)}
              />
            </DateBoxStyle>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', mt: 40, justifyContent: 'flex-end' }}>
          <BlackButton style={{ width: 270, height: 40 }}>Create Now</BlackButton>
        </Box>
      </ContentBoxStyle>
    </Box>
  )
}
