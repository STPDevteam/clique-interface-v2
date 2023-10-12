import { Box, Link, Typography, styled } from '@mui/material'
// import chainLogo0 from 'assets/images/chainLogo0.png'
import { ReactComponent as ShareIcon } from 'assets/svg/share.svg'
import LoopIcon from '@mui/icons-material/Loop'
import Button from 'components/Button/Button'
import useModal from 'hooks/useModal'
import CreateNftModal from './CreateNftModal'
import { useUserInfo } from 'state/userInfo/hooks'
import { useActiveWeb3React } from 'hooks'
import { ScanNFTInfo, useAccountNFTsList, useIsDelayTime, useRefreshNft } from 'hooks/useBackedProfileServer'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { ChainId, ChainListMap } from 'constants/chain'
import useBreakpoint from 'hooks/useBreakpoint'
import { toast } from 'react-toastify'
import { getEtherscanLink } from 'utils'
import placeholderImage from 'assets/images/placeholder.png'
import Image from 'components/Image'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useSBTIsDeployList } from 'hooks/useContractIsDeploy'
import Loading from 'components/Loading'
import { NftLayout } from './NftLayout'
import { Searching } from './Children/Card/Searching'
import { NotHaveNft } from './Children/Card/NotHaveNft'
import { NftDelaySuccess } from './Children/Card/SuccessCard'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'

const TitleStyle = styled(Typography)(({ theme }) => ({
  color: '#FFF',
  fontSize: '36px',
  fontWeight: 700,
  lineHeight: '40px',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '30px'
  }
}))

const CardStyled = styled(Box)(({ theme }) => ({
  height: 260,
  width: 225,
  borderRadius: '8px',
  border: '1px solid #2D50CB',
  background: 'rgb(249, 249, 249)',
  // background: '#0F1F39',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    width: '42vw',
    height: 180
  }
}))

const NftCards = styled(Box)(({ theme }) => ({
  maxHeight: 585,
  overflowY: 'auto',
  overflowX: 'hidden',
  display: 'flex',
  gap: 20,
  padding: '35px 110px',
  flexWrap: 'wrap',
  mt: 25,
  '::-webkit-scrollbar': {
    display: 'none'
  },
  [theme.breakpoints.down('sm')]: {
    display: 'grid',
    padding: '0',
    gridTemplateColumns: '42vw 42vw',
    paddingTop: '35px',
    gap: 10,
    mt: 0,
    justifyContent: 'space-evenly'
  }
}))

export const ContentTextStyle = styled(Typography)(() => ({
  color: 'var(--button-line, #97B7EF)',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px'
}))

export interface NftProp {
  nftAccount: `0x${string}` | undefined
  contractAddress: string | undefined
  nftTokenId: string | undefined
}

export function NftSelect() {
  const isSmDown = useBreakpoint('sm')
  const navigate = useNavigate()
  const userSignature = useUserInfo()
  const { isDelayTime } = useIsDelayTime()
  const { account, chainId } = useActiveWeb3React()
  // const [ercType, setErcType] = useState<'erc721' | 'erc1155'>('erc721')
  const [nftData, setNftData] = useState<NftProp>()
  const { result: _accountNFTsList, loading } = useAccountNFTsList(account || undefined, chainId, 'erc721')
  const { claimSubmitted } = useUserHasSubmittedClaim(`${nftData?.nftAccount}_create_Nft_Account`)
  const [isDeployIng, setIsDeployIng] = useState<boolean | undefined>()
  const [isDeploySuccess, setIsDeploySuccess] = useState<boolean>(false)

  const SBTIsDeployList = useSBTIsDeployList(
    _accountNFTsList.map(item => item.contract_address),
    _accountNFTsList.map(i => i.token_id)
  )

  const accountNFTsList = useMemo(() => {
    if (!_accountNFTsList.length) return []

    if (!SBTIsDeployList) return

    return _accountNFTsList.filter((_, idx) => SBTIsDeployList[idx] === false)
  }, [SBTIsDeployList, _accountNFTsList])

  useEffect(() => {
    if (isDelayTime) return
    if (!account || !userSignature) {
      navigate(routes.NftGenerator)
    }
  }, [account, userSignature, isDelayTime, navigate])

  useEffect(() => {
    if (claimSubmitted) {
      setIsDeployIng(true)
    }
    if (!claimSubmitted && isDeployIng) {
      setIsDeploySuccess(true)
    }
  }, [claimSubmitted, isDeployIng])
  console.log(_accountNFTsList, !loading)

  return (
    <NftLayout>
      <>
        {!isDeploySuccess ? (
          <>
            {account && userSignature ? (
              <Box
                sx={{
                  marginTop: isSmDown ? 10 : 50
                }}
              >
                <TitleStyle>
                  Select a NFT to create
                  <b style={{ color: '#A7F46A' }}> Smart Wallet</b>
                </TitleStyle>
                {accountNFTsList !== undefined && !loading ? (
                  accountNFTsList.length ? (
                    <NftCards>
                      {accountNFTsList?.map((item, index) => (
                        <Card
                          key={index + item.contract_name}
                          nft={item}
                          nftChainId={chainId}
                          setNftData={setNftData}
                        />
                      ))}
                    </NftCards>
                  ) : (
                    <NotHaveNft />
                  )
                ) : (
                  <Searching />
                )}
              </Box>
            ) : (
              <Box>
                <Loading />
              </Box>
            )}
          </>
        ) : (
          <NftDelaySuccess nftData={nftData} />
        )}
      </>
    </NftLayout>
  )
}

function Card({
  nft,
  nftChainId,
  setNftData
}: {
  nft: ScanNFTInfo
  nftChainId: ChainId | undefined
  setNftData: Dispatch<SetStateAction<NftProp | undefined>>
}) {
  const { showModal } = useModal()
  const isSmDown = useBreakpoint('sm')
  const refreshCb = useRefreshNft()

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
          src={ChainListMap[(nftChainId as ChainId) || 1].logo}
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
              showModal(<CreateNftModal nft={nft} setNftData={setNftData} />)
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
              lineHeight: '20px'
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
