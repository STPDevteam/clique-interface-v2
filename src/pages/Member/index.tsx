import { Box, Typography, styled, Tabs, Tab, Divider, useTheme } from '@mui/material'
import { ReactComponent as MemberIcon } from 'assets/svg/member.svg'
import Button from 'components/Button/Button'
import { ReactComponent as View } from 'assets/svg/view.svg'
import { ReactComponent as Job } from 'assets/svg/job.svg'
import { ReactComponent as Invite } from 'assets/svg/invite.svg'
import { useState, useCallback } from 'react'
import CardView from './Children/CardView'
import JobApplication from './Children/JobApplication'
import InviteUser from './Children/InviteUser'
import { useJobsApplyList, useJobsList } from 'hooks/useBackedDaoServer'
import { useNavigate, useParams } from 'react-router-dom'
import DaoContainer from 'components/DaoContainer'
import OpenJobs from './Children/OpenJobs'
import { useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
import EmptyPage from 'pages/DaoInfo/Children/emptyPage'
import useModal from 'hooks/useModal'
import AddJobsModal from 'pages/AboutSetting/Modals/AddJobsModal'
import { TooltipStyle } from 'pages/DaoInfo/LeftSider'
import AddMemberModal from 'pages/AboutSetting/Modals/AddMemberModal'
import { routes } from 'constants/routes'
import { useGetPublishJobList } from 'hooks/useBackedTaskServer'
import { useActiveWeb3React } from 'hooks'
import Loading from 'components/Loading'
import useBreakpoint from 'hooks/useBreakpoint'

const StyledTabs = styled('div')(({ theme }) => ({
  display: 'flex',
  fontWeight: 600,
  fontSize: 14,
  listStyle: 'none',
  padding: 0,
  height: 60,
  '&>*': {
    marginRight: 60,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    color: '#0049c6',
    cursor: 'pointer',
    '&:hover': {
      color: '#0049c6'
    },
    '&.active': {
      color: '#0049c6'
    }
  },
  '& .css-1jxw4rn-MuiTabs-indicator': {
    width: '0!important'
  },
  '& button': {
    display: 'flex',
    alignItems: 'center',
    border: 0,
    paddingLeft: 0,
    '&:hover': {
      color: '#0049c6'
    },
    '&:hover svg path': {
      fill: '#0049c6'
    },
    '&.active': {
      fontWeight: 600
    },
    '&.active svg path': {
      fill: '#0049c6'
    }
  },
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'space-evenly',
    '&>*': {
      marginRight: 0,

      '&:last-child': {
        marginRight: 0
      },
      '& .css-1q9gtu-MuiButtonBase-root-MuiTab-root': {
        fontSize: '12px !important',
        gap: 5
      },
      '& .css-heg063-MuiTabs-flexContainer': {
        justifyContent: 'space-between',
        width: 'calc(100vw - 32px)'
      },
      '& button': {
        padding: 0
      }
    }
  }
}))

const DisabledBtn = styled(Box)({
  cursor: 'no-drop',
  width: 125,
  height: 36,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  backgroundColor: '#97B7EF',
  color: '#fff',
  fontFamily: 'Inter',
  fontSize: '14px',
  fontWeight: 700,
  lineHeight: '20px'
})

