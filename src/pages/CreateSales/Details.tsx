import { Box, Card, Stack, Link, styled, Typography } from '@mui/material'
import Back from 'components/Back'
import theme from 'theme'
import Input from 'components/Input'
import NumericalInput from 'components/Input/InputNumerical'
import { BlackButton } from 'components/Button/Button'
import { useCallback, useEffect, useMemo, useState } from 'react'
import TransactionList from './TransactionList'
import metamaskIcon from 'assets/walletIcon/metamask.png'
import coinmarcketcapIcon from 'assets/images/cap.png'
import coingeckoIcon from 'assets/images/coingecko.png'
import { useParams } from 'react-router-dom'
import ReactHtmlParser from 'react-html-parser'
import { currentTimeStamp, getEtherscanLink, getAllTargetTimeString } from 'utils'
import {
  PublicSaleListBaseProp,
  usePublicSaleBaseList,
  usePublicSaleTransactionList
} from 'hooks/useBackedPublicSaleServer'
import { useCurrencyBalance, useNativeAndToken } from 'state/wallet/hooks'
import { escapeAttrValue } from 'xss'
import {
  SwapStatus,
  useCancelSaleCallback,
  useGetSalesInfo,
  useGetSoldAmount,
  usePurchaseCallback
} from 'hooks/useCreatePublicSaleCallback'
import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { BigNumber } from 'bignumber.js'
import useModal from 'hooks/useModal'
import { TokenAmount } from 'constants/token'
import JSBI from 'jsbi'
import { timeStampToFormat, titleCase } from 'utils/dao'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { tryParseAmount } from 'utils/parseAmount'
import { PUBLICSALE_ADDRESS } from '../../constants'
import { ChainId } from 'constants/chain'
import { getIsWhiteList, getTokenPrices } from 'utils/fetch/server'
import isZero from 'utils/isZero'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { addTokenToWallet } from 'utils/addTokenToWallet'
import Image from 'components/Image'
import { ReactComponent as ETHERSCAN } from 'assets/svg/etherscan.svg'
import CircularStatic from 'pages/Activity/CircularStatic'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'

enum Tabs {
  ABOUT,
  TRASACTION
}

export const SwapStatusText = {
  [SwapStatus.SOON]: 'soon',
  [SwapStatus.OPEN]: 'normal',
  [SwapStatus.ENDED]: 'ended',
  [SwapStatus.CANCEL]: 'cancel'
}

const tabs = [
  { name: 'About', value: Tabs.ABOUT },
  { name: 'Transactions', value: Tabs.TRASACTION }
]

const RowSentence = styled('p')(({}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row'
}))

