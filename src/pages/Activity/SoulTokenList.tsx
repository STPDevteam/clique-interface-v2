import { Box, Typography, styled, Stack, Link } from '@mui/material'
import Image from 'components/Image'
import { DaoAvatars } from 'components/Avatars'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import Pagination from 'components/Pagination'
import EmptyData from 'components/EmptyData'
import Loading from 'components/Loading'
import DelayLoading from 'components/DelayLoading'
import { SbtListProp } from 'hooks/useBackedSbtServer'
import { ChainListMap } from 'constants/chain'
import { formatTimestamp } from 'utils/index'
import { formatNumberWithCommas } from 'utils'
import { capitalizeFirstLetter } from 'components/Header'
import useBreakpoint from 'hooks/useBreakpoint'

const StyledItem = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.bgColor.bg2}`,
  // boxShadow: theme.boxShadow.bs1,
  borderRadius: theme.borderRadius.default,
  padding: '20px 56px 20px 24px',
  display: 'grid',
  gap: 34,
  cursor: 'pointer',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: '180px 1fr'
  },
  [theme.breakpoints.down('sm')]: {
    padding: '10px 15px 16px',
    gridTemplateRows: '180px 1fr',
    gap: 20
  }
}))
const ContentBoxStyle = styled(Box)(() => ({
  display: 'grid',
  flexDirection: 'column',
  gap: 20
}))
const ContentTitleStyle = styled(Typography)(() => ({
  fontSize: ' 14px',
  lineHeight: '16px',
  color: '#80829F'
}))
const ContentStyle = styled(Typography)(() => ({
  fontSize: ' 16px',
  lineHeight: '20px',
  color: '#3F5170'
}))
const ContentLayout = styled(Box)(() => ({
  display: 'grid',
  flexDirection: 'column',
  gap: 10
}))
const StatusStyle = styled(Box)(({ color }: { color?: string }) => ({
  width: 70,
  height: 30,
  padding: '6px 0 6px 13px',
  background: color === 'active' ? '#EBFFD2' : color === 'soon' ? '#E9FAFF' : '#F8FBFF',
  borderRadius: '20px',
  display: 'flex',
  gap: 5,
  alignItems: 'center',
  fontWeight: 600,
  fontSize: 12,
  lineHeight: '18px',
  color: color === 'active' ? '#21C431' : color === 'soon' ? '#0049C6' : '#8D8EA5',
  '&:before': {
    content: `''`,
    width: 5,
    height: 5,
    background: color == 'active' ? '#21C431' : color === 'soon' ? '#0049C6' : '#8D8EA5',
    borderRadius: '50%'
  }
}))

export default function SoulTokenList({
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
    </>
  )
}

export function ItemCard(item: SbtListProp) {
  const navigate = useNavigate()
  const isSm = useBreakpoint('sm')
  console.log('isSm', isSm)

  return (
    <StyledItem
      onClick={() => {
        navigate(routes._SoulTokenDetail + '/' + item.daoId + '/' + item.SBTId)
      }}
    >
      <Image
        src={item?.fileUrl}
        style={{
          height: 180,
          width: 180,
          border: ' 1px solid #D4D7E2',
          borderRadius: '8px '
        }}
      />

      <ContentBoxStyle>
        <Box sx={{ display: 'grid', gap: 10 }}>
          <Box sx={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <DaoAvatars src={item?.daoLogo} size={36} />
            <Box sx={{ display: 'grid', gap: 3 }}>
              <Typography variant="body1" lineHeight={'16px'} fontSize={14} color={'#80829F'}>
                DAO
              </Typography>
              <Link
                target="_blank"
                href={routes._DaoInfo + `/${item.daoId}` + '/proposal'}
                sx={{
                  fontWeight: '600',
                  fontSize: 16,
                  textDecoration: 'none',
                  color: '#3F5170',
                  ':hover': { textDecoration: 'underline' }
                }}
              >
                {item?.daoName}
              </Link>
            </Box>
          </Box>
          <Box>
            <Typography
              variant="h6"
              lineHeight={'27px'}
              sx={{ wordBreak: 'break-all', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {/* The STP protocol is open to anyone, and project configurations can vary widely. There are risks associated
            with interacting with all projects on the protocol... */}
              {item?.itemName}
            </Typography>
          </Box>
        </Box>
        {/* <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 300px' }}> */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
          <ContentLayout>
            <ContentTitleStyle>Items</ContentTitleStyle>
            <ContentStyle>{formatNumberWithCommas(item?.totalSupply)}</ContentStyle>
          </ContentLayout>
          <ContentLayout>
            <ContentTitleStyle>Network</ContentTitleStyle>
            <ContentStyle>{ChainListMap[item.tokenChainId]?.name || '--'}</ContentStyle>
          </ContentLayout>
          <ContentLayout>
            <ContentTitleStyle>Status</ContentTitleStyle>
            <StatusStyle color={item?.status}>{capitalizeFirstLetter(item?.status)}</StatusStyle>
          </ContentLayout>
          <ContentLayout>
            <ContentTitleStyle>Claimable Period</ContentTitleStyle>
            <ContentStyle>
              {item?.startTime ? formatTimestamp(item?.startTime) : '--'} -{' '}
              {item?.endTime ? formatTimestamp(item?.endTime) : '--'}
            </ContentStyle>
          </ContentLayout>
        </Box>
      </ContentBoxStyle>
    </StyledItem>
  )
}
