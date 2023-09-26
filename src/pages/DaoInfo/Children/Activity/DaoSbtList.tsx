import { Box, Typography, Stack } from '@mui/material'
import Pagination from 'components/Pagination'
import EmptyData from 'components/EmptyData'
import Loading from 'components/Loading'
import DelayLoading from 'components/DelayLoading'
import { SbtListProp } from 'hooks/useBackedSbtServer'
import { ItemCard } from 'pages/Activity/SoulTokenList'

export default function DaoSoulTokenList({
  loading,
  page,
  result
}: {
  loading: boolean
  page: {
    setCurrentPage: (currentPage: number) => void
    currentPage: number
    total: number
    totalPage: number
    pageSize: number
  }
  result: SbtListProp[]
}) {
  return (
    <>
      <Box minHeight={150}>
        {!loading && !result.length && <EmptyData sx={{ marginTop: 30 }}>No data</EmptyData>}
        <DelayLoading loading={loading}>
          <Loading sx={{ marginTop: 30 }} />
        </DelayLoading>
        <Stack spacing={20}>
          {result && result.map((item: SbtListProp, index: any) => <ItemCard key={index} {...item} />)}
        </Stack>
      </Box>
      <Box mt={20} display={'flex'} justifyContent="center">
        <Pagination
          count={page.totalPage}
          page={page.currentPage}
          onChange={(_, value) => page.setCurrentPage(value)}
        />
      </Box>
      <Typography variant="body2" textAlign={'right'} sx={{ color: theme => theme.palette.text.secondary }}>
        Notice: Newly created SBT will appear here in a few minutes.
      </Typography>
    </>
  )
}
