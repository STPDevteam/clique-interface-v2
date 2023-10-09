import Modal from 'components/Modal/index'
import { Box, Typography, styled } from '@mui/material'
import Input from 'components/Input/index'
import Button from 'components/Button/Button'
import useModal from 'hooks/useModal'
import { useCallback, useMemo, useState } from 'react'
import { isAddress } from 'ethers/lib/utils'
// import { useActiveWeb3React } from 'hooks'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useTransferNFT, NftInfoProp } from 'hooks/useBackedNftCallback'
import { useActiveWeb3React } from 'hooks'

const BodyBoxStyle = styled(Box)(() => ({
  padding: '13px 28px'
}))

const InputStyle = styled(Input)(() => ({
  height: 40
}))
const RedText = styled(Typography)({
  color: '#E46767'
})

export default function TransFerNftModal({
  chainId,
  NftInfoData,
  tokenId
}: {
  chainId: number | undefined
  NftInfoData: NftInfoProp | undefined
  tokenId: string | undefined
}) {
  const { account } = useActiveWeb3React()
  const { TransFerCallback } = useTransferNFT(NftInfoData?.contract_address, Number(chainId))
  const { hideModal, showModal } = useModal()
  const [receiveAccount, setReceiveAccount] = useState<string>('')

  const SendCallback = useCallback(async () => {
    if (!account || !tokenId) return
    try {
      hideModal()
      showModal(<TransacitonPendingModal />)
      const res = await TransFerCallback(account, receiveAccount, tokenId)
      console.log('res=>', res)

      hideModal()
      showModal(
        <TransactionSubmittedModal
          hideFunc={() => {
            console.log('next=>')
          }}
          hash={res.hash}
        />
      )
    } catch (err: any) {
      showModal(
        <MessageBox type="error">
          {err?.reason || err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
        </MessageBox>
      )
    }
  }, [account, tokenId, hideModal, showModal, TransFerCallback, receiveAccount])

  const nextHandler = useMemo(() => {
    if (!isAddress(receiveAccount))
      return {
        error: 'address format error',
        disabled: true
      }

    // if (!nft6551Hash)
    //   return {
    //     error: 'Nft required',
    //     disabled: true
    //   }

    return {
      disabled: false
    }
  }, [receiveAccount])

  console.log(nextHandler)

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
          NFT TransFer
        </Typography>
        <Box sx={{ mt: 27, display: 'grid', flexDirection: 'column', gap: 20 }}>
          <Box>
            <InputStyle
              placeholderSize="14px"
              placeholder={'Ethereum address(0x) or ENS'}
              label="To Account"
              onChange={e => {
                setReceiveAccount(e.target.value)
              }}
              value={receiveAccount}
            />
          </Box>
        </Box>
        {false && <RedText>{123}</RedText>}
        <Box sx={{ mt: 30, mb: 30 }}>
          <Button
            style={{
              height: '40px',
              ':disabled': {
                color: '#fff',
                background: '#DAE4F0'
              }
            }}
            disabled={nextHandler?.disabled}
            onClick={() => SendCallback()}
          >
            Send
          </Button>
        </Box>
      </BodyBoxStyle>
    </Modal>
  )
}
