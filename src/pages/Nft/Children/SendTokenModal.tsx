import Modal from 'components/Modal/index'
import { Box, MenuItem, Typography, styled } from '@mui/material'
import Input from 'components/Input/index'
import Button from 'components/Button/Button'
import useModal from 'hooks/useModal'
import { useState } from 'react'
import Select from 'components/Select/Select'
import Image from 'components/Image'

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
  const { hideModal } = useModal()
  const [requirementAmount, setRequirementAmount] = useState('')

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
              setRequirementAmount(e.target.value)
            }}
            value={requirementAmount}
          />
          <Select
            label="Assets"
            placeholder={'Select DAO'}
            noBold
            value={1}
            onChange={e => {
              console.log(e)
            }}
          >
            <MenuItem
              sx={{
                fontWeight: 500,
                fontSize: '14px !important'
              }}
              value={1}
              //   selected={daoValue === item?.daoId}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Image style={{ height: 18, width: 18, borderRadius: '50%' }} src={''} />
                  ETH
                </Box>
                <Typography>Balance:0.003 ETH</Typography>
              </Box>
            </MenuItem>
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
                  borderRadius: '2px',
                  background: 'var(--light-bg, #F8FBFF)',
                  textAlign: 'center'
                }}
                variant="body1"
              >
                Max
              </Typography>
            }
            onChange={e => {
              setRequirementAmount(e.target.value)
            }}
            value={requirementAmount}
          />
        </Box>
        {false && <RedText>{123}</RedText>}
        <Box sx={{ mt: 30, mb: 30 }}>
          <Button
            width="100%"
            height="40px"
            disabled={false}
            onClick={hideModal}
            style={{
              ':disabled': {
                color: '#fff',
                background: '#DAE4F0'
              }
            }}
          >
            {false ? 'Insufficient balance' : 'Send'}
          </Button>
        </Box>
      </BodyBoxStyle>
    </Modal>
  )
}
