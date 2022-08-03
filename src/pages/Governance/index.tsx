import SearchPanel from './SearchPanel'
import { Grid, Box, Typography } from '@mui/material'
import DaoItem from './DaoItem'
import Pagination from 'components/Pagination'
import { useHomeDaoList } from 'hooks/useBackedDaoServer'
import HomeTabs from './HomeTabs'
import DelayLoading from 'components/DelayLoading'
import Loading from 'components/Loading'
import EmptyData from 'components/EmptyData'

export default function Home() {
  const {
    result: homeDaoList,
    page,
    loading,
    search: { keyword, setKeyword, category, setCategory }
  } = useHomeDaoList()

  return (
    <Box sx={{ maxWidth: 1248 }}>
      <SearchPanel searchValue={keyword} onSearchValue={val => setKeyword(val)} />
      <Box mt={12}>
        <HomeTabs value={category} changeTab={val => setCategory(val)} />
        <Box minHeight={316}>
          {!loading && !homeDaoList.length && <EmptyData sx={{ marginTop: 30 }}>No data</EmptyData>}
          <DelayLoading loading={loading}>
            <Loading sx={{ marginTop: 30 }} />
          </DelayLoading>
          <Grid spacing={18} container mt={7}>
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
