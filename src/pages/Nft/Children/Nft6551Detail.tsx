import { Box, Tab, Tabs, Typography, styled, useTheme } from '@mui/material'
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
import { useActiveWeb3React } from 'hooks'
import { shortenAddress } from 'utils'
import Button, { BlackButton } from 'components/Button/Button'
import { useState } from 'react'
import { Assets } from './Tabs/Assets'
import { Nfts } from './Tabs/Nfts'
import { History } from './Tabs/History'
import { Tokens } from 'pages/Nft/Tokens'

const ContentBoxStyle = styled(Box)(({ maxWidth }: { maxWidth?: number }) => ({
  minHeight: 800,
  marginBottom: 40,
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
  width: '100%'
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
  gap: 10
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
  height: 60,
  borderBottom: '1px solid #D4D7E2',

  '&>*': {
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    color: '#0049c6',
    cursor: 'pointer',
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
    height: '60px',
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

enum TAB {
  Assets = 'Assets',
  NFTs = 'NFTs',
  History = 'History'
}

const TabsList = [TAB.Assets, TAB.NFTs, TAB.History]

export function Nft6551Detail() {
  const theme = useTheme()
  const { nftAddress, chainId } = useParams<{ nftAddress: string; chainId: string }>()
  console.log(nftAddress, chainId)
  const { account } = useActiveWeb3React()
  const [tabValue, setTabValue] = useState<number>(0)
  console.log(tabValue)

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
              <Back
                text="NFT Accounts"
                sx={{
                  margin: '0 !important',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}
              />
              <TitleStyle>{`$0.0123`}</TitleStyle>
              <ButtonsStyle>
                <AccountButton>
                  <ETHIcon />
                  <Typography>{account ? shortenAddress(account) : '--'}</Typography>
                  <Copy toCopy={'value'} />
                </AccountButton>

                <OutlineButton>
                  <ReceiveIcon />
                  Receive
                </OutlineButton>

                <OutlineButton>
                  <SendIcon />
                  <Box display={'flex'} gap={'10px'} alignItems={'center'}>
                    Send
                    <ArrowIcon />
                  </Box>
                </OutlineButton>

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
              {TabsList[tabValue] === TAB.NFTs && <Nfts />}
              {TabsList[tabValue] === TAB.History && <History />}
            </LeftDetailStyle>
          </ContentBoxStyle>
          <ContentBoxStyle maxWidth={580} maxHeight={800}>
            <RightDetailStyle>
              asdasdas
              <Tokens Symbol="USDT" />
            </RightDetailStyle>
          </ContentBoxStyle>
        </Box>
      </ContainerWrapper>
    </>
  )
}
