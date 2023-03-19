import { Box, Card, CircularProgress, Stack, styled, Typography } from '@mui/material'
import Back from 'components/Back'
import theme from 'theme'
import Input from 'components/Input'
import { BlackButton } from 'components/Button/Button'
import { useCallback, useState } from 'react'
import TransactionList from './TransactionList'
import icon from 'assets/images/placeholder.png'
import { useParams } from 'react-router-dom'
import ReactHtmlParser from 'react-html-parser'
import {
  PublicSaleListBaseProp,
  usePublicSaleBaseList,
  usePublicSaleTransactionList
} from 'hooks/useBackedPublicSaleServer'
import { useToken } from 'state/wallet/hooks'
import { escapeAttrValue } from 'xss'
import { useCancelSaleCallback } from 'hooks/useCreatePublicSaleCallback'
import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from 'hooks/useModal'

enum Tabs {
  ABOUT,
  TRASACTION
}

enum statusType {
  ACTIVE,
  CLOSED
}

const tabs = [
  { name: 'About', value: Tabs.ABOUT },
  { name: 'Transaction', value: Tabs.TRASACTION }
]

const RowSentence = styled('p')(({}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row'
}))

const CardWrapper = styled(Card)(({ theme }) => ({
  border: '1px solid',
  borderRadius: 10,
  padding: 10,
  borderColor: theme.bgColor.bg2,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  '& img': {
    width: 80
  },
  '& div': {
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column'
  },
  '& .iconList': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  '& .iconList img': {
    width: 30
  }
}))

const ColSentence = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  '& p': {
    fontSize: 16,
    color: '#000'
  },
  '& p:first-of-type': {
    fontSize: 12,
    color: '#808191'
  }
}))

const imgDataList = [icon, icon, icon, icon]

