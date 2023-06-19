import { Box, styled, Typography } from '@mui/material'
import { DaoAvatars } from 'components/Avatars'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import Button from 'components/Button/Button'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import Image from 'components/Image'
import EllipsisIcon from 'assets/images/ellipsis_icon.png'
import Back from 'components/Back'
const ContentBoxStyle = styled(Box)(({ maxWidth }: { maxWidth?: number }) => ({
  height: 800,
  maxWidth: maxWidth ? maxWidth : 600,
  border: '1px solid #D4D7E2',
  borderRadius: '10px'
}))
const ContentHeaderStyle = styled(Box)(() => ({
  padding: '30px 40px'
}))
const JoInButton = styled(Button)(() => ({
  height: 36,
  width: 70,
  '&:disabled': {
    border: ' 1px solid #D4D7E2',
    backgroundColor: 'rgba(0, 91, 198, 0.06)',
    color: '#97B7EF'
  }
}))
const DetailLayoutStyle = styled(Box)(() => ({
  background: '#F8FBFF',
  padding: '13px 40px',
  height: 150,
  marginTop: 25,
  display: 'grid',
  flexDirection: 'column',
  gap: 20
}))
const DetailTitleStyle = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  color: '#B5B7CF'
}))
const DetailStyle = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: '18px',
  lineHeight: '20px',
  color: '#3F5170',
  marginTop: 6
}))
const ClaimButton = styled(Button)(() => ({
  width: 270,
  height: 40,
  background: '#0049C6',
  borderRadius: '8px',
  color: '#fff',
  '&:disabled': {
    backgroundColor: '#F8FBFF',
    color: '#97B7EF'
  }
}))
const OwnersStyle = styled(Box)(() => ({
  padding: '20px 25px'
}))

export default function SoulboundDetail() {
  return (
    <ContainerWrapper maxWidth={1200} sx={{ paddingTop: 30 }}>
      <Back />
      <Box sx={{ display: 'flex', gap: 20, marginTop: 30 }}>
        <ContentBoxStyle>
          <ContentHeaderStyle>
            <Typography fontSize={24} fontWeight={700} lineHeight={'29px'} color={'#3F5170'}>
              Long Event title, Event title, Event title, Event title, Event title, Event title, Event title, Event
              title
            </Typography>
            <Box sx={{ mt: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
              <DaoAvatars size={45} />
              <Box>
                <Typography variant="body1" color={'#80829F'}>
                  Base on
                </Typography>
                <Typography variant="h6" fontSize={18} lineHeight={'20px'}>
                  STP DAO
                </Typography>
              </Box>
              <JoInButton disabled>Joined</JoInButton>
            </Box>
          </ContentHeaderStyle>
          <DetailLayoutStyle>
            <RowCenter>
              <Box>
                <DetailTitleStyle>Items</DetailTitleStyle>
                <DetailStyle>9,999</DetailStyle>
              </Box>
              <Box>
                <DetailTitleStyle>Network</DetailTitleStyle>
                <DetailStyle>Ethereum</DetailStyle>
              </Box>
              <Box>
                <DetailTitleStyle>Contract Address</DetailTitleStyle>
                <DetailStyle>0x2134...312D3</DetailStyle>
              </Box>
            </RowCenter>
            <Box>
              <DetailTitleStyle>Claimable Period</DetailTitleStyle>
              <DetailStyle fontSize={20}>06/06/2023 14:00 - 06/09/2023 14:00</DetailStyle>
            </Box>
          </DetailLayoutStyle>
          <Typography sx={{ padding: '20px 40px' }} variant="body1" lineHeight={'20px'} fontWeight={400}>
            {` Hey warriors, are you ready to embark on a new journey?

          In the journey of Iliad, warriors need to complete four trials on zkSync, releasing (Wind/Water/Fire/Thunder) four Divine Beasts to obtain corresponding NFT
          fragments. Only the warrior who collects all four NFTs can reach the final symbol of glory - the zkSync Glory
          NFT(zGN). 

          The Iliad Event is presented by Element, Izumi, Star Protocol, and KaratDAO. The ultimate NFT—zkSync
          Glory NFT(zGN), will be jointly supported by the four projects and receive their airdrops/rights/utilities/…?
          Stay tuned for more!
          
          Event time: May 25th - June 21st. 
          
          The NFT fragments could be collected during May.25-Jun.18; 
          The zGN Mint Allowlist will be announced on Element Twitter 
          @Element_Market on Jun.19; 
          The zGN mint access will be open on Jun.21 on Element official website. Read more details:
          https://element-market.medium.com/the-iliad-event-2154ab714f11`}
          </Typography>
        </ContentBoxStyle>
        <ContentBoxStyle maxWidth={580}>
          <Box
            sx={{
              padding: '30px 135px',
              display: 'flex',
              flexDirection: 'column',
              gap: 30,
              alignItems: 'center',
              borderBottom: '1px solid #D4D7E2;'
            }}
          >
            <Image src="" style={{ height: 310, width: 310, borderRadius: '10px', backgroundColor: '#bfbf' }} />
            <ClaimButton>Claim</ClaimButton>
          </Box>
          <OwnersStyle>
            <Typography variant="body1" color="#B5B7CF" lineHeight={'20px'}>
              Owners(2,000)
            </Typography>
            <Box sx={{ marginTop: 20, display: 'flex', gap: 17, flexWrap: 'wrap' }}>
              <Image src="" style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }} />
              <Image src="" style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }} />
              <Image src="" style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }} />
              <Image src="" style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }} />
              <Image src="" style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }} />
              <Image src="" style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }} />
              <Image src="" style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }} />
              <Image src="" style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }} />
              <Image src="" style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }} />
              <Image src="" style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }} />
              <Image src="" style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }} />
              <Image src="" style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }} />
              <Image src="" style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }} />
              <Image src="" style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }} />
              <Image src={EllipsisIcon} width={50} />
            </Box>
          </OwnersStyle>
        </ContentBoxStyle>
      </Box>
    </ContainerWrapper>
  )
}
