import Modal from 'components/Modal/index'
import { Box, MenuItem, Typography, styled, useTheme } from '@mui/material'
import Input from 'components/Input/index'
import Button from 'components/Button/Button'
import useModal from 'hooks/useModal'
import { useCallback, useMemo, useState } from 'react'
import Select from 'components/Select/Select'
import Image from 'components/Image'
import placeholderImage from 'assets/images/placeholder.png'
import { useAccountNFTsList } from 'hooks/useBackedProfileServer'
import { useSBTIsDeployList } from 'hooks/useContractIsDeploy'
import { isAddress } from 'ethers/lib/utils'
import { useTransferNFT } from 'hooks/useBackedNftCallback'
import { useActiveWeb3React } from 'hooks'
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

const SelectItem = styled(MenuItem)(() => ({
  fontWeight: 500,
  fontSize: '14px !important'
}))

// const ErrorText = styled(Typography)(() => ({
//   color: '#E46767',
//   font: '400 12px/20px "Inter"',
//   marginTop: '3px'
// }))

export default function SendNftModal({
  chainId,
  nftAddress
}: {
  chainId: number | undefined
  nftAddress: string | undefined
}) {
  const { hideModal, showModal } = useModal()
  const { account } = useActiveWeb3React()
  const theme = useTheme()
  const [transferAccount, setTransferAccount] = useState('')
  const [nft6551Hash, setNft6551Hash] = useState<string>('')
  const { transferNftCallback } = useTransferNFT()
  const { result: _accountNFTsList } = useAccountNFTsList(account || undefined, chainId, 'erc721')

  const checkNftDetail = useMemo(() => {
    if (nft6551Hash) {
      return _accountNFTsList.find(item => item.mint_transaction_hash === nft6551Hash)
    }
    return
  }, [nft6551Hash, _accountNFTsList])

  console.log('checkNftDetail=>', checkNftDetail)

  const SBTIsDeployList = useSBTIsDeployList(
    _accountNFTsList.map(item => item.contract_address),
    _accountNFTsList.map(i => i.token_id)
  )

  const accountNFTsList = useMemo(() => {
    if (!_accountNFTsList.length) return []
    if (!SBTIsDeployList) return

    return _accountNFTsList.filter((_, idx) => SBTIsDeployList[idx] === true)
  }, [SBTIsDeployList, _accountNFTsList])
  console.log(accountNFTsList)

  const SendCallback = useCallback(async () => {
    if (!nftAddress || !checkNftDetail) return
    try {
      hideModal()
      showModal(<TransacitonPendingModal />)
      const res = await transferNftCallback(
        nftAddress,
        checkNftDetail?.contract_address,
        checkNftDetail?.token_id,
        transferAccount
      )
      hideModal()
      showModal(
        <TransactionSubmittedModal
          hideFunc={() => {
            console.log('next=>')
          }}
          hash={res}
        />
      )
    } catch (err: any) {
      showModal(
        <MessageBox type="error">
          {err?.reason || err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
        </MessageBox>
      )
    }
  }, [nftAddress, checkNftDetail, hideModal, showModal, transferNftCallback, transferAccount])

  const nextHandler = useMemo(() => {
    if (!isAddress(transferAccount))
      return {
        error: 'address format error',
        disabled: true
      }

    if (!nft6551Hash)
      return {
        error: 'Nft required',
        disabled: true
      }

    return {
      disabled: false
    }
  }, [transferAccount, nft6551Hash])

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
          Send Assets
        </Typography>
        <Box sx={{ mt: 27, display: 'grid', flexDirection: 'column', gap: 20 }}>
          <Box>
            <InputStyle
              placeholderSize="14px"
              placeholder={'Ethereum address(0x) or ENS'}
              label="To Account"
              onChange={e => {
                setTransferAccount(e.target.value)
              }}
              value={transferAccount}
            />
            {/* <ErrorText>{nextHandler.error}</ErrorText> */}
          </Box>
          <Box>
            <Select
              label="Assets"
              placeholder={'Select DAO'}
              noBold
              value={nft6551Hash}
              onChange={e => {
                setNft6551Hash(e.target.value)
              }}
              style={{
                height: '121px',
                '&:before': {
                  content: "''",
                  position: 'absolute',
                  left: 24,
                  // top: 10,
                  zIndex: 999,
                  height: '80px',
                  width: '80px',
                  borderRadius: '8px',
                  background: '#F8FBFF',
                  border: '1px solid var(--button-line, #97B7EF)',
                  display: nft6551Hash ? 'none' : 'block'
                },
                '&:after': {
                  content: `"Select DAO"`,
                  position: 'absolute',
                  left: 130,
                  // top: 10,
                  zIndex: 999,
                  color: theme.palette.text.secondary,
                  fontSize: 16,
                  fontWeight: '400!important',
                  display: nft6551Hash ? 'none' : 'block'
                },
                '& .hover': {
                  color: '#fff !important'
                },
                img: {
                  height: '80px !important',
                  width: '80px !important'
                }
              }}
              MenuStyle={{
                '& li': {
                  color: ' #80829F',
                  padding: '7px 23px !important'
                },
                '& li:hover': {
                  fontWeight: '600 !important',
                  color: ' #0049C6'
                }
              }}
            >
              {accountNFTsList?.length ? (
                accountNFTsList?.map((item, index) => (
                  <SelectItem
                    key={item.name + index}
                    value={item.mint_transaction_hash}
                    selected={nft6551Hash === item?.mint_transaction_hash}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 20,
                        width: '100%',
                        fontSize: '14px',
                        lineHeight: '20px',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        style={{ height: 50, width: 50, background: '#F8FBFF', borderRadius: '7px' }}
                        src={item.image_uri || placeholderImage}
                      />
                      <Typography width={'100%'} maxWidth={'250px'} noWrap>
                        {item?.name || item?.contract_name || '-'}#{item?.token_id}
                      </Typography>
                    </Box>
                  </SelectItem>
                ))
              ) : (
                <MenuItem sx={{ fontWeight: 500, fontSize: '14px !important', color: '#808191' }}>No Data</MenuItem>
              )}
            </Select>
            {/* <ErrorText>{nextHandler.error}</ErrorText> */}
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