export default function Member() {
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')
  const [rand, setRand] = useState(Math.random())
  const { account } = useActiveWeb3React()
  const [randNum] = useState(Math.random())
  const { daoId: daoId } = useParams<{ daoId: string }>()
  const [tabValue, setTabValue] = useState(0)
  const curDaoId = Number(daoId)
  const navigate = useNavigate()
  const { showModal, hideModal } = useModal()
  const { myJoinDaoData: isJoined } = useUpdateDaoDataCallback()
  const { result: applyList } = useJobsApplyList(curDaoId, rand)
  const { result: jobsList, loading: jobListLoading } = useJobsList(curDaoId)
  const { result: jobsNum } = useGetPublishJobList(curDaoId, randNum)
  const addJobsCB = useCallback(() => {
    showModal(
      <AddJobsModal isEdit={false} chainId={curDaoId} onDimiss={() => setRand(Math.random())} originLevel={1} />
    )
  }, [curDaoId, showModal])

  const addMemberCB = useCallback(() => {
    showModal(<AddMemberModal onClose={hideModal} daoId={curDaoId} />)
  }, [curDaoId, hideModal, showModal])

  const tabList = !isJoined
    ? []
    : isJoined && isJoined.job !== 'owner' && isJoined.job !== 'superAdmin'
    ? [
        {
          label: 'Card View',
          icon: <View />
        },
        {
          label: 'Open Jobs',
          icon: <Job />
        }
      ]
    : [
        {
          label: 'Card View',
          icon: <View />
        },
        {
          label: 'Job Application',
          icon: <Job />
        },
        {
          label: 'Invite User',
          icon: <Invite />
        }
      ]

  return (
    <DaoContainer>
      <>
        {!isJoined.isJoin || !account ? (
          <EmptyPage />
        ) : jobsList.length && account && isJoined.isJoin ? (
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
                '& button': {
                  width: 125,
                  height: 36,
                  borderRadius: '8px'
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  '& svg path': {
                    fill: '#0049C6'
                  },
                  '& p': {
                    fontWeight: 600,
                    fontSize: 30,
                    textAlign: 'left',
                    color: '#3f5170'
                  }
                }}
              >
                <MemberIcon width={38} height={38} />
                <Typography>Member</Typography>
              </Box>
              {!isSmDown && <AddJobMemberButtons job={isJoined.job} addJobsCB={addJobsCB} addMemberCB={addMemberCB} />}
            </Box>
            <Typography
              variant="h5"
              fontWeight={500}
              lineHeight={'20px'}
              sx={{
                maxWidth: '700px',
                textAlign: 'left',
                color: '#3f5170',
                fontSize: 14,
                mt: 15
              }}
            >
              Manage members here, add them by address, and define roles for them. Make sure to turn on your
              notifications to receive information about new openings.
            </Typography>
            {isSmDown && <AddJobMemberButtons job={isJoined.job} addJobsCB={addJobsCB} addMemberCB={addMemberCB} />}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',

                '& p': {
                  cursor: 'pointer',
                  color: '#0049C6',
                  fontWeight: 500,
                  padding: '12px 16px',
                  marginBottom: '-12px'
                }
              }}
            >
              <StyledTabs>
                <Tabs value={tabValue}>
                  {tabList.map((item, idx) => (
                    <Tab
                      key={item.label + idx}
                      icon={item.icon}
                      iconPosition="start"
                      label={item.label}
                      onClick={() => setTabValue(idx)}
                      sx={{
                        gap: 10,
                        marginRight: 50,
                        [theme.breakpoints.down('sm')]: {
                          mr: 0
                        }
                      }}
                      className={tabValue === idx ? 'active' : ''}
                    ></Tab>
                  ))}
                </Tabs>
              </StyledTabs>
              {tabList.length === 3 && tabValue === 1 && !isSmDown ? (
                <Typography
                  onClick={() => {
                    navigate(routes._DaoInfo + `/${daoId}/settings?tab=3`)
                  }}
                >
                  View open jobs({jobsNum.length})&gt;
                </Typography>
              ) : (
                <></>
              )}
            </Box>
            <Divider />
            {tabList.length === 2 ? (
              tabValue === 0 ? (
                <CardView result={jobsList} role={isJoined?.job} />
              ) : (
                <OpenJobs />
              )
            ) : tabValue === 0 ? (
              <CardView result={jobsList} role={isJoined?.job} />
            ) : tabValue === 1 ? (
              <JobApplication
                result={applyList}
                reFetch={() => setRand(Math.random())}
                jobsNum={jobsNum}
                daoId={curDaoId}
              />
            ) : (
              <InviteUser />
            )}
          </Box>
        ) : (
          jobListLoading && <Loading />
        )}
      </>
    </DaoContainer>
  )
}

function AddJobMemberButtons({
  job,
  addJobsCB,
  addMemberCB
}: {
  job: string
  addJobsCB: () => void
  addMemberCB: () => void
}) {
  const isSmDown = useBreakpoint('sm')
  return (
    <>
      {job === 'owner' || job === 'superAdmin' ? (
        <Box
          display={'flex'}
          alignItems={'center'}
          flexDirection={'row'}
          gap={8}
          justifyContent={isSmDown ? 'end' : 'unset'}
          mt={isSmDown ? 20 : 0}
        >
          <Button
            onClick={addJobsCB}
            width={isSmDown ? '120px' : 'auto'}
            height={isSmDown ? '32px' : '40px'}
            fontSize={isSmDown ? '13px' : '14px'}
          >
            + Add Job
          </Button>
          <Button
            onClick={addMemberCB}
            width={isSmDown ? '120px' : 'auto'}
            height={isSmDown ? '32px' : '40px'}
            fontSize={isSmDown ? '13px' : '14px'}
          >
            + Add Member
          </Button>
        </Box>
      ) : (
        <Box display={'flex'} alignItems={'center'} flexDirection={'row'} gap={8}>
          <TooltipStyle title={"This feature is only available to DAO's owner."} placement="left">
            <DisabledBtn>+ Add Job</DisabledBtn>
          </TooltipStyle>
          <TooltipStyle title={"This feature is only available to DAO's owner."} placement="top">
            <DisabledBtn>+ Add Member</DisabledBtn>
          </TooltipStyle>
        </Box>
      )}
    </>
  )
}
