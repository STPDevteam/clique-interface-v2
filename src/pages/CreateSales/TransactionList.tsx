import { Box, Link, Stack, Typography } from '@mui/material'
import DelayLoading from 'components/DelayLoading'
import EmptyData from 'components/EmptyData'
import Loading from 'components/Loading'
import Pagination from 'components/Pagination'
import theme from 'theme'

export default function TransactionList({
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
  result: any[]
}) {
  return (
    <>
      <Box minHeight={150}>
        {!loading && !result.length && <EmptyData sx={{ marginTop: 30 }}>No data</EmptyData>}
        <DelayLoading loading={loading}>
          <Loading sx={{ marginTop: 30 }} />
        </DelayLoading>
        <Stack mt={40} spacing={40}>
          {result.map(item => {
            return (
              <Stack key={item} display={'flex'} justifyContent={'space-between'} flexDirection={'row'}>
                <Link>{item.title}</Link>
                <Typography color={theme.palette.text.secondary} fontWeight={500} lineHeight={1.5} variant="inherit">
                  {item.date}
                </Typography>
              </Stack>
            )
          })}
        </Stack>
      </Box>
      <Box mt={20} display={'flex'} justifyContent="center">
        <Pagination
          count={page.totalPage}
          page={page.currentPage}
          onChange={(_, value) => page.setCurrentPage(value)}
        />
      </Box>
    </>
  )
}
