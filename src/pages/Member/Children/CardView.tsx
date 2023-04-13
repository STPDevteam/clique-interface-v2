import { Box, Card, Typography } from '@mui/material'
import Image from 'components/Image'
import owl from 'assets/images/owl.png'

export default function CardView() {
  return (
    <Box>
      <Card
        sx={{
          width: 220,
          height: 226,
          border: '1px solid #d4d7e2',
          '& img': {
            width: 70
          }
        }}
      >
        <Image src={owl}></Image>
        <Typography noWrap maxWidth={'100%'}>
          Sonet is an open-source platform providing AWS-like services across Web2 and Web3 applicationsSonet is an
          open-source platform providing AWS-like services across Web2 and Web3 applicationsSonet is an open-source
          platform providing AWS-like services across Web2 and Web3 applications
        </Typography>
      </Card>
    </Box>
  )
}
