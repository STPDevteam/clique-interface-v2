import { Box, Typography, styled } from '@mui/material'
import Image from 'components/Image'
import placeholderImage from 'assets/images/placeholder.png'
import { NftIsDelayCard } from 'pages/Nft/NftLayout'
import Button from 'components/Button/Button'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { NftProp } from 'pages/Nft/NftSelect'
import { useActiveWeb3React } from 'hooks'
import { useNftAccountInfo } from 'hooks/useBackedNftCallback'

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
  lineHeight: '28px',
  textAlign: 'center'
}))

const NftImgStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '244px',
  borderRadius: '7px',
  background: 'rgb(249, 249, 249)',
  [theme.breakpoints.down('md')]: {
    height: '100%'
  }
}))

export function NftDelaySuccess({ nftData }: { nftData: NftProp | undefined }) {
  const { chainId } = useActiveWeb3React()
  const { result: nftInfo } = useNftAccountInfo(nftData?.contractAddress, chainId)
  console.log('nftInfo=>', nftInfo)
  const navigate = useNavigate()
  return (
    <>
      <Box sx={{ mt: 50, display: 'grid', justifyContent: 'center' }}>
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
            '& .class_nft_card': {
              width: { xs: '220px', md: '278px' },
              height: { xs: '300px', md: '375px' },
              '& .item': {
                display: 'grid',
                gap: '20px'
              }
            }
          }}
        >
          <NftIsDelayCard className="class_nft_card">
            <>
              <Box sx={{ display: 'grid', gap: 10 }}>
                <CardHeadStyle noWrap>
                  {nftInfo?.name || '-'}#{nftData?.nftTokenId}
                </CardHeadStyle>
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
                    src={nftInfo?.logo_url || placeholderImage}
                  />
                </NftImgStyle>
              </Box>
              <Button
                style={{ borderRadius: '20px', height: '40px' }}
                onClick={() => {
                  navigate(routes.NftAssets)
                }}
              >
                View Now
              </Button>
            </>
          </NftIsDelayCard>
        </Box>
      </Box>
    </>
  )
}
