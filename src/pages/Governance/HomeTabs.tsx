import { Box, styled } from '@mui/material'
import { CategoriesTypeProp } from 'state/buildingGovDao/actions'

const itemList = Object.values(CategoriesTypeProp)

const StyledWrapper = styled('ul')(({ theme }) => ({
  borderBottom: `1px solid ${theme.bgColor.bg2}`,
  display: 'flex',
  justifyContent: 'right',
  padding: 0,
  listStyle: 'none',
  fontSize: 14,
  margin: 0,
  fontWeight: 600,
  overflowX: 'auto',
  color: theme.palette.text.secondary,
  '& li': {
    cursor: 'pointer',
    padding: '12px 0',
    marginLeft: 64,
    '&:first-of-type': {
      marginLeft: 0
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 24
    },
    '&.active': {
      color: theme.palette.text.primary
    }
  },
  [theme.breakpoints.down('sm')]: {
    display: 'inline-flex'
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
    <Box
      sx={{
        overflowX: 'auto',
        width: { sm: 'unset', xs: `calc(100vw - 32px)` },
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
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
