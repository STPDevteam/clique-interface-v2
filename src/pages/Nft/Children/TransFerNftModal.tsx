import Modal from 'components/Modal/index'
import { Box, Typography, styled } from '@mui/material'
import Input from 'components/Input/index'
// import Button from 'components/Button/Button'
import { LoadingButton } from '@mui/lab'
import useModal from 'hooks/useModal'
import { useCallback } from 'react'
import { isAddress } from 'ethers/lib/utils'
// import { useActiveWeb3React } from 'hooks'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useTransferNFT, NftInfoProp } from 'hooks/useBackedNftCallback'
import { useActiveWeb3React } from 'hooks'
import FormItem from 'components/FormItem'
import { Form, Formik } from 'formik'
import * as yup from 'yup'

const BodyBoxStyle = styled(Box)(() => ({
  padding: '13px 28px'
}))

const InputStyle = styled(Input)(() => ({
  height: 40
}))

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

  const initialValues = {
    receiveAccount: ''
  }

  const validationSchema = yup.object().shape({
    receiveAccount: yup
      .string()
      .trim()
      .required('Please enter receive account address')
      .test('validate', 'Address format error', value => {
        if (value && !isAddress(value)) {
          return false
        }
        return true
      })
  })

  const SendCallback = useCallback(
    async (val: any) => {
      if (!account || !tokenId) return
      try {
        hideModal()
        showModal(<TransacitonPendingModal />)
        const res = await TransFerCallback(account, val.receiveAccount, tokenId)
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
    },
    [account, tokenId, hideModal, showModal, TransFerCallback]
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
                NFT TransFer
              </Typography>
              <Box sx={{ mt: 27, display: 'grid', flexDirection: 'column', gap: 20 }}>
                <FormItem name="receiveAccount" required>
                  <InputStyle
                    placeholderSize="14px"
                    placeholder={'Ethereum address(0x) or ENS'}
                    style={{ borderColor: errors.receiveAccount && touched.receiveAccount ? '#E46767' : '#D4D7E2' }}
                    label="To Account"
                    onChange={e => {
                      setFieldValue('receiveAccount', e.target.value)
                    }}
                    value={values.receiveAccount}
                  />
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
                    textAlign: 'center'
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
