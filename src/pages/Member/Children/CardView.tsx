import { Box, Card, Typography } from '@mui/material'
import Image from 'components/Image'
import owl from 'assets/images/owl.png'
import { shortenAddress } from 'utils'
import Button from 'components/Button/Button'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import { ReactComponent as Youtobe } from 'assets/svg/youtobe.svg'
import { ReactComponent as Opensea } from 'assets/svg/opensea.svg'

export default function CardView() {
  return (
    <Box mt={10}>
      <Card
        sx={{
          position: 'relative',
          width: 220,
          height: 226,
          textAlign: 'center',
          border: '1px solid #d4d7e2',

          '& img': {
            zIndex: 10,
            marginTop: 20,
            width: 70
          },
          '& p': {
            fontWeight: 600
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 60,
            backgroundSize: '130% auto',
            backgroundPosition: 'center center',
            backgroundImage: `url(${owl})`,
            backgroundRepeat: 'no-repeat'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 60,
              backdropFilter: 'blur(17px)'
            }}
          ></Box>
        </Box>
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            '& button': {
              fontWeight: 500
            }
          }}
        >
          <Image src={owl}></Image>
          <Typography noWrap maxWidth={'100%'} color="#3f5170" fontSize={18}>
            Admin
          </Typography>
          <Typography noWrap maxWidth={'100%'} color="#0049c6" fontSize={13}>
            {shortenAddress('0x5159ed45c75C406CFCd832caCEE5B5E48eaD568E', 3)}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '10px 0',
              cursor: 'pointer',
              gap: 10
            }}
          >
            <Twitter></Twitter>
            <Youtobe></Youtobe>
            <Discord></Discord>
            <Opensea></Opensea>
          </Box>
          <Button width="98px" height="22px" borderRadius="30px" fontSize={13}>
            Super Admin
          </Button>
        </Box>
      </Card>
    </Box>
  )
}
