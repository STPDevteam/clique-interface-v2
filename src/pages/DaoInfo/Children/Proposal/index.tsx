import { Box, Grid, MenuItem, Stack, Typography } from '@mui/material'
import Button from 'components/Button/Button'
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
import DaoContainer from 'components/DaoContainer'
import { ReactComponent as ProposalIcon } from 'assets/svg/proposal.svg'

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
    <DaoContainer>
      <Box>
        <Box mb={30} display={'grid'} gridTemplateColumns={'1fr 158px'} gap={60}>
          <Box>
            <Stack
              sx={{
                'svg path': {
                  fill: 'rgba(0, 73, 198, 1)'
                }
              }}
              direction={'row'}
              alignItems={'center'}
            >
              <ProposalIcon />
              <Typography
                sx={{
                  ml: '6px',
                  fontWeight: '600',
                  fontSize: '30px',
                  lineHeight: '20px'
                }}
              >
                Proposal
              </Typography>
            </Stack>
            <Typography variant="body1" lineHeight="20px" mt={12}>
              Core members can initiate a vote and get the number of votes through tasks. If the number of votes in
              favor is greater than 50%, and the number of valid votes is not less than 2/3 of the total number of
              votes, it will be viewed as passed.
            </Typography>
          </Box>
          <Stack spacing={15} mt={5}>
            <Button
              width={isSmDown ? '146px' : '158px'}
              fontSize={isSmDown ? 10 : 14}
              height={isSmDown ? '30px' : '36px'}
              borderRadius={isSmDown ? '8px' : undefined}
              style={{ fontWeight: 700 }}
              onClick={() => history.push(routes._DaoInfo + `/${params.chainId}/${params.address}/proposal/create`)}
            >
              + Create A Proposal
            </Button>
            <Select
              noBold
              placeholder=""
              style={{ fontWeight: 500, fontSize: 14 }}
              width={isSmDown ? 160 : 158}
              height={isSmDown ? 36 : 36}
              value={currentProposalStatus}
              onChange={e => setCurrentProposalStatus(e.target.value)}
            >
              {itemList.map(item => (
                <MenuItem
                  key={item.value}
                  sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                  value={item.value}
                  selected={currentProposalStatus && currentProposalStatus === item.value}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Box>
        <Box mt={17} minHeight={200}>
          {!loading && !proposalBaseList.length && <EmptyData sx={{ marginTop: 30 }}>No data</EmptyData>}
          <DelayLoading loading={loading}>
            <Box sx={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loading sx={{ marginTop: 30 }} />
            </Box>
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
      </Box>
    </DaoContainer>
  )
}
