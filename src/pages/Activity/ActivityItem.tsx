import { Box, Stack, styled, Typography } from '@mui/material'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ChainListMap } from 'constants/chain'
import { routes } from 'constants/routes'
import { useHistory } from 'react-router'
import CircularStatic from './CircularStatic'

const StyledItem = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.bgColor.bg2}`,
  boxShadow: theme.boxShadow.bs1,
  borderRadius: theme.borderRadius.default,
  padding: '50px 39px 24px',
  display: 'grid',
  gridTemplateColumns: '1fr 118px',
  columnGap: '24px',
  cursor: 'pointer',
  position: 'relative'
}))

const StyledTitle = styled(Typography)(({}) => ({
  overflow: 'hidden',
  height: 54,
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  '-webkit-box-orient': 'vertical',
  '-webkit-line-clamp': '2',
  wordBreak: 'break-all',
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '27px'
}))

const StyledText = styled(Typography)(
  ({ fontSize, theme, fontWeight }: { fontSize?: number; theme?: any; fontWeight?: number }) => ({
    fontSize: fontSize || 14,
    fontWeight: fontWeight || 500,
    lineHeight: '16px',
    color: theme.palette.text.secondary
  })
)

const StyledBoldText = styled(StyledText)({
  fontWeight: 600,
  fontSize: 16
})

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

const StyledStatusText = styled(StyledText)(({ color, theme }: { color?: string; theme?: any }) => ({
  color: color === 'active' ? theme.bgColor.bg7 : color ? color : theme.palette.text.secondary,
  fontSize: 12,
  '&:before': {
    content: `''`,
    position: 'absolute',
    width: 5,
    height: 5,
    background: color === 'active' ? theme.bgColor.bg7 : color ? color : theme.palette.text.secondary,
    marginLeft: -10,
    marginTop: 5,
    borderRadius: '50%'
  }
}))

export function AirdropItem() {
  const history = useHistory()
  return (
    <StyledItem
      onClick={() => history.push(routes._ActivityAirdropDetail + '/5/0x9f1a024df72e6ea512b3bb726e9d4532463c307e/1')}
    >
      <StyledStatusBox direction={'row'} spacing={24}>
        <StyledStatusText color={'active'}>Active</StyledStatusText>
        <StyledText fontSize={12}>2 days left</StyledText>
      </StyledStatusBox>
      <Stack spacing={24}>
        <StyledTitle variant="h6">
          The STP protocol is open to anyone, and project configurations can vary widely. There are risks associated
          with interacting with all projects on the protocol en to anyone, and project configurations can vary widely.
          There are risks associated with interacting with all projects on the protoco
        </StyledTitle>
        <Box display={'grid'} gridTemplateColumns="1fr 1fr 1fr 1fr 1fr">
          <Stack spacing={16}>
            <StyledText>Token</StyledText>
            <StyledText>
              <Stack direction={'row'} alignItems="center">
                <CurrencyLogo currency={undefined} size="22px" style={{ marginRight: '5px' }} />
                <StyledBoldText noWrap>name</StyledBoldText>
              </Stack>
            </StyledText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Network</StyledText>
            <StyledBoldText noWrap>{ChainListMap[5]?.name || '--'}</StyledBoldText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Amount</StyledText>
            <StyledBoldText noWrap>4,000,000</StyledBoldText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Airdrop time</StyledText>
            <StyledBoldText noWrap>05/12/2022 10:59:00</StyledBoldText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Number of recipients</StyledText>
            <StyledBoldText noWrap>20</StyledBoldText>
          </Stack>
        </Box>
      </Stack>
      <CircularStatic value={10} />
    </StyledItem>
  )
}

export function PublicSaleItem() {
  return (
    <StyledItem>
      <StyledStatusBox direction={'row'} spacing={24}>
        <StyledStatusText color={'active'}>Active</StyledStatusText>
        <StyledText fontSize={12}>2 days left</StyledText>
      </StyledStatusBox>
      <Stack spacing={24}>
        <StyledTitle variant="h6">
          The STP protocol is open to anyone, and project configurations can vary widely. There are risks associated
          with interacting with all projects on the protocol en to anyone, and project configurations can vary widely.
          There are risks associated with interacting with all projects on the protoco
        </StyledTitle>
        <Box display={'grid'} gridTemplateColumns="1fr 1fr 1fr 1fr">
          <Stack spacing={16}>
            <StyledText>Token</StyledText>
            <StyledText>
              <Stack direction={'row'} alignItems="center">
                <CurrencyLogo currency={undefined} size="22px" style={{ marginRight: '5px' }} />
                <StyledBoldText noWrap>name</StyledBoldText>
              </Stack>
            </StyledText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Network</StyledText>
            <StyledBoldText noWrap>{ChainListMap[5]?.name || '--'}</StyledBoldText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Amount</StyledText>
            <StyledBoldText noWrap>4,000,000</StyledBoldText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Price</StyledText>
            <StyledBoldText noWrap>0.0018ETH ($2.33)</StyledBoldText>
          </Stack>
        </Box>
      </Stack>
      <CircularStatic value={10} />
    </StyledItem>
  )
}
