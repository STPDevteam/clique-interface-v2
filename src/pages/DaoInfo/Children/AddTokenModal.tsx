import Modal from 'components/Modal/index'
import { Box, Typography, styled, MenuItem } from '@mui/material'
import UploadImage from 'components/UploadImage'
import Select from 'components/Select/Select'
import Input from 'components/Input'
// import OutlineButton from 'components/Button/OutlineButton'

const ContentStyle = styled(Typography)(() => ({
  fontweight: 500,
  fontSize: 14,
  lineHeight: '20px',
  color: '#80829F'
}))
const InputStyle = styled(Input)(() => ({
  height: 40
}))
export default function AddTokenModal() {
  const ListItem = [
    { label: 'Anyone', value: 'Anyone' },
    { label: 'Holding token or NFT', value: 'Holding token or NFT' }
  ]
  return (
    <Modal maxWidth="480px" width="100%" closeIcon padding="13px 28px">
      <Box
        display="flex"
        textAlign={'center'}
        width="100%"
        height="480px"
        flexDirection={'column'}
        sx={{
          '& p': {
            textAlign: 'left',
            width: '100%'
          }
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: 14,
            lineHeight: '24px',
            color: '#3F5170'
          }}
        >
          Add Governanve Token
        </Typography>
        <Box sx={{ display: 'flex', mt: 27, gap: 40 }}>
          <Box>
            <ContentStyle sx={{ mb: 5 }}>Token logo</ContentStyle>
            <UploadImage onChange={val => console.log(val)} size={124}></UploadImage>
          </Box>
          <Box sx={{ maxWidth: '253px', width: '100%' }}>
            <ContentStyle sx={{ mb: 10 }}>Network</ContentStyle>
            <Select
              noBold
              style={{ fontWeight: 500, fontSize: 14 }}
              height={40}
              value={ListItem[0].value}
              // onChange={e => setCurrentProposalStatus(e.target.value)}
            >
              {ListItem.map(item => (
                <MenuItem
                  key={item.value}
                  sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                  value={item.value}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            <ContentStyle sx={{ mt: 10, mb: 10 }}>Token Contract Address</ContentStyle>
            <InputStyle placeholderSize="14px" placeholder={'Address'} value={''} />
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
