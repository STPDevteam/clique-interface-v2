import Modal from 'components/Modal/index'
import { Box, MenuItem, Typography, styled } from '@mui/material'
import Input from 'components/Input/index'
import Button from 'components/Button/Button'
import useModal from 'hooks/useModal'
import { useState } from 'react'
import Select from 'components/Select/Select'
import Image from 'components/Image'
import placeholderImage from 'assets/images/placeholder.png'

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

export default function SendNftModal() {
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
            style={{
              height: '121px',
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
            <SelectItem
              value={1}
              //   selected={daoValue === item?.daoId}
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
                  src={placeholderImage}
                />
                NFT NAME#001
              </Box>
            </SelectItem>
          </Select>
        </Box>
        {false && <RedText>{123}</RedText>}
        <Box sx={{ mt: 30, mb: 30 }}>
          <Button width="100%" height="40px" onClick={hideModal}>
            Send
          </Button>
        </Box>
      </BodyBoxStyle>
    </Modal>
  )
}
