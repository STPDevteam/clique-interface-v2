import {
  Box,
  ButtonGroup,
  Stack,
  styled,
  Button as MuiButton,
  Typography,
  MenuItem,
  Switch,
  Alert,
  Snackbar,
  Link
} from '@mui/material'
import Select from 'components/Select/Select'
import { SetStateAction, useCallback, useMemo, useState } from 'react'
import theme from 'theme'
import Input from 'components/Input'
import Editor from 'pages/DaoInfo/Children/Proposal/Editor'
import DateTimePicker from 'components/DateTimePicker'
import { BlackButton } from 'components/Button/Button'
import ChainSelect from 'components/Select/ChainSelect'
import { ChainList, ChainListMap } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { isAddress } from 'utils'

enum saleTypes {
  GENERAL,
  DISCOUNT
}

enum purchaseType {
  ONETIME,
  LIMIT
}

enum priceType {
  UNIT,
  PACKAGE
}

interface ItemProp {
  address: string
  amount: string
}

const itemList = [
  { value: 'value1', label: 'RAI' },
  { value: 'value2', label: 'RAI' }
]

const insertLine = (list: ItemProp[], newItem: ItemProp) => {
  const _ret = list.filter(({ address }) => address.toLowerCase() !== newItem.address.toLowerCase())
  _ret.push(newItem)
  return _ret
}

