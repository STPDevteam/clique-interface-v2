import { Box, ClickAwayListener, Popper, Tab, Tabs, Typography, styled, useTheme, Link } from '@mui/material'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import Back from 'components/Back'
import { useNavigate, useParams } from 'react-router-dom'
import Copy from 'components/essential/Copy'
import Loading from 'components/Loading'
// import { routes } from 'constants/routes'
// import { ReactComponent as ETHIcon } from 'assets/tokens/ETH.svg'
import { ReactComponent as SendIcon } from 'assets/svg/sendIcon.svg'
import { ReactComponent as ReceiveIcon } from 'assets/svg/receiveIcon.svg'
import { ReactComponent as ArrowIcon } from 'assets/svg/arrow_down.svg'
import { ReactComponent as OpenSeaIcon } from 'assets/svg/opensea.svg'
import { ReactComponent as TransferIcon } from 'assets/svg/transferIcon.svg'
import { useActiveWeb3React } from 'hooks'
import { getEtherscanLink, shortenAddress } from 'utils'
import Button, { BlackButton } from 'components/Button/Button'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Assets } from './Tabs/Assets'
import { Nfts } from './Tabs/Nfts'
import { History } from './Tabs/History'
import placeholderImage from 'assets/images/placeholder.png'
import Image from 'components/Image'
import SendTokenModal from './SendTokenModal'
import useModal from 'hooks/useModal'
import SendNftModal from './SendNftModal'
import RecieveAssetsModal from './RecieveAssetsModal'
import TransFerNftModal from './TransFerNftModal'
import { useIsOwnerCallback, useNft6551Detail } from 'hooks/useBackedNftCallback'
import { useUserInfo } from 'state/userInfo/hooks'
// import { useIsDelayTime } from 'hooks/useBackedProfileServer'
// import { routes } from 'constants/routes'
import { ChainId, ChainListMap } from 'constants/chain'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import ConnectAccountModal from './ConnectAccountModal'
import { routes } from 'constants/routes'

const ContentBoxStyle = styled(Box)(({ theme }) => ({
  minHeight: '780px',
  width: '100%',
  border: '1px solid #D4D7E2',
  borderRadius: '10px',
  padding: '30px 40px',
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
    minHeight: 'auto'
  }
}))

const LeftDetailStyle = styled(Box)(() => ({
  width: '100%'
}))

const RightDetailStyle = styled(Box)(() => ({
  width: '100%',
  display: 'grid',
  gap: 20
}))

const TitleStyle = styled(Typography)(() => ({
  color: 'var(--word-color, #3F5170)',
  fontSize: '30px',
  fontWeight: '700',
  lineHeight: 'normal'
}))

const ButtonsStyle = styled(Box)(() => ({
  display: 'flex',
  width: '100%',
  gap: 10,
  marginTop: '20px',
  flexWrap: 'wrap'
}))

const ConnectButtons = styled(Button)(({ theme }) => ({
  height: 40,
  width: '120px',
  color: '#FFF',
  fontWeight: '500',
  [theme.breakpoints.down('sm')]: {
    height: '36px'
  }
}))

const AccountButton = styled(Box)(() => ({
  width: '160px',
  height: '40px',
  borderRadius: '8px',
  border: '1px solid var(--line, #D4D7E2)',
  background: '#FFF',
  padding: '10px 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 6,
  svg: {
    margin: '0 !important'
  }
}))

const OutlineButton = styled(Button)(({ theme }) => ({
  height: '40px',
  display: 'flex',
  gap: 4,
  padding: '10px 15px',
  width: 'auto',
  background: '#fff',
  border: '1px solid var(--line, #D4D7E2)',
  color: 'var(--word-color, #3F5170)',
  fontSize: '14px',
  fontWeight: 500,
  ':hover': {
    background: '#fff',
    color: '#000'
  },
  [theme.breakpoints.down('sm')]: {
    height: '36px'
  }
}))

const WarningStyle = styled(Box)(() => ({
  width: '100%',
  height: 65,
  marginTop: 15,
  backgroundColor: 'rgba(255, 186, 10, 0.18)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '8px',
  padding: '12px 13px 12px 29px',
  '& .class_apply_button': {
    height: 36,
    width: 85,
    fontWeight: 500,
    color: '#C5954F',
    backgroundColor: '#fff !important',
    border: '1px solid #F1DEAB !important',
    ':hover': {
      backgroundColor: '#F5F5F5 !important',
      color: '#9F8644'
    }
  }
}))

