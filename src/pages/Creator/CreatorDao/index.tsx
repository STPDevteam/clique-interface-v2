import { Box, styled, Typography } from '@mui/material'
import Back from 'components/Back'
import useBreakpoint from 'hooks/useBreakpoint'
import { useState } from 'react'
import { ContainerWrapper } from '../StyledCreate'
import Basic from './Basic'
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
  REVIEW
}

const tabs = [
  { name: '1. Basic', value: Tabs.BASIC },
  { name: '3. Review', value: Tabs.REVIEW }
]

export default function Index() {
  const [curTab, setCurTab] = useState(Tabs.BASIC)
  const [hash] = useState<string>()
  const isSmDown = useBreakpoint('sm')
  return (
    <ContainerWrapper maxWidth={1140} margin={isSmDown ? '0 auto 40px' : '40px auto 80px'}>
      <Back />
      <Typography textAlign={'center'} mt={20} mb={40} fontSize={20} fontWeight={600}>
        Add a DAO on Clique
      </Typography>
      <StyledTabWrapper>
        {tabs.map(({ value, name }) => (
          <Box key={value} className={`tab-item border-tab-item ${curTab === value ? 'active' : ''}`}>
            {name}
          </Box>
        ))}
      </StyledTabWrapper>
      {curTab === Tabs.BASIC && <Basic next={() => setCurTab(Tabs.REVIEW)}></Basic>}
      {curTab === Tabs.REVIEW && <Review hash={hash} />}
    </ContainerWrapper>
  )
}
