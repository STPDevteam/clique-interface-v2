import Input from 'components/Input'
import { ReactComponent as SearchIcon } from 'assets/svg/search_icon.svg'
import { styled, Box, Typography, useTheme, Stack } from '@mui/material'
import { useState } from 'react'
import { useHomeOverview } from 'hooks/useBackedDaoServer'
import { formatMillion } from 'utils/dao'

const StyledSearchPanel = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  height: 240,
  padding: '52px',
  borderRadius: theme.borderRadius.default,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  '& .search': {
    path: {
      fill: '#200E32'
    }
  },
  [theme.breakpoints.down('lg')]: {
    gap: '20px',
    gridTemplateColumns: '1fr',
    height: 'auto'
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

  const homeOverview = useHomeOverview()

  const theme = useTheme()
  return (
    <StyledSearchPanel>
      <Box>
        <Typography variant="h4" mb={24} color={theme.palette.common.white}>
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
      </Box>
      <Stack
        direction={'row'}
        sx={{
          justifyContent: { md: 'start', lg: 'center' },
          '&>:last-child': { border: 'none', paddingRight: 0 },
          '&>:first-child': { paddingLeft: 0 }
        }}
        alignItems="center"
      >
        <StaticsItem name="DAOs" value={homeOverview ? formatMillion(homeOverview.totalDao) : '-'} />
        <StaticsItem name="Verified DAOs" value={homeOverview ? formatMillion(homeOverview.totalApproveDao) : '-'} />
        <StaticsItem name="Users" value={homeOverview ? formatMillion(homeOverview.totalAccount) : '-'} />
        <StaticsItem name="Proposals" value={homeOverview ? formatMillion(homeOverview.totalProposal) : '-'} />
      </Stack>
    </StyledSearchPanel>
  )
}

function StaticsItem({ name, value }: { name: string; value: string }) {
  const theme = useTheme()
  return (
    <Box padding="0 25px" borderRight={`1px solid ${theme.textColor.text6}`}>
      <Typography noWrap fontSize={16} color={theme.palette.common.white} variant="h6" fontWeight={400}>
        {name}
      </Typography>
      <Typography variant="h4" mt={10} color={theme.palette.common.white} fontSize={40} fontWeight={700}>
        {value}
      </Typography>
    </Box>
  )
}
