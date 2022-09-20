import { Box, styled, Typography } from '@mui/material'
import Back from 'components/Back'
import { useState } from 'react'
import { ContainerWrapper } from '../StyledCreate'
import Basic from './Basic'
import Governance from './Governance'
import Review from './Review'

const StyledTabWrapper = styled(Box)(({}) => ({
  maxWidth: 540,
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-around',
  fontWeight: 600,
  fontSize: 14,
  lineHeight: '20px',
  [`& .tab-item`]: {
    paddingBottom: 16
  }
}))

enum Tabs {
  BASIC,
  GOVERNANCE,
  REVIEW
}

const tabs = [
  { name: '1. Basic', value: Tabs.BASIC },
  { name: '2. Distribution', value: Tabs.GOVERNANCE },
  { name: '3. Review', value: Tabs.REVIEW }
]

export default function Index() {
  const [curTab, setCurTab] = useState(Tabs.BASIC)
  const [hash, setHash] = useState<string>()
  return (
    <ContainerWrapper maxWidth={1140} margin={'40px auto 80px'}>
      <Back />
      <Typography textAlign={'center'} mt={20} mb={40} fontSize={20} fontWeight={600}>
        Create a token
      </Typography>
      <StyledTabWrapper>
        {tabs.map(({ value, name }) => (
          <Box key={value} className={`tab-item border-tab-item ${curTab === value ? 'active' : ''}`}>
            {name}
          </Box>
        ))}
      </StyledTabWrapper>
      {curTab === Tabs.BASIC && <Basic next={() => setCurTab(Tabs.GOVERNANCE)}></Basic>}
      {curTab === Tabs.GOVERNANCE && (
        <Governance
          next={(hash: string) => {
            setHash(hash)
            setCurTab(Tabs.REVIEW)
          }}
          back={() => setCurTab(Tabs.BASIC)}
        ></Governance>
      )}
      {curTab === Tabs.REVIEW && <Review hash={hash} />}
    </ContainerWrapper>
  )
}
