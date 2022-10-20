import { Box, Stack, Typography } from '@mui/material'
import DelayLoading from 'components/DelayLoading'
import EmptyData from 'components/EmptyData'
import Loading from 'components/Loading'
import Pagination from 'components/Pagination'
import { ActivityListProp } from 'hooks/useBackedActivityServer'
import { AirdropItem, PublicSaleItem } from 'pages/Activity/ActivityItem'
import { Dispatch, SetStateAction } from 'react'

export function AirdropList({
  loading,
  page,
  result
}: {
  loading: boolean
  page: {
    setCurrentPage: Dispatch<SetStateAction<number>>
    currentPage: number
    total: number
    totalPage: number
    pageSize: number
  }
  result: ActivityListProp[]
}) {
  return (
    <>
      <Box minHeight={150}>
        {!loading && !result.length && <EmptyData sx={{ marginTop: 30 }}>No data</EmptyData>}
        <DelayLoading loading={loading}>
          <Loading sx={{ marginTop: 30 }} />
        </DelayLoading>
        <Stack spacing={24}>
          {result.map(item => (
            <AirdropItem key={item.activityId} item={item} />
          ))}
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
        Notice: Newly created DAO Rewards will appear here in a few minutes.
      </Typography>
    </>
  )
}

export function PublicSaleList() {
  return (
    <Stack spacing={24}>
      <PublicSaleItem />
      <PublicSaleItem />
      <PublicSaleItem />
    </Stack>
  )
}
