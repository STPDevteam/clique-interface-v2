import { Box, MenuItem, MenuList, styled, useTheme } from '@mui/material'
import ComingSoon from 'pages/ComingSoon'
import { useState } from 'react'
import Admin from './Admin'

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  margin: '16px 0',
  padding: '0 14px',
  fontSize: 14,
  fontWeight: 600,
  color: theme.palette.text.secondary,
  lineHeight: '26px',
  position: 'relative',
  '&.active': {
    color: theme.palette.text.primary,
    '&:before': {
      content: `''`,
      position: 'absolute',
      bottom: 0,
      top: 0,
      left: 0,
      width: 4,
      backgroundColor: theme.palette.text.primary,
      borderRadius: '0 2px 2px 0'
    }
  }
}))

const tabs = [
  {
    name: 'General',
    component: <ComingSoon />
  },
  {
    name: 'Governance setting',
    component: <ComingSoon />
  },
  {
    name: 'Admin',
    component: <Admin />
  }
]

export default function Settings() {
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState(0)
  return (
    <Box display={'grid'} gridTemplateColumns="162px 1fr" gap={25}>
      <div>
        <MenuList
          sx={{
            borderRadius: theme.borderRadius.default,
            boxShadow: theme.boxShadow.bs1,
            border: `1px solid ${theme.bgColor.bg2}`
          }}
        >
          {tabs.map(({ name }, index) => (
            <StyledMenuItem
              key={name}
              onClick={() => setActiveTab(index)}
              className={`${index === activeTab ? 'active' : ''}`}
            >
              {name}
            </StyledMenuItem>
          ))}
        </MenuList>
      </div>

      {tabs[activeTab].component}
    </Box>
  )
}
