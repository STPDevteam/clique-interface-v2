import { NftLayout } from './NftAccount'
import { Box, Link, Typography, styled } from '@mui/material'
// import chainLogo0 from 'assets/images/chainLogo0.png'
import { ReactComponent as ShareIcon } from 'assets/svg/share.svg'
import { ReactComponent as HourglassIcon } from 'assets/svg/hourglass_icon.svg'
import { ReactComponent as NotHaveNftIcon } from 'assets/svg/nothavenft_icon.svg'
import LoopIcon from '@mui/icons-material/Loop'
import Button from 'components/Button/Button'
import useModal from 'hooks/useModal'
import CreateNftModal from './CreateNftModal'
import { useUserInfo } from 'state/userInfo/hooks'
import { useActiveWeb3React } from 'hooks'
import { ScanNFTInfo, useAccountNFTsList, useRefreshNft } from 'hooks/useBackedProfileServer'
import { useCallback, useEffect, useMemo } from 'react'
import { ChainId } from 'constants/chain'
import useBreakpoint from 'hooks/useBreakpoint'
import { toast } from 'react-toastify'
import { getEtherscanLink } from 'utils'
import placeholderImage from 'assets/images/placeholder.png'
import Image from 'components/Image'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { ChainList } from 'constants/chain'

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
  background: 'rgb(249, 249, 249)',
  // background: '#0F1F39',
  position: 'relative'
}))

const ContentTextStyle = styled(Typography)(() => ({
  color: 'var(--button-line, #97B7EF)',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px'
}))

const SearchCardStyle = styled(Box)(() => ({
  position: 'relative',
  margin: '90px auto 0',
  borderRadius: '20px',
  background: 'linear-gradient(45deg, #67ccf8 0%, #3457b9 50%, #3d7bce 100%)',
  filter: 'drop-shadow(0px 14px 34px #0A35FF)',
  '& .item': {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    borderRadius: '20px',
    margin: 2,
    borderImageSlice: 1,
    // background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.14) 100%)'
    background: 'linear-gradient(180deg, #3558b9e6 0%, #2b53c0e6 80%, #2643c1e6 100%)',
    backdropFilter: ' blur(30.5px)',
    position: 'absolute'
  }
}))

export function NftSelect() {
  const navigate = useNavigate()
  const userSignature = useUserInfo()
  const { account, chainId } = useActiveWeb3React()
  // const [ercType, setErcType] = useState<'erc721' | 'erc1155'>('erc721')

  const { result: accountNFTsList, loading } = useAccountNFTsList(account || undefined, chainId, 'erc721')

  useEffect(() => {
    if (!account || !userSignature) {
      navigate(routes.NftAccount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, userSignature])
  return (
    <NftLayout>
      <Box
        sx={{
          marginTop: 130
        }}
      >
        <TitleStyle>
          Select an NFT deployment as the <b style={{ color: '#A7F46A' }}> Smart Wallet</b>
        </TitleStyle>

        {loading && <Searching />}

        {!accountNFTsList?.length && !loading ? (
          <>
            <NotHaveNft />
          </>
        ) : (
          !loading && (
            <Box
              sx={{
                maxHeight: 585,
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                gap: 20,
                padding: '35px 110px',
                mt: 25,
                '::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
            >
              <>
                {accountNFTsList?.map((item, index) => (
                  <Card key={index + item.contract_name} nft={item} nftChainId={chainId} />
                ))}
              </>
            </Box>
          )
        )}
      </Box>
    </NftLayout>
  )
}

function Card({ nft, nftChainId }: { nft: ScanNFTInfo; nftChainId: ChainId | undefined }) {
  const { showModal } = useModal()
  const isSmDown = useBreakpoint('sm')
  const refreshCb = useRefreshNft()

  const curChainLogo = useMemo(() => {
    const res = ChainList.filter(item => item.id === nftChainId)
    return res[0]?.logo
  }, [nftChainId])

  const refresh = useCallback(() => {
    refreshCb(nft.contract_address, nft.token_id).then((res: any) => {
      if (res.data.code !== 200) {
        toast.error(res.data.msg || 'Refresh error')
        return
      }
      toast.success('Refresh success')
    })
  }, [nft.contract_address, nft.token_id, refreshCb])
  console.log(isSmDown)

  return (
    <Box
      sx={{
        cursor: 'pointer',
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
            // background: ' #0F1F39'
            background: 'rgb(249, 249, 249)'
          }
        }
      }}
    >
      <CardStyled className="card">
        <img
          className="chainIcon"
          src={curChainLogo}
          alt=""
          height={'30'}
          width={'30'}
          style={{ borderRadius: '50%', position: 'absolute', top: 10, left: 10, display: 'none', zIndex: 10 }}
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
            refresh()
          }}
        ></LoopIcon>
        <Image
          altSrc={placeholderImage}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            objectFit: 'cover',
            position: 'absolute',
            zIndex: 0
          }}
          src={nft.image_uri || placeholderImage}
        />
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
              showModal(<CreateNftModal nft={nft} />)
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
            noWrap
            sx={{
              color: ' var(--button-line, #97B7EF)',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px',
              maxWidth: 180
            }}
          >
            {nft.name || nft.contract_name || '-'}#{nft.token_id}
          </Typography>
          <Box className="shareButton" sx={{ display: 'none' }}>
            <Link
              sx={{ height: '16px', width: '16px' }}
              target={'_blank'}
              underline="none"
              href={
                nftChainId === ChainId.MAINNET
                  ? `https://opensea.io/assets/ethereum/${nft.contract_address}/${nft.token_id}`
                  : nftChainId && getEtherscanLink(nftChainId, nft.contract_address, 'token') + `?a=${nft.token_id}`
              }
            >
              <ShareIcon />
            </Link>
          </Box>
        </Box>
      </CardStyled>
    </Box>
  )
}

function Searching() {
  return (
    <SearchCardStyle
      style={{
        height: 280,
        width: '278.816px'
      }}
    >
      <Box
        className="item"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 30
        }}
      >
        <HourglassIcon />
        <ContentTextStyle>Searching for available NFTs</ContentTextStyle>
      </Box>
    </SearchCardStyle>
  )
}

function NotHaveNft() {
  const navigate = useNavigate()

  return (
    <SearchCardStyle
      style={{
        width: '443px',
        height: '280px'
      }}
    >
      <Box
        className="item"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 30
        }}
      >
        <NotHaveNftIcon />
        <ContentTextStyle
          sx={{
            maxWidth: 340,
            textAlign: 'center'
          }}
        >
          {"Whoops, you don't have any available NFTs."}
          <br />
          {" It's okay, go into "}
          <Link
            style={{
              cursor: 'pointer',
              color: '#F9F9F9',
              textDecoration: 'underline'
            }}
            onClick={() => {
              navigate(routes.Activity)
            }}
          >
            Clique Discovery
          </Link>
          {' to claim a NFT !'}
        </ContentTextStyle>
      </Box>
    </SearchCardStyle>
  )
}
