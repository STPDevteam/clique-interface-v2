import SearchPanel from './SearchPanel'
import { Grid, Box, Typography } from '@mui/material'
import DaoItem from './DaoItem'
import Pagination from 'components/Pagination'
import { useHomeDaoList } from 'hooks/useBackedDaoServer'
import HomeTabs from './HomeTabs'
import DelayLoading from 'components/DelayLoading'
import Loading from 'components/Loading'
import EmptyData from 'components/EmptyData'
import useBreakpoint from 'hooks/useBreakpoint'

export default function Home() {
  const {
    result: homeDaoList,
    page,
    loading,
    search: { keyword, setKeyword, category, setCategory }
  } = useHomeDaoList()
  const isSmDown = useBreakpoint('sm')

  return (
    <Box sx={{ maxWidth: 1248 }}>
      {!isSmDown && <SearchPanel searchValue={keyword} onSearchValue={val => setKeyword(val)} />}
      <Box sx={{ mt: { sm: 12, xs: -24 } }}>
        <HomeTabs value={category} changeTab={val => setCategory(val)} />
        <Box minHeight={316}>
          {!loading && !homeDaoList.length && <EmptyData sx={{ marginTop: 30 }}>No data</EmptyData>}
          <DelayLoading loading={loading}>
            <Box sx={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loading sx={{ marginTop: 30 }} />
            </Box>
          </DelayLoading>
          <Grid
            spacing={isSmDown ? 16 : 18}
            container
            mt={7}
            sx={{
              overflow: 'hidden'
            }}
          >
            {!loading &&
              homeDaoList.map(item => (
                <Grid key={item.daoAddress + item.chainId} item lg={3} md={4} sm={6} xs={12}>
                  <DaoItem {...item} />
                </Grid>
              ))}
          </Grid>
        </Box>

        <Box mt={20} display={'flex'} justifyContent="center">
          <Pagination
            count={page.totalPage}
            page={page.currentPage}
            onChange={(_, value) => page.setCurrentPage(value)}
          />
        </Box>
        <Typography variant="body2" textAlign={'right'} sx={{ color: theme => theme.palette.text.secondary }}>
          Notice: Newly created DAO will appear here in a few minutes.
        </Typography>
      </Box>
    </Box>
  )
}
