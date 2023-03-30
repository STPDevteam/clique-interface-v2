import { Box, Stack, styled, Typography } from '@mui/material'
// import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ChainListMap } from 'constants/chain'
import CircularStatic from 'pages/Activity/CircularStatic'
import { routes } from 'constants/routes'
import { useHistory } from 'react-router'
import { PublicSaleListBaseProp } from 'hooks/useBackedPublicSaleServer'
import { useNativeAndToken } from 'state/wallet/hooks'
import { TokenAmount } from 'constants/token'
import { useMemo } from 'react'
import JSBI from 'jsbi'
import { currentTimeStamp, getTargetTimeString } from 'utils'
// import { getTokenPrices } from 'utils/fetch/server'
import { BigNumber } from 'bignumber.js'
import { useGetSalesInfo } from 'hooks/useCreatePublicSaleCallback'
import { titleCase } from 'utils/dao'
import { publicSaleStatus } from 'hooks/useBackedPublicSaleServer'

const StyledItem = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.bgColor.bg2}`,
  boxShadow: theme.boxShadow.bs1,
  padding: '50px 39px 24px',
  display: 'grid',
  borderRadius: 24,
  gridTemplateColumns: '1fr 118px',
  columnGap: '24px',
  cursor: 'pointer',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    padding: '42px 15px 16px'
  }
}))

const StyledTitle = styled(Typography)(({}) => ({
  overflow: 'hidden',
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '27px'
}))

const StyledText = styled(Typography)(
  ({ fontSize, theme, fontWeight }: { fontSize?: number; theme?: any; fontWeight?: number }) => ({
    fontSize: fontSize || 14,
    fontWeight: fontWeight || 500,
    lineHeight: '16px',
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      fontSize: 12
    }
  })
)

const StyledBoldText = styled(StyledText)(({ theme }) => ({
  fontWeight: 600,
  fontSize: 16,
  [theme.breakpoints.down('sm')]: {
    fontSize: 12
  }
}))

const StyledStatusBox = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  border: `1px solid ${theme.bgColor.bg2}`,
  padding: '0 24px 0 32px',
  height: 46,
  borderRadius: 24,
  display: 'inline-flex',
  alignItems: 'center',
  background: theme.palette.common.white
}))

const DiscountTag = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  gap: 10,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '4px 16px',
  border: `1px solid ${theme.bgColor.bg2}`,
  borderRadius: 24,
  '& img': {
    width: 20
  },
  '& p': {
    color: '#ff0000',
    fontWeight: 500,
    lineHeight: 1.5,
    fontSize: 12
  }
}))

const StyledStatusText = styled(StyledText)(({ color, theme }: { color?: string; theme?: any }) => ({
  color:
    color === 'Active'
      ? theme.bgColor.bg7
      : color === 'Soon'
      ? theme.bgColor.bg6
      : color === 'Ended'
      ? '#000000'
      : theme.bgColor.bg2,
  fontSize: 18,
  padding: '10px 0',
  '&:before': {
    content: `''`,
    position: 'absolute',
    width: 5,
    height: 5,
    background:
      color === 'Active'
        ? theme.bgColor.bg7
        : color === 'Soon'
        ? theme.bgColor.bg6
        : color === 'Ended'
        ? '#000000'
        : theme.bgColor.bg2,
    marginLeft: -10,
    marginTop: 5,
    borderRadius: '50%'
  }
}))

function ShowStatus({ item }: { item: any }) {
  const now = currentTimeStamp()
  let targetTimeString = ''
  if (item.status === publicSaleStatus.SOON) {
    targetTimeString = 'in ' + getTargetTimeString(now, item.startTime).replace('left', '')
  } else if (item.status === publicSaleStatus.OPEN) {
    targetTimeString = getTargetTimeString(now, item.endTime)
  }

  return (
    <>
      <StyledStatusText
        color={
          [publicSaleStatus.OPEN].includes(item.status)
            ? 'Active'
            : [publicSaleStatus.SOON].includes(item.status)
            ? 'Soon'
            : 'Ended'
        }
      >
        {titleCase(item.status === 'normal' ? 'active' : item.status)}
      </StyledStatusText>
      <StyledText fontSize={16}>{targetTimeString}</StyledText>
    </>
  )
}

export default function PublicSaleListItem({ item }: { item: PublicSaleListBaseProp }) {
  const history = useHistory()
  // const [ratio, setRatio] = useState('')
  const saleToken = useNativeAndToken(item.saleToken, item.chainId)
  const receiveToken = useNativeAndToken(item.receiveToken, item.chainId)
  const saleAmount = useMemo(() => {
    if (!saleToken) return
    return new TokenAmount(saleToken, JSBI.BigInt(item.saleAmount))
  }, [item.saleAmount, saleToken])
  const progress = useMemo(() => {
    if (!item || !saleToken) return 0
    return new TokenAmount(saleToken, JSBI.BigInt(item?.soldAmount))
      .divide(new TokenAmount(saleToken, JSBI.BigInt(item?.saleAmount)))
      .multiply(JSBI.BigInt(100))
      .toSignificant(6)
  }, [item, saleToken])
  const salesInfo = useGetSalesInfo(item?.saleId, item?.chainId)
  console.log(item)

  // useEffect(() => {
  //   if (!saleToken || !receiveToken) return
  //   let result: any = []
  //   let ratio
  //   const tokens = (saleToken?.address || '') + ',' + (receiveToken?.address || '')
  //   ;(async () => {
  //     if (!item.chainId) {
  //       setRatio('')
  //       return
  //     }
  //     try {
  //       const res = await getTokenPrices(item.chainId, tokens)
  //       console.log('try')

  //       result = res?.data
  //       if (!result) return
  //       const saleTokenData = result?.data[0]
  //       const receiveTokenData = result?.data[1]
  //       ratio = new BigNumber(saleTokenData?.price)
  //         .div(new BigNumber(receiveTokenData?.price))
  //         .toFixed(6, BigNumber.ROUND_FLOOR)
  //         .toString()
  //     } catch (error) {
  //       console.error(error)
  //     }
  //     setRatio(ratio ?? '')
  //   })()
  // }, [item.chainId, receiveToken, saleToken])

  return (
    <StyledItem onClick={() => history.push(routes._SaleDetails + `/${item.saleId}`)}>
      <StyledStatusBox direction={'row'} spacing={24}>
        <ShowStatus item={item} />
      </StyledStatusBox>
      <DiscountTag>
        <img src={ChainListMap[item?.chainId]?.logo} alt="" />
        <Typography variant="inherit">
          {new BigNumber(item.originalDiscount).multipliedBy(100).isGreaterThanOrEqualTo(0.01)
            ? new BigNumber(item.originalDiscount)
                .multipliedBy(100)
                .toFixed(2)
                .toString()
            : '< 0.01'}
          % discount
        </Typography>
      </DiscountTag>
      <Stack spacing={24}>
        <StyledTitle variant="h6">{item?.title}</StyledTitle>
        <Box display={'grid'} gridTemplateColumns="100px 1fr 1fr 1fr 1fr 1fr">
          <Stack display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <img
              src={item.receiveTokenImg || 'https://devapiv2.myclique.io/static/1665558531929085683.png'}
              height={50}
              alt=""
            />
            <img
              src={item.saleTokenImg || 'https://devapiv2.myclique.io/static/1665558531929085683.png'}
              height={50}
              alt=""
            />
          </Stack>
          <Stack spacing={16}>
            <StyledText>Swap</StyledText>
            <StyledText>
              <Stack direction={'row'} alignItems="center">
                {/* <CurrencyLogo currency={undefined} size="22px" style={{ marginRight: '5px' }} /> */}
                <StyledBoldText noWrap>
                  Swap {saleToken?.symbol} for {receiveToken?.symbol}
                </StyledBoldText>
              </Stack>
            </StyledText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Network</StyledText>
            <StyledBoldText noWrap>{ChainListMap[item?.chainId]?.name || '--'}</StyledBoldText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Amount</StyledText>
            <StyledBoldText noWrap>{saleAmount?.toSignificant(6, { groupSeparator: ',' })}</StyledBoldText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Price</StyledText>
            <StyledBoldText noWrap>
              1 {saleToken?.symbol} ={' '}
              {salesInfo &&
                receiveToken &&
                new TokenAmount(receiveToken, JSBI.BigInt(salesInfo?.pricePer))?.toSignificant()}{' '}
              {receiveToken?.symbol}
            </StyledBoldText>
          </Stack>
        </Box>
      </Stack>
      <CircularStatic value={Number(progress) ? Number(progress) : 0} />
    </StyledItem>
  )
}
