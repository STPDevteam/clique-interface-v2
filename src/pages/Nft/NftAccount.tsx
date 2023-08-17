import { Box, Typography, styled } from '@mui/material'
import Nft_bgImage from 'assets/images/nft_bg.png'
import { ReactComponent as NftImage } from 'assets/svg/nft.svg'
import { ReactComponent as NftAccountTxt } from 'assets/svg/nftAccount_txt.svg'
import Button from 'components/Button/Button'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

const TitleStyle = styled(Box)(() => ({
  marginTop: 130,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: 18
}))

const CreateNftButton = styled(Button)(() => ({
  width: 252,
  height: 46,
  borderRadius: '38px',
  background: 'linear-gradient(180deg, #2265D8 0%, #012EAC 81.25%, #0150AC 100%)',
  boxShadow: '0px 4px 44px 0px rgba(2, 26, 98, 0.52)'
}))

export function NftAccount() {
  const navigate = useNavigate()
  return (
    <NftLayout>
      <>
        <TitleStyle>
          <NftAccountTxt />

          <Typography sx={{ color: '#fff', font: '400 18px/28px "Inter"', maxWidth: 620 }}>
            Turn any NFT into a Smart Wallet to seamlessly own any assets and efficiently interact with blockchain
            applications and ecosystems.
          </Typography>
          <CreateNftButton
            onClick={() => {
              navigate(routes.NftSelect)
            }}
          >
            Create my NFT account
          </CreateNftButton>
        </TitleStyle>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <NftImage />
        </Box>
      </>
    </NftLayout>
  )
}

export function NftLayout({ children }: { children: JSX.Element }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100%',
        backgroundImage: `url(${Nft_bgImage})`,
        backgroundSize: '100% 100%',
        objectFit: 'cover'
      }}
    >
      <Box sx={{ maxWidth: 1440, margin: 'auto' }}>{children}</Box>
    </Box>
  )
}