const StyledTabs = styled('div')(({ theme }) => ({
  display: 'flex',
  fontWeight: 600,
  fontSize: 14,
  listStyle: 'none',
  padding: 0,
  height: '48px',
  borderBottom: '1px solid #D4D7E2',
  marginTop: '10px',
  '&>*': {
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    color: '#0049c6',
    cursor: 'pointer',
    minHeight: 'auto',
    '&:hover': {
      color: '#0049c6'
    },
    '&.active': {
      color: '#0049c6'
    }
  },
  '& .MuiTabs-indicator': {
    width: '0!important'
  },
  '& button': {
    height: '48px',
    display: 'flex',
    alignItems: 'start',
    border: 0,
    padding: 0,
    lineHeight: '20px',
    width: 'auto',
    minWidth: 'auto',
    paddingRight: '50px',
    '&:hover': {
      color: '#0049c6'
    },
    '&.active': {
      fontWeight: 600
    }
  },
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'space-evenly',
    '&>*': {
      marginRight: 0,

      '&:last-child': {
        marginRight: 0
      },
      '& .css-1q9gtu-MuiButtonBase-root-MuiTab-root': {
        fontSize: '12px !important',
        gap: 5
      },
      '& .css-heg063-MuiTabs-flexContainer': {
        justifyContent: 'space-between',
        width: 'calc(100vw - 72px)'
      },
      '& button': {
        padding: 0
      }
    }
  }
}))

const SelectOptionStyle = styled(Box)(() => ({
  color: 'var(--word-color, #3F5170)',
  fontWeight: '500',
  lineHeight: '20px',
  padding: '9px 22px 11px',
  height: '40px',
  width: '100%',
  fontSize: '14px',
  cursor: 'pointer',
  ':hover': {
    background: 'rgba(0, 73, 198, 0.05)'
  }
}))

enum TAB {
  Assets = 'Assets',
  NFTs = 'NFTs',
  History = 'History'
}

const TabsList = [TAB.Assets, TAB.NFTs, TAB.History]

