import Modal from 'components/Modal/index'
import { Box, Typography, styled } from '@mui/material'
// import Image from 'components/Image'
// import placeholderImage from 'assets/images/placeholder.png'
import { ReactComponent as CodeYellowIcon } from 'assets/svg/code_yellow.svg'
import Copy from 'components/essential/Copy'
import { useMemo } from 'react'
import { Currency } from 'constants/token'
import { ChainId } from 'constants/chain'
import { useCurrencyBalance } from 'state/wallet/hooks'
import QRCode from 'react-qr-code'

const BodyBoxStyle = styled(Box)(() => ({
  padding: '13px 28px',
  display: 'grid',
  gap: 20
}))

// const TokensStyle = styled(Box)(() => ({
//   padding: '10px 0',
//   display: 'grid',
//   flexDirection: 'column',
//   gap: 17
// }))

// const TokensItem = styled(Box)(() => ({
//   display: 'flex',
//   width: '100%',
//   justifyContent: 'space-between',
//   paddingRight: '6px',
//   alignItems: 'center',
//   cursor: 'pointer',
//   borderRadius: '8px',
//   ':hover': {
//     background: '#F8FBFF'
//   }
// }))

// const TextStyle = styled(Typography)(() => ({
//   fontSize: '16px',
//   color: '#80829F',
//   lineHeight: '20px'
// }))

const QRcodeStyle = styled(Box)(() => ({
  width: '100%',
  background: 'rgba(255, 186, 10, 0.18)',
  borderRadius: '8px',
  padding: '20px',
  overflow: 'hidden'
}))

const QRcodeText = styled(Typography)(() => ({
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: '500',
  color: '#9F8644'
}))

const QRcodeWhite = styled(Box)(({ theme }) => ({
  height: '139px',
  width: '100%',
  background: '#fff',
  borderRadius: '6px',
  padding: '14px 17px',
  display: 'grid',
  gap: '10px',
  marginTop: '15px',
  [theme.breakpoints.down('sm')]: {
    height: 'auto'
  }
}))

const AddressStyle = styled(Box)(({ theme }) => ({
  maxWidth: '194px',
  height: 'auto',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '23px',
  '>div': {
    display: 'inline-block',
    svg: {
      marginLeft: '6px'
    }
  },

  [theme.breakpoints.down('sm')]: {
    maxWidth: '155px'
  }
}))

export default function RecieveAssetsModal({
  chainId,
  nftAddress
}: {
  chainId: number | undefined
  nftAddress: string | undefined
}) {
  const network = useMemo(() => {
    if (chainId) {
      return Currency.get_ETH_TOKEN(chainId as ChainId)
    }

    return
  }, [chainId])

  const airdropCurrencyBalance = useCurrencyBalance(nftAddress || undefined, network || undefined, chainId || undefined)
  console.log('airdropCurrencyBalance=>', airdropCurrencyBalance)

  return (
    <Modal maxWidth="480px" width="100%" closeIcon>
      <BodyBoxStyle>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: 14,
            lineHeight: '24px',
            color: '#3F5170'
          }}
        >
          Recieve Assets
        </Typography>
        {/* <TokensStyle>
          <TokensItem>
            <Box display={'flex'} gap={'15px'}>
              <Image
                style={{ height: 40, width: 40, background: '#F8FBFF', borderRadius: '50%' }}
                src={airdropCurrencyBalance?.currency?.logo || placeholderImage}
              />
              <Box>
                <TextStyle>{airdropCurrencyBalance?.currency?.symbol || '--'}</TextStyle>
                <TextStyle fontSize={'12px !important'}>{airdropCurrencyBalance?.currency?.name || '--'}</TextStyle>
              </Box>
            </Box>
            <TextStyle>{airdropCurrencyBalance?.toSignificant(6) || 0}</TextStyle>
          </TokensItem>
        </TokensStyle> */}
        <QRcodeStyle
          sx={{
            // height: isCheck ? 220 : 55,
            height: { xs: 'auto', md: 220 },
            transition: 'all 0.5s'
          }}
        >
          <Box display={'flex'} justifyContent={'space-between'}>
            <QRcodeText>Other Token</QRcodeText>
            <QRcodeText display={'flex'} gap={'12px'} lineHeight={'16px !important'} fontSize={'14px !important'}>
              Show receive address QRcode
              <CodeYellowIcon />
            </QRcodeText>
          </Box>
          <QRcodeWhite>
            <Typography lineHeight={'16px'} fontSize={'14px'} color={'#8D8EA5'}>
              Only send Ethereum network assets to this address
            </Typography>
            <Box display={'flex'} justifyContent={'space-between'}>
              <AddressStyle
                sx={{
                  overflowWrap: 'break-word'
                }}
              >
                {nftAddress || '--'}
                <Copy toCopy={nftAddress || '--'} />
              </AddressStyle>
              <Box
                sx={{
                  svg: {
                    height: '76px',
                    width: '76px'
                  }
                }}
              >
                {/* <CodeYellowIcon /> */}
                <QRCode value={nftAddress?.toString() || ''} />
              </Box>
            </Box>
          </QRcodeWhite>
        </QRcodeStyle>
      </BodyBoxStyle>
    </Modal>
  )
}