export default function Details() {
  const { saleId } = useParams<{ saleId: string }>()
  const [curTab, setCurTab] = useState(Tabs.ABOUT)
  const status = statusType.ACTIVE
  const cancelSaleCallback = useCancelSaleCallback()
  const { showModal, hideModal } = useModal()

  const { ListLoading, listRes, listPage } = usePublicSaleTransactionList(saleId)
  const { result } = usePublicSaleBaseList(saleId)
  const SwapData: PublicSaleListBaseProp = result[0]
  const saleToken = useToken(SwapData?.saleToken, SwapData?.chainId)
  const receiveToken = useToken(SwapData?.receiveToken, SwapData?.chainId)
  console.log(SwapData)
  const handlePay = useCallback(() => {}, [])
  const handleSale = useCallback(() => {}, [])
  const handleCancel = useCallback(() => {
    cancelSaleCallback(saleId)
      .then(hash => {
        hideModal()
        showModal(<TransactiontionSubmittedModal hash={hash} />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [cancelSaleCallback, hideModal, saleId, showModal])

  return (
    <Box
      sx={{
        maxWidth: 1140,
        width: '100%',
        margin: '30px auto 20px',
        textAlign: 'left',
        padding: { xs: '0 16px', sm: undefined }
      }}
    >
      <Back />
      <Stack display={'grid'} gridTemplateColumns="4fr 2fr" gap={10}>
        <Stack className="left_content">
          <Stack
            mb={20}
            mt={20}
            display={'grid'}
            gridTemplateColumns="250px 100px 250px"
            alignItems={'center'}
            textAlign={'center'}
            justifyContent={'flex-start'}
            gap={10}
          >
            <CardWrapper>
              <img src={SwapData?.saleTokenImg} alt="" />
              <div>
                <p>{saleToken?.symbol}</p>
                <div className="iconList">
                  {imgDataList.map((item, inx) => {
                    return <img key={inx} src={item} alt="" />
                  })}
                </div>
              </div>
            </CardWrapper>
            <p>&gt;&gt;</p>
            <CardWrapper>
              <img src={SwapData?.receiveTokenImg} alt="" />
              <div>
                <p>{receiveToken?.symbol}</p>
                <div className="iconList">
                  {imgDataList.map((item, inx) => {
                    return <img key={inx} src={item} alt="" />
                  })}
                </div>
              </div>
            </CardWrapper>
          </Stack>
          <Stack display={'grid'} gridTemplateColumns="1fr 1fr">
            <ColSentence>
              <p>Original price (create at xxx)</p>
              <p>
                1 {saleToken?.symbol} = {SwapData?.originalDiscount} {receiveToken?.symbol}
              </p>
            </ColSentence>
            <ColSentence>
              <p>Current price</p>
              <p>
                1 {saleToken?.symbol} = 13,000 {receiveToken?.symbol}
              </p>
            </ColSentence>
          </Stack>
          <Stack display={'grid'} gridTemplateColumns="1fr 1fr">
            <ColSentence>
              <p>Funding target</p>
              <p>10,000,000 RAI</p>
            </ColSentence>
            <ColSentence>
              <p>Sale progress</p>
              <p
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}
              >
                <span>40%</span>
                <CircularProgress sx={{ marginLeft: 10 }} variant="determinate" value={100} />
              </p>
            </ColSentence>
          </Stack>
          <Stack display={'grid'} gridTemplateColumns="1fr 1fr">
            <ColSentence>
              <p>Status</p>
              <p style={{ color: status === statusType.ACTIVE ? '#00ff43' : '#b2b3bd' }}>Active</p>
            </ColSentence>
            <ColSentence>
              <p>Close at</p>
              <p>in 2 days</p>
            </ColSentence>
          </Stack>
          <Stack display={'flex'} flexDirection={'row'} mt={30}>
            {tabs.map(({ value, name }) => (
              <Box
                sx={{
                  width: 'fit-content',
                  paddingBottom: 8,
                  marginRight: 180,
                  cursor: 'pointer'
                }}
                key={value}
                className={`tab-item border-tab-item ${curTab === value ? 'active' : ''}`}
                onClick={() => setCurTab(value)}
              >
                {name}
              </Box>
            ))}
          </Stack>
          {curTab === Tabs.ABOUT ? (
            <Stack spacing={10}>
              {ReactHtmlParser(
                filterXSS(SwapData?.about || '', {
                  onIgnoreTagAttr: function(_, name, value) {
                    if (name === 'class') {
                      return name + '="' + escapeAttrValue(value) + '"'
                    }
                    return undefined
                  }
                })
              )}
            </Stack>
          ) : (
            <TransactionList loading={ListLoading} page={listPage} result={listRes} />
          )}
        </Stack>
        <Stack className="right_content">
          <Stack
            mb={50}
            sx={{
              padding: 16,
              fontSize: 12,
              border: `1px solid ${theme.bgColor.bg2}`,
              boxShadow: `inset 0px -1px 0px ${theme.bgColor.bg2}`
            }}
          >
            <RowSentence>
              <span>Sale type</span>
              <span>Purchase limit</span>
            </RowSentence>
            <RowSentence>
              <span>Price</span>
              <span>1 STPT = 13，000 RAI</span>
            </RowSentence>
            <RowSentence>
              <span>Est.discount</span>
              <span>-10%</span>
            </RowSentence>
            <Input
              readOnly
              value={''}
              errSet={() => {}}
              onChange={() => {}}
              placeholder=""
              label="Swap"
              endAdornment="10,000"
              rightLabel=""
              type="swap"
            />
            <Input
              readOnly
              value={''}
              errSet={() => {}}
              onChange={() => {}}
              placeholder=""
              label="Pay"
              endAdornment="10,000"
              rightLabel={`Balance: 20,000 ${saleToken?.symbol}`}
              type="pay"
            />
            <RowSentence>
              <span>Claimable balance</span>
              <span>10,000 RAI</span>
            </RowSentence>
            <Typography color={theme.palette.text.secondary} fontWeight={500} lineHeight={1.5} variant="inherit">
              *You should do your own research and understand the risks before committing your funds.
            </Typography>
            <Stack
              display="grid"
              gridTemplateRows="1fr 1fr"
              alignItems={'center'}
              justifyContent={'center'}
              spacing={10}
            >
              <BlackButton width="252px" onClick={handlePay}>
                Pay
              </BlackButton>
              <BlackButton width="252px" onClick={handleSale}>
                Sale ended
              </BlackButton>
            </Stack>
          </Stack>
          <Stack
            mb={50}
            sx={{
              fontSize: 12,
              padding: 16,
              border: `1px solid ${theme.bgColor.bg2}`,
              boxShadow: `inset 0px -1px 0px ${theme.bgColor.bg2}`
            }}
          >
            <RowSentence>
              <span>Sale type</span>
              <span>One-time purchase</span>
            </RowSentence>
            <RowSentence>
              <span>Price</span>
              <span>1 STPT = 13,000 RAI</span>
            </RowSentence>
            <RowSentence>
              <span>Discount</span>
              <span>-20%</span>
            </RowSentence>
            <RowSentence>
              <span>Saled</span>
              <span>10,000 RAI</span>
            </RowSentence>
            <RowSentence>
              <span>Pay</span>
              <span>300 STPT</span>
            </RowSentence>
            <BlackButton style={{ width: '252px', margin: '0 auto' }} onClick={handlePay}>
              Pay
            </BlackButton>
            <RowSentence>
              <span>Claimable balance:</span>
              <span>10,000 RAI</span>
            </RowSentence>
          </Stack>
          <Stack
            sx={{
              fontSize: 12,
              padding: 16,
              border: `1px solid ${theme.bgColor.bg2}`,
              boxShadow: `inset 0px -1px 0px ${theme.bgColor.bg2}`
            }}
          >
            <RowSentence>
              <span>Available balance</span>
              <span>1,000 RAI</span>
            </RowSentence>
            <RowSentence>
              <span>Available funds</span>
              <span>30,000 STPT</span>
            </RowSentence>
            <Stack
              display="grid"
              gridTemplateRows="1fr 1fr"
              alignItems={'center'}
              justifyContent={'center'}
              spacing={10}
            >
              <BlackButton width="252px" onClick={handlePay}>
                Claim all
              </BlackButton>
              <BlackButton width="252px" onClick={handleCancel}>
                Cancel event
              </BlackButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}
