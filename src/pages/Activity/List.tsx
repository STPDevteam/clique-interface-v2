import { Box, Link, Stack, Typography, useTheme } from '@mui/material'
import { DaoAvatars } from 'components/Avatars'
// import OutlineButton from 'components/Button/OutlineButton'
import DelayLoading from 'components/DelayLoading'
import EmptyData from 'components/EmptyData'
import Loading from 'components/Loading'
import Pagination from 'components/Pagination'
// import { ChainId } from 'constants/chain'
import { routes } from 'constants/routes'
import { ActivityListProp } from 'hooks/useBackedActivityServer'
import useBreakpoint from 'hooks/useBreakpoint'
import { ActivityType } from 'pages/DaoInfo/Children/Activity'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import { timeStampToFormat } from 'utils/dao'
import { AirdropItem } from 'pages/Activity/ActivityItem'
// import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'

function ItemWrapper({
  children,
  type,
  publishTime,
  daoId,
  daoLogo,
  daoName
}: {
  children: any
  type: ActivityType
  publishTime: number
  daoId: number
  daoLogo: string
  daoName: string
}) {
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')
  console.log(type)

  // const { buildingDaoData: daoBaseInfo } = useBuildingDaoDataCallback()
  return (
    <Stack spacing={24}>
      <Stack direction={'row'} alignItems="center" spacing={16}>
        <Link href={routes._DaoInfo + `/${daoId}/proposal`}>
          <DaoAvatars size={isSmDown ? 40 : 64} src={daoLogo} alt={''} />
        </Link>
        <RowCenter flexWrap={'wrap'}>
          <Typography variant="h6" mr={10}>
            {daoName || '--'}
          </Typography>
          <Typography
            fontSize={isSmDown ? 12 : 14}
            lineHeight={1.2}
            fontWeight={400}
            color={theme.palette.text.secondary}
          >
            Publish at {timeStampToFormat(publishTime)}
          </Typography>
        </RowCenter>
        {/* <OutlineButton
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
          {activityTypeText[type]}
        </OutlineButton> */}
      </Stack>
      {children}
    </Stack>
  )
}

export default function List({
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
  result: ActivityListProp[]
}) {
  return (
    <>
      <Box minHeight={150}>
        {!loading && !result.length && <EmptyData sx={{ marginTop: 30 }}>No data</EmptyData>}
        <DelayLoading loading={loading}>
          <Loading sx={{ marginTop: 30 }} />
        </DelayLoading>
        <Stack mt={40} spacing={40}>
          {result.map(item => (
            <ItemWrapper
              daoId={item.daoId}
              daoLogo={item.daoLogo}
              daoName={item.daoName}
              key={item.airdropId}
              publishTime={item.publishTime}
              type={ActivityType.AIRDROP}
            >
              {/* {item.types === ActivityType.AIRDROP ? <AirdropItem item={item} /> : <PublicSaleItem />}
               */}
              <AirdropItem item={item} />
            </ItemWrapper>
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
    </>
  )
}