export function Nft6551Detail() {
  const navigate = useNavigate()
  // const { isDelayTime } = useIsDelayTime()

  const userSignature = useUserInfo()
  const { chainId: walletChainId, account, library } = useActiveWeb3React()
  const theme = useTheme()
  const { showModal } = useModal()
  const { nftAddress, chainId } = useParams<{ nftAddress: string; chainId: string }>()
  const [tabValue, setTabValue] = useState<number>(0)
  const { result: NftInfoData, loading, tokenId } = useNft6551Detail(nftAddress, chainId)
  const { OwnerAccount } = useIsOwnerCallback(NftInfoData?.contract_address, Number(chainId), tokenId)
  console.log('NftInfoData=>', NftInfoData)
  const isOwner = useMemo(() => {
    if (!account || !OwnerAccount) return false
    return account === OwnerAccount
  }, [OwnerAccount, account])

  const isTrueChain = useMemo(() => {
    if (userSignature && walletChainId && chainId && Number(walletChainId) !== Number(chainId)) return false
    return true
  }, [chainId, walletChainId, userSignature])
  console.log('isTrueChain=>', isTrueChain)

  // useEffect(() => {
  //   if (isDelayTime) return
  //   if (!account || !userSignature) {
  //     navigate(routes.NftGenerator)
  //     hideModal()
  //     return
  //   }
  //   if (Number(walletChainId) !== Number(chainId)) {
  //     navigate(routes.NftAssets)
  //     return
  //   }
  // }, [account, userSignature, hideModal, isDelayTime, navigate, walletChainId, chainId])
  const IsShow = false
  return (
    <>
      <ContainerWrapper maxWidth={1200} sx={{ paddingTop: 40 }}>
        {loading ? (
          <Box>
            <Loading sx={{ marginTop: 30 }} />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              gap: 20,
              flexDirection: 'row',
              [theme.breakpoints.down('md')]: {
                flexDirection: 'column',
                padding: '0 16px 30px'
              }
            }}
          >
            <ContentBoxStyle maxWidth={600}>
              <LeftDetailStyle>
                <Box display="grid" gap="15px">
                  <Back
                    text="NFT Accounts"
                    sx={{
                      margin: '0 !important',
                      fontWeight: 500,
                      lineHeight: '20px'
                    }}
                    event={() => {
                      navigate(routes.NftAssets)
                    }}
                  />
                  <TitleStyle>${NftInfoData?.opensea_floor_price || '--'}</TitleStyle>
                </Box>
                <ButtonsStyle>
                  <AccountButton>
                    <Image
                      style={{ height: 18, width: 18, borderRadius: '50%' }}
                      src={ChainListMap[Number(chainId) || 1]?.logo || ''}
                    />
                    <Typography>{nftAddress ? shortenAddress(nftAddress) : '--'}</Typography>
                    <Copy toCopy={nftAddress || '--'} />
                  </AccountButton>

                  <OutlineButton
                    onClick={() => showModal(<RecieveAssetsModal chainId={Number(chainId)} nftAddress={nftAddress} />)}
                  >
                    <ReceiveIcon />
                    Receive
                  </OutlineButton>

                  {isOwner && isTrueChain && (
                    <>
                      <SendButton chainId={Number(chainId)} nftAddress={nftAddress} />
                      {IsShow && (
                        <ConnectButtons onClick={() => showModal(<ConnectAccountModal />)}>Connect Dapp</ConnectButtons>
                      )}
                    </>
                  )}
                </ButtonsStyle>

                <WarningStyle>
                  {!isTrueChain ? (
                    <>
                      <Typography variant="body1" lineHeight={'16px'} color={'#9F8644'}>
                        You need switch to{` `}
                        <Link
                          sx={{ cursor: 'pointer' }}
                          onClick={() => chainId && triggerSwitchChain(library, Number(chainId), account || '')}
                        >
                          switch
                        </Link>
                        {` `}
                        {chainId ? ChainListMap[Number(chainId)].name : '--'}
                      </Typography>
                      <BlackButton
                        className="class_apply_button"
                        onClick={() => chainId && triggerSwitchChain(library, Number(chainId), account || '')}
                      >
                        Switch
                      </BlackButton>
                    </>
                  ) : (
                    <>
                      <Typography variant="body1" lineHeight={'16px'} color={'#9F8644'}>
                        {`Apply for .aw domain name now ->`}
                      </Typography>
                      <BlackButton
                        className="class_apply_button"
                        onClick={() => {
                          console.log('status=>', 1)
                        }}
                      >
                        Apply
                      </BlackButton>
                    </>
                  )}
                </WarningStyle>
                <StyledTabs>
                  <Tabs value={tabValue}>
                    {TabsList.map((item, idx) => (
                      <Tab
                        key={item + idx}
                        label={item}
                        onClick={() => setTabValue(idx)}
                        sx={{
                          gap: 50,
                          [theme.breakpoints.down('sm')]: {
                            mr: 0
                          }
                        }}
                        className={tabValue === idx ? 'active' : ''}
                      ></Tab>
                    ))}
                  </Tabs>
                </StyledTabs>
                {TabsList[tabValue] === TAB.Assets && <Assets chainId={Number(chainId)} nftAddress={nftAddress} />}
                {TabsList[tabValue] === TAB.NFTs && <Nfts chainId={Number(chainId)} nftAddress={nftAddress} />}
                {TabsList[tabValue] === TAB.History && <History />}
              </LeftDetailStyle>
            </ContentBoxStyle>
            <ContentBoxStyle maxWidth={580}>
              <RightDetailStyle>
                <Box display={'grid'} gap={'8px'} minHeight={57}>
                  <>
                    <Typography
                      sx={{
                        color: 'var(--tile-grey, #80829F)',
                        lineHeight: '20px'
                      }}
                    >
                      Collection name
                    </Typography>
                    <TitleStyle fontSize={'24px !important'} noWrap>
                      {NftInfoData?.name || '--'} #{tokenId}
                    </TitleStyle>
                  </>
                </Box>

                <Box
                  sx={{
                    height: 500,
                    width: 500,
                    borderRadius: '10px',
                    background: 'rgb(236 236 236)',
                    [theme.breakpoints.down('md')]: {
                      height: '100%',
                      width: '100%'
                    }
                  }}
                >
                  <Image
                    style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      zIndex: 0
                    }}
                    src={NftInfoData?.logo_url || NftInfoData?.large_image_url || placeholderImage}
                  />
                </Box>
                <Typography
                  sx={{
                    color: 'var(--tile-grey, #80829F)',
                    lineHeight: '20px'
                  }}
                >
                  {NftInfoData?.description ||
                    ` Developers around the world are tired of working and contributing their time and effort to enrich the
                  top 1%. Join the movement that is community owned, building the future from the bottom up.`}
                </Typography>
                <ButtonsStyle justifyContent={'end'}>
                  {Number(chainId) === ChainId.MAINNET && (
                    <Link
                      target={'_blank'}
                      underline="none"
                      href={
                        Number(chainId) === ChainId.MAINNET
                          ? `https://opensea.io/assets/ethereum/${NftInfoData?.contract_address}/${tokenId}`
                          : chainId &&
                            NftInfoData?.contract_address &&
                            getEtherscanLink(Number(chainId), NftInfoData?.contract_address, 'token') + `?a=${tokenId}`
                      }
                    >
                      <OutlineButton sx={{ padding: '10px 20px', gap: 5 }}>
                        <OpenSeaIcon />
                        View on Opensea
                      </OutlineButton>
                    </Link>
                  )}
                  {isOwner && isTrueChain && (
                    <OutlineButton
                      sx={{ padding: '11px', gap: 5 }}
                      onClick={() =>
                        showModal(
                          <TransFerNftModal chainId={Number(chainId)} NftInfoData={NftInfoData} tokenId={tokenId} />
                        )
                      }
                    >
                      <TransferIcon />
                      Transfer
                    </OutlineButton>
                  )}
                </ButtonsStyle>
              </RightDetailStyle>
            </ContentBoxStyle>
          </Box>
        )}
      </ContainerWrapper>
    </>
  )
}

