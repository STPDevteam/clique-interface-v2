import { Alert, Box, Link, styled, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import { ChainListMap } from 'constants/chain'
import { ContainerWrapper, CreatorBox } from '../StyledCreate'
import InputNumerical from 'components/Input/InputNumerical'
import {
  getAmountForPer,
  getCurrentInputMaxAmount,
  getCurrentInputMaxPer,
  getPerForAmount,
  isValidAmount,
  toFormatGroup
} from 'utils/dao'
import OutlineButton from 'components/Button/OutlineButton'
import { useCallback, useMemo, useState } from 'react'
import { useCreateTokenCallback } from 'hooks/useCreateTokenCallback'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Input from 'components/Input'
import { useCreateTokenDataCallback, useRemainderTokenAmount } from 'state/createToken/hooks'
import DateTimePicker from 'components/DateTimePicker'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import Checkbox from 'components/Checkbox'
import { BigNumber } from 'bignumber.js'
import useBreakpoint from 'hooks/useBreakpoint'

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.secondary,
  fontSize: 12,
  lineHeight: '16px'
}))

export const StyledDelButton = styled('button')(({ theme }) => ({
  border: `2px solid ${theme.palette.text.primary}`,
  borderRadius: '8px',
  width: 54,
  height: 54,
  cursor: 'pointer',
  position: 'relative',
  background: theme.palette.common.white,
  '&:disabled': {
    opacity: 0.2
  },
  '&:after': {
    content: "''",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: theme.palette.text.primary,
    width: '15px',
    height: '2px',
    position: 'absolute',
    margin: 'auto'
  }
}))

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.secondary,
    padding: '20px',
    borderRadius: '16px',
    boxShadow: theme.boxShadow.bs2,
    fontSize: 11
  }
}))

