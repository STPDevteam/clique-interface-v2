import { Box, styled } from '@mui/material'
import { CategoriesTypeProp } from 'state/buildingGovDao/actions'

const itemList = Object.values(CategoriesTypeProp).map(v => v)

const StyledWrapper = styled('ul')(({ theme }) => ({
  borderBottom: `1px solid ${theme.bgColor.bg2}`,
  display: 'flex',
  justifyContent: 'right',
  padding: 0,
  listStyle: 'none',
  fontSize: 14,
  margin: 0,
  fontWeight: 600,
  color: theme.palette.text.secondary,
  '& li': {
    cursor: 'pointer',
    padding: '12px 0',
    marginLeft: 64,
    '&.active': {
      color: theme.palette.text.primary
    }
  }
}))

export default function HomeTabs({
  value,
  changeTab
}: {
  value: string
  changeTab: (val: CategoriesTypeProp) => void
}) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <StyledWrapper>
        {itemList.map(item => (
          <li
            className={`border-tab-item ${value === item ? 'active' : ''}`}
            onClick={() => changeTab(item)}
            key={item}
          >
            {item}
          </li>
        ))}
      </StyledWrapper>
    </Box>
  )
}
