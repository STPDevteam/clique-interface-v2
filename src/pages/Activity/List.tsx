import { Box, Stack, Typography, useTheme } from '@mui/material'
import { DaoAvatars } from 'components/Avatars'
import OutlineButton from 'components/Button/OutlineButton'
import Pagination from 'components/Pagination'
import { ActivityType } from 'pages/DaoInfo/Children/Activity'
import { PublicSaleItem, AirdropItem } from './ActivityItem'

function ItemWrapper({ children, type }: { children: any; type: ActivityType }) {
  const theme = useTheme()
  return (
    <Stack spacing={24}>
      <Stack direction={'row'} alignItems="center" spacing={16}>
        <DaoAvatars size={64} src={''} alt={''} />
        <Typography variant="h6">DAO Name</Typography>
        <Typography fontSize={14} fontWeight={400} color={theme.palette.text.secondary}>
          Publish at 2022-05-12 11:48:00
        </Typography>
        <OutlineButton
          style={
            type === ActivityType.AIRDROP
              ? { color: theme.palette.primary.light, borderColor: theme.palette.primary.light }
              : undefined
          }
          primary
          borderRadius="30px"
          height={40}
          width="154px"
        >
          {type}
        </OutlineButton>
      </Stack>
      {children}
    </Stack>
  )
}

export default function List() {
  return (
    <Stack mt={40} spacing={40}>
      <ItemWrapper type={ActivityType.AIRDROP}>
        <AirdropItem />
      </ItemWrapper>
      <ItemWrapper type={ActivityType.AIRDROP}>
        <AirdropItem />
      </ItemWrapper>
      <ItemWrapper type={ActivityType.AIRDROP}>
        <AirdropItem />
      </ItemWrapper>
      <ItemWrapper type={ActivityType.AIRDROP}>
        <AirdropItem />
      </ItemWrapper>
      <ItemWrapper type={ActivityType.PUBLIC_SALE}>
        <PublicSaleItem />
      </ItemWrapper>

      <Box display={'flex'} justifyContent="center">
        <Pagination count={10} page={2} onChange={() => {}} />
      </Box>
    </Stack>
  )
}
