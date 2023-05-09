import { Box, Grid, MenuItem, Typography } from '@mui/material'
import Button from 'components/Button/Button'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import Select from 'components/Select/Select'
import { ProposalStatus } from 'hooks/useProposalInfo'
import ProposalItem from './ProposalItem'
import { useHistory, useParams } from 'react-router'
import { routes } from 'constants/routes'
import { useProposalBaseList } from 'hooks/useBackedProposalServer'
import DelayLoading from 'components/DelayLoading'
import EmptyData from 'components/EmptyData'
import Loading from 'components/Loading'
import Pagination from 'components/Pagination'
import useBreakpoint from 'hooks/useBreakpoint'

const itemList = [
  { value: undefined, label: 'All Proposals' },
  { value: ProposalStatus.SOON, label: 'Soon' },
  { value: ProposalStatus.OPEN, label: 'Active' },
  { value: ProposalStatus.CLOSED, label: 'Closed' }
]

export default function Proposal() {
  const history = useHistory()
  const params = useParams<{ chainId: string; address: string }>()
  const isSmDown = useBreakpoint('sm')
  const {
    search: { status: currentProposalStatus, setStatus: setCurrentProposalStatus },
    loading,
    result: proposalBaseList,
    page
  } = useProposalBaseList(Number(params.chainId), params.address)

  return (
    <ContainerWrapper maxWidth={1248}>
      <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
        <Button
          width={isSmDown ? '146px' : '252px'}
          fontSize={isSmDown ? 10 : 14}
          height={isSmDown ? '40px' : '56px'}
          borderRadius={isSmDown ? '8px' : undefined}
          style={{ fontWeight: 700 }}
          onClick={() => history.push(routes._DaoInfo + `/${params.chainId}/${params.address}/proposal/create`)}
        >
          + Create A Proposal
        </Button>
        <Select
          noBold
          placeholder=""
          width={isSmDown ? 160 : 235}
          height={isSmDown ? 40 : undefined}
          value={currentProposalStatus}
          onChange={e => setCurrentProposalStatus(e.target.value)}
        >
          {itemList.map(item => (
            <MenuItem
              key={item.value}
              sx={{ fontWeight: 500, fontSize: 10 }}
              value={item.value}
              selected={currentProposalStatus && currentProposalStatus === item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box mt={17} minHeight={200}>
        {!loading && !proposalBaseList.length && <EmptyData sx={{ marginTop: 30 }}>No data</EmptyData>}
        <DelayLoading loading={loading}>
          <Loading sx={{ marginTop: 30 }} />
        </DelayLoading>
        <Grid container rowSpacing={18} columnSpacing={isSmDown ? 0 : 34}>
          {!loading &&
            proposalBaseList.map(item => (
              <Grid item key={item.proposalId + item.startTime + item.endTime} lg={6} xs={12}>
                <ProposalItem {...item} />
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
        Notice: Newly created proposal will appear here in a few minutes.
      </Typography>
    </ContainerWrapper>
  )
}
