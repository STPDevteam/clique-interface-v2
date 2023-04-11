import {
  Box,
  ButtonGroup,
  Stack,
  styled,
  Button as MuiButton,
  Typography,
  Switch,
  Alert,
  Snackbar,
  Link
} from '@mui/material'
import { SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import theme from 'theme'
import Input from 'components/Input'
import NumericalInput from 'components/Input/InputNumerical'
import DownloadIcon from '@mui/icons-material/Download'
import Editor from 'pages/DaoInfo/Children/Proposal/Editor'
import DateTimePicker from 'components/DateTimePicker'
import { BlackButton } from 'components/Button/Button'
import ChainSelect from 'components/Select/ChainSelect'
import { ChainId, ChainList, ChainListMap } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { isAddress } from 'utils'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { tryParseAmount } from 'utils/parseAmount'
import { PUBLICSALE_ADDRESS, ZERO_ADDRESS } from '../../constants'
import { Currency, Token } from 'constants/token'
import { getTokenPrices, getIsCreatorWhite } from 'utils/fetch/server'
import useModal from 'hooks/useModal'
import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useCreatePublicSaleCallback } from 'hooks/useCreatePublicSaleCallback'
import SelectCurrencyModal from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { BigNumber } from 'bignumber.js'
import JSBI from 'jsbi'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useWalletModalToggle } from 'state/application/hooks'
import isZero from 'utils/isZero'

enum purchaseType {
  ONETIME,
  LIMIT
}

enum priceType {
  UNIT,
  PACKAGE
}

const RowWrapper = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 24,
  marginBottom: 20,
  '& button.Mui-selected': {
    color: '#ff9',
    backgroundColor: theme.palette.primary.main
  },
  '& .css-1ujnqem-MuiTabs-root': {
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 16
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'unset',
    padding: '20px'
  }
}))

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  '& button': {
    borderWidth: '2px',
    color: theme.palette.text.primary,
    fontWeight: 600,
    '&:hover': {
      borderWidth: '2px'
    },
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    }
  }
}))

const UploadLabel = styled('label')({
  border: '1px solid',
  width: 127,
  height: 20,
  fontWeight: 500,
  fontSize: 12,
  cursor: 'pointer',
  display: 'inline-block',
  textAlign: 'center',
  borderRadius: '16px'
})

