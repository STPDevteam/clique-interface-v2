import Modal from 'components/Modal/index'
import { Box, Typography, styled, MenuItem } from '@mui/material'
import Input from 'components/Input/index'
// import Button from 'components/Button/Button'
import { LoadingButton } from '@mui/lab'
import useModal from 'hooks/useModal'
import { useCallback, useMemo, useState } from 'react'
import Select from 'components/Select/Select'
import Image from 'components/Image'
import { isAddress } from 'ethers/lib/utils'
// import { Currency } from 'constants/token'
// import { ChainList } from 'constants/chain'
// import { useActiveWeb3React } from 'hooks'
// import { ChainId } from 'constants/chain'
import { useAssetsTokenCallback, useSendAssetsCallback } from 'hooks/useBackedNftCallback'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import FormItem from 'components/FormItem'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
// import { useActiveWeb3React } from 'hooks'
// import BigNumber from 'bignumber.js'

const BodyBoxStyle = styled(Box)(() => ({
  padding: '13px 28px'
}))

const InputStyle = styled(Input)(() => ({
  height: 40
}))
const RedText = styled(Typography)({
  color: '#E46767'
})

export default function SendTokenModal({
  nftAddress,
  chainId
}: {
  nftAddress: string | undefined
  chainId: number | undefined
}) {
  const { hideModal, showModal } = useModal()
  // const [toAccount, setToAccount] = useState<string>('')
  // const [amount, setAmount] = useState<string>('')
  const [checkAddress, setCheckAddress] = useState<string>('')
  const { SendAssetsCallback } = useSendAssetsCallback(chainId)
  const { result: TokenList } = useAssetsTokenCallback(chainId, nftAddress)

  const network = useMemo(() => {
    if (checkAddress) {
      return TokenList.find(v => v.id === checkAddress)
    }
    return
  }, [checkAddress, TokenList])

  console.log('List=>', TokenList, chainId)

  const initialValues = {
    toAccount: '',
    checkTokenAddress: '',
    amount: ''
  }

  const validationSchema = yup.object().shape({
    toAccount: yup
      .string()
      .trim()
      .required('Please enter receive account address')
      .test('validate', 'Address format error', value => {
        if (value && !isAddress(value)) {
          return false
        }
        return true
      }),
    checkTokenAddress: yup.string().required('Please select token'),
    amount: yup
      .string()
      .required('Please enter send amount')
      .matches(/^-?\d+(\.\d+)?$/, 'Enter amount entered is not valid')
      .test('validate', 'Amount exceed the maxLimit', value => {
        if (!isNaN(Number(value)) || !value) {
          if (network?.amount && Number(value) > Number(network?.amount)) {
            return false
          } else {
            return true
          }
        }
        return true
      })
  })

  const SendCallback = useCallback(
    async (val: any) => {
      if (!nftAddress || !network) return
      try {
        hideModal()
        showModal(<TransacitonPendingModal />)
        const res = await SendAssetsCallback(nftAddress, val.toAccount, Number(val.amount), network)
        if (res) {
          hideModal()
          showModal(
            <TransactionSubmittedModal
              hideFunc={() => {
                console.log('next=>')
              }}
              hash={res}
            />
          )
        } else {
          showModal(<MessageBox type="error">{'unknown error'}</MessageBox>)
        }

        console.log(res)
      } catch (err: any) {
        showModal(
          <MessageBox type="error">
            {err?.reason || err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
      }
    },
    [SendAssetsCallback, hideModal, network, nftAddress, showModal]
  )

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
                <FormItem name="toAccount" required>
                  <InputStyle
                    placeholderSize="14px"
                    placeholder={'Ethereum address(0x) or ENS'}
                    label="To Account"
                    style={{ borderColor: errors.toAccount && touched.toAccount ? '#E46767' : '#D4D7E2' }}
                    onChange={e => {
                      // setToAccount(e.target.value)
                      setFieldValue('toAccount', e.target.value)
                    }}
                    value={values.toAccount}
                  />
                </FormItem>
                <FormItem name="checkTokenAddress" fieldType="custom">
                  <Select
                    label="Assets"
                    noBold
                    placeholder="Select a Token"
                    value={values.checkTokenAddress}
                    onChange={e => {
                      setCheckAddress(e.target.value)
                      setFieldValue('checkTokenAddress', e.target.value)
                      setFieldValue('amount', '')
                    }}
                    style={{
                      borderColor: errors.checkTokenAddress && touched.checkTokenAddress ? '#E46767' : '#D4D7E2',
                      '&:after': {
                        content: `"Balance:${network?.amount || '--'} ${network?.symbol || '--'}"`,
                        position: 'absolute',
                        right: 40,
                        color: '#3F5170',
                        fontSize: 14,
                        fontWeight: '500!important',
                        display: values.checkTokenAddress ? 'block' : 'none'
                      }
                    }}
                  >
                    {TokenList.length ? (
                      TokenList.map((v, index) => (
                        <MenuItem key={v.id + index} value={v.id} selected={values.checkTokenAddress === v.id}>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 8,
                              alignItems: 'center',
                              fontWeight: 500,
                              fontSize: '14px !important'
                            }}
                          >
                            <Image style={{ height: 18, width: 18, borderRadius: '50%' }} src={v?.logo_url || ''} />
                            {v.symbol}
                          </Box>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem sx={{ fontWeight: 500, fontSize: '14px !important', color: '#808191' }}>
                        No Data
                      </MenuItem>
                    )}
                  </Select>
                </FormItem>
                <FormItem name="amount" required>
                  <InputStyle
                    placeholderSize="14px"
                    placeholder={'0.00'}
                    label="Send Amount"
                    style={{ borderColor: errors.amount && touched.amount ? '#E46767' : '#D4D7E2' }}
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
                          // setAmount(network?.amount.toString())
                          setFieldValue('amount', network?.amount.toString())
                        }}
                      >
                        Max
                      </Typography>
                    }
                    onChange={e => {
                      setFieldValue('amount', e.target.value)
                      // const balance = network?.amount
                      // if (!isNaN(Number(value)) || !value) {
                      //   if (balance && Number(value) >= Number(balance)) {
                      //     setAmount(network?.amount.toString())
                      //   } else {
                      //     setAmount(value)
                      //   }
                      // }
                    }}
                    value={values.amount}
                  />
                </FormItem>
              </Box>
              {false && <RedText>{123}</RedText>}
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
                    textAlign: 'center'
                  }}
                  type="submit"
                >
                  Send
                </LoadingButton>
                {/* <Button
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
                </Button> */}
              </Box>
            </BodyBoxStyle>
          )
        }}
      </Formik>
    </Modal>
  )
}
