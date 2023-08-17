import { NftLayout } from './NftAccount'
import { Box, Typography, styled } from '@mui/material'
import Nft_bgImage from 'assets/images/coingecko.png'
import chainLogo0 from 'assets/images/chainLogo0.png'
import { ReactComponent as ShareIcon } from 'assets/svg/share.svg'
import LoopIcon from '@mui/icons-material/Loop'
import Button from 'components/Button/Button'
import useModal from 'hooks/useModal'
import CreateNftModal from './CreateNftModal'
const TitleStyle = styled(Typography)(() => ({
  color: '#FFF',
  fontSize: '36px',
  fontWeight: 700,
  lineHeight: '40px',
  textAlign: 'center'
}))

const CardStyled = styled(Box)(() => ({
  height: 260,
  width: 225,
  borderRadius: '8px',
  border: '1px solid #2D50CB',
  background: '#0F1F39',
  position: 'relative'
}))

export function NftSelect() {
  return (
    <NftLayout>
      <Box
        sx={{
          marginTop: 130
        }}
      >
        <TitleStyle>
          Select an NFT deployment as the <b style={{ color: '#A7F46A' }}> wallet</b>
        </TitleStyle>
        <Box
          sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 20, padding: '20px 115px', mt: 35 }}
        >
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
        </Box>
      </Box>
    </NftLayout>
  )
}

function Card() {
  const { showModal } = useModal()
  return (
    <Box
      sx={{
        cursor: 'pointer',
        paddingBottom: 2,
        '&:hover': {
          '.chainIcon': {
            display: 'block !important'
          },
          '.deployButton': {
            display: 'block !important'
          },
          '.shareButton': {
            display: 'flex !important'
          },
          '.card': {
            transition: 'all 0.5s',
            transform: 'translateY(-15px)',
            boxShadow: '0px 4px 20px 3px #0094FF',
            border: '1px solid var(--button-line, #97B7EF)',
            background: ' #0F1F39'
          }
        }
      }}
    >
      <CardStyled className="card">
        <img
          className="chainIcon"
          src={chainLogo0}
          alt=""
          height={'30'}
          width={'30'}
          style={{ borderRadius: '50%', position: 'absolute', top: 10, left: 10, display: 'none' }}
        />
        <LoopIcon
          sx={{
            cursor: 'pointer',
            display: 'inline-block',
            right: 5,
            top: 5,
            backgroundColor: 'rgba(0, 0, 0, 0.10)',
            borderRadius: '50%',
            padding: 1,
            zIndex: 10,
            width: '20px',
            height: '20px',
            position: 'absolute',
            '& path': {
              fill: '#fff'
            },
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.50)'
            }
          }}
          onClick={() => {
            console.log(1)
          }}
        ></LoopIcon>
        <img src={Nft_bgImage} alt="" height={'100%'} width={'100%'} style={{ borderRadius: '8px' }} />
        <Box
          sx={{
            position: 'absolute',
            bottom: 47,
            width: '100%',
            height: 36,
            padding: '0 33px'
          }}
        >
          <Button
            className="deployButton"
            style={{
              borderRadius: '8px',
              border: '1px solid var(--main-color, #0049C6)',
              background: '#FFF',
              color: '#0049C6',
              display: 'none',
              '&:hover': {
                background: '#eee',
                color: '#06c'
              }
            }}
            onClick={() => {
              showModal(<CreateNftModal />)
            }}
          >
            Deploy
          </Button>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 37,
            width: '100%',
            background: '#0F1F39',
            borderRadius: '0 0 8px 8px',
            padding: '8px 10px 10px 15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography
            sx={{
              color: ' var(--button-line, #97B7EF)',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px'
            }}
          >
            Heroes of Evermore#...
          </Typography>
          <Box className="shareButton" sx={{ display: 'none', alignItems: 'center' }}>
            <ShareIcon />
          </Box>
        </Box>
      </CardStyled>
    </Box>
  )
}
