import { Stack } from '@mui/material'
import { AirdropItem, PublicSaleItem } from 'pages/Activity/ActivityItem'

export function AirdropList() {
  return (
    <Stack spacing={24}>
      <AirdropItem />
      <AirdropItem />
      <AirdropItem />
    </Stack>
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