export default function Governance({ back, next }: { back: () => void; next: (hash: string) => void }) {
  const {
    createTokenData,
    updateTokenDistributionKeyData,
    addReservedRowCallback,
    removeReservedRowCallback
  } = useCreateTokenDataCallback()
  const createTokenDistributionData = createTokenData.distribution
  const createTokenBaseData = createTokenData.basic
  const createTokenCallback = useCreateTokenCallback()
  const remainderTokenAmount = useRemainderTokenAmount()
  const { showModal, hideModal } = useModal()
  const { chainId, account, library } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(false)
  const isSmDown = useBreakpoint('sm')

  const onCreateToken = useCallback(() => {
    showModal(<TransacitonPendingModal />)
    createTokenCallback()
      .then(hash => {
        hideModal()
        next(hash)
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
  }, [createTokenCallback, hideModal, next, showModal])

  const currentUsedTokenAmount = useMemo(
    () =>
      createTokenDistributionData.length
        ? createTokenDistributionData
            .map(item => item.tokenNumber)
            .reduce((pre, cur) => new BigNumber(pre || '0').plus(cur || '0').toString()) || '0'
        : '0',
    [createTokenDistributionData]
  )

  const nextHandler: {
    disabled: boolean
    handler?: () => void
    error?: undefined | string | JSX.Element
  } = useMemo(() => {
    if (
      !createTokenBaseData.tokenSymbol.trim() ||
      !createTokenBaseData.tokenName.trim() ||
      !createTokenBaseData.tokenPhoto.trim() ||
      !createTokenBaseData.tokenSupply ||
      !createTokenBaseData.baseChainId ||
      !createTokenBaseData.tokenDecimals
    ) {
      return {
        disabled: true,
        error: 'Basic data required'
      }
    }
    const countRecord: { [key in string]: number } = {}
    for (const item of createTokenDistributionData) {
      if (!item.address)
        return {
          disabled: true,
          error: 'Wallet address required'
        }
      if (!isValidAmount(item.tokenNumber))
        return {
          disabled: true,
          error: 'Token number required'
        }
      if (!item.lockDate)
        return {
          disabled: true,
          error: 'Lock date required'
        }
      if (Object.keys(countRecord).includes(item.address)) {
        countRecord[item.address] = countRecord[item.address] + 1
      } else {
        countRecord[item.address] = 1
      }
    }
    for (const i of Object.values(countRecord)) {
      if (i > 1)
        return {
          disabled: true,
          error: 'Wallet address is repeat'
        }
    }

    if (isValidAmount(remainderTokenAmount))
      return {
        disabled: true,
        error: 'There are remaining tokens that are not used'
      }

    if (new BigNumber(createTokenBaseData.tokenSupply).isLessThan(currentUsedTokenAmount)) {
      return {
        disabled: true,
        error: 'Distributed total amount exceed totalSupply'
      }
    }

    if (!account) {
      return {
        disabled: true,
        error: (
          <>
            You need to{' '}
            <Link sx={{ cursor: 'pointer' }} onClick={toggleWalletModal}>
              connect
            </Link>{' '}
            your wallet
          </>
        )
      }
    }
    if (createTokenBaseData.baseChainId !== chainId) {
      return {
        disabled: true,
        error: (
          <>
            You need{' '}
            <Link
              sx={{ cursor: 'pointer' }}
              onClick={() =>
                createTokenBaseData.baseChainId && triggerSwitchChain(library, createTokenBaseData.baseChainId, account)
              }
            >
              switch
            </Link>{' '}
            to {ChainListMap[createTokenBaseData.baseChainId].name}
          </>
        )
      }
    }
    if (!agreeDisclaimer) {
      return {
        disabled: true,
        error: 'You must agree to the disclaimer'
      }
    }
    return {
      disabled: false,
      handler: onCreateToken
    }
  }, [
    createTokenBaseData,
    remainderTokenAmount,
    currentUsedTokenAmount,
    account,
    chainId,
    agreeDisclaimer,
    onCreateToken,
    createTokenDistributionData,
    toggleWalletModal,
    library
  ])

  return (
    <ContainerWrapper
      sx={{
        padding: { xs: '0 16px', sm: undefined }
      }}
    >
      <CreatorBox
        sx={{
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        <Box
          display={'grid'}
          mb={10}
          sx={{
            minWidth: 600,
            gridTemplateColumns: { sm: '380fr 142fr 92fr 160fr 56fr', xs: '250fr 142fr 100fr 160fr 56fr' }
          }}
          gap="8px 10px"
        >
          <StyledTitle>Wallet Address</StyledTitle>
          <StyledTitle>Number of Tokens</StyledTitle>
          <StyledTitle>% of Total</StyledTitle>
          <StyledTitle display={'flex'} alignItems="center">
            Lock Date
            <LightTooltip
              title={`Before the lock dates, the tokens will not be accessible. Afterwards, tokens will be distributed to
                  the user's wallet address.`}
            >
              <HelpOutlineIcon
                sx={{
                  marginLeft: 3,
                  cursor: 'pointer',
                  width: 12,
                  height: 12,
                  color: theme => theme.palette.common.black
                }}
              />
            </LightTooltip>
          </StyledTitle>
          <div />

          {createTokenDistributionData.map((item, index) => (
            <>
              <Input
                value={item.address}
                errSet={() => updateTokenDistributionKeyData(index, 'address', '')}
                onChange={e => updateTokenDistributionKeyData(index, 'address', e.target.value || '')}
                placeholder="Address"
                type={'address'}
              />
              <InputNumerical
                noDecimals
                showFormatWrapper={() => (item.tokenNumber ? toFormatGroup(item.tokenNumber) : '')}
                value={item.tokenNumber}
                onChange={e => {
                  const input = getCurrentInputMaxAmount(remainderTokenAmount, item.tokenNumber || '', e.target.value)
                  updateTokenDistributionKeyData(index, 'tokenNumber', input || '')
                }}
                placeholder="1000"
                onUserBlur={() =>
                  updateTokenDistributionKeyData(
                    index,
                    'per',
                    getPerForAmount(createTokenBaseData.tokenSupply, item.tokenNumber)
                  )
                }
              />
              <InputNumerical
                value={item.per?.toString() || ''}
                max={100}
                onChange={e => {
                  const maxPer = getCurrentInputMaxPer(
                    createTokenBaseData.tokenSupply,
                    remainderTokenAmount,
                    item.tokenNumber || '0',
                    Number(e.target.value || 0)
                  )
                  updateTokenDistributionKeyData(
                    index,
                    'per',
                    maxPer >= Number(e.target.value || 0) ? e.target.value : maxPer
                  )
                }}
                placeholder="0"
                onUserBlur={() => {
                  updateTokenDistributionKeyData(
                    index,
                    'tokenNumber',
                    getAmountForPer(createTokenBaseData.tokenSupply, item.per)
                  )
                }}
                endAdornment={<>%</>}
              />

              <DateTimePicker
                value={item.lockDate ? new Date(item.lockDate * 1000) : null}
                onValue={timestamp => updateTokenDistributionKeyData(index, 'lockDate', timestamp)}
              />

              {index === 0 ? (
                <StyledDelButton disabled />
              ) : (
                <StyledDelButton onClick={() => removeReservedRowCallback(index)} />
              )}
            </>
          ))}
        </Box>
        <OutlineButton width={isSmDown ? 120 : 250} height={isSmDown ? 40 : 56} onClick={addReservedRowCallback}>
          + Add
        </OutlineButton>
      </CreatorBox>

      <Box display={'flex'} justifyContent="center" mb={16}>
        <Checkbox checked={agreeDisclaimer} onChange={e => setAgreeDisclaimer(e.target.checked)}></Checkbox>
        <Typography variant="body1">
          I have read and agree to the{' '}
          <Link target="_blank" href="https://stp-dao.gitbook.io/verse-network/clique/overview-of-clique">
            Disclaimer
          </Link>{' '}
          for creating a token
        </Typography>
      </Box>

      {nextHandler.error ? (
        <Alert severity="error">{nextHandler.error}</Alert>
      ) : (
        <Alert severity="info">You will create a Token in {chainId ? ChainListMap[chainId].name : '--'}</Alert>
      )}

      <Box mt={30} display="flex" justifyContent={'center'} gap="40px">
        <OutlineButton width="166px" onClick={back}>
          Back
        </OutlineButton>
        <BlackButton width="252px" disabled={nextHandler.disabled} onClick={nextHandler.handler}>
          Create Token
        </BlackButton>
      </Box>
    </ContainerWrapper>
  )
}
