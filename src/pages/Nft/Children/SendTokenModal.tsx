import Modal from 'components/Modal/index'
import { Box, MenuItem, Typography, styled } from '@mui/material'
import Input from 'components/Input/index'
import Button from 'components/Button/Button'
import useModal from 'hooks/useModal'
import { useCallback, useMemo, useState } from 'react'
import Select from 'components/Select/Select'
import Image from 'components/Image'
import { isAddress } from 'ethers/lib/utils'
import { Currency } from 'constants/token'
import { ChainList } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { ChainId } from 'constants/chain'
import { useSendAssetsCallback } from 'hooks/useBackedNftCallback'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'

const BodyBoxStyle = styled(Box)(() => ({
  padding: '13px 28px'
}))

const InputStyle = styled(Input)(() => ({
  height: 40
}))
const RedText = styled(Typography)({
  color: '#E46767'
})

export default function SendTokenModal() {
  const { hideModal, showModal } = useModal()
  const { account } = useActiveWeb3React()
  const [toAccount, setToAccount] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [checkChainId, setCheckChainId] = useState<number>()
  const { SendAssetsCallback } = useSendAssetsCallback()
  const network = useMemo(() => {
    if (checkChainId) {
      return Currency.get_ETH_TOKEN(checkChainId as ChainId)
    }

    return
  }, [checkChainId])

  const airdropCurrencyBalance = useCurrencyBalance(
    account || undefined,
    network || undefined,
    checkChainId || undefined
  )

  const Send = useCallback(async () => {
    if (!toAccount || !amount || !checkChainId || !account) return
    try {
      hideModal()
      showModal(<TransacitonPendingModal />)
      const res = await SendAssetsCallback(account, toAccount, Number(amount))
      hideModal()
      showModal(
        <TransactionSubmittedModal
          hideFunc={() => {
            console.log('next=>')
          }}
          hash={res}
        />
      )
      console.log(res)
    } catch (err: any) {
      showModal(
        <MessageBox type="error">
          {err?.reason || err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
        </MessageBox>
      )
    }
  }, [SendAssetsCallback, account, amount, checkChainId, hideModal, showModal, toAccount])

  const nextHandler = useMemo(() => {
    if (!isAddress(toAccount))
      return {
        error: 'address error',
        disabled: true
      }
    if (!amount) {
      return {
        error: ' enter',
        disabled: true
      }
    }
    return {
      disabled: false
    }
  }, [toAccount, amount])

  console.log(nextHandler, airdropCurrencyBalance)

  return (
    <Modal maxWidth="480px" width="100%" closeIcon>
      <BodyBoxStyle>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: 14,
            lineHeight: '24px',
            color: '#3F5170'
          }}
        >
          Send Assets
        </Typography>
        <Box sx={{ mt: 27, display: 'grid', flexDirection: 'column', gap: 20 }}>
          <InputStyle
            placeholderSize="14px"
            placeholder={'Ethereum address(0x) or ENS'}
            label="To Account"
            onChange={e => {
              setToAccount(e.target.value)
            }}
            value={toAccount}
          />
          <Select
            label="Assets"
            noBold
            placeholder="Select a Token"
            value={checkChainId}
            onChange={e => {
              setCheckChainId(e.target.value)
            }}
            style={{
              '&:after': {
                content: `"Balance:${airdropCurrencyBalance?.toSignificant(6) || '--'} ${
                  airdropCurrencyBalance?.currency.symbol || '--'
                }"`,
                position: 'absolute',
                right: 40,
                color: '#3F5170',
                fontSize: 14,
                fontWeight: '500!important',
                display: checkChainId ? 'block' : 'none'
              }
            }}
          >
            {ChainList.map((v, index) => (
              <MenuItem
                key={v.id + index}
                sx={{
                  fontWeight: 500,
                  fontSize: '14px !important'
                }}
                value={v.id}
                selected={checkChainId === v.id}
              >
                <Box sx={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Image style={{ height: 18, width: 18, borderRadius: '50%' }} src={v.logo} />
                  {v.symbol}
                </Box>
              </MenuItem>
            ))}
          </Select>
          <InputStyle
            placeholderSize="14px"
            placeholder={'0.00'}
            label="Send Amount"
            endAdornment={
              <Typography
                sx={{
                  color: '#97B7EF',
                  lineHeight: '22px',
                  width: '41px',
                  height: '22px',
                  borderRadius: '4px',
                  background: 'var(--light-bg, #F8FBFF)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  ':hover': {
                    background: 'var(--light-bg, #e6e6e6)'
                  }
                }}
                variant="body1"
                onClick={() => {
                  if (airdropCurrencyBalance && checkChainId) {
                    setAmount(airdropCurrencyBalance?.toSignificant(6))
                  }
                }}
              >
                Max
              </Typography>
            }
            onChange={e => {
              const value = e.target.value
              if (!isNaN(Number(value)) || !value) {
                setAmount(value)
              }
            }}
            value={amount}
          />
        </Box>
        {false && <RedText>{123}</RedText>}
        <Box sx={{ mt: 30, mb: 30 }}>
          <Button
            width="100%"
            height="40px"
            disabled={nextHandler.disabled}
            onClick={() => Send()}
            style={{
              ':disabled': {
                color: '#fff',
                background: '#DAE4F0'
              }
            }}
          >
            {nextHandler.disabled ? 'Insufficient balance' : 'Send'}
          </Button>
        </Box>
      </BodyBoxStyle>
    </Modal>
  )
}
