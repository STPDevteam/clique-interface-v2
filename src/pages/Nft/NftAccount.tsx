import { Box, Typography, keyframes, styled } from '@mui/material'
import Nft_bgImage from 'assets/images/nft_bg.png'
import NftImage from 'assets/images/nft_r.png'
import Coin_1 from 'assets/images/coin_1.png'
import Coin_2 from 'assets/images/coin_2.png'
import Coin_3 from 'assets/images/coin_3.png'
// import { ReactComponent as NftAccountTxt } from 'assets/svg/nftAccount_txt.svg'
import Button from 'components/Button/Button'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useWalletModalToggle } from 'state/application/hooks'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import { useActiveWeb3React } from 'hooks'
import useBreakpoint from 'hooks/useBreakpoint'

const conin1_key = keyframes`
0% { transform: translateY(0); }
25% { transform: translateY(-5px); }
75% { transform: translateY(5px); }
100% { transform: translateY(0); }
`
const conin2_key = keyframes`
0% { transform: translateY(0); }
25% { transform: translateY(5px); }
75% { transform: translateY(-5px); }
100% { transform: translateY(0); }
`
const conin3_key = keyframes`
0% { transform: translateY(0); }
25% { transform: translateY(-5px); }
75% { transform: translateY(5px); }
100% { transform: translateY(0); }
`

const TitleStyle = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  // alignItems: 'center',
  // textAlign: 'center',
  gap: 30
}))

const CreateNftButton = styled(Button)(() => ({
  width: 252,
  height: 46,
  borderRadius: '38px',
  background: 'linear-gradient(180deg, #2265D8 0%, #012EAC 81.25%, #0150AC 100%)',
  boxShadow: '0px 4px 44px 0px rgba(2, 26, 98, 0.52)'
}))

export function NftAccount() {
  const isMdDown = useBreakpoint('md')
  const navigate = useNavigate()
  const toggleWalletModal = useWalletModalToggle()
  const loginSignature = useLoginSignature()
  const { account } = useActiveWeb3React()
  const userSignature = useUserInfo()
  console.log(isMdDown)

  return (
    <NftLayout>
      <Box
        sx={{
          height: isMdDown ? 'auto' : '100vh',
          display: isMdDown ? 'grid' : 'flex',
          marginTop: isMdDown ? 130 : 0,
          gap: 10,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TitleStyle
          style={{
            height: isMdDown ? 'auto' : 300,
            alignItems: isMdDown ? 'center' : 'normal',
            textAlign: isMdDown ? 'center' : 'left',
            marginBottom: isMdDown ? '0' : '50px'
          }}
        >
          {/* <NftAccountTxt /> */}

          <Typography
            sx={{
              color: '#FFF',
              fontFeatureSettings: `'clig' off, 'liga' off`,
              fontFamily: 'Passion One',
              fontSize: '50px',
              fontStyle: 'normal',
              fontWeight: 800,
              lineHeight: '60px',
              letterSpacing: ' 1px'
            }}
          >
            Generate NFT Smart Wallets
          </Typography>
          <Typography sx={{ color: '#fff', font: '400 18px/28px "Inter"', maxWidth: 472 }}>
            Turn any NFT into a Smart Wallet to seamlessly own any assets and efficiently interact with blockchain
            applications and ecosystems.
          </Typography>
          <CreateNftButton
            onClick={() => {
              if (!account) return toggleWalletModal()
              if (!userSignature) return loginSignature()
              navigate(routes.NftSelect)
            }}
          >
            Create my NFT account
          </CreateNftButton>
        </TitleStyle>
        <Box
          sx={{
            textAlign: 'center',
            width: isMdDown ? '70vw' : 631,
            height: isMdDown ? '70vw' : 557,
            position: 'relative',
            margin: isMdDown ? 'auto' : '0'
          }}
        >
          <img
            src={NftImage}
            alt=""
            style={{
              width: isMdDown ? '70vw' : 631,
              height: isMdDown ? '70vw' : 557
            }}
          />
          <Box
            sx={{
              width: isMdDown ? '7vw' : '49.68px',
              height: isMdDown ? '7vw' : '49.03px',
              position: 'absolute',
              top: isMdDown ? '11%' : 60,
              left: isMdDown ? '37vw' : 320,
              animation: `${conin1_key} 5s linear infinite`
            }}
          >
            <img src={Coin_1} alt="" width={'100%'} height={'100%'} />
          </Box>

          <Box
            sx={{
              width: isMdDown ? '11vw' : '98px',
              height: isMdDown ? '11vw' : '109px',
              position: 'absolute',
              top: 55,
              right: -15,
              animation: `${conin2_key} 5s linear infinite`
            }}
          >
            <img src={Coin_2} alt="" width={'100%'} height={'100%'} />
          </Box>
          <Box
            sx={{
              width: isMdDown ? '9vw' : '81.42px',
              height: isMdDown ? '9vw' : '80.35px',
              position: 'absolute',
              bottom: isMdDown ? '20vw' : 170,
              right: 0,
              animation: `${conin3_key} 5s linear infinite`
            }}
          >
            <img src={Coin_3} alt="" width={'100%'} height={'100%'} />
          </Box>
        </Box>
      </Box>
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
        width: '100%'
        // backgroundImage: `url(${Nft_bgImage})`,
        // backgroundSize: 'cover',
        // backgroundPosition: 'center center'
      }}
    >
      <img
        src={Nft_bgImage}
        alt=""
        style={{
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          position: 'fixed',
          zIndex: 0
        }}
      />
      <Box sx={{ maxWidth: 1440, margin: 'auto', position: 'relative', zIndex: 10 }}>{children}</Box>
    </Box>
  )
}