export default function Index() {
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
      border: '2px solid',
      borderRadius: 16,
      borderColor: theme.palette.primary.main
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
  const { chainId } = useActiveWeb3React()
  const [salePriceType, setSalePriceType] = useState(priceType.UNIT)
  const [saleMode, setSaleMode] = useState(saleTypes.DISCOUNT)
  const [purchase, setPurchaseLimit] = useState(purchaseType.ONETIME)
  const [unitPrice, setUnitPrice] = useState('')
  const [packagePrice, setPackagePrice] = useState('')
  const [minPurchase, setMinPurchase] = useState('')
  const [maxPurchase, setMaxPurchase] = useState('')
  const [content, setContent] = useState('')
  const [startTime, setStartTime] = useState<number>()
  const [endTime, setEndTime] = useState<number>()
  const [isWhitelist, setIsWhiteList] = useState<boolean>(true)
  const [currentSaleToken, setCurrentSaleToken] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [salesAmount, setSalesAmount] = useState('')
  const [receiveToken, setReceiveToken] = useState('')
  const [baseChainId, setCurrentBaseChain] = useState<any>('')
  const [oneTimePrice, setOnetimePrice] = useState<string>('1000')
  const estimation = ''
  const currentBaseChain = useMemo(() => (baseChainId ? ChainListMap[baseChainId] || null : null), [baseChainId])
  const handlePublic = useCallback(() => {
    console.log(baseChainId)
  }, [baseChainId])

  const uploadCSV = useCallback(() => {
    const el = document.getElementById('upload_CSV') as HTMLInputElement
    if (!el || !el.files) return
    const reader = new FileReader()
    reader.onload = function() {
      const ret: ItemProp[] = []
      const textInput = reader.result as string
      const allRows = textInput.split(/\r?\n|\r/)
      for (let i = 0; i < allRows.length; i++) {
        const splitTextInput = allRows[i].split(',')
        if (!splitTextInput[0]?.trim() || !splitTextInput[1]?.trim()) {
          continue
        }
        if (!isAddress(splitTextInput[0]?.trim())) {
          setOpenSnackbar(true)
          el.value = ''
          return
        }
        ret.push({
          address: splitTextInput[0].trim(),
          amount: splitTextInput[1].trim()
        })
      }
      el.value = ''
      let newList: ItemProp[] = []
      for (const item of ret) {
        newList = insertLine(newList, item)
      }
      // setAirdropList(newList)
    }
    reader.readAsBinaryString(el.files[0])
  }, [])

  const paramsCheck: {
    disabled: boolean
    handler?: () => void
    error?: undefined | string | JSX.Element
  } = useMemo(() => {
    if (!baseChainId) {
      return {
        disabled: true,
        error: 'Network required'
      }
    }
    if (salePriceType === priceType.UNIT) {
      if (!unitPrice) {
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
    }
    if (purchase === purchaseType.LIMIT) {
      if (!minPurchase) {
        return {
          disabled: true,
          error: 'Min Purchase required'
        }
      }
      if (Number(minPurchase) < 0) {
        return {
          disabled: true,
          error: 'Min Purchase must be bigger than 0'
        }
      }
      if (Number(maxPurchase) < 0) {
        return {
          disabled: true,
          error: 'Max Purchase must be bigger than 0'
        }
      }
      if (!maxPurchase) {
        return {
          disabled: true,
          error: 'Max Price required'
        }
      }
      if (minPurchase > maxPurchase) {
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
    if (endTime <= startTime) {
      return {
        disabled: true,
        error: 'The start time must be earlier than the end time'
      }
    }
    return {
      disabled: false,
      handler: handlePublic
    }
  }, [
    baseChainId,
    endTime,
    handlePublic,
    maxPurchase,
    minPurchase,
    oneTimePrice,
    packagePrice,
    purchase,
    salePriceType,
    salesAmount,
    startTime,
    unitPrice
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
        Create Public Sale
      </Typography>
      <RowWrapper>
        <Typography color={theme.palette.text.secondary} fontWeight={500} variant="inherit">
          Way of sale
        </Typography>
        <StyledButtonGroup>
          <MuiButton
            className={saleMode === saleTypes.GENERAL ? 'active' : ''}
            onClick={() => setSaleMode(saleTypes.GENERAL)}
          >
            General sale
          </MuiButton>
          <MuiButton
            className={saleMode === saleTypes.DISCOUNT ? 'active' : ''}
            onClick={() => setSaleMode(saleTypes.DISCOUNT)}
          >
            Discount sale
          </MuiButton>
        </StyledButtonGroup>
      </RowWrapper>
      <RowWrapper>
        <Typography color={theme.palette.text.secondary} fontWeight={500} variant="inherit">
          Select Network
        </Typography>
        <ChainSelect
          width="200px"
          chainList={ChainList}
          selectedChain={currentBaseChain}
          label=""
          onChange={e => setCurrentBaseChain(e?.id || null)}
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
        <Select
          width={250}
          placeholder=""
          label="Sale Token"
          value={currentSaleToken}
          onChange={e => setCurrentSaleToken(e.target.value)}
        >
          {itemList.map(item => (
            <MenuItem key={item.value} sx={{ fontWeight: 500, fontSize: 10 }} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
        <Input
          style={{ marginTop: 0 }}
          value={salesAmount}
          errSet={() => setSalesAmount('')}
          onChange={e => setSalesAmount(e.target.value || '')}
          placeholder="200000"
          label="Sales amount"
          endAdornment="RAI"
          rightLabel={<>Balance: 200,000 RAI</>}
          type="amount"
        />
      </Stack>
      <Stack display={'grid'} style={{ marginBottom: 20 }} gridTemplateColumns="1fr 1fr" gap={50}>
        <Input
          value={receiveToken}
          errSet={() => setReceiveToken('')}
          onChange={e => setReceiveToken(e.target.value || '')}
          placeholder="STPT"
          label="Receiving Token"
          rightLabel=""
          type="receive"
        />
        <Input
          readOnly
          style={{ marginTop: 0 }}
          value={estimation}
          errSet={() => {}}
          onChange={() => {}}
          placeholder="2000"
          label="Equivalent estimate"
          endAdornment="STPT"
          rightLabel={<>1 STPT = 100 RAI</>}
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
            Sale price
          </Typography>
          <StyledButtonGroup style={{ width: '350px' }}>
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
          <Input
            style={{ marginTop: 0 }}
            value={unitPrice}
            errSet={() => setUnitPrice('')}
            onChange={e => setUnitPrice(e.target.value || '')}
            placeholder="0.1"
            endAdornment="STPT"
            label="Unit price"
            rightLabel={<>Package price: 2,000 STPT </>}
            type="address"
          />
        ) : (
          <Input
            style={{ marginTop: 0 }}
            value={packagePrice}
            errSet={() => setPackagePrice('')}
            onChange={e => setPackagePrice(e.target.value || '')}
            placeholder="2000"
            endAdornment="STPT"
            label="Package price"
            rightLabel={<>Unit price: 0.01 STPT </>}
            type="address"
          />
        )}
      </Box>
      <RowWrapper padding={'0 16px'}>
        <Typography color={theme.palette.text.secondary} fontWeight={500} variant="inherit">
          Methods of sales
        </Typography>
        <StyledButtonGroup>
          <MuiButton
            className={purchase === purchaseType.ONETIME ? 'active' : ''}
            onClick={() => setPurchaseLimit(purchaseType.ONETIME)}
          >
            One-time purchase
          </MuiButton>
          <MuiButton
            className={purchase === purchaseType.LIMIT ? 'active' : ''}
            onClick={() => setPurchaseLimit(purchaseType.LIMIT)}
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
          <Stack display={'grid'} gridTemplateColumns="1fr 1fr" alignItems={'center'}>
            <Typography color={theme.palette.text.secondary} textAlign={'left'} fontWeight={500} variant="inherit">
              One-time purchase amount
            </Typography>
            <Input
              style={{ marginTop: 0 }}
              value={oneTimePrice}
              errSet={() => setOnetimePrice('')}
              onChange={e => setOnetimePrice(e.target.value)}
              placeholder=""
              label=""
              endAdornment="RAI"
              rightLabel={<></>}
              type="amount"
            />
          </Stack>
        ) : (
          <Stack display={'grid'} gridTemplateColumns="1fr 1fr" alignItems={'center'}>
            <Typography color={theme.palette.text.secondary} textAlign={'left'} fontWeight={500} variant="inherit">
              purchase limit
            </Typography>
            <Stack display={'grid'} gridTemplateColumns="4fr 1fr 4fr" alignItems={'center'}>
              <Input
                style={{ marginTop: 0 }}
                value={minPurchase}
                errSet={() => setMinPurchase('')}
                onChange={e => setMinPurchase(e.target.value || '')}
                placeholder="min"
                label=""
                endAdornment="RAI"
                rightLabel={<></>}
                type="min"
              />
              -
              <Input
                style={{ marginTop: 0 }}
                value={maxPurchase}
                errSet={() => setMaxPurchase('')}
                onChange={e => setMaxPurchase(e.target.value || '')}
                endAdornment="RAI"
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
          Discount
        </Typography>
        <Typography color={theme.palette.text.secondary} fontWeight={500} variant="inherit">
          -20%
        </Typography>
      </RowWrapper>
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
            setIsWhiteList(!isWhitelist)
          }}
        />
      </RowWrapper>
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
          address(s), Download this <Link>referrence template</Link>
        </Typography>
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
        <Alert severity="info">You will create a public sale in {chainId ? ChainListMap[chainId]?.name : '--'}</Alert>
      )}
      <Stack display="flex" justifyContent="center" flexDirection={'row'} spacing={60}>
        <BlackButton width="252px" disabled={paramsCheck.disabled} onClick={paramsCheck.handler}>
          Public
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
