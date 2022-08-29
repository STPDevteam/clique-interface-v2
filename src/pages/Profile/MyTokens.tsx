import { Box, Link, Stack, styled, Typography, useTheme } from '@mui/material'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import TokenListTable from 'pages/TokenList/TokenListTable'
import { useCreateTokenReserved } from 'hooks/useCreateTokenInfo'
import { useCreateERC20ClaimCallback } from 'hooks/useCreateERC20ClaimCallback'
import { getEtherscanLink } from 'utils'
import useModal from 'hooks/useModal'
import { useActiveWeb3React } from 'hooks'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { TokenAmount } from 'constants/token'
import { useCallback, useMemo } from 'react'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import OutlineButton from 'components/Button/OutlineButton'
import { Dots } from 'theme/components'
import { timeStampToFormat } from 'utils/dao'
import CurrencyLogo from 'components/essential/CurrencyLogo'

const claimBtnStyle = {
  width: '75px',
  height: '24px',
  fontSize: 12,
  fontWeight: 500,
  style: { borderWidth: 1 }
}
const StyledClaimItem = styled(Box)(({ theme }) => ({
  padding: '28px 40px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: `1px solid ${theme.bgColor.bg2}`,
  boxShadow: theme.boxShadow.bs1,
  borderRadius: theme.borderRadius.default
}))

function CreateTokenReservedClaim({ item }: { item: { tokenAmount: TokenAmount; lockDate: number; index: number } }) {
  const { showModal, hideModal } = useModal()
  const { account } = useActiveWeb3React()
  const createERC20Claim = useCreateERC20ClaimCallback()
  const { claimSubmitted } = useUserHasSubmittedClaim(`${account}_${item.tokenAmount.token.address}`)

  const isLocked = useMemo(() => {
    const now = new Date().getTime()
    return now / 1000 - item.lockDate < 0
  }, [item.lockDate])

  const onReservedClaim = useCallback(() => {
    showModal(<TransactionPendingModal />)
    createERC20Claim(item.tokenAmount.token.address, item.index)
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
      })
      .catch(err => {
        hideModal()
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err, JSON.stringify(err))
      })
  }, [createERC20Claim, hideModal, item.index, item.tokenAmount.token.address, showModal])

  const getReservedActions = useMemo(() => {
    if (!account) {
      return null
    }
    if (claimSubmitted) {
      return (
        <OutlineButton {...claimBtnStyle} disabled>
          Claiming
          <Dots />
        </OutlineButton>
      )
    }
    if (isLocked) {
      return (
        <OutlineButton {...claimBtnStyle} disabled>
          Claim
        </OutlineButton>
      )
    }

    return (
      <OutlineButton {...claimBtnStyle} onClick={onReservedClaim}>
        Claim
      </OutlineButton>
    )
  }, [account, claimSubmitted, isLocked, onReservedClaim])

  return getReservedActions
}

function CreateTokenReservedList() {
  const createTokenReserved = useCreateTokenReserved()

  return (
    <Box display={'grid'} gap="10px" mt={25}>
      {createTokenReserved?.map((item, index) => (
        <StyledClaimItem key={index}>
          <Stack direction={'row'} spacing={6} alignItems="center">
            <CurrencyLogo size="24" currency={item.tokenAmount.token} />
            <Link
              target={'_blank'}
              underline="none"
              href={getEtherscanLink(item.tokenAmount.token.chainId, item.tokenAmount.token.address, 'address')}
            >
              <b>
                {item.tokenAmount.toSignificant(6, { groupSeparator: ',' })} {item.tokenAmount.token.symbol}
              </b>
            </Link>
            <Typography>can be claimed on {timeStampToFormat(item.lockDate)}</Typography>
          </Stack>
          <CreateTokenReservedClaim item={item} />
        </StyledClaimItem>
      ))}
    </Box>
  )
}

export default function MyTokens({ account }: { account: string }) {
  const theme = useTheme()
  return (
    <ContainerWrapper maxWidth={1150} margin={'0 auto'}>
      <Box display={'flex'} justifyContent="space-between">
        <Typography variant="h6" fontSize={16} fontWeight={600}>
          MyTokens
        </Typography>
        <Typography fontSize={16} fontWeight={500} color={theme.palette.text.secondary}>
          Only visible to yourself
        </Typography>
      </Box>
      <CreateTokenReservedList />
      <Box mt={25}>
        <TokenListTable account={account} />
      </Box>
    </ContainerWrapper>
  )
}
