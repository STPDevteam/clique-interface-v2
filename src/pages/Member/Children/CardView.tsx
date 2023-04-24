import { Box, Card, Typography } from '@mui/material'
import Image from 'components/Image'
import owl from 'assets/images/owl.png'
import { shortenAddress } from 'utils'
import Button from 'components/Button/Button'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import { ReactComponent as Youtobe } from 'assets/svg/youtobe.svg'
import { ReactComponent as Opensea } from 'assets/svg/opensea.svg'

export default function CardView({ result }: any) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}
    >
      {result.map((item: any) => (
        <Box key={item} width={'30%'} margin={'20px auto 10px'}>
          <Card
            sx={{
              position: 'relative',
              width: '100%',
              height: 226,
              textAlign: 'center',
              border: '1px solid #d4d7e2',
              '& img': {
                zIndex: 10,
                marginTop: 20,
                width: 70,
                height: 70
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
                backgroundImage: `url(${item.avatar || owl})`,
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
                },
                '& .A_superAdmin': {
                  backgroundColor: '#0049C6'
                },
                '& .A_admin': {
                  backgroundColor: '#97B7EF'
                },
                '& .A_member': {
                  backgroundColor: '#EBF0F7',
                  color: '#80829F'
                }
              }}
            >
              <Image src={item.avatar || owl}></Image>
              <Typography noWrap maxWidth={'100%'} color="#3f5170" fontSize={18} minHeight={24}>
                {item.nickname}
              </Typography>
              <Typography noWrap maxWidth={'100%'} color="#0049c6" fontSize={13}>
                {shortenAddress(item.account, 3)}
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
                <Twitter onClick={() => window.open(item.twitter, '_blank')}></Twitter>
                <Youtobe onClick={() => window.open(item.youtobe, '_blank')}></Youtobe>
                <Discord onClick={() => window.open(item.discord, '_blank')}></Discord>
                <Opensea onClick={() => window.open(item.opensea, '_blank')}></Opensea>
              </Box>
              <Button width="98px" height="22px" borderRadius="30px" fontSize={13} className={item.jobs}>
                {item.jobs || 'unnamed'}
              </Button>
            </Box>
          </Card>
        </Box>
      ))}
    </Box>
  )
}