function SendButton({ chainId, nftAddress }: { chainId: number | undefined; nftAddress: string | undefined }) {
  const { showModal } = useModal()
  // const popperRef = useRef<any>(null)
  const childRef = useRef<any>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = !!anchorEl
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.type === 'touchend') return
    setAnchorEl(event.currentTarget)
    event.nativeEvent.stopImmediatePropagation()
    event.stopPropagation()
  }

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (childRef.current && !childRef.current.contains(event.target)) {
        setAnchorEl(null)
        event.stopPropagation()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <div>
      <ClickAwayListener
        onClickAway={() => {
          setAnchorEl(null)
        }}
      >
        <>
          <Box
            onMouseEnter={handleClick}
            onClick={e => {
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
              handleClick(e)
            }}
          >
            <OutlineButton>
              <SendIcon />
              <Box display={'flex'} gap={'10px'} alignItems={'center'}>
                Send
                <ArrowIcon />
              </Box>
            </OutlineButton>
          </Box>

          <Popper
            open={open}
            placement={'bottom-start'}
            anchorEl={anchorEl}
            className="popperCon"
            onMouseLeave={() => setAnchorEl(null)}
            style={{
              zIndex: 99999
            }}
          >
            <Box
              sx={{
                paddingTop: 48,
                cursor: 'pointer',
                transform: 'translateY(-40px)'
              }}
            >
              <Box
                sx={{
                  width: '150px',
                  borderRadius: '8px',
                  border: '1px solid var(--line, #D4D7E2)',
                  background: '#FFF',
                  padding: '9px 0'
                }}
                ref={childRef}
                onClick={() => setAnchorEl(null)}
              >
                <SelectOptionStyle
                  onClick={() => showModal(<SendTokenModal nftAddress={nftAddress} chainId={chainId} />)}
                >
                  Fungible Token
                </SelectOptionStyle>
                <SelectOptionStyle
                  onClick={() => showModal(<SendNftModal chainId={chainId} nftAddress={nftAddress} />)}
                >
                  NFT
                </SelectOptionStyle>
              </Box>
            </Box>
          </Popper>
        </>
      </ClickAwayListener>
    </div>
  )
}
