import { Box, Stack, Typography, MenuItem, Grid } from '@mui/material'
import Button from 'components/Button/Button'
import Select from 'components/Select/Select'
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
import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'

const itemList = [
  { value: undefined, label: 'All Proposals' },
  { value: 'Soon', label: 'Soon' },
  { value: 'Active', label: 'Active' },
  { value: 'Closed', label: 'Closed' }
]

export default function Proposal() {
  const history = useHistory()
  const { showModal } = useModal()
  const { buildingDaoData: daoInfo } = useBuildingDaoDataCallback()
  const params = useParams<{ daoId: string }>()
  const isSmDown = useBreakpoint('sm')
  const {
    search: { status: currentProposalStatus, setStatus: setCurrentProposalStatus },
    loading,
    result: proposalBaseList,
    page
  } = useProposalBaseList(Number(params.daoId))
  console.log(proposalBaseList, currentProposalStatus)

  return (
    <DaoContainer>
      <Box>
        <Box mb={20} display={'grid'} gridTemplateColumns={'1fr 158px'} gap={60}>
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
              onClick={() => {
                if (!daoInfo.daoCanCreateProposal) {
                  showModal(
                    <MessageBox type="error">Please wait for the administrator to set up governance rules</MessageBox>
                  )
                  return
                }
                history.push(routes._DaoInfo + `/${params.daoId}/proposal/create`)
              }}
            >
              + Create A Proposal
            </Button>
            <Select
              noBold
              placeholder=""
              style={{ fontWeight: 500, fontSize: 14 }}
              // width={isSmDown ? 160 : 158}
              height={isSmDown ? '30px' : '36px'}
              value={currentProposalStatus}
              onChange={e => setCurrentProposalStatus(e.target.value)}
            >
              {itemList.map(item => (
                <MenuItem
                  key={item.value}
                  sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                  value={item.value}
                  selected={currentProposalStatus === item.value}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Box>
        <Box minHeight={200}>
          {!loading && !proposalBaseList.length && <EmptyData sx={{ marginTop: 30 }}>No data</EmptyData>}
          <DelayLoading loading={loading}>
            <Box sx={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loading sx={{ marginTop: 30 }} />
            </Box>
          </DelayLoading>

          <Grid container justifyContent={'space-between'} width={'100%'}>
            {!loading &&
              proposalBaseList.map(item => (
                <Box key={item.proposalId + item.startTime + item.endTime} mb={20}>
                  <ProposalItem {...item} />
                </Box>
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
