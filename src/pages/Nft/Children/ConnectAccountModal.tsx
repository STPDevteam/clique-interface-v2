import Modal from 'components/Modal/index'
import { Box, Stack, Typography, styled } from '@mui/material'
import Input from 'components/Input/index'
// import Button from 'components/Button/Button'
import { LoadingButton } from '@mui/lab'

import { useCallback } from 'react'
import Image from 'components/Image'
import WalletConnectClip from 'assets/images/walletConnect_clip.png'
import FormItem from 'components/FormItem'
import { Form, Formik } from 'formik'
import * as yup from 'yup'

const BodyBoxStyle = styled(Box)(() => ({
  padding: '13px 28px 30px'
}))

const InputStyle = styled(Input)(() => ({
  height: 40,
  marginTop: '5px'
}))

const StepStyle = styled(Typography)(() => ({
  color: '#80829F',
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '20px'
}))

const StepTextStyle = styled(Typography)(() => ({
  color: '#3F5170',
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '20px'
}))

export default function ConnectAccountModal() {
  const initialValues = {
    uri: ''
  }

  const validationSchema = yup.object().shape({
    uri: yup
      .string()
      .trim()
      .required('Please enter Walletconnect URI')
      .test('validate', 'URI format error', value => {
        if (value && !/^wc:.*@\d.*$/.test(value)) {
          return false
        }
        return true
      })
  })

  const ConnectCallback = useCallback(() => {
    console.log('URI=>', initialValues.uri)
  }, [initialValues.uri])

  return (
    <Modal maxWidth="480px" width="100%" closeIcon>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={ConnectCallback}
      >
        {({ values, setFieldValue, errors, touched }) => {
          return (
            <BodyBoxStyle component={Form}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: '24px',
                  color: '#3F5170',
                  paddingLeft: '10px'
                }}
              >
                {`Link your wallet as the NFT's smart wallet account`}
              </Typography>
              <Stack spacing={15} mt={20}>
                <Stack spacing={5}>
                  <StepStyle>Step 1</StepStyle>
                  <StepTextStyle>
                    Login to the website with{` `}
                    <b style={{ fontWeight: '700' }}>WalletConnect</b>.
                  </StepTextStyle>
                </Stack>
                <Stack spacing={5}>
                  <StepStyle>Step 2</StepStyle>
                  <StepTextStyle>
                    Click {` `}
                    <b style={{ fontWeight: '700' }}>the copy icon</b>
                    {` `}
                    in the modal.
                  </StepTextStyle>
                  <Box sx={{ marginTop: '10px !important', height: 100, maxWidth: 313 }}>
                    <Image src={WalletConnectClip} width={'100%'} height={'100%'} />
                  </Box>
                </Stack>
                <Stack spacing={5}>
                  <StepStyle>Step 3</StepStyle>
                  <StepTextStyle>Paste the code into the input below, and click connect.</StepTextStyle>

                  <FormItem name="uri" required>
                    <InputStyle
                      placeholderSize="14px"
                      placeholder={'Walletconnect URI'}
                      onChange={e => {
                        setFieldValue('uri', e.target.value)
                      }}
                      style={{
                        borderColor: errors.uri && touched.uri ? '#E46767' : '#D4D7E2'
                      }}
                      value={values.uri}
                    />
                  </FormItem>
                </Stack>
              </Stack>

              <Box sx={{ mt: 20 }}>
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
                  Connect
                </LoadingButton>
              </Box>
            </BodyBoxStyle>
          )
        }}
      </Formik>
    </Modal>
  )
}
