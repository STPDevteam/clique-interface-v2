import Input from 'components/Input'
import { ReactComponent as SearchIcon } from 'assets/svg/search_icon.svg'
import { styled, Box, Typography, useTheme } from '@mui/material'
import { useState } from 'react'

const StyledSearchPanel = styled(Box)(({ theme }) => ({
  backgroundColor: theme.bgColor.bg3,
  height: 240,
  padding: '52px',
  borderRadius: theme.borderRadius.default,
  display: 'grid',
  justifyItems: 'center',
  '& .search': {
    path: {
      fill: '#200E32'
    }
  }
}))

export default function SearchPanel({
  searchValue,
  onSearchValue
}: {
  searchValue: string
  onSearchValue: (val: string) => void
}) {
  const [searchStr, setSearchStr] = useState(searchValue)

  const theme = useTheme()
  return (
    <StyledSearchPanel>
      <Typography variant="h4" textAlign={'center'} mb={24} color={theme.palette.common.white}>
        Welcome to Clique
      </Typography>
      <Input
        value={searchStr}
        onChange={val => setSearchStr(val.target.value)}
        maxWidth="432px"
        onEnter={() => onSearchValue(searchStr)}
        onBlur={() => setSearchStr(searchValue)}
        startAdornment={<SearchIcon className="search" />}
        placeholder="Search and Discover DAOs"
      />
    </StyledSearchPanel>
  )
}
