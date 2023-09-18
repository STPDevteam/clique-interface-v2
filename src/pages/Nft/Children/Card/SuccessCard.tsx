import { Box, Typography, styled } from '@mui/material'
import Image from 'components/Image'
import placeholderImage from 'assets/images/placeholder.png'
import { NftIsDelayCard } from 'pages/Nft/NftLayout'
import Button from 'components/Button/Button'

const TitleStyle = styled(Typography)(({ theme }) => ({
  color: '#FFF',
  fontSize: '36px',
  fontWeight: 700,
  lineHeight: '42px',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '30px'
  }
}))

const CardHeadStyle = styled(Typography)(() => ({
  color: '#FFF',
  fontSize: '18px',
  fontWeight: 600,
  lineHeight: '28px'
}))

const NftImgStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '244px',
  borderRadius: '7px',
  background: 'rgb(249, 249, 249)',
  [theme.breakpoints.down('sm')]: {
    height: '100%'
  }
}))

export function NftDelaySuccess() {
  return (
    <>
      <Box sx={{ marginTop: 30, display: 'grid', justifyContent: 'center' }}>
        <TitleStyle>Congratulations! </TitleStyle>
        <TitleStyle>
          {`Here's your`}
          <b style={{ color: '#A7F46A' }}> NFT Smart Wallet</b>
        </TitleStyle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '28px',
            '& .class_nft_card .item': {
              display: 'grid',
              gap: '20px'
            }
          }}
        >
          <NftIsDelayCard className="class_nft_card">
            <>
              <Box sx={{ display: 'grid', gap: 10 }}>
                <CardHeadStyle>NFT NAME #6207</CardHeadStyle>
                <NftImgStyle>
                  <Image
                    altSrc={placeholderImage}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      zIndex: 0
                    }}
                    src={placeholderImage}
                  />
                </NftImgStyle>
              </Box>
              <Button style={{ borderRadius: '20px', height: '40px' }}>View Now</Button>
            </>
          </NftIsDelayCard>
        </Box>
      </Box>
    </>
  )
}
