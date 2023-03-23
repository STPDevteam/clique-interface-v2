import { Box, Stack, styled, Typography } from '@mui/material'
// import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ChainListMap } from 'constants/chain'
import CircularStatic from 'pages/Activity/CircularStatic'
import discountIcon from 'assets/images/ethereum-logo.png'
import { routes } from 'constants/routes'
import { useHistory } from 'react-router'
import { PublicSaleListBaseProp } from 'hooks/useBackedPublicSaleServer'
import { useToken } from 'state/wallet/hooks'
import { TokenAmount } from 'constants/token'
import { useMemo } from 'react'
import JSBI from 'jsbi'
import { currentTimeStamp, getTargetTimeString } from 'utils'

const StyledItem = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.bgColor.bg2}`,
  boxShadow: theme.boxShadow.bs1,
  padding: '50px 39px 24px',
  display: 'grid',
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
  // height: 26,
  // textOverflow: 'ellipsis',
  // display: '-webkit-box',
  // '-webkit-box-orient': 'vertical',
  // '-webkit-line-clamp': '2',
  // wordBreak: 'break-all',
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
  borderRadius: '14px 0 0 14px',
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
    color === 'active'
      ? theme.bgColor.bg7
      : color === 'soon'
      ? theme.bgColor.bg6
      : color === 'ended'
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
      color === 'active'
        ? theme.bgColor.bg7
        : color === 'soon'
        ? theme.bgColor.bg6
        : color === 'ended'
        ? '#000000'
        : theme.bgColor.bg2,
    marginLeft: -10,
    marginTop: 5,
    borderRadius: '50%'
  }
}))

enum SwapStatus {
  SOON = 'soon',
  OPEN = 'normal',
  ENDED = 'ended',
  CANCEL = 'cancel'
}

function ShowStatus({ item }: { item: any }) {
  const now = currentTimeStamp()
  let targetTimeString = ''
  if (item.status === SwapStatus.SOON) {
    targetTimeString = 'in ' + getTargetTimeString(now, item.startTime).replace('left', '')
  } else if (item.status === SwapStatus.OPEN) {
    targetTimeString = getTargetTimeString(now, item.endTime)
  }

  return (
    <>
      <StyledStatusText
        color={
          [SwapStatus.OPEN].includes(item.status)
            ? 'active'
            : [SwapStatus.SOON].includes(item.status)
            ? 'soon'
            : 'ended'
        }
      >
        {item.status}
      </StyledStatusText>
      <StyledText fontSize={16}>{targetTimeString}</StyledText>
    </>
  )
}

export default function PublicSaleListItem({ item }: { item: PublicSaleListBaseProp }) {
  const history = useHistory()
  console.log(item)
  const saleToken = useToken(item.saleToken, item.chainId)
  const receiveToken = useToken(item.receiveToken, item.chainId)
  const saleAmount = useMemo(() => {
    if (!saleToken) return
    return new TokenAmount(saleToken, JSBI.BigInt(item.saleAmount))
  }, [item.saleAmount, saleToken])
  const progress = useMemo(() => {
    if (!item || !receiveToken || !saleToken) return 0
    return new TokenAmount(receiveToken, JSBI.BigInt(item?.soldAmount))
      .divide(new TokenAmount(saleToken, JSBI.BigInt(item?.saleAmount)))
      .multiply(JSBI.BigInt(100))
      .toSignificant(6)
  }, [item, receiveToken, saleToken])

  return (
    <StyledItem onClick={() => history.push(routes._SaleDetails + `/${item.saleId}`)}>
      <StyledStatusBox direction={'row'} spacing={24}>
        <ShowStatus item={item} />
      </StyledStatusBox>
      <DiscountTag>
        <img src={discountIcon} alt="" />
        <Typography variant="inherit">Sale off 10%</Typography>
      </DiscountTag>
      <Stack spacing={24}>
        <StyledTitle variant="h6">
          The STP protocol is open to anyone, and project configurations can vary widely. There are risks associated
          with interacting with all projects on the protocol...
        </StyledTitle>
        <Box display={'grid'} gridTemplateColumns="100px 1fr 1fr 1fr 1fr 1fr">
          <Stack display={'flex'} flexDirection={'row'} spacing={16}>
            <img src={item.saleTokenImg} height={50} alt="" />
            <img src={item.receiveTokenImg} height={50} alt="" />
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
              1 {saleToken?.symbol} = {item?.originalDiscount} {receiveToken?.symbol}
            </StyledBoldText>
          </Stack>
        </Box>
      </Stack>
      <CircularStatic value={Number(progress) || 0} />
    </StyledItem>
  )
}
