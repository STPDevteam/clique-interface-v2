import Modal from 'components/Modal/index'
import { Box, MenuItem, Typography, styled, useTheme } from '@mui/material'
import Input from 'components/Input/index'
import { LoadingButton } from '@mui/lab'
import useModal from 'hooks/useModal'
import { useMemo } from 'react'
import Select from 'components/Select/Select'
import Image from 'components/Image'
import placeholderImage from 'assets/images/placeholder.png'
import { useAccountNFTsList } from 'hooks/useBackedProfileServer'
import { useSBTIsDeployList } from 'hooks/useContractIsDeploy'
import { isAddress } from 'ethers/lib/utils'
import { useSendNFT6551Callback } from 'hooks/useBackedNftCallback'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import FormItem from 'components/FormItem'
import { Form, Formik } from 'formik'
import * as yup from 'yup'

const BodyBoxStyle = styled(Box)(() => ({
  padding: '13px 28px'
}))

const InputStyle = styled(Input)(() => ({
  height: 40
}))

const SelectItem = styled(MenuItem)(() => ({
  fontWeight: 500,
  fontSize: '14px !important'
}))

export default function SendNftModal({
  chainId,
  nftAddress
}: {
  chainId: number | undefined
  nftAddress: string | undefined
}) {
  const { hideModal, showModal } = useModal()
  const theme = useTheme()
  const { sendNftCallback } = useSendNFT6551Callback()
  const { result: _accountNFTsList } = useAccountNFTsList(nftAddress || undefined, chainId, 'erc721')

  const SBTIsDeployList = useSBTIsDeployList(
    _accountNFTsList.map(item => item.contract_address),
    _accountNFTsList.map(i => i.token_id)
  )

  const accountNFTsList = useMemo(() => {
    if (!_accountNFTsList.length) return []
    if (!SBTIsDeployList) return

    return _accountNFTsList.filter((_, idx) => SBTIsDeployList[idx] === true)
  }, [SBTIsDeployList, _accountNFTsList])

  const initialValues = {
    transferAccount: '',
    nft6551Hash: ''
  }

  const validationSchema = yup.object().shape({
    transferAccount: yup
      .string()
      .trim()
      .required('Please enter receive account address')
      .test('validate', 'Address format error', value => {
        if (value && !isAddress(value)) {
          return false
        }
        return true
      }),
    nft6551Hash: yup.string().required('Please select nft')
  })

  const SendCallback = async (val: any) => {
    const checkNftDetail = _accountNFTsList.find(item => item.mint_transaction_hash === val.nft6551Hash)
    console.log('checkNftDetail=>', checkNftDetail)

    if (!nftAddress || !checkNftDetail) return
    try {
      hideModal()
      showModal(<TransacitonPendingModal />)
      const res = await sendNftCallback(
        nftAddress,
        checkNftDetail?.contract_address,
        checkNftDetail?.token_id,
        val.transferAccount
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
  }

  return (
    <Modal maxWidth="480px" width="100%" closeIcon>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={SendCallback}
      >
        {({ values, setFieldValue, errors, touched }) => {
          return (
            <BodyBoxStyle component={Form}>
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
                <FormItem name="transferAccount" required>
                  <InputStyle
                    placeholderSize="14px"
                    placeholder={'Ethereum address(0x) or ENS'}
                    label="To Account"
                    onChange={e => {
                      setFieldValue('transferAccount', e.target.value)
                    }}
                    style={{ borderColor: errors.transferAccount && touched.transferAccount ? '#E46767' : '#D4D7E2' }}
                    value={values.transferAccount}
                  />
                </FormItem>
                <FormItem name="nft6551Hash" fieldType="custom">
                  <Select
                    label="Assets"
                    placeholder={'Select DAO'}
                    noBold
                    value={values.nft6551Hash}
                    onChange={e => {
                      setFieldValue('nft6551Hash', e.target.value)
                    }}
                    style={{
                      height: '121px',
                      borderColor: errors.nft6551Hash && touched.nft6551Hash ? '#E46767' : '#D4D7E2',
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
                        display: values.nft6551Hash ? 'none' : 'block'
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
                        display: values.nft6551Hash ? 'none' : 'block'
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
                          selected={values.nft6551Hash === item?.mint_transaction_hash}
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
                      <MenuItem sx={{ fontWeight: 500, fontSize: '14px !important', color: '#808191' }}>
                        No Data
                      </MenuItem>
                    )}
                  </Select>
                </FormItem>
              </Box>
              <Box sx={{ mt: 30, mb: 30 }}>
                <LoadingButton
                  // loading={isSaving}
                  loadingPosition="start"
                  startIcon={<></>}
                  variant="contained"
                  color="primary"
                  sx={{
                    width: '100%',
                    height: 40,
                    textAlign: 'center',
                    [theme.breakpoints.down('sm')]: {
                      width: 160,
                      height: 36
                    }
                  }}
                  type="submit"
                >
                  Send
                </LoadingButton>
                {/* <Button
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
                </Button> */}
              </Box>
            </BodyBoxStyle>
          )
        }}
      </Formik>
    </Modal>
  )
}
