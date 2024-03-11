import { Box, Typography, keyframes, styled, useTheme } from '@mui/material'
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
import { NftLayout } from './NftLayout'

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

const CreateNftButton = styled(Button)(({ theme }) => ({
  width: 252,
  height: 46,
  borderRadius: '38px',
  background: 'linear-gradient(180deg, #2265D8 0%, #012EAC 81.25%, #0150AC 100%)',
  boxShadow: '0px 4px 44px 0px rgba(2, 26, 98, 0.52)',
  [theme.breakpoints.down('sm')]: {
    width: 205,
    height: 36,
    borderRadius: '18px'
  }
}))

export function NftGenerator() {
  const theme = useTheme()

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
          height: 'calc(100vh - 80px)',
          display: 'flex',
          marginTop: 0,
          gap: 10,
          justifyContent: 'center',
          alignItems: 'center',
          [theme.breakpoints.down('sm')]: {
            height: 'auto',
            display: 'grid',
            marginTop: 40
          }
        }}
      >
        <TitleStyle
          sx={{
            height: 300,
            alignItems: 'normal',
            textAlign: 'left',
            marginBottom: '50px',
            [theme.breakpoints.down('sm')]: {
              height: 'auto',
              alignItems: 'center',
              textAlign: 'center',
              marginBottom: '0',
              padding: '0 20px'
            }
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
              letterSpacing: ' 1px',
              [theme.breakpoints.down('sm')]: {
                fontSize: '28px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '30px'
              }
            }}
          >
            Generate NFT Smart Wallets
          </Typography>
          <Typography
            sx={{
              color: '#fff',
              font: '400 18px/28px "Inter"',
              maxWidth: 472,
              [theme.breakpoints.down('sm')]: {
                width: '100%',
                fontSize: '14px'
              }
            }}
          >
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
            width: 631,
            height: 557,
            position: 'relative',
            margin: '0',
            [theme.breakpoints.down('sm')]: {
              width: '70vw',
              height: '70vw',
              margin: 'auto'
            }
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
              width: '49.68px',
              height: '49.03px',
              position: 'absolute',
              top: 60,
              left: 320,
              animation: `${conin1_key} 5s linear infinite`,
              [theme.breakpoints.down('sm')]: {
                width: '7vw',
                height: '7vw',
                top: '11%',
                left: '37vw'
              }
            }}
          >
            <img src={Coin_1} alt="" width={'100%'} height={'100%'} />
          </Box>

          <Box
            sx={{
              width: '98px',
              height: '109px',
              position: 'absolute',
              top: 55,
              right: -15,
              animation: `${conin2_key} 5s linear infinite`,
              [theme.breakpoints.down('sm')]: {
                width: '11vw',
                height: '11vw'
              }
            }}
          >
            <img src={Coin_2} alt="" width={'100%'} height={'100%'} />
          </Box>
          <Box
            sx={{
              width: '81.42px',
              height: '80.35px',
              position: 'absolute',
              bottom: 170,
              right: 0,
              animation: `${conin3_key} 5s linear infinite`,
              [theme.breakpoints.down('sm')]: {
                width: '9vw',
                height: '9vw',
                bottom: '20vw'
              }
            }}
          >
            <img src={Coin_3} alt="" width={'100%'} height={'100%'} />
          </Box>
        </Box>
      </Box>
    </NftLayout>
  )
}
