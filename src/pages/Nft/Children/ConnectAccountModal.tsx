import Modal from 'components/Modal/index'
import { Box, Stack, Typography, styled } from '@mui/material'
import Input from 'components/Input/index'
import Button from 'components/Button/Button'
import { useCallback, useState, useMemo } from 'react'
import Image from 'components/Image'
import WalletConnectClip from 'assets/images/walletConnect_clip.png'

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

const ErrorText = styled(Typography)(() => ({
  color: '#E46767',
  font: '400 12px/20px "Inter"',
  marginTop: '3px'
}))

export default function ConnectAccountModal() {
  const [uri, setUri] = useState<string>('')

  const SendCallback = useCallback(() => {
    console.log(1)
  }, [])

  const nextHandler = useMemo(() => {
    if (!uri)
      return {
        error: 'URI required',
        disabled: true
      }

    if (!/^wc:.*@\d.*$/.test(uri))
      return {
        error: 'URI format error',
        disabled: true
      }

    return {
      disabled: false
    }
  }, [uri])

  return (
    <Modal maxWidth="480px" width="100%" closeIcon>
      <BodyBoxStyle>
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
            <Box>
              <InputStyle
                placeholderSize="14px"
                placeholder={'Walletconnect URI'}
                onChange={e => {
                  setUri(e.target.value)
                }}
                style={{
                  borderColor: nextHandler.error ? '#E46767' : '#D4D7E2'
                }}
                value={uri}
              />
              {nextHandler.error && <ErrorText>{nextHandler.error}</ErrorText>}
            </Box>
          </Stack>
        </Stack>

        <Box sx={{ mt: 20 }}>
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
            Connect
          </Button>
        </Box>
      </BodyBoxStyle>
    </Modal>
  )
}