const CardWrapper = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.bgColor.bg2}`,
  borderRadius: 10,
  padding: 10,
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
    alignItems: 'baseline',
    gap: 10,
    justifyContent: 'flex-start'
  },
  '& .iconList img, & .iconList svg': {
    width: '20px',
    height: '20px'
  },
  '& .iconList a:hover, & .iconList img:hover': {
    cursor: 'pointer'
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

export default function Details() {
  const { saleId } = useParams<{ saleId: string }>()
  const { account, chainId, library } = useActiveWeb3React()
  const [curTab, setCurTab] = useState(Tabs.ABOUT)
  const [salesAmount, setSalesAmount] = useState('')
  const [ratio, setRatio] = useState('')
  const [updateTime, setUpdateTime] = useState('')
  const purchaseCallback = usePurchaseCallback()
  const cancelSaleCallback = useCancelSaleCallback()
  const { showModal, hideModal } = useModal()
  const { result } = usePublicSaleBaseList(saleId)
  const SwapData: PublicSaleListBaseProp = result[0]
  const salesInfo = useGetSalesInfo(saleId || '', SwapData?.chainId)
  const SoldAmountData = useGetSoldAmount(saleId || '', account || '', SwapData?.chainId)
  const saleToken = useNativeAndToken(SwapData?.saleToken, SwapData?.chainId)
  const receiveToken = useNativeAndToken(SwapData?.receiveToken, SwapData?.chainId)
  const soldCurrencyAmount = useMemo(() => {
    if (!salesInfo || !saleToken) return
    return new TokenAmount(saleToken, JSBI.BigInt(salesInfo?.soldAmount || 0))
  }, [saleToken, salesInfo])
  const saleCurrencyAmount = tryParseAmount(salesInfo?.saleAmount, saleToken || undefined)
  const soldTokenAmountData = useMemo(() => {
    if (!saleToken || !SoldAmountData) return
    return new TokenAmount(saleToken, JSBI.BigInt(SoldAmountData?.amount))
  }, [SoldAmountData, saleToken])

  const [url, setUrl] = useState<any>([])
  const [isWhitelist, setIsWhiteList] = useState(false)

  useEffect(() => {
    let result: any = []
    ;(async () => {
      if (!saleId || !account) {
        setIsWhiteList(false)
        return
      }
      try {
        const res = await getIsWhiteList(account, Number(saleId))
        result = res?.data.data
        if (!result) {
          setIsWhiteList(false)
          return
        }
        setIsWhiteList(result?.isWhite)
      } catch (error) {
        setIsWhiteList(false)
        console.error(error)
      }
    })()
  }, [account, saleId])

  useEffect(() => {
    if (!saleToken || !receiveToken) return
    let result: any = []
    let ratio
    const tokens = (saleToken?.address || '') + ',' + (receiveToken?.address || '')
    ;(async () => {
      if (!SwapData?.chainId) {
        setRatio('')
        return
      }
      try {
        const res = await getTokenPrices(SwapData?.chainId, tokens)
        result = res?.data.data
        if (!result) {
          setRatio('')
          setUpdateTime('')
          return
        }
        ratio = new BigNumber(result[0]?.price).div(new BigNumber(result[1]?.price)).toFixed(6).toString()
        setUrl([result[0], result[1]])
        setUpdateTime(result[0]?.updateAt)
      } catch (error) {
        console.error(error)
      }
      setRatio(ratio ?? '')
    })()
  }, [SwapData?.chainId, receiveToken, saleToken])

  const progress = useMemo(() => {
    if (!salesInfo || !saleCurrencyAmount || !soldCurrencyAmount || !saleToken) return
    return new TokenAmount(saleToken, JSBI.BigInt(salesInfo?.soldAmount))
      .divide(new TokenAmount(saleToken, JSBI.BigInt(salesInfo?.saleAmount)))
      .multiply(JSBI.BigInt(100))
      .toSignificant(2)
  }, [saleCurrencyAmount, saleToken, salesInfo, soldCurrencyAmount])

  const { ListLoading, listRes, listPage } = usePublicSaleTransactionList(saleId || '')

  const totalAmount = useMemo(() => {
    if (!salesInfo || !saleToken || !receiveToken) return
    return new TokenAmount(saleToken, JSBI.BigInt(salesInfo.saleAmount))
  }, [receiveToken, saleToken, salesInfo])

  // const curPrice = useMemo(() => {
  //   if (!saleToken || !SwapData) return
  //   return new TokenAmount(saleToken, JSBI.BigInt(SwapData?.salePrice))
  // }, [SwapData, saleToken])
  const swapAmount = useMemo(() => {
    if (!salesAmount || !receiveToken || !salesInfo) return ''
    const value = new BigNumber(Number(salesAmount))
      .multipliedBy(new TokenAmount(receiveToken, JSBI.BigInt(salesInfo?.pricePer))?.toExact())
      .toFixed()
    return value.toString()
  }, [receiveToken, salesAmount, salesInfo])

  const isOneTimePurchase = useMemo(() => {
    if (!SwapData) return
    return new BigNumber(Number(SwapData?.limitMax)).isEqualTo(new BigNumber(Number(SwapData?.limitMin)))
  }, [SwapData])

  const buyTokenAmount = tryParseAmount(salesAmount, saleToken || undefined)

  const oneTimePurchaseTokenAmount = useMemo(() => {
    if (!saleToken || !salesInfo) return
    return new TokenAmount(saleToken, JSBI.BigInt(salesInfo?.limitMax))
  }, [saleToken, salesInfo])

  const oneTimePayPriceApproveValue = useMemo(() => {
    if (!SwapData || !oneTimePurchaseTokenAmount || !receiveToken || !salesInfo) return
    const _Percent = new BigNumber(oneTimePurchaseTokenAmount.toExact())
      .multipliedBy(new TokenAmount(receiveToken, JSBI.BigInt(salesInfo?.pricePer))?.toExact())
      .toFixed()
    return _Percent.toString()
  }, [SwapData, oneTimePurchaseTokenAmount, receiveToken, salesInfo])

  const canBuyMaxValue = useMemo(() => {
    if (!saleToken || !salesInfo) return
    return new TokenAmount(saleToken, JSBI.BigInt(salesInfo?.limitMax))
  }, [saleToken, salesInfo])

  const canBuyMinValue = useMemo(() => {
    if (!saleToken || !salesInfo) return
    return new TokenAmount(saleToken, JSBI.BigInt(salesInfo?.limitMin))
  }, [saleToken, salesInfo])

  const restCanBuyValue = useMemo(() => {
    if (!soldTokenAmountData || !saleToken || !canBuyMaxValue) return
    const amount = canBuyMaxValue?.subtract(soldTokenAmountData)
    return tryParseAmount(amount?.toSignificant() || undefined, saleToken || undefined)
  }, [canBuyMaxValue, saleToken, soldTokenAmountData])

  const oneTimePurchaseApproveTokenAmount = tryParseAmount(swapAmount, receiveToken || undefined)
  const oneTimePriceCurrencyAmount = tryParseAmount(oneTimePayPriceApproveValue, receiveToken || undefined)

  const isReceiveTokenEth = useMemo(() => isZero(receiveToken?.address || ''), [receiveToken])
  // const isSaleTokenEth = useMemo(() => isZero(saleToken?.address || ''), [saleToken])

  const handlePay = useCallback(() => {
    if (!account || !saleId) return
    showModal(<TransacitonPendingModal />)

    purchaseCallback(
      account,
      isOneTimePurchase ? oneTimePurchaseTokenAmount?.raw.toString() || '' : buyTokenAmount?.raw.toString() || '',
      Number(saleId),
      isReceiveTokenEth,
      isOneTimePurchase ? oneTimePriceCurrencyAmount?.raw.toString() : oneTimePurchaseApproveTokenAmount?.raw.toString()
    )
      .then(hash => {
        hideModal()
        showModal(<TransactiontionSubmittedModal hash={hash} />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">
            {err?.reason || err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [
    account,
    buyTokenAmount?.raw,
    hideModal,
    isOneTimePurchase,
    isReceiveTokenEth,
    oneTimePriceCurrencyAmount?.raw,
    oneTimePurchaseApproveTokenAmount?.raw,
    oneTimePurchaseTokenAmount?.raw,
    purchaseCallback,
    saleId,
    showModal
  ])
  const handleCancel = useCallback(() => {
    if (!saleId) return
    showModal(<TransacitonPendingModal />)
    cancelSaleCallback(saleId)
      .then(hash => {
        hideModal()
        showModal(<TransactiontionSubmittedModal hash={hash} />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">
            {err?.reason || err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [cancelSaleCallback, hideModal, saleId, showModal])

  const closeTimeLeft = useMemo(() => {
    if (!SwapData || !salesInfo) return
    const now = currentTimeStamp()
    let targetTimeString = ''
    if (SwapData.status === SwapStatus.SOON) {
      targetTimeString = getAllTargetTimeString(now, Number(SwapData?.endTime))
    } else if (SwapData.status === SwapStatus.OPEN) {
      targetTimeString = getAllTargetTimeString(now, Number(SwapData?.endTime))
    } else {
      targetTimeString = timeStampToFormat(Number(SwapData?.endTime))
    }
    return targetTimeString
  }, [SwapData, salesInfo])

  const saleTokenBalance = useCurrencyBalance(account || undefined, receiveToken || undefined)

  const remainingBalance = useMemo(() => {
    if (!saleToken || !salesInfo || !receiveToken) return undefined
    const balance = new BigNumber(salesInfo.saleAmount).minus(new BigNumber(salesInfo?.soldAmount))
    return new TokenAmount(saleToken, balance.toString())
  }, [receiveToken, saleToken, salesInfo])

  const canPayAmount = useMemo(() => {
    if (!saleToken || !receiveToken || !salesInfo) return
    return new TokenAmount(saleToken, JSBI.BigInt(salesInfo?.saleAmount)).subtract(
      new TokenAmount(saleToken, JSBI.BigInt(salesInfo?.soldAmount))
    )
  }, [receiveToken, saleToken, salesInfo])

  const isCreator = useMemo(() => {
    if (!salesInfo || !account) return
    return parseInt(salesInfo?.creator, 16) === parseInt(account, 16)
  }, [account, salesInfo])

  const statusText = useMemo(() => {
    if (!SwapData) return
    return SwapData?.status === 'normal' ? titleCase('active') : titleCase(SwapData?.status ?? '')
  }, [SwapData])

  const [approveState, approveCallback] = useApproveCallback(
    oneTimePurchaseApproveTokenAmount,
    SwapData?.chainId ? PUBLICSALE_ADDRESS[SwapData?.chainId as ChainId] : undefined,
    isReceiveTokenEth
  )
  const [approveState1, approveCallback1] = useApproveCallback(
    oneTimePriceCurrencyAmount,
    SwapData?.chainId ? PUBLICSALE_ADDRESS[SwapData?.chainId as ChainId] : undefined
  )
  const { claimSubmitted: isClaiming } = useUserHasSubmittedClaim(`${account}_purchase_swap_${saleId}`)
  const { claimSubmitted: isClaimingBalance } = useUserHasSubmittedClaim(`${account}_claim_balance_${saleId}`)

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
          <Typography mt={30}>{SwapData?.title || ''}</Typography>
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
              <Image
                style={{
                  maxWidth: '80px',
                  maxHeight: '80px',
                  marginRight: 10
                }}
                src={SwapData?.receiveTokenImg || 'https://devapiv2.myclique.io/static/1665558531929085683.png'}
                alt=""
              />
              <div>
                <p>{receiveToken?.symbol}</p>
                <div className="iconList">
                  {receiveToken && isZero(receiveToken?.address) ? (
                    ''
                  ) : (
                    <Link
                      href={
                        receiveToken && SwapData?.chainId && !isZero(receiveToken?.address)
                          ? getEtherscanLink(SwapData?.chainId, receiveToken?.address, 'address')
                          : undefined
                      }
                      target="_blank"
                    >
                      <ETHERSCAN />
                    </Link>
                  )}

                  <Image
                    width={20}
                    onClick={() => {
                      window.open(url[1]?.urlCoingecko, '_blank')
                    }}
                    src={coingeckoIcon}
                    alt=""
                  />
                  <Image
                    width={20}
                    onClick={() => {
                      window.open(url[1]?.urlCoinmarketcap, '_blank')
                    }}
                    src={coinmarcketcapIcon}
                    alt=""
                  />
                  {receiveToken && isZero(receiveToken?.address) ? (
                    ''
                  ) : (
                    <Image
                      width={20}
                      onClick={() => {
                        receiveToken &&
                          addTokenToWallet(receiveToken?.address, receiveToken?.symbol || '', receiveToken?.decimals)
                      }}
                      src={metamaskIcon}
                      alt=""
                    />
                  )}
                </div>
              </div>
            </CardWrapper>
            <p>&gt;&gt;</p>
            <CardWrapper>
              <Image
                style={{
                  maxWidth: '80px',
                  maxHeight: '80px',
                  marginRight: 10
                }}
                src={SwapData?.saleTokenImg || 'https://devapiv2.myclique.io/static/1665558531929085683.png'}
                alt=""
              />
              <div>
                <p>{saleToken?.symbol}</p>
                <div className="iconList">
                  <Link
                    href={
                      saleToken && SwapData?.chainId
                        ? getEtherscanLink(SwapData?.chainId, saleToken?.address, 'address')
                        : undefined
                    }
                    target="_blank"
                  >
                    <ETHERSCAN />
                  </Link>
                  <Image onClick={() => window.open(url[0]?.urlCoingecko, '_blank')} src={coingeckoIcon} alt="" />
                  <Image
                    onClick={() => window.open(url[0]?.urlCoinmarketcap, '_blank')}
                    src={coinmarcketcapIcon}
                    alt=""
                  />
                  <Image
                    onClick={() =>
                      saleToken && addTokenToWallet(saleToken?.address, saleToken?.symbol || '', saleToken?.decimals)
                    }
                    src={metamaskIcon}
                    alt=""
                  />
                </div>
              </div>
            </CardWrapper>
          </Stack>
          <Stack display={'grid'} gridTemplateColumns="1fr 1fr">
            <ColSentence>
              <p>Current price (Updated at {timeStampToFormat(Number(updateTime))})</p>
              <p>
                1 {saleToken?.symbol} = {ratio} {receiveToken?.symbol}
              </p>
            </ColSentence>
            <ColSentence>
              <p>Sale price</p>
              <p>
                1 {saleToken?.symbol} ={' '}
                {salesInfo &&
                  receiveToken &&
                  new TokenAmount(receiveToken, JSBI.BigInt(salesInfo?.pricePer))?.toSignificant()}{' '}
                {receiveToken?.symbol}
              </p>
            </ColSentence>
          </Stack>
          <Stack display={'grid'} gridTemplateColumns="1fr 1fr">
            <ColSentence>
              <p>Funding target</p>
              <p>
                {totalAmount?.toSignificant(6, { groupSeparator: ',' })} {saleToken?.symbol}
              </p>
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
                {/* <span>{Number(progress) ? Number(progress) : 0}%</span> */}
                {/* <CircularProgress
                  sx={{ marginLeft: 10, '& .css-oxts8u-MuiCircularProgress-circle': { fill: '#c9cdd4' } }}
                  variant="determinate"
                  value={Number(progress) ? Number(progress) : 0}
                /> */}
                <CircularStatic
                  value={Number(progress) ? Number(progress) : 0}
                  borderValue={5}
                  style={{ width: '60px', height: '60px' }}
                />
              </p>
            </ColSentence>
          </Stack>
          <Stack display={'grid'} gridTemplateColumns="1fr 1fr">
            <ColSentence>
              <p>Status</p>
              <p
                style={{
                  color: SwapData?.status.includes(SwapStatus.ENDED || SwapData?.status === SwapStatus.CANCEL)
                    ? '#000'
                    : SwapData?.status.includes(SwapStatus.SOON)
                    ? '#00a0ff'
                    : SwapData?.status.includes(SwapStatus.OPEN)
                    ? '#0a9700'
                    : '#000'
                }}
              >
                {statusText}
              </p>
            </ColSentence>
            <ColSentence>
              <p>Close at</p>
              <p>{closeTimeLeft}</p>
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
            <Stack
              spacing={10}
              sx={{
                maxWidth: 800,
                width: '100%',
                '& img': {
                  width: '100%',
                  overflow: 'hidden'
                }
              }}
            >
              {ReactHtmlParser(
                filterXSS(SwapData?.about || '', {
                  onIgnoreTagAttr: function (_, name, value) {
                    if (name === 'class' || name === 'style') {
                      return name + '="' + escapeAttrValue(value) + '"'
                    }
                    return undefined
                  }
                })
              )}
            </Stack>
          ) : (
            <TransactionList loading={ListLoading} page={listPage} result0={listRes} saleId={saleId || ''} />
          )}
        </Stack>
        <Stack className="right_content">
          {!isCreator ? (
            !isOneTimePurchase ? (
              <Stack
                mb={50}
                sx={{
                  fontSize: 12,
                  borderRadius: '24px',
                  boxShadow: 'rgb(174 174 174 / 20%) 0px 0px 5px',
                  padding: '32px',
                  '& .MuiBox-root .css-9m85nc': {
                    display: 'flex',
                    gap: 10,
                    flexDirection: 'row-reverse'
                  },
                  '& .MuiBox-root .css-9m85nc button': {
                    width: '50px'
                  }
                }}
              >
                <RowSentence>
                  <span>Sale type</span>
                  <span>Purchase limit</span>
                </RowSentence>
                <RowSentence>
                  <span>Sale time</span>
                  <span>{timeStampToFormat(Number(SwapData?.startTime || ''))}</span>
                </RowSentence>
                <RowSentence>
                  <span>Price</span>
                  <span>
                    1 {saleToken?.symbol} ={' '}
                    {salesInfo &&
                      receiveToken &&
                      new TokenAmount(receiveToken, JSBI.BigInt(salesInfo?.pricePer))?.toSignificant()}{' '}
                    {receiveToken?.symbol}
                  </span>
                </RowSentence>
                <RowSentence>
                  <span>Est.discount</span>
                  <span>
                    {new BigNumber(SwapData?.originalDiscount)
                      .multipliedBy(new BigNumber(100))
                      .isGreaterThanOrEqualTo(0.01)
                      ? new BigNumber(SwapData?.originalDiscount).multipliedBy(new BigNumber(100)).toFixed(2)
                      : '< 0.01'}
                    %
                  </span>
                </RowSentence>
                <RowSentence>
                  <span>Sold</span>
                  <span>
                    {soldCurrencyAmount?.toSignificant(6, { groupSeparator: ',' }) ?? '0'} {saleToken?.symbol}
                  </span>
                </RowSentence>
                <NumericalInput
                  value={salesAmount}
                  autoFocus
                  onMax={() => {
                    if (restCanBuyValue) {
                      setSalesAmount(restCanBuyValue?.toSignificant())
                    }
                  }}
                  errSet={() => {}}
                  onChange={e => setSalesAmount(e.target.value)}
                  onBlur={e => {
                    let inputValue = e.target.value
                    const inputValueTokenAmount = tryParseAmount(inputValue, saleToken || undefined)
                    if (
                      new BigNumber(inputValue).isGreaterThanOrEqualTo(
                        new BigNumber(canBuyMinValue?.toSignificant() || '')
                      ) &&
                      new BigNumber(inputValue).isLessThanOrEqualTo(
                        new BigNumber(canBuyMaxValue?.toSignificant() || '')
                      )
                    ) {
                      setSalesAmount(inputValueTokenAmount?.toSignificant().toString() || '')
                      return
                    } else {
                      if (inputValueTokenAmount?.lessThan(canBuyMinValue || '')) {
                        inputValue = canBuyMinValue?.toSignificant() || ''.toString()
                        setSalesAmount(inputValue)
                        return
                      }
                      if (inputValueTokenAmount?.greaterThan(canBuyMaxValue || '')) {
                        inputValue = canBuyMaxValue?.toSignificant() || ''.toString()
                        setSalesAmount(inputValue)
                        return
                      }
                    }
                  }}
                  placeholder=""
                  label="Get"
                  endAdornment={<>{`${saleToken?.symbol}`}</>}
                  rightLabel={`min: ${canBuyMinValue?.toSignificant(6)} ${
                    saleToken?.symbol
                  } max: ${canBuyMaxValue?.toSignificant(6)} ${saleToken?.symbol}`}
                  type="pay"
                />
                <NumericalInput
                  readOnly
                  value={swapAmount}
                  errSet={() => {}}
                  onChange={() => {}}
                  placeholder=""
                  label="Swap"
                  endAdornment={<>{`${receiveToken?.symbol}`}</>}
                  rightLabel={`Balance: ${saleTokenBalance?.toSignificant(6, { groupSeparator: ',' }) || ''} ${
                    receiveToken?.symbol
                  }`}
                  type="swap"
                />
                {/* <RowSentence>
                  <span>Claimable balance:</span>
                  <span>
                    {claimableBalance?.toSignificant(6, { groupSeparator: ',' }) ?? '-'}
                    {saleToken?.symbol}
                  </span>
                </RowSentence> */}
                <Typography color={theme.palette.text.secondary} fontWeight={500} lineHeight={1.5} variant="inherit">
                  *You should do your own research and understand the risks before committing your funds.
                </Typography>
                <Stack
                  display="grid"
                  gridTemplateRows="1fr 1fr"
                  alignItems={'center'}
                  justifyContent={'center'}
                  pt={30}
                >
                  {SwapData?.status === SwapStatus.ENDED ? (
                    <BlackButton disabled width="252px">
                      Sale ended
                    </BlackButton>
                  ) : SwapData?.status === SwapStatus.CANCEL ? (
                    <BlackButton disabled width="252px">
                      Sale cancelled
                    </BlackButton>
                  ) : chainId !== SwapData?.chainId ? (
                    <BlackButton
                      width="252px"
                      onClick={() => triggerSwitchChain(library, SwapData?.chainId, account || '')}
                    >
                      Switch network
                    </BlackButton>
                  ) : (
                    <BlackButton
                      width="252px"
                      disabled={
                        !isWhitelist ||
                        SwapData?.status === SwapStatus.SOON ||
                        isClaiming ||
                        approveState === ApprovalState.PENDING ||
                        !salesAmount ||
                        !saleTokenBalance?.toSignificant(6) ||
                        new BigNumber(Number(SoldAmountData?.amount)).isGreaterThan(
                          new BigNumber(Number(salesInfo?.limitMax))
                        ) ||
                        new BigNumber(salesAmount).isGreaterThan(
                          new BigNumber(saleTokenBalance?.toSignificant(6) || '')
                        ) ||
                        new BigNumber(salesAmount).isGreaterThan(new BigNumber(canPayAmount?.toSignificant(6) || '')) ||
                        new BigNumber(Number(soldTokenAmountData?.toSignificant())).isEqualTo(
                          new BigNumber(Number(canBuyMaxValue?.toSignificant()))
                        )
                      }
                      onClick={approveState === ApprovalState.NOT_APPROVED ? approveCallback : handlePay}
                    >
                      {!isWhitelist
                        ? 'You are not in the whitelist'
                        : SwapData?.status === SwapStatus.SOON
                        ? 'Sale time has no started'
                        : saleTokenBalance?.lessThan('0') || saleTokenBalance?.equalTo('0')
                        ? 'Insufficient balance'
                        : new BigNumber(Number(soldTokenAmountData?.toSignificant())).isEqualTo(
                            new BigNumber(Number(canBuyMaxValue?.toSignificant()))
                          )
                        ? 'Purchased'
                        : approveState === ApprovalState.PENDING
                        ? 'Approving'
                        : approveState === ApprovalState.NOT_APPROVED
                        ? 'Approve'
                        : 'Pay'}
                    </BlackButton>
                  )}
                </Stack>
              </Stack>
            ) : (
              <Stack
                mb={50}
                sx={{
                  fontSize: 12,
                  borderRadius: '24px',
                  boxShadow: 'rgb(174 174 174 / 20%) 0px 0px 5px',
                  padding: '32px'
                }}
              >
                <RowSentence>
                  <span>Sale type</span>
                  <span>One-time purchase</span>
                </RowSentence>
                <RowSentence>
                  <span>Sale time</span>
                  <span>{timeStampToFormat(Number(SwapData?.startTime || ''))}</span>
                </RowSentence>
                <RowSentence>
                  <span>Price</span>
                  <span>
                    1 {saleToken?.symbol} ={' '}
                    {salesInfo &&
                      receiveToken &&
                      new TokenAmount(receiveToken, JSBI.BigInt(salesInfo?.pricePer))?.toSignificant()}{' '}
                    {receiveToken?.symbol}
                  </span>
                </RowSentence>
                <RowSentence>
                  <span>Discount</span>
                  <span>
                    {new BigNumber(SwapData?.originalDiscount).multipliedBy(100).isGreaterThanOrEqualTo(0.01)
                      ? Number(new BigNumber(SwapData?.originalDiscount).multipliedBy(100)).toFixed(2)
                      : '< 0.01'}
                    %
                  </span>
                </RowSentence>
                <RowSentence>
                  <span>Sold</span>
                  <span>
                    {soldCurrencyAmount?.toSignificant(6, { groupSeparator: ',' }) ?? '0'} {saleToken?.symbol}
                  </span>
                </RowSentence>
                <RowSentence>
                  <span></span>
                  <Input
                    readOnly
                    value={oneTimePurchaseTokenAmount?.toSignificant() ?? ''}
                    errSet={() => {}}
                    onChange={e => setSalesAmount(e.target.value || '')}
                    placeholder=""
                    label="Get"
                    endAdornment={`${saleToken?.symbol}`}
                    rightLabel={``}
                    type="get"
                  />
                </RowSentence>
                <RowSentence>
                  <span></span>
                  <Input
                    readOnly
                    value={oneTimePayPriceApproveValue ?? ''}
                    errSet={() => {}}
                    onChange={() => {}}
                    placeholder=""
                    label="Pay"
                    endAdornment={`${receiveToken?.symbol}`}
                    rightLabel={`Balance: ${saleTokenBalance?.toSignificant(6, { groupSeparator: ',' }) || ''} ${
                      receiveToken?.symbol
                    }`}
                    type="pay"
                  />
                </RowSentence>
                <Stack
                  display="grid"
                  gridTemplateRows="1fr 1fr"
                  alignItems={'center'}
                  justifyContent={'center'}
                  pt={30}
                >
                  {SwapData?.status === SwapStatus.ENDED ? (
                    <BlackButton disabled width="252px">
                      Sale ended
                    </BlackButton>
                  ) : SwapData?.status === SwapStatus.CANCEL ? (
                    <BlackButton disabled width="252px">
                      Sale cancelled
                    </BlackButton>
                  ) : chainId !== SwapData?.chainId ? (
                    <BlackButton
                      width="252px"
                      onClick={() => triggerSwitchChain(library, SwapData?.chainId, account || '')}
                    >
                      Switch network
                    </BlackButton>
                  ) : (
                    <BlackButton
                      width="252px"
                      disabled={
                        !isWhitelist ||
                        SwapData?.status === SwapStatus.SOON ||
                        isClaiming ||
                        approveState1 === ApprovalState.PENDING ||
                        new BigNumber(Number(SoldAmountData?.amount)).isGreaterThan(0) ||
                        new BigNumber(Number(saleTokenBalance?.toSignificant(6))).isLessThan('0') ||
                        new BigNumber(Number(oneTimePayPriceApproveValue))?.isGreaterThan(
                          new BigNumber(Number(saleTokenBalance?.toExact() || ''))
                        )
                      }
                      onClick={approveState1 === ApprovalState.NOT_APPROVED ? approveCallback1 : handlePay}
                    >
                      {!isWhitelist
                        ? 'You are not in the whitelist'
                        : SwapData?.status === SwapStatus.SOON
                        ? 'Sale time has no started'
                        : new BigNumber(Number(oneTimePayPriceApproveValue))?.isGreaterThan(
                            new BigNumber(Number(saleTokenBalance?.toExact() || ''))
                          )
                        ? 'Insufficient balance'
                        : new BigNumber(Number(soldTokenAmountData?.toSignificant(6))).isGreaterThan(0)
                        ? 'Purchased'
                        : approveState1 === ApprovalState.PENDING
                        ? 'Approving'
                        : approveState1 === ApprovalState.NOT_APPROVED
                        ? 'Approve'
                        : 'Pay'}
                    </BlackButton>
                  )}
                </Stack>
                {/* <RowSentence>
                  <span>Claimable balance:</span>
                  <span>
                    {claimableBalance?.toSignificant(6, { groupSeparator: ',' }) ?? '-'}
                    {saleToken?.symbol}
                  </span>
                </RowSentence> */}
              </Stack>
            )
          ) : (
            ''
          )}
          {isCreator ? (
            <Stack
              sx={{
                fontSize: 12,
                padding: 16,
                border: `1px solid ${theme.bgColor.bg2}`,
                boxShadow: `inset 0px -1px 0px ${theme.bgColor.bg2}`
              }}
            >
              <RowSentence>
                <span>Balance</span>
                <span>
                  {remainingBalance?.toSignificant(6, { groupSeperator: ',' }).toString() ?? '-'} {saleToken?.symbol}
                </span>
              </RowSentence>
              <Stack display="grid" gridTemplateRows="1fr 1fr" alignItems={'center'} justifyContent={'center'} pt={30}>
                <BlackButton
                  width="252px"
                  disabled={salesInfo?.isCancel || SwapData?.status === 'ended' || isClaimingBalance}
                  onClick={handleCancel}
                >
                  {SwapData?.status === 'cancel'
                    ? 'Sale cancelled'
                    : SwapData?.status === 'ended'
                    ? 'Sale ended'
                    : 'Cancel event'}
                </BlackButton>
              </Stack>
            </Stack>
          ) : (
            ''
          )}
        </Stack>
      </Stack>
    </Box>
  )
}
