import Modal from 'components/Modal/index'
import { Box, Typography, styled, MenuItem } from '@mui/material'
import UploadImage from 'components/UploadImage'
import Select from 'components/Select/Select'
import Input from 'components/Input'
import Image from 'components/Image'
import EthIcon from 'assets/svg/eth_logo.svg'
import OutlineButton from 'components/Button/OutlineButton'
import Button from 'components/Button/Button'
import useModal from 'hooks/useModal'

const BodyBoxStyle = styled(Box)(() => ({
  padding: '13px 28px'
}))

const ContentTitleStyle = styled(Typography)(() => ({
  fontweight: 500,
  fontSize: 14,
  lineHeight: '20px',
  color: '#80829F'
}))

const ContentStyle = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: 16,
  lineHeight: '16px',
  color: '#3F5170'
}))

const InputStyle = styled(Input)(() => ({
  height: 40
}))
export default function AddTokenModal() {
  const { hideModal } = useModal()
  const ListItem = [
    { label: 'Anyone', value: 'Anyone' },
    { label: 'Holding token or NFT', value: 'Holding token or NFT' }
  ]
  return (
    <Modal maxWidth="480px" width="100%" closeIcon>
      <BodyBoxStyle>
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

        <Box sx={{ mt: 27, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <ContentTitleStyle sx={{ mb: 5 }}>Token logo</ContentTitleStyle>
            <UploadImage onChange={val => console.log(val)} size={124}></UploadImage>
          </Box>
          <Box sx={{ maxWidth: '253px', width: '100%' }}>
            <ContentTitleStyle sx={{ mb: 10 }}>Network</ContentTitleStyle>
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
            <ContentTitleStyle sx={{ mt: 10, mb: 10 }}>Token Contract Address</ContentTitleStyle>
            <InputStyle placeholderSize="14px" placeholder={'Address'} value={''} />
          </Box>
        </Box>
        <Box sx={{ mt: 25, display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
          <Box>
            <ContentTitleStyle sx={{ mb: 20 }}>Token name </ContentTitleStyle>
            <ContentStyle>Ethereum</ContentStyle>
          </Box>
          <Box>
            <ContentTitleStyle sx={{ mb: 14 }}>Symbol </ContentTitleStyle>
            <Image width={28} height={28} src={EthIcon} alt="logo" />
          </Box>
          <Box>
            <ContentTitleStyle sx={{ mb: 20 }}>Total supply</ContentTitleStyle>
            <ContentStyle>2,000 ETH</ContentStyle>
          </Box>
        </Box>
        <ContentTitleStyle sx={{ mt: 14 }}>Requirement</ContentTitleStyle>
        <Box sx={{ mt: 4, display: 'grid', flexDirection: 'column', gap: 8 }}>
          <Typography variant="body1" color={'#B5B7CF'} lineHeight={'20px'}>
            Minimum Tokens Needed To Create Proposal
          </Typography>
          <InputStyle
            placeholderSize="14px"
            placeholder={'--'}
            endAdornment={
              <Typography color="#B5B7CF" lineHeight="20px" variant="body1">
                STPT
              </Typography>
            }
            value={''}
          />
          <Box
            sx={{
              height: 40,
              width: '100%',
              display: 'flex',
              border: '1px solid #D4D7E2',
              borderRadius: '8px'
            }}
          >
            <Box sx={{ display: 'flex', padding: '10px 0 10px 20px' }}>
              <ContentTitleStyle sx={{ whiteSpace: 'nowrap' }}>Voting Weight</ContentTitleStyle>
              <Box sx={{ ml: 25, width: 0, border: ' 1px solid #D4D7E2' }}></Box>
              <Typography variant="body1" sx={{ ml: 50, whiteSpace: 'nowrap', color: '#B5B7CF', lineHeight: '16px' }}>
                1 STPT =
              </Typography>
            </Box>
            <InputStyle
              sx={{ border: 'none !important', background: 'transparent !important' }}
              endAdornment={
                <Typography color="#B5B7CF" lineHeight="20px" variant="body1">
                  Votes
                </Typography>
              }
              value={'0'}
            />
          </Box>
          <Box sx={{ mt: 32, mb: 20, display: 'flex', justifyContent: 'space-between' }}>
            <OutlineButton
              style={{ border: '1px solid #0049C6', color: '#0049C6' }}
              width={125}
              height={40}
              onClick={hideModal}
            >
              Close
            </OutlineButton>
            <Button width="125px" height="40px" onClick={hideModal}>
              Add
            </Button>
          </Box>
        </Box>
      </BodyBoxStyle>
    </Modal>
  )
}
