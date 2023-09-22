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

export default function SendNftModal({ chainId }: { chainId: number | undefined }) {
  const { hideModal } = useModal()
  const theme = useTheme()
  const [transferAccount, setTransferAccount] = useState('')
  const [contractName, setContractName] = useState<string>('')
  const { result: _accountNFTsList } = useAccountNFTsList(
    '0x5aEFAA34EaDaC483ea542077D30505eF2472cfe3' || undefined,
    chainId,
    'erc721'
  )
  // '0x5aEFAA34EaDaC483ea542077D30505eF2472cfe3'

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

  const SendCallback = useCallback(() => {
    hideModal()
    console.log(1)
  }, [hideModal])

  const nextHandler = useMemo(() => {
    if (!isAddress(transferAccount))
      return {
        error: 'address error',
        disabled: true
      }

    if (!contractName)
      return {
        error: 'nft error',
        disabled: true
      }

    return {
      disabled: false
    }
  }, [transferAccount, contractName])

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
          <InputStyle
            placeholderSize="14px"
            placeholder={'Ethereum address(0x) or ENS'}
            label="To Account"
            onChange={e => {
              setTransferAccount(e.target.value)
            }}
            value={transferAccount}
          />

          <Select
            label="Assets"
            placeholder={'Select DAO'}
            noBold
            value={contractName}
            onChange={e => {
              setContractName(e.target.value)
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
                display: contractName ? 'none' : 'block'
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
                display: contractName ? 'none' : 'block'
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
            {accountNFTsList?.map((item, index) => (
              <SelectItem
                key={item.name + index}
                value={item.contract_name}
                selected={contractName === item?.contract_name}
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
            ))}
          </Select>
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
