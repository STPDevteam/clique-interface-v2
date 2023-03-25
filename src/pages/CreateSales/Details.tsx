import { Box, Card, CircularProgress, Stack, styled, Typography } from '@mui/material'
import Back from 'components/Back'
import theme from 'theme'
import Input from 'components/Input'
import NumericalInput from 'components/Input/InputNumerical'
import { BlackButton } from 'components/Button/Button'
import { useCallback, useEffect, useMemo, useState } from 'react'
import TransactionList from './TransactionList'
import icon from 'assets/images/placeholder.png'
import { useParams } from 'react-router-dom'
import ReactHtmlParser from 'react-html-parser'
import { currentTimeStamp, getTargetTimeString } from 'utils'
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
import { timeStampToFormat } from 'utils/dao'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { tryParseAmount } from 'utils/parseAmount'
import { PUBLICSALE_ADDRESS } from '../../constants'
import { ChainId } from 'constants/chain'
import { getTokenPrices } from 'utils/fetch/server'
import isZero from 'utils/isZero'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'

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
  const { account } = useActiveWeb3React()
  const [curTab, setCurTab] = useState(Tabs.ABOUT)
  const [salesAmount, setSalesAmount] = useState('')
  const [ratio, setRatio] = useState('')
  const purchaseCallback = usePurchaseCallback()
  const cancelSaleCallback = useCancelSaleCallback()
  const { showModal, hideModal } = useModal()
  const { result } = usePublicSaleBaseList(saleId)
  const SwapData: PublicSaleListBaseProp = result[0]
  const salesInfo = useGetSalesInfo(saleId, SwapData?.chainId)
  const SoldAmountData = useGetSoldAmount(saleId, account || '', SwapData?.chainId)
  const saleToken = useNativeAndToken(SwapData?.saleToken, SwapData?.chainId)
  const receiveToken = useNativeAndToken(SwapData?.receiveToken, SwapData?.chainId)
  const soldCurrencyAmount = useMemo(() => {
    if (!salesInfo || !receiveToken) return
    return new TokenAmount(receiveToken, JSBI.BigInt(salesInfo?.soldAmount || 0))
  }, [receiveToken, salesInfo])
  const saleCurrencyAmount = tryParseAmount(salesInfo?.saleAmount, saleToken || undefined)
  const soldTokenAmountData = useMemo(() => {
    if (!saleToken || !SoldAmountData) return
    return new TokenAmount(saleToken, JSBI.BigInt(SoldAmountData?.amount))
  }, [SoldAmountData, saleToken])

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
        result = res?.data
        const saleTokenData = result?.data[0]
        const receiveTokenData = result?.data[1]

        ratio = new BigNumber(saleTokenData?.price)
          .div(new BigNumber(receiveTokenData?.price))
          .toFixed(6, BigNumber.ROUND_FLOOR)
          .toString()
      } catch (error) {
        console.error(error)
      }

      setRatio(ratio ?? '')
    })()
  }, [SwapData?.chainId, receiveToken, saleToken])

  const progress = useMemo(() => {
    if (!salesInfo || !saleCurrencyAmount || !soldCurrencyAmount || !saleToken || !receiveToken) return
    return new TokenAmount(receiveToken, JSBI.BigInt(salesInfo?.soldAmount))
      .divide(new TokenAmount(saleToken, JSBI.BigInt(salesInfo?.saleAmount)))
      .multiply(JSBI.BigInt(100))
      .toSignificant(6)
  }, [receiveToken, saleCurrencyAmount, saleToken, salesInfo, soldCurrencyAmount])

  const { ListLoading, listRes, listPage } = usePublicSaleTransactionList(saleId)

  const totalAmount = useMemo(() => {
    if (!salesInfo || !saleToken || !receiveToken) return
    return new TokenAmount(saleToken, JSBI.BigInt(salesInfo.saleAmount))
  }, [receiveToken, saleToken, salesInfo])

  const curPrice = useMemo(() => {
    if (!saleToken || !SwapData) return
    return new TokenAmount(saleToken, JSBI.BigInt(SwapData?.salePrice))
  }, [SwapData, saleToken])
  const swapAmount = useMemo(() => {
    if (!salesAmount || !curPrice) return ''
    const value = Number(
      new BigNumber(Number(salesAmount)).multipliedBy(
        new BigNumber(Number(new BigNumber(1).multipliedBy(new BigNumber(curPrice.toSignificant(6)))))
      )
    )
    return value.toString()
  }, [curPrice, salesAmount])

  const isOneTimePurchase = useMemo(() => {
    if (!SwapData) return
    return new BigNumber(Number(SwapData?.limitMax)).isEqualTo(new BigNumber(Number(SwapData?.limitMin)))
  }, [SwapData])

  const buyTokenAmount = tryParseAmount(salesAmount, receiveToken || undefined)

  const payLimitMax = useMemo(() => {
    if (!receiveToken || !salesInfo) return
    return new TokenAmount(receiveToken, JSBI.BigInt(salesInfo?.limitMax))
  }, [receiveToken, salesInfo])

  const oneTimePurchaseTokenAmount = tryParseAmount(payLimitMax?.toSignificant(6), receiveToken || undefined)

  const oneTimePayPriceApproveValue = useMemo(() => {
    if (!SwapData || !oneTimePurchaseTokenAmount) return
    return Number(
      new BigNumber(oneTimePurchaseTokenAmount.toSignificant())
        .multipliedBy(new BigNumber(SwapData?.originalDiscount))
        .multipliedBy(100)
    ).toFixed()
  }, [SwapData, oneTimePurchaseTokenAmount])

  const canBuyMaxValue = useMemo(() => {
    if (!receiveToken || !salesInfo) return
    return new TokenAmount(receiveToken, JSBI.BigInt(salesInfo?.limitMax))
  }, [receiveToken, salesInfo])
  const canBuyMinValue = useMemo(() => {
    if (!receiveToken || !salesInfo) return
    return new TokenAmount(receiveToken, JSBI.BigInt(salesInfo?.limitMin))
  }, [receiveToken, salesInfo])

  const oneTimePurchaseApproveTokenAmount = tryParseAmount(swapAmount, saleToken || undefined)
  const oneTimePriceCurrencyAmount = tryParseAmount(oneTimePayPriceApproveValue, saleToken || undefined)

  const isEth = useMemo(() => isZero(receiveToken?.address || ''), [receiveToken])

  const handlePay = useCallback(() => {
    if (!account || !saleId) return
    showModal(<TransacitonPendingModal />)
    purchaseCallback(
      account,
      isOneTimePurchase ? oneTimePurchaseTokenAmount?.raw.toString() || '' : buyTokenAmount?.raw.toString() || '',
      Number(saleId),
      isEth
    )
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
  }, [
    account,
    buyTokenAmount?.raw,
    hideModal,
    isEth,
    isOneTimePurchase,
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
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
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
      targetTimeString = getTargetTimeString(Number(SwapData?.startTime), now)
    } else if (SwapData.status === SwapStatus.OPEN) {
      targetTimeString = getTargetTimeString(now, Number(SwapData?.endTime))
    } else if (SwapData.status === SwapStatus.CANCEL) {
      targetTimeString = 'canceled'
    } else {
      targetTimeString = getTargetTimeString(now, Number(SwapData?.endTime))
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

  const [approveState, approveCallback] = useApproveCallback(
    oneTimePurchaseApproveTokenAmount,
    SwapData?.chainId ? PUBLICSALE_ADDRESS[SwapData?.chainId as ChainId] : undefined,
    isEth
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
            <p>&gt;&gt;</p>
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
          </Stack>
          <Stack display={'grid'} gridTemplateColumns="1fr 1fr">
            <ColSentence>
              <p>Original price (create at {timeStampToFormat(Number(SwapData?.createTime))})</p>
              <p>
                1 {saleToken?.symbol} ={' '}
                {(ratio &&
                  SwapData &&
                  new BigNumber(ratio).multipliedBy(new BigNumber(SwapData?.originalDiscount)).toFixed(6)) ||
                  ''}{' '}
                {receiveToken?.symbol}
              </p>
            </ColSentence>
            <ColSentence>
              <p>Current price</p>
              <p>
                1 {saleToken?.symbol} = {ratio} {receiveToken?.symbol}
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
                <span>{Number(progress ? Number(progress) : 0)}%</span>
                <CircularProgress
                  sx={{ marginLeft: 10 }}
                  variant="determinate"
                  value={Number(progress) ? Number(progress) : 0}
                />
              </p>
            </ColSentence>
          </Stack>
          <Stack display={'grid'} gridTemplateColumns="1fr 1fr">
            <ColSentence>
              <p>Status</p>
              <p
                style={{
                  color: SwapData?.status === SwapStatus.SOON ? '#00a0ff' : SwapStatus.OPEN ? '#0a9700' : '#000'
                }}
              >
                {SwapData?.status}
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
            <TransactionList loading={ListLoading} page={listPage} result0={listRes} saleId={saleId} />
          )}
        </Stack>
        <Stack className="right_content">
          {!isCreator ? (
            !isOneTimePurchase ? (
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
                  <span>
                    1 {saleToken?.symbol} = {ratio}
                    {receiveToken?.symbol}
                  </span>
                </RowSentence>
                <RowSentence>
                  <span>Est.discount</span>
                  <span>{new BigNumber(SwapData?.originalDiscount).multipliedBy(new BigNumber(100)).toFixed(6)}%</span>
                </RowSentence>
                <RowSentence>
                  <span>Sold</span>
                  <span>
                    {soldCurrencyAmount?.toSignificant(6, { groupSeparator: ',' }) ?? '0'} {saleToken?.symbol}
                  </span>
                </RowSentence>
                <NumericalInput
                  value={salesAmount}
                  errSet={() => {}}
                  onChange={e => {
                    let inputValue = e.target.value
                    const inputValueTokenAmount = tryParseAmount(inputValue, saleToken || undefined)
                    if (
                      new BigNumber(inputValue).isGreaterThanOrEqualTo(
                        new BigNumber(canBuyMinValue?.toSignificant() || '')
                      ) ||
                      new BigNumber(inputValue).isLessThanOrEqualTo(
                        new BigNumber(canBuyMaxValue?.toSignificant() || '')
                      )
                    ) {
                      setSalesAmount(inputValueTokenAmount?.toSignificant(6).toString() || '')
                    } else {
                      if (inputValueTokenAmount?.greaterThan(JSBI.BigInt(canBuyMinValue || ''))) {
                        inputValue = new BigNumber(canBuyMinValue?.toSignificant() || '').toString()
                        setSalesAmount(inputValue)
                        return
                      }
                      if (inputValueTokenAmount?.lessThan(JSBI.BigInt(canBuyMaxValue || ''))) {
                        inputValue = new BigNumber(canBuyMaxValue?.toSignificant() || '').toString()
                        setSalesAmount(inputValue)
                        return
                      }
                      console.log(inputValue)
                      setSalesAmount(inputValue)
                    }
                  }}
                  placeholder=""
                  label="Buy"
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
                  {SwapData?.status === SwapStatus.ENDED || SwapData?.status === SwapStatus.CANCEL ? (
                    <BlackButton disabled width="252px">
                      Sale ended
                    </BlackButton>
                  ) : (
                    <BlackButton
                      width="252px"
                      disabled={
                        new BigNumber(Number(soldTokenAmountData?.toSignificant(6))).isGreaterThan(0) ||
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
                        new BigNumber(salesAmount).isLessThan(new BigNumber(canBuyMinValue?.toSignificant(6) || '')) ||
                        new BigNumber(salesAmount).isGreaterThan(canBuyMaxValue?.toSignificant(6) || '')
                      }
                      onClick={approveState === ApprovalState.NOT_APPROVED ? approveCallback : handlePay}
                    >
                      {new BigNumber(Number(soldTokenAmountData?.toSignificant(6))).isGreaterThan(0)
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
                  <span>
                    1 {saleToken?.symbol} = {ratio}
                    {receiveToken?.symbol}
                  </span>
                </RowSentence>
                <RowSentence>
                  <span>Discount</span>
                  <span>{Number(new BigNumber(SwapData?.originalDiscount).multipliedBy(100)).toFixed(6)}%</span>
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
                    value={oneTimePurchaseTokenAmount?.toSignificant(6) ?? ''}
                    errSet={() => {}}
                    onChange={e => {
                      setSalesAmount(e.target.value || '')
                    }}
                    placeholder=""
                    label="Get"
                    endAdornment={`${saleToken?.symbol}`}
                    rightLabel={``}
                    type="pay"
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
                  {SwapData?.status === SwapStatus.ENDED || SwapData?.status === SwapStatus.CANCEL ? (
                    <BlackButton disabled width="252px">
                      Sale ended
                    </BlackButton>
                  ) : (
                    <BlackButton
                      width="252px"
                      disabled={
                        isClaiming ||
                        approveState1 === ApprovalState.PENDING ||
                        new BigNumber(Number(SoldAmountData?.amount)).isGreaterThan(0) ||
                        new BigNumber(Number(saleTokenBalance?.toSignificant(6))).isLessThan(new BigNumber(0)) ||
                        new BigNumber(Number(oneTimePurchaseTokenAmount?.toSignificant(6))).isGreaterThan(
                          new BigNumber(Number(saleTokenBalance?.toSignificant(6)))
                        )
                      }
                      onClick={approveState1 === ApprovalState.NOT_APPROVED ? approveCallback1 : handlePay}
                    >
                      {new BigNumber(Number(soldTokenAmountData?.toSignificant(6))).isGreaterThan(0)
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
                  {salesInfo?.isCancel || SwapData?.status === 'ended' ? 'Claim' : 'Cancel event'}
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
