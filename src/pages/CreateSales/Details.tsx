import { Box, Stack, styled, Typography } from '@mui/material'
import Back from 'components/Back'
import theme from 'theme'
import Input from 'components/Input'
import { BlackButton } from 'components/Button/Button'
import { useCallback, useState } from 'react'

enum Tabs {
  ABOUT,
  TRASACTION
}

const tabs = [
  { name: 'about', value: Tabs.ABOUT },
  { name: 'transaction', value: Tabs.TRASACTION }
]

export default function Details() {
  const RowSentence = styled('p')(({}) => ({
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row'
  }))

  const handlePay = useCallback(() => {}, [])
  const handleSale = useCallback(() => {}, [])

  const [curTab, setCurTab] = useState(Tabs.ABOUT)

  return (
    <Box
      sx={{
        maxWidth: 1140,
        width: '100%',
        margin: '30px auto 20px',
        textAlign: 'left',
        padding: { xs: '0 16px', sm: undefined }
      }}
    >
      <Back />
      <Stack display={'grid'} gridTemplateColumns="4fr 2fr" gap={10}>
        <Stack className="left_content">
          <Stack display={'flex'} flexDirection={'row'}>
            {tabs.map(({ value, name }) => (
              <Box
                sx={{
                  width: 80,
                  cursor: 'pointer'
                }}
                key={value}
                className={`tab-item border-tab-item ${curTab === value ? 'active' : ''}`}
                onClick={() => setCurTab(value)}
              >
                {name}
              </Box>
            ))}
          </Stack>
        </Stack>
        <Stack className="right_content">
          <Stack
            mb={50}
            sx={{
              padding: 16,
              border: `1px solid ${theme.bgColor.bg2}`,
              boxShadow: `inset 0px -1px 0px ${theme.bgColor.bg2}`
            }}
          >
            <RowSentence>
              <span>Sale type</span>
              <span>Purchase limit</span>
            </RowSentence>
            <RowSentence>
              <span>Price</span>
              <span>1 STPT = 13，000 RAI</span>
            </RowSentence>
            <RowSentence>
              <span>Est.discount</span>
              <span>-20%</span>
            </RowSentence>
            <Input
              readOnly
              value={'10,000'}
              errSet={() => {}}
              onChange={() => {}}
              placeholder=""
              label="Swap"
              rightLabel=""
              type="swap"
            />
            <Input
              readOnly
              value={'10,000'}
              errSet={() => {}}
              onChange={() => {}}
              placeholder=""
              label="Pay"
              rightLabel="Balance: 20,000 STPT"
              type="pay"
            />
            <RowSentence>
              <span>Claimable balance</span>
              <span>10,000 RAI</span>
            </RowSentence>
            <Typography color={theme.palette.text.secondary} fontWeight={500} variant="inherit">
              *You should do your own research and understand the risks before committing your funds.
            </Typography>
            <Stack
              display="grid"
              gridTemplateRows="1fr 1fr"
              alignItems={'center'}
              justifyContent={'center'}
              spacing={10}
            >
              <BlackButton width="252px" onClick={handlePay}>
                Pay
              </BlackButton>
              <BlackButton width="252px" onClick={handleSale}>
                Sale ended
              </BlackButton>
            </Stack>
          </Stack>
          <Stack
            sx={{
              padding: 16,
              border: `1px solid ${theme.bgColor.bg2}`,
              boxShadow: `inset 0px -1px 0px ${theme.bgColor.bg2}`
            }}
          >
            <RowSentence>
              <span>Available balance</span>
              <span>1,000 RAI</span>
            </RowSentence>
            <RowSentence>
              <span>Available funds</span>
              <span>30,000 STPT</span>
            </RowSentence>
            <Stack
              display="grid"
              gridTemplateRows="1fr 1fr"
              alignItems={'center'}
              justifyContent={'center'}
              spacing={10}
            >
              <BlackButton width="252px" onClick={handlePay}>
                Claim all
              </BlackButton>
              <BlackButton width="252px" onClick={handleSale}>
                Cancel event
              </BlackButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}
