import { Box } from '@mui/material'
import { useHomeDaoList } from 'hooks/useBackedDaoServer'
import useBreakpoint from 'hooks/useBreakpoint'
import LeftMenu from './LeftSider'
import SearchPanel from './SearchPanel'

export default function GovernanceContainer({ children }: { children: any }) {
  const {
    search: { keyword, setKeyword }
  } = useHomeDaoList()
  const isSm = useBreakpoint('sm')
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '80px 1fr' },
        minHeight: '100%',
        width: '100%'
      }}
    >
      {isSm && (
        <Box
          sx={{
            padding: { sm: '16px', xs: '0 16px' }
          }}
        >
          <SearchPanel searchValue={keyword} onSearchValue={val => setKeyword(val)} />{' '}
        </Box>
      )}
      <LeftMenu />
      <Box
        sx={{
          padding: { sm: '24px 32px', xs: '20px 16px' }
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
