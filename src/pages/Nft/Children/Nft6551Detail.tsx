import { Box, ClickAwayListener, Popper, Tab, Tabs, Typography, styled, useTheme } from '@mui/material'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
// import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import Back from 'components/Back'
import { useParams } from 'react-router-dom'
// import { ChainListMap } from 'constants/chain'
import Copy from 'components/essential/Copy'
import DelayLoading from 'components/DelayLoading'
import Loading from 'components/Loading'
// import { routes } from 'constants/routes'
import { ReactComponent as ETHIcon } from 'assets/tokens/ETH.svg'
import { ReactComponent as SendIcon } from 'assets/svg/sendIcon.svg'
import { ReactComponent as ReceiveIcon } from 'assets/svg/receiveIcon.svg'
import { ReactComponent as ArrowIcon } from 'assets/svg/arrow_down.svg'
import { ReactComponent as OpenSeaIcon } from 'assets/svg/opensea.svg'
import { ReactComponent as TransferIcon } from 'assets/svg/transferIcon.svg'
import { useActiveWeb3React } from 'hooks'
import { shortenAddress } from 'utils'
import Button, { BlackButton } from 'components/Button/Button'
import { useEffect, useRef, useState } from 'react'
import { Assets } from './Tabs/Assets'
import { Nfts } from './Tabs/Nfts'
import { History } from './Tabs/History'
import placeholderImage from 'assets/images/placeholder.png'
import Image from 'components/Image'
import SendTokenModal from './SendTokenModal'
import useModal from 'hooks/useModal'
import SendNftModal from './SendNftModal'
import RecieveAssetsModal from './RecieveAssetsModal'
import { useNft6551Detail } from 'hooks/useBackedNftCallback'
// import { ReactComponent as WETHIcon } from 'assets/tokens/WETH.svg'
const ContentBoxStyle = styled(Box)(({ maxWidth }: { maxWidth?: number }) => ({
  height: '780px',
  maxWidth: maxWidth ? maxWidth : 600,
  width: '100%',
  border: '1px solid #D4D7E2',
  borderRadius: '10px',
  padding: '30px 40px'
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
  marginTop: '20px'
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

const OutlineButton = styled(Button)(() => ({
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
        width: 'calc(100vw - 32px)'
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
  const { chainId, account } = useActiveWeb3React()
  const theme = useTheme()
  const { showModal } = useModal()
  const { nftAddress, tokenId } = useParams<{ nftAddress: string; tokenId: string }>()
  const [tabValue, setTabValue] = useState<number>(0)
  const { result: NftInfoData } = useNft6551Detail(nftAddress)
  console.log('=>', NftInfoData)

  return (
    <>
      {false && (
        <DelayLoading loading={false}>
          <Loading sx={{ marginTop: 30 }} />
        </DelayLoading>
      )}

      <ContainerWrapper maxWidth={1200} sx={{ paddingTop: 40 }}>
        <Box sx={[{ display: 'flex', gap: 20, flexDirection: 'row' }]}>
          <ContentBoxStyle>
            <LeftDetailStyle>
              <Box display="grid" gap="15px">
                <Back
                  text="NFT Accounts"
                  sx={{
                    margin: '0 !important',
                    fontWeight: 500,
                    lineHeight: '20px'
                  }}
                />
                <TitleStyle>{`$0.0123`}</TitleStyle>
              </Box>
              <ButtonsStyle>
                <AccountButton>
                  <ETHIcon />
                  <Typography>{account ? shortenAddress(account) : '--'}</Typography>
                  <Copy toCopy={'value'} />
                </AccountButton>

                <OutlineButton onClick={() => showModal(<RecieveAssetsModal />)}>
                  <ReceiveIcon />
                  Receive
                </OutlineButton>
                <SendButton />
                <Button style={{ width: '120px', color: '#FFF', fontWeight: '500' }}>Connect Dapp</Button>
              </ButtonsStyle>

              <WarningStyle>
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
              {TabsList[tabValue] === TAB.Assets && <Assets />}
              {TabsList[tabValue] === TAB.NFTs && <Nfts chainId={Number(chainId)} />}
              {TabsList[tabValue] === TAB.History && <History />}
            </LeftDetailStyle>
          </ContentBoxStyle>
          <ContentBoxStyle maxWidth={580}>
            <RightDetailStyle>
              <Box display={'grid'} gap={'8px'} minHeight={57}>
                {TabsList[tabValue] !== TAB.History && (
                  <>
                    <Typography
                      sx={{
                        color: 'var(--tile-grey, #80829F)',
                        lineHeight: '20px'
                      }}
                    >
                      Collection name asdo
                    </Typography>
                    <TitleStyle fontSize={'24px !important'} noWrap>
                      {NftInfoData?.name || '--'} #{tokenId}
                    </TitleStyle>
                  </>
                )}
              </Box>

              <Box
                sx={{
                  height: 500,
                  width: 500,
                  borderRadius: '10px',
                  background: 'rgb(236 236 236)'
                }}
              >
                <Image
                  style={{
                    height: 500,
                    width: 500,
                    borderRadius: '10px',
                    objectFit: 'cover',
                    zIndex: 0
                  }}
                  src={placeholderImage}
                />
              </Box>
              <Typography
                sx={{
                  color: 'var(--tile-grey, #80829F)',
                  lineHeight: '20px'
                }}
              >
                Developers around the world are tired of working and contributing their time and effort to enrich the
                top 1%. Join the movement that is community owned, building the future from the bottom up.
              </Typography>
              <ButtonsStyle justifyContent={'end'}>
                <OutlineButton sx={{ padding: '10px 20px', gap: 5 }}>
                  <OpenSeaIcon />
                  View on Opensea
                </OutlineButton>
                <OutlineButton sx={{ padding: '11px', gap: 5 }}>
                  <TransferIcon />
                  Transfer
                </OutlineButton>
              </ButtonsStyle>
            </RightDetailStyle>
          </ContentBoxStyle>
        </Box>
      </ContainerWrapper>
    </>
  )
}

function SendButton() {
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
            style={{
              zIndex: 99999
            }}
          >
            <Box
              sx={{
                width: '150px',
                borderRadius: '8px',
                border: '1px solid var(--line, #D4D7E2)',
                background: '#FFF',
                marginTop: '8px',
                padding: '9px 0'
              }}
              ref={childRef}
              onClick={() => setAnchorEl(null)}
            >
              <SelectOptionStyle onClick={() => showModal(<SendTokenModal />)}>Fungible Token</SelectOptionStyle>
              <SelectOptionStyle onClick={() => showModal(<SendNftModal />)}>NFT</SelectOptionStyle>
            </Box>
          </Popper>
        </>
      </ClickAwayListener>
    </div>
  )
}
