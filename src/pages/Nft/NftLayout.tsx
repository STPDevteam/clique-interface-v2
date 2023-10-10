import { Box, styled, useTheme } from '@mui/material'
import Nft_bgImage from 'assets/images/nft_bg.png'

const NftCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  background: 'linear-gradient(5deg, #59E1FF 0%, #3457b9 35%, #2975CE 100%)',
  width: '278px',
  height: '375px',
  '& .item': {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    padding: '11px 16px 20px',
    borderRadius: '20px',
    margin: 2,
    borderImageSlice: 1,
    background: 'linear-gradient(180deg, #4257b7 0%, #4573c4d1 100%)',
    backdropFilter: ' blur(30.5px)',
    position: 'absolute'
  },
  [theme.breakpoints.down('sm')]: {
    width: '44vw',
    height: '56vw',
    '& .item': {
      padding: '0 16px 0'
    }
  }
}))

export const SearchCardStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  margin: '90px auto 0',
  borderRadius: '20px',
  background: 'linear-gradient(45deg, #67ccf8 0%, #3457b9 50%, #3d7bce 100%)',
  filter: 'drop-shadow(0px 14px 34px #0A35FF)',
  '& .item': {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    borderRadius: '20px',
    margin: 2,
    borderImageSlice: 1,
    // background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.14) 100%)'
    background: 'linear-gradient(180deg, #3558b9e6 0%, #2b53c0e6 80%, #2643c1e6 100%)',
    backdropFilter: ' blur(30.5px)',
    position: 'absolute'
  },
  [theme.breakpoints.down('sm')]: {
    margin: '45px auto 0'
  }
}))

export function NftLayout({ children }: { children: JSX.Element }) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100%',
        backgroundImage: `url(${Nft_bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        padding: '0  35px 0 20px',
        [theme.breakpoints.down('sm')]: {
          padding: '0'
        }
      }}
    >
      {/* <img
          src={Nft_bgImage}
          alt=""
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            position: 'fixed',
            zIndex: 0
          }}
        /> */}
      <Box height={80} />
      <Box sx={{ maxWidth: 1440, margin: 'auto', position: 'relative', zIndex: 10 }}>{children}</Box>
    </Box>
  )
}

export function NftIsDelayCard({ children, className }: { children: JSX.Element; className?: string }) {
  return (
    <>
      <NftCard className={className}>
        <Box className="item">{children}</Box>
      </NftCard>
    </>
  )
}