export default function Index() {
  const { chainId, account, library } = useActiveWeb3React()
  const [salePriceType, setSalePriceType] = useState(priceType.UNIT)
  const [purchase, setPurchaseLimit] = useState(purchaseType.ONETIME)
  const [packagePrice, setPackagePrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [minPurchase, setMinPurchase] = useState('')
  const [maxPurchase, setMaxPurchase] = useState('')
  const [content, setContent] = useState('')
  const [startTime, setStartTime] = useState<number>()
  const [endTime, setEndTime] = useState<number>()
  const [isWhitelist, setIsWhiteList] = useState<boolean>(false)
  const [publicSaleList, setPublicSaleList] = useState<string[]>([])
  const [saleToken, setSaleToken] = useState<Currency>()
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [salesAmount, setSalesAmount] = useState('')
  const [receiveToken, setReceiveToken] = useState<Currency>()
  const [baseChainId, setCurrentBaseChain] = useState<any>('')
  const [oneTimePrice, setOnetimePrice] = useState<string>('')
  const [currencyRatio, setCurrencyRatio] = useState('')
  const [eventTitle, setEventTitle] = useState('')
  const [isAccountWhite, setIsAccountWhite] = useState(false)
  const history = useHistory()
  const { showModal, hideModal } = useModal()

  const handleChangeOneTimePrice = useCallback(e => {
    setOnetimePrice(e.target.value)
    setMaxPurchase(e.target.value)
    setMinPurchase(e.target.value)
  }, [])

  const createPublicSaleCallback = useCreatePublicSaleCallback()

  const insertLine = useCallback((list: string[], newItem: string) => {
    const _ret = list.filter(item => item.toLowerCase() !== newItem.toLowerCase())
    _ret.push(newItem)
    return _ret
  }, [])

  const uploadCSV = useCallback(() => {
    const el = document.getElementById('upload_CSV') as HTMLInputElement
    if (!el || !el.files) return
    const reader = new FileReader()
    reader.onload = function() {
      const ret: string[] = []
      const textInput = reader.result as string
      const allRows = textInput.split(/\r?\n|\r/)
      for (let i = 0; i < allRows.length; i++) {
        const splitTextInput = allRows[i].split(',')
        if (!splitTextInput[0]?.trim()) {
          continue
        }
        if (!isAddress(splitTextInput[0]?.trim())) {
          setOpenSnackbar(true)
          el.value = ''
          return
        }
        ret.push(splitTextInput[0].trim())
      }
      el.value = ''
      let newList: string[] = []
      for (const item of ret) {
        newList = insertLine(newList, item)
        setPublicSaleList(newList)
      }
    }
    reader.readAsBinaryString(el.files[0])
  }, [insertLine])
  const currentBaseChain = useMemo(() => (baseChainId ? ChainListMap[baseChainId] || null : null), [baseChainId])
  const onSelectCurrency = useCallback((cur: Currency) => {
    setSaleToken(cur)
  }, [])

  const saleTokenBalance = useCurrencyBalance(account || undefined, saleToken, baseChainId)

  const onSelectReceiveCurrency = useCallback((cur: Currency) => {
    setReceiveToken(cur)
  }, [])
  const [currencyOptions, setCurrencyOptions] = useState<any>([])
  useEffect(() => {
    if (!account) return
    let result: any = []
    ;(async () => {
      try {
        const res = await getIsCreatorWhite(account)
        result = res?.data.data
        console.log(result?.isWhite)
        if (!result.isWhite) {
          setIsAccountWhite(false)
          showModal(
            <MessageBox type="error" hideFunc={() => history.goBack()}>
              You are not in the whitelist, you can&apos;t create a swap
            </MessageBox>
          )
        } else {
          setIsAccountWhite(true)
        }
      } catch (error) {
        setIsAccountWhite(false)
        console.error(error)
      }
    })()
  }, [account, history, showModal])
  useEffect(() => {
    if (!saleToken || !receiveToken) return
    let result: any = []
    let ratio
    const tokens = (saleToken?.address || '') + ',' + (receiveToken?.address || '')
    ;(async () => {
      if (!currentBaseChain?.id) {
        setCurrencyRatio('')
        return
      }
      try {
        const res = await getTokenPrices(currentBaseChain?.id, tokens)
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
      setCurrencyRatio(ratio ?? '')
    })()
  }, [currentBaseChain?.id, receiveToken, saleToken])
  useEffect(() => {
    ;(async () => {
      if (!currentBaseChain?.id) {
        setCurrencyOptions([])
        return
      }
      try {
        const res = await getTokenPrices(currentBaseChain?.id)
        if (!res?.data?.data) {
          setCurrencyOptions([])
          return
        }
        const result: Currency = res.data.data.map((item: any) => {
          if (item.tokenAddress === ZERO_ADDRESS) {
            return Currency.get_ETH_TOKEN(item.chainId)
          }
          return new Token(
            item.chainId,
            item.tokenAddress,
            item.decimals,
            item.symbol,
            item.tokenName,
            item.img,
            item.urlCoingecko,
            item.urlCoinmarketcap
          )
        })
        setCurrencyOptions(result)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [currentBaseChain?.id])

  const inputValueAmount = tryParseAmount(salesAmount, saleToken || undefined)
  const maxPurchaseCa = tryParseAmount(maxPurchase, saleToken)
  const minPurchaseCa = tryParseAmount(minPurchase, saleToken)
  const salePriceCa = tryParseAmount(salePrice, receiveToken)
  const oneTimePriceCa = tryParseAmount(oneTimePrice, saleToken)

  const handlePublic = useCallback(() => {
    if (!saleToken || !startTime || !endTime || !account || !receiveToken || !inputValueAmount || !salePriceCa) return
    const receiveTokenAddr = receiveToken?.address
    const saleTokenAddr = saleToken?.address
    const limitMax = purchase === purchaseType.ONETIME ? oneTimePriceCa?.raw.toString() : maxPurchaseCa?.raw.toString()
    const limitMin =
      purchase === purchaseType.ONETIME ? oneTimePriceCa?.raw.toString() : minPurchaseCa?.raw.toString() || '0'
    showModal(<TransacitonPendingModal />)

    createPublicSaleCallback(
      content,
      baseChainId,
      account,
      endTime,
      limitMax || '',
      limitMin || '',
      receiveTokenAddr,
      inputValueAmount.raw.toString(),
      salePriceCa.raw.toString(),
      saleTokenAddr,
      'discount',
      startTime,
      eventTitle,
      isWhitelist ? publicSaleList : []
    )
      .then(hash => {
        hideModal()
        showModal(
          <TransactiontionSubmittedModal hash={hash} hideFunc={() => history.push(routes.SaleList)}>
            Your swap can take up to 5 minutes to appear
          </TransactiontionSubmittedModal>
        )
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
    saleToken,
    startTime,
    endTime,
    account,
    receiveToken,
    inputValueAmount,
    salePriceCa,
    purchase,
    oneTimePriceCa?.raw,
    maxPurchaseCa?.raw,
    minPurchaseCa?.raw,
    showModal,
    createPublicSaleCallback,
    content,
    baseChainId,
    eventTitle,
    isWhitelist,
    publicSaleList,
    hideModal,
    history
  ])

  const [approveState, approveCallback] = useApproveCallback(
    inputValueAmount,
    baseChainId ? PUBLICSALE_ADDRESS[baseChainId as ChainId] : undefined
  )

  const toggleWallet = useWalletModalToggle()

  const tokenPriceText = useMemo(() => {
    if (!saleToken || !receiveToken) return
    return `1 ${saleToken?.symbol} = ${currencyRatio} ${receiveToken?.symbol} / 1 ${
      receiveToken?.symbol
    } = ${currencyRatio && new BigNumber(1).div(currencyRatio).toFixed(6)} ${saleToken?.symbol}`
  }, [currencyRatio, receiveToken, saleToken])

  const totalShare = useMemo(() => {
    if (!salesAmount || !oneTimePrice) return
    return Number(new BigNumber(salesAmount).div(new BigNumber(oneTimePrice))).toFixed()
  }, [oneTimePrice, salesAmount])

  const sharePer = useMemo(() => {
    if (!salePrice || !oneTimePrice) return
    return new BigNumber(oneTimePrice)
      .multipliedBy(new BigNumber(salePrice))
      .toFixed()
      .toString()
  }, [salePrice, oneTimePrice])

  const paramsCheck: {
    disabled: boolean
    handler?: () => void
    error?: undefined | string | JSX.Element
  } = useMemo(() => {
    if (!account) {
      return {
        disabled: true,
        error: <span onClick={toggleWallet}>Connect wallet first</span>
      }
    }
    if (!isAccountWhite) {
      return {
        disabled: true,
        error: 'You are not in the whitelist'
      }
    }
    if (!baseChainId) {
      return {
        disabled: true,
        error: 'Network required'
      }
    }
    if (baseChainId !== chainId) {
      return {
        disabled: true,
        error: (
          <>
            You need{' '}
            <Link
              sx={{ cursor: 'pointer' }}
              onClick={() => baseChainId && triggerSwitchChain(library, baseChainId, account || '')}
            >
              switch
            </Link>{' '}
            to {ChainListMap[baseChainId].name}
          </>
        )
      }
    }
    if (!saleToken) {
      return {
        disabled: true,
        error: 'Sale Token required'
      }
    }
    if (salePriceType === priceType.UNIT) {
      if (!salePrice) {
        return {
          disabled: true,
          error: 'Unit Price required'
        }
      }
    }
    if (salePriceType === priceType.PACKAGE) {
      if (!packagePrice) {
        return {
          disabled: true,
          error: 'Package Price required'
        }
      }
    }
    if (!salesAmount) {
      return {
        disabled: true,
        error: 'Sales Amount required'
      }
    }
    if (purchase === purchaseType.ONETIME) {
      if (!oneTimePrice) {
        return {
          disabled: true,
          error: 'One-time Price required'
        }
      }
      // if (
      //   new BigNumber(salePrice)
      //     .multipliedBy(new BigNumber(100))
      //     .div(Number(currencyRatio))
      //     .isGreaterThan(200)
      // ) {
      //   return {
      //     disabled: true,
      //     error: 'Discount can not be over 200%'
      //   }
      // }
    }
    if (purchase === purchaseType.LIMIT) {
      if (minPurchaseCa?.lessThan(JSBI.BigInt(0))) {
        return {
          disabled: true,
          error: 'Min Purchase must be bigger than 0'
        }
      }
      if (maxPurchaseCa?.lessThan(JSBI.BigInt(0))) {
        return {
          disabled: true,
          error: 'Max Purchase must be bigger than 0'
        }
      }
      if (!maxPurchaseCa) {
        return {
          disabled: true,
          error: 'Max Price required'
        }
      }
      if (maxPurchaseCa && minPurchaseCa?.greaterThan(maxPurchaseCa)) {
        return {
          disabled: true,
          error: 'Max purchase must be bigger than Min purchase'
        }
      }
    }
    if (!startTime) {
      return {
        disabled: true,
        error: 'Start time required'
      }
    }
    if (!endTime) {
      return {
        disabled: true,
        error: 'End time required'
      }
    }
    if (endTime < startTime) {
      return {
        disabled: true,
        error: 'The start time must be earlier than the end time'
      }
    }
    if (!eventTitle) {
      return {
        disabled: true,
        error: 'The event title required'
      }
    }
    return {
      disabled: false,
      handler: handlePublic
    }
  }, [
    account,
    isAccountWhite,
    baseChainId,
    chainId,
    saleToken,
    salePriceType,
    salesAmount,
    purchase,
    startTime,
    endTime,
    eventTitle,
    handlePublic,
    toggleWallet,
    library,
    salePrice,
    packagePrice,
    oneTimePrice,
    minPurchaseCa,
    maxPurchaseCa
  ])

  return (
    <Box
      sx={{
        maxWidth: 964,
        width: '100%',
        margin: '30px auto 20px',
        textAlign: 'center',
        fontSize: 12,
        padding: { xs: '0 16px', sm: undefined }
      }}
    >
      <Typography variant="h3" mb={100}>
        Create A Swap
      </Typography>
      <RowWrapper>
        <Typography color={theme.palette.text.secondary} fontWeight={500} variant="inherit">
          Select Network
        </Typography>
        <ChainSelect
          width="440px"
          chainList={ChainList}
          selectedChain={currentBaseChain}
          label=""
          onChange={e => {
            setCurrentBaseChain(e?.id || null)
            if (e?.id !== baseChainId) {
              setSaleToken(undefined)
              setReceiveToken(undefined)
            }
            if (e?.id !== chainId) {
              e?.id && triggerSwitchChain(library, e?.id, account || '')
            }
          }}
        />
      </RowWrapper>
      <Stack
        display={'grid'}
        gridTemplateColumns="1fr 1fr"
        gap={50}
        sx={{
          textAlign: 'left'
        }}
      >
        <Stack display={'flex'} alignItems={'space'} flexDirection={'column'} justifyContent={'space-Between'} gap={10}>
          <NumericalInput
            onClick={() => {
              const noEthCurrenncyOptions = currencyOptions.filter((item: any) => !isZero(item?.address))
              showModal(
                <SelectCurrencyModal
                  disabled={[saleToken, receiveToken]}
                  onSelectCurrency={onSelectCurrency}
                  currencyOptions={noEthCurrenncyOptions}
                />
              )
            }}
            style={{ marginTop: 0 }}
            value={saleToken?.symbol || ''}
            placeholder=" "
            label="Sale token"
            endAdornment={<></>}
            rightLabel={<p></p>}
            type="amount"
          />
        </Stack>
        <NumericalInput
          style={{ marginTop: 0 }}
          value={salesAmount}
          errSet={() => setSalesAmount('')}
          onChange={e => {
            if (
              new BigNumber(Number(e.target.value)).isGreaterThan(
                new BigNumber(Number(saleTokenBalance?.toSignificant(6)))
              )
            )
              return
            setSalesAmount(e.target.value || '')
          }}
          placeholder="0"
          label="Sale amount"
          endAdornment={<>{saleToken?.symbol}</>}
          rightLabel={`Balance: ${saleTokenBalance?.toSignificant(6, { groupSeparator: ',' }) ||
            '-'} ${saleToken?.symbol || ''}`}
          type="amount"
        />
      </Stack>
      <Stack display={'grid'} style={{ marginBottom: 20 }} gridTemplateColumns="1fr 1fr" gap={50}>
        <Input
          onClick={() => {
            const receiveTokenCurrencyOptions = currencyOptions.filter(
              (item: any) => item !== saleToken && item !== receiveToken
            )
            showModal(
              <SelectCurrencyModal
                onSelectCurrency={onSelectReceiveCurrency}
                currencyOptions={receiveTokenCurrencyOptions}
              />
            )
          }}
          readOnly
          value={receiveToken?.symbol || ''}
          placeholder=""
          label="Receiving Token"
          rightLabel=""
          type="receive"
        />
        <Input
          readOnly
          style={{ marginTop: 0 }}
          value={tokenPriceText ?? '-'}
          errSet={() => {}}
          onChange={() => {}}
          placeholder="0"
          label="Price"
          endAdornment={''}
          rightLabel={''}
          type="estimate"
        />
      </Stack>
      <Box
        sx={{
          padding: 16,
          marginBottom: 20,
          border: `1px solid ${theme.bgColor.bg2}`,
          boxShadow: `inset 0px -1px 0px ${theme.bgColor.bg2}`,
          borderRadius: theme.borderRadius.default
        }}
        display={'grid'}
        gridTemplateColumns="1fr 1fr"
        gap={50}
      >
        <Stack spacing={10}>
          <Typography color={theme.palette.text.secondary} textAlign={'left'} fontWeight={500} variant="inherit">
            Set sale price
          </Typography>
          <StyledButtonGroup style={{ width: '350px', marginTop: 20 }}>
            <MuiButton
              className={salePriceType === priceType.UNIT ? 'active' : ''}
              onClick={() => setSalePriceType(priceType.UNIT)}
            >
              Unit price
            </MuiButton>
            <MuiButton
              className={salePriceType === priceType.PACKAGE ? 'active' : ''}
              onClick={() => setSalePriceType(priceType.PACKAGE)}
            >
              Package price
            </MuiButton>
          </StyledButtonGroup>
        </Stack>
        {salePriceType === priceType.UNIT ? (
          <NumericalInput
            style={{ marginTop: 0 }}
            value={salePrice}
            errSet={() => setSalePrice('')}
            onChange={e => setSalePrice(e.target.value)}
            placeholder="0"
            endAdornment={<>{receiveToken?.symbol}</>}
            label="Unit price"
            rightLabel={``}
            type="unit"
          />
        ) : (
          <NumericalInput
            style={{ marginTop: 0 }}
            value={packagePrice}
            errSet={() => setPackagePrice('')}
            onChange={e => {
              setPackagePrice(e.target.value || '')
              const uPrice = new BigNumber(e.target.value).div(new BigNumber(salesAmount)).toFixed(6)
              setSalePrice(uPrice)
            }}
            placeholder="0"
            endAdornment={<>{receiveToken?.symbol}</>}
            label="package price"
            rightLabel={``}
            type="package"
          />
        )}
      </Box>
      <RowWrapper padding={'40px 16px'}>
        <Typography color={theme.palette.text.secondary} fontWeight={500} variant="inherit">
          Sale price
        </Typography>
        {new BigNumber(salePrice).isLessThan(0.000001) ? (
          <Typography color={theme.palette.text.secondary} fontWeight={500} variant="inherit">
            {salePrice ? `1 ${saleToken?.symbol} < 0.000001 ${receiveToken?.symbol}` : ''}
          </Typography>
        ) : (
          <Typography color={theme.palette.text.secondary} fontWeight={500} variant="inherit">
            {salePrice ? `1 ${saleToken?.symbol} = ${salePrice} ${receiveToken?.symbol}` : ''}
          </Typography>
        )}
      </RowWrapper>
      <RowWrapper padding={'40px 16px'}>
        <Typography color={theme.palette.text.secondary} fontWeight={500} variant="inherit">
          Discount
        </Typography>
        <Typography color={theme.palette.text.secondary} fontWeight={500} variant="inherit">
          {salePrice &&
            currencyRatio &&
            (new BigNumber(salePrice)
              .multipliedBy(new BigNumber(100))
              .div(Number(currencyRatio))
              .isLessThan(0.01)
              ? '< 0.01'
              : new BigNumber(salePrice)
                  .multipliedBy(new BigNumber(100))
                  .div(Number(currencyRatio))
                  .toFixed(2))}
          %
          {/* {new BigNumber(salePrice)
            .multipliedBy(new BigNumber(100))
            .div(Number(currencyRatio))
            .isGreaterThan(200) ? (
            <span style={{ color: 'red' }}> discount can not be over 200%</span>
          ) : (
            ''
          )} */}
        </Typography>
      </RowWrapper>
      <RowWrapper padding={'0 16px'}>
        <Typography color={theme.palette.text.secondary} fontWeight={500} variant="inherit">
          Methods of sales
        </Typography>
        <StyledButtonGroup>
          <MuiButton
            className={purchase === purchaseType.ONETIME ? 'active' : ''}
            onClick={() => {
              setPurchaseLimit(purchaseType.ONETIME)
              setMaxPurchase('')
              setMinPurchase('')
            }}
          >
            One-time purchase
          </MuiButton>
          <MuiButton
            className={purchase === purchaseType.LIMIT ? 'active' : ''}
            onClick={() => {
              setPurchaseLimit(purchaseType.LIMIT)
              setOnetimePrice('')
            }}
          >
            Purchase limit
          </MuiButton>
        </StyledButtonGroup>
      </RowWrapper>
      <Box
        sx={{
          padding: 16,
          marginBottom: 20,
          border: `1px solid ${theme.bgColor.bg2}`,
          boxShadow: `inset 0px -1px 0px ${theme.bgColor.bg2}`,
          borderRadius: theme.borderRadius.default
        }}
      >
        {purchase === purchaseType.ONETIME ? (
          <Stack display={'grid'} gridTemplateColumns="260px 1fr 2fr" alignItems={'center'}>
            <Typography color={theme.palette.text.secondary} textAlign={'left'} fontWeight={500} variant="inherit">
              One-time purchase amount
            </Typography>
            <NumericalInput
              style={{ marginTop: 0 }}
              value={oneTimePrice}
              errSet={() => setOnetimePrice('')}
              onChange={handleChangeOneTimePrice}
              placeholder=""
              label=""
              endAdornment={<>{saleToken?.symbol}</>}
              rightLabel={<></>}
              type="oneTime"
            />
            <div
              style={{
                color: '#1b1d21',
                fontSize: 16,
                display: 'flex',
                justifyContent: 'space-between',
                padding: '13px 10px 5px',
                fontWeight: 600
              }}
            >
              <span>{`Total share: ${totalShare ?? '-'}`}</span>
              <span>{`${sharePer ?? '-'} ${receiveToken?.symbol ?? ''}/share`}</span>
            </div>
          </Stack>
        ) : (
          <Stack display={'grid'} gridTemplateColumns="1fr 1fr" alignItems={'center'}>
            <Typography color={theme.palette.text.secondary} textAlign={'left'} fontWeight={500} variant="inherit">
              purchase limit
            </Typography>
            <Stack display={'grid'} gridTemplateColumns="4fr 1fr 4fr" alignItems={'center'}>
              <NumericalInput
                style={{ marginTop: 0 }}
                value={minPurchase}
                errSet={() => setMinPurchase('')}
                onChange={e => setMinPurchase(e.target.value || '')}
                placeholder="min"
                label=""
                endAdornment={<>{saleToken?.symbol}</>}
                rightLabel={<></>}
                type="min"
              />
              -
              <NumericalInput
                style={{ marginTop: 0 }}
                value={maxPurchase}
                errSet={() => setMaxPurchase('')}
                onChange={e => setMaxPurchase(e.target.value || '')}
                endAdornment={<>{saleToken?.symbol}</>}
                placeholder="max"
                label=""
                rightLabel={<></>}
                type="max"
              />
            </Stack>
          </Stack>
        )}
      </Box>
      <RowWrapper padding={'0 16px'}>
        <Typography color={theme.palette.text.secondary} fontWeight={500} variant="inherit">
          Event time
        </Typography>
        <Box display={'grid'} gridTemplateColumns="80px 1fr 70px 1fr" alignItems={'center'} gap="12px 24px">
          <Typography fontSize={12}>Start Time</Typography>
          <DateTimePicker
            value={startTime ? new Date(startTime * 1000) : null}
            onValue={(timestamp: SetStateAction<number | undefined>) => setStartTime(timestamp)}
          ></DateTimePicker>
          <Typography fontSize={12}>End Time</Typography>
          <DateTimePicker
            onValue={(timestamp: SetStateAction<number | undefined>) => setEndTime(timestamp)}
            minDateTime={startTime ? new Date(startTime * 1000) : undefined}
            value={endTime ? new Date(endTime * 1000) : null}
          ></DateTimePicker>
        </Box>
      </RowWrapper>
      <RowWrapper padding={'0 16px'}>
        <Typography color={theme.palette.text.secondary} textAlign={'left'} fontWeight={500} variant="inherit">
          Whitelist
        </Typography>
        <Switch
          checked={isWhitelist}
          onChange={() => {
            if (isWhitelist) setPublicSaleList([])
            setIsWhiteList(!isWhitelist)
          }}
        />
      </RowWrapper>

      {isWhitelist ? (
        <>
          <Stack
            gap={20}
            sx={{
              height: 60,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <input accept=".csv" type="file" onChange={uploadCSV} id="upload_CSV" style={{ width: 0, height: 0 }} />
            <UploadLabel htmlFor="upload_CSV">Upload CSV file</UploadLabel>
            <Typography color={theme.palette.text.secondary} textAlign={'left'} fontWeight={500} variant="inherit">
              {publicSaleList.length} address(s)
            </Typography>
            <Link href="/template/swap-list.csv">
              <Typography display={'flex'} alignItems="center" fontSize={12}>
                Download Templates
                <DownloadIcon sx={{ height: 16 }} />
              </Typography>
            </Link>
          </Stack>
          <Stack sx={{ textAlign: 'left', padding: 20 }}>
            {publicSaleList
              ? publicSaleList.map(item => (
                  <Typography key={item} fontSize={12}>
                    {item}
                  </Typography>
                ))
              : ''}
          </Stack>
        </>
      ) : (
        ''
      )}
      <Stack spacing={10} padding={'0 16px'} mb={70}>
        <Typography color={theme.palette.text.secondary} textAlign={'left'} fontWeight={500} variant="inherit">
          Event title
        </Typography>
        <Input
          style={{ marginTop: 0 }}
          value={eventTitle}
          errSet={() => {}}
          onChange={e => setEventTitle(e.target.value || '')}
          placeholder=""
          label=""
          endAdornment={''}
          rightLabel={''}
          type="estimate"
        />
      </Stack>
      <Stack spacing={10} padding={'0 16px'} mb={50}>
        <Typography color={theme.palette.text.secondary} textAlign={'left'} fontWeight={500} variant="inherit">
          About Product
        </Typography>
        <Editor content={content} setContent={setContent} />
      </Stack>
      {paramsCheck.error ? (
        <Alert severity="error">{paramsCheck.error}</Alert>
      ) : (
        <Alert severity="info">You will create a swap in {chainId ? ChainListMap[chainId]?.name : '--'}</Alert>
      )}
      <Stack display="flex" justifyContent="center" mt={30} flexDirection={'row'} spacing={60}>
        <BlackButton
          width="252px"
          disabled={paramsCheck.disabled || approveState === ApprovalState.PENDING}
          onClick={approveState === ApprovalState.NOT_APPROVED ? approveCallback : paramsCheck.handler}
        >
          {approveState === ApprovalState.PENDING
            ? 'Approving'
            : approveState === ApprovalState.NOT_APPROVED
            ? 'Approve'
            : 'Create'}
        </BlackButton>
      </Stack>
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error">Address format error, please download the template.</Alert>
      </Snackbar>
    </Box>
  )
}
