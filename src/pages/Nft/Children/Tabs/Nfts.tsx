import { Box, styled, Typography, Link } from '@mui/material'
import { ChainList } from 'constants/chain'
import { useCallback, useMemo } from 'react'
import LoopIcon from '@mui/icons-material/Loop'
import placeholderImage from 'assets/images/placeholder.png'
import Image from 'components/Image'
import { useRefreshNft } from 'hooks/useBackedProfileServer'
import { toast } from 'react-toastify'
import { ReactComponent as ShareIcon } from 'assets/svg/share.svg'

export function Nfts({ chainId }: { chainId: number }) {
  return (
    <>
      <Box
        sx={{
          mt: 15,
          display: 'flex',
          gap: 13,
          flexWrap: 'wrap'
        }}
      >
        <Card chainId={chainId} />
        <Card chainId={chainId} />
        <Card chainId={chainId} />
        <Card chainId={chainId} />
      </Box>
    </>
  )
}

const CardStyled = styled(Box)(({ theme }) => ({
  height: 190,
  width: 164,
  borderRadius: '8px',
  border: '1px solid var(--line, #D4D7E2)',
  background: 'rgb(236 236 236)',
  // background: '#0F1F39',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    width: '44vw',
    height: 180
  }
}))

function Card({ chainId }: { chainId: number }) {
  const refreshCb = useRefreshNft()

  const curChainLogo = useMemo(() => {
    const res = ChainList.filter(item => item.id === chainId)
    return res[0]?.logo
  }, [chainId])

  const refresh = useCallback(() => {
    refreshCb('0xasdas', '1').then((res: any) => {
      if (res.data.code !== 200) {
        toast.error(res.data.msg || 'Refresh error')
        return
      }
      toast.success('Refresh success')
    })
  }, [refreshCb])
  return (
    <Box
      sx={{
        cursor: 'pointer',
        '&:hover': {
          '.deployButton, .class_loopIcon, .chainIcon': {
            display: 'block !important'
          },
          '.shareButton': {
            display: 'flex !important'
          },
          '.card': {
            border: '1px solid var(--button-line, #97B7EF)'
          }
        }
      }}
    >
      <CardStyled className="card">
        <img
          className="chainIcon"
          src={curChainLogo}
          alt=""
          height={'24px'}
          width={'24px'}
          style={{ borderRadius: '50%', position: 'absolute', top: 10, left: 10, display: 'none', zIndex: 10 }}
        />
        <LoopIcon
          className="class_loopIcon"
          sx={{
            cursor: 'pointer',
            display: 'none ',
            right: 5,
            top: 5,
            backgroundColor: 'rgba(0, 0, 0, 0.10)',
            borderRadius: '50%',
            padding: 1,
            zIndex: 10,
            width: '24px',
            height: '24px',
            position: 'absolute',
            '& path': {
              fill: '#fff'
            },
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.50)'
            }
          }}
          onClick={() => {
            refresh()
          }}
        ></LoopIcon>
        <Image
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            objectFit: 'cover',
            position: 'absolute',
            zIndex: 0
          }}
          src={placeholderImage}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 27,
            width: '100%',
            background: '#F8FBFF',
            borderRadius: '0 0 8px 8px',
            padding: '0 10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography
            noWrap
            sx={{
              color: ' var(--button-line, #97B7EF)',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px',
              maxWidth: 180
            }}
          >
            {'asdasasdasdasdasdasdasdasasasasdasasddasdas'}
          </Typography>
          <Box className="shareButton" sx={{ display: 'none' }}>
            <Link
              sx={{ height: '16px', width: '16px' }}
              target={'_blank'}
              underline="none"
              href="asd"
              //   href={
              //     nftChainId === ChainId.MAINNET
              //       ? `https://opensea.io/assets/ethereum/${nft.contract_address}/${nft.token_id}`
              //       : nftChainId && getEtherscanLink(nftChainId, nft.contract_address, 'token') + `?a=${nft.token_id}`
              //   }
            >
              <ShareIcon />
            </Link>
          </Box>
        </Box>
      </CardStyled>
    </Box>
  )
}
