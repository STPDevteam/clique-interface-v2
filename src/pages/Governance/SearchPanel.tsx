import Input from 'components/Input'
import { ReactComponent as SearchIcon } from 'assets/svg/search_icon.svg'
import { styled, Box, Typography, useTheme, Stack } from '@mui/material'
import { useState } from 'react'
import { useHomeOverview } from 'hooks/useBackedDaoServer'
import { formatMillion } from 'utils/dao'
import useBreakpoint from 'hooks/useBreakpoint'

const StyledSearchPanel = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  height: 200,
  padding: '32px 52px',
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
  },
  [theme.breakpoints.down('sm')]: {
    height: 'auto',
    padding: '26px'
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
        <Typography
          variant="h4"
          sx={{ fontSize: { xs: 24, sm: 32 }, mb: { sm: 24, xs: 16 }, textAlign: { xs: 'center', sm: 'left' } }}
          color={theme.palette.common.white}
        >
          Welcome to Clique
        </Typography>
        <Input
          value={searchStr}
          onChange={val => setSearchStr(val.target.value)}
          maxWidth="432px"
          onEnter={() => onSearchValue(searchStr)}
          onBlur={() => onSearchValue(searchStr)}
          startAdornment={
            <SearchIcon className="search" style={{ cursor: 'pointer' }} onClick={() => onSearchValue(searchStr)} />
          }
          placeholder="Search and Discover DAOs"
        />
      </Box>
      <Stack
        direction={'row'}
        sx={{
          justifyContent: { xs: 'center', md: 'start', lg: 'center' },
          '&>:last-child': { border: 'none', paddingRight: 0 },
          '&>:first-child': { paddingLeft: 0 }
        }}
        alignItems="center"
      >
        <StaticsItem name="DAOs" value={homeOverview ? formatMillion(homeOverview.totalDao) : '-'} />
        {/* <StaticsItem name="Verified DAOs" value={homeOverview ? formatMillion(homeOverview.totalApproveDao) : '-'} /> */}
        <StaticsItem name="Users" value={homeOverview ? formatMillion(homeOverview.totalAccount) : '-'} />
        <StaticsItem name="Proposals" value={homeOverview ? formatMillion(homeOverview.totalProposal) : '-'} />
      </Stack>
    </StyledSearchPanel>
  )
}

function StaticsItem({ name, value }: { name: string; value: string }) {
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')
  return (
    <Box
      sx={{
        padding: { sm: '0 25px', xs: '0 16px' }
      }}
      borderRight={`1px solid ${theme.textColor.text6}`}
    >
      <Typography
        textAlign={'center'}
        noWrap
        fontSize={isSmDown ? 14 : 16}
        color={theme.palette.common.white}
        variant="h6"
        fontWeight={400}
      >
        {name}
      </Typography>
      <Typography
        textAlign={'center'}
        variant="h4"
        mt={isSmDown ? 0 : 10}
        color={theme.palette.common.white}
        fontSize={isSmDown ? 24 : 40}
        fontWeight={700}
      >
        {value}
      </Typography>
    </Box>
  )
}
