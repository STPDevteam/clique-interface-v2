import { Box, useTheme, Typography } from '@mui/material'
import { shortenAddress } from 'utils'

// const Dot = styled('span')({
//   width: 16,
//   height: 16,
//   background: 'linear-gradient(135deg, #ffffff 4.17%, rgba(255, 255, 255, 0) 75%)',
//   border: '0.6px solid #ffffff',
//   borderRadius: '50%'
// })

// function StatusIcon(connector: AbstractConnector | undefined) {
//   const style = { height: 16, width: 16, objectFit: 'contain' as const }
//   if (connector === injected) {
//     const { ethereum } = window
//     const isMetaMask = !!(ethereum && ethereum.isMetaMask)
//     return isMetaMask ? <Image style={style} src={Matamask} /> : <Dot />
//   } else if (connector === walletconnect) {
//     return <Image style={style} src={WalletConnectIcon} />
//   } else if (connector === walletlink) {
//     return <Image style={style} src={CoinbaseWalletIcon} />
//   } else if (connector === fortmatic) {
//     return <Image style={style} src={FortmaticIcon} />
//   } else if (connector === portis) {
//     return <Image style={style} src={PortisIcon} />
//   }
//   return null
// }

export default function DestinationAddress({ address, margin }: { address: string; margin?: string }) {
  const theme = useTheme()

  return (
    <>
      {address && (
        <Box display="flex" margin={margin || '16px 0 0'} fontSize="14px">
          <Typography marginRight="10px" color={theme.palette.text.secondary}>
            Destination:
          </Typography>
          <Box display="flex" alignItems={'center'}>
            {/* <Image src={WalletConnectIcon} /> */}
            <Typography marginLeft="8px" color={theme.palette.text.secondary}>
              {shortenAddress(address, 10)}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  )
}
