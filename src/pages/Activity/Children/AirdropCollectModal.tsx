import { Typography, Box, styled, useTheme, Stack } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import Input from 'components/Input'
import Modal from 'components/Modal'
import { useCallback, useState } from 'react'
import { airdropSaveUserCollect } from 'utils/fetch/server'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import { useActiveWeb3React } from 'hooks'

const StyledBody = styled(Box)({
  minHeight: 200,
  padding: '40px 32px'
})

interface CollectInputsProps {
  name: string
  required: boolean
  value: string
  error: boolean
}

export default function AirdropCollectModal({
  airdropId,
  collect
}: {
  airdropId: number
  collect: {
    name: string
    required: boolean
  }[]
}) {
  const { account } = useActiveWeb3React()
  const theme = useTheme()
  const { showModal } = useModal()
  const [inputs, setInputs] = useState(
    collect.map(({ name, required }) => ({ name, required, value: '', error: false }))
  )
  const updateCollectInputs = useCallback(
    (index: number, item: CollectInputsProps) => {
      const _data = [...inputs]
      inputs[index] = item
      setInputs(_data)
    },
    [inputs]
  )

  const commit = useCallback(() => {
    if (!account) return
    const params: { [key in string]: string } = {}
    params.account = account
    for (const item of inputs) {
      if (item.required && !item.value.trim()) throw new Error('params error')
      params[item.name] = item.value
    }
    airdropSaveUserCollect(account, airdropId, JSON.stringify(params))
      .then(() => {
        showModal(<TransactiontionSubmittedModal />)
      })
      .catch(err => {
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'Commit error'}
          </MessageBox>
        )
      })
  }, [account, airdropId, inputs, showModal])

  return (
    <Modal maxWidth="628px" closeIcon width="100%">
      <StyledBody>
        <Typography variant="h5" textAlign={'center'}>
          Please complete the form
        </Typography>
        <Stack spacing={16} mt={20}>
          <Input value={account || ''} readOnly label="Your address" />

          <InputBox collectInputs={inputs} updateCollectInputs={updateCollectInputs} />

          <Box display={'flex'} pt={10} justifyContent="center">
            <BlackButton
              width="166px"
              onClick={commit}
              disabled={!account || !!inputs.filter(i => i.required && !i.value.trim()).length}
            >
              Submit
            </BlackButton>
          </Box>
          <Typography textAlign={'center'} fontSize={12} fontWeight={400} color={theme.palette.text.secondary}>
            Repeated submissions will overwrite the previous message
          </Typography>
        </Stack>
      </StyledBody>
    </Modal>
  )
}

function InputBox({
  collectInputs,
  updateCollectInputs
}: {
  collectInputs: CollectInputsProps[]
  updateCollectInputs: (index: number, item: CollectInputsProps) => void
}) {
  return (
    <>
      {collectInputs.map((item, index) => (
        <Input
          key={index}
          value={item.value}
          error={item.error}
          onChange={e => updateCollectInputs(index, Object.assign(item, { value: e.target.value }))}
          onBlur={() => {
            if (!item.value.trim() && item.required) {
              updateCollectInputs(index, Object.assign(item, { error: true }))
            } else if (item.value.trim() && item.required) {
              updateCollectInputs(index, Object.assign(item, { error: false }))
            }
          }}
          placeholder="Please enter the required fields"
          label={`${item.required ? '*' : ''}${item.name}`}
        />
      ))}
    </>
  )
}
