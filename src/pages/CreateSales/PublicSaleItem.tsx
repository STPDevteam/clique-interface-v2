import { Box, Stack, styled, Typography } from '@mui/material'
// import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ChainListMap } from 'constants/chain'
import { ActivityStatus } from 'hooks/useActivityInfo'
import CircularStatic from 'pages/Activity/CircularStatic'
import discountIcon from 'assets/images/ethereum-logo.png'
import { routes } from 'constants/routes'
import { useHistory } from 'react-router'

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
  height: 26,
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '14px',
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
      : color
      ? color
      : theme.palette.text.secondary,
  fontSize: 12,
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
        : color
        ? color
        : theme.palette.text.secondary,
    marginLeft: -10,
    marginTop: 5,
    borderRadius: '50%'
  }
}))

export const activityStatusText = {
  [ActivityStatus.SOON]: 'Soon',
  [ActivityStatus.OPEN]: 'Open',
  [ActivityStatus.ENDED]: 'Ended',
  [ActivityStatus.AIRDROP]: 'DAO Rewards',
  [ActivityStatus.CLOSED]: 'Closed'
}

export default function PublicSaleItem() {
  const history = useHistory()
  return (
    <StyledItem onClick={() => history.push(routes.SaleDetails + '?:13')}>
      <StyledStatusBox direction={'row'} spacing={24}>
        <StyledStatusText color={'active'}>Active</StyledStatusText>
        <StyledText fontSize={12}>2 days left</StyledText>
      </StyledStatusBox>
      <DiscountTag>
        <img src={discountIcon} alt="" />
        <Typography variant="inherit">Sale off 20%</Typography>
      </DiscountTag>
      <Stack spacing={24}>
        <StyledTitle variant="h6">
          The STP protocol is open to anyone, and project configurations can vary widely. There are risks associated
          with interacting with all projects on the protocol...
        </StyledTitle>
        <Box display={'grid'} gridTemplateColumns="100px 1fr 1fr 1fr 1fr">
          <Stack spacing={16}>
            <img src={discountIcon} height={50} alt="" />
          </Stack>
          <Stack spacing={16}>
            <StyledText>Swap</StyledText>
            <StyledText>
              <Stack direction={'row'} alignItems="center">
                {/* <CurrencyLogo currency={undefined} size="22px" style={{ marginRight: '5px' }} /> */}
                <StyledBoldText noWrap>Swap STPT for RAI</StyledBoldText>
              </Stack>
            </StyledText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Network</StyledText>
            <StyledBoldText noWrap>{ChainListMap[5]?.name || '--'}</StyledBoldText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Amount</StyledText>
            <StyledBoldText noWrap>4,000,000 RAI</StyledBoldText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Price</StyledText>
            <StyledBoldText noWrap>1 STPT = 13,000 RAI</StyledBoldText>
          </Stack>
        </Box>
      </Stack>
      <CircularStatic value={10} />
    </StyledItem>
  )
}
