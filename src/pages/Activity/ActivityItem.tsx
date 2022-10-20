import { Box, Stack, styled, Typography } from '@mui/material'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ChainListMap } from 'constants/chain'
import { routes } from 'constants/routes'
import { TokenAmount } from 'constants/token'
import { ActivityStatus } from 'hooks/useActivityInfo'
import { ActivityListProp } from 'hooks/useBackedActivityServer'
import { useMemo } from 'react'
import { useHistory } from 'react-router'
import { useNativeAndToken } from 'state/wallet/hooks'
import { currentTimeStamp, getTargetTimeString } from 'utils'
import { timeStampToFormat } from 'utils/dao'
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

const AirdropStyledItem = styled(StyledItem)({
  gridTemplateColumns: '1fr'
})

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

function ShowStatus({ item }: { item: ActivityListProp }) {
  const now = currentTimeStamp()
  let targetTimeString = ''
  if (item.status === ActivityStatus.SOON) {
    targetTimeString = getTargetTimeString(now, item.eventStartTime)
  } else if (item.status === ActivityStatus.OPEN) {
    targetTimeString = getTargetTimeString(now, item.eventEndTime)
  } else if (item.status === ActivityStatus.ENDED) {
    targetTimeString = getTargetTimeString(now, item.airdropStartTime)
  } else if (item.status === ActivityStatus.AIRDROP) {
    targetTimeString = getTargetTimeString(now, item.airdropEndTime)
  }

  return (
    <>
      <StyledStatusText
        color={
          [ActivityStatus.OPEN, ActivityStatus.AIRDROP].includes(item.status)
            ? 'active'
            : [ActivityStatus.SOON, ActivityStatus.ENDED].includes(item.status)
            ? 'soon'
            : ''
        }
      >
        {activityStatusText[item.status]}
      </StyledStatusText>
      <StyledText fontSize={12}>{targetTimeString}</StyledText>
    </>
  )
}

export function AirdropItem({ item }: { item: ActivityListProp }) {
  const history = useHistory()

  const token = useNativeAndToken(item.tokenAddress, item.tokenChainId)
  const amount = useMemo(() => {
    if (!token) return undefined
    return new TokenAmount(token, item.amount)
  }, [item.amount, token])

  return (
    <AirdropStyledItem
      onClick={() =>
        history.push(routes._ActivityAirdropDetail + `/${item.chainId}/${item.daoAddress}/${item.activityId}`)
      }
    >
      <StyledStatusBox direction={'row'} spacing={24}>
        <ShowStatus item={item} />
      </StyledStatusBox>
      <Stack spacing={24}>
        <StyledTitle variant="h6">{item.title}</StyledTitle>
        <Box display={'grid'} columnGap="16px" gridTemplateColumns="1fr 1fr 1fr 1fr 1fr">
          <Stack spacing={16}>
            <StyledText>Token</StyledText>
            <StyledText>
              <Stack direction={'row'} alignItems="center">
                <CurrencyLogo currency={token || undefined} size="22px" style={{ marginRight: '5px' }} />
                <StyledBoldText noWrap>{token ? `${token.name}(${token.symbol})` : '--'}</StyledBoldText>
              </Stack>
            </StyledText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Network</StyledText>
            <StyledBoldText noWrap>{ChainListMap[item.tokenChainId]?.name || '--'}</StyledBoldText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Amount</StyledText>
            <StyledBoldText noWrap>{amount?.toSignificant(6, { groupSeparator: ',' }) || '--'}</StyledBoldText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Start Time</StyledText>
            <StyledBoldText noWrap>{timeStampToFormat(item.eventStartTime, 'Y-MM-DD HH:mm')}</StyledBoldText>
          </Stack>
          <Stack spacing={16}>
            <StyledText>Number Of Recipients</StyledText>
            <StyledBoldText noWrap>{item.airdropNumber}</StyledBoldText>
          </Stack>
        </Box>
      </Stack>
      {/* <CircularStatic value={item.claimedPercentage * 100} /> */}
    </AirdropStyledItem>
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
