import { Box, Typography, styled } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import { ReactComponent as AddIcon } from 'assets/svg/newIcon.svg'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useModal from 'hooks/useModal'
import AddJobsModal from './Modals/AddJobsModal'
import JobDetailModal from './Modals/JobDetailModal'
import AddMemberModal from './Modals/AddMemberModal'
import EditIcon from 'assets/images/editIcon.png'
import DetailIcon from 'assets/images/expendIcon.png'
import Image from 'components/Image'
import Table from 'components/Table'
import Avatar from 'assets/images/avatar.png'
import { useParams } from 'react-router-dom'
import { useGetPublishJobList, useJobsList } from 'hooks/useBackedTaskServer'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MemberAuthorityAssignmentModal from './Modals/MemberAuthorityAssignmentModal'
import EmptyData from 'components/EmptyData'
import { useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
import { useActiveWeb3React } from 'hooks'
import { DaoAdminLevelProp } from 'hooks/useDaoInfo'
// import Pagination from 'components/Pagination'

const TopText = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
})

export const adminLevelIndex = {
  owner: 0,
  superAdmin: 1,
  admin: 2
}

export default function Team() {
  const isSmDown = useBreakpoint('sm')
  const [rand, setRand] = useState(Math.random())
  const [randNum, setRandNum] = useState(Math.random())
  const { showModal, hideModal } = useModal()
  const { daoId: daoChainId } = useParams<{ daoId: string }>()
  const curDaoId = Number(daoChainId)
  const { account: curAccount } = useActiveWeb3React()
  const { result: jobList } = useGetPublishJobList(curDaoId, randNum)
  const { result: memberList } = useJobsList(curDaoId, rand)
  const { myJoinDaoData: memberLevel, updateDaoMyJoinData } = useUpdateDaoDataCallback()

  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('run')
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const addMemberCB = useCallback(() => {
    showModal(<AddMemberModal onClose={hideModal} daoId={curDaoId} />)
  }, [curDaoId, hideModal, showModal])

  const addJobsCB = useCallback(() => {
    showModal(
      <AddJobsModal isEdit={false} chainId={curDaoId} onDimiss={() => setRandNum(Math.random())} originLevel={1} />
    )
  }, [curDaoId, showModal])

  const tableList = useMemo(() => {
    return memberList.map(({ avatar, daoId, account, nickname, jobsLevel }) => [
      <Box
        key={account + daoId}
        display={'flex'}
        alignItems={'center'}
        gap={10}
        width={158}
        sx={{
          textOverflow: 'ellipsis',
          overflow: 'hidden'
        }}
      >
        <Image width={18} height={18} src={avatar || Avatar} style={{ borderRadius: '50%' }} />
        <Typography textAlign={'left'} width={'100%'} color={'#3F5170'} fontWeight={500} fontSize={14} noWrap>
          {nickname || 'unnamed'}
        </Typography>
      </Box>,
      <Box key={account + daoId} display={'flex'} justifyContent={'flex-start'}>
        <Typography>{account}</Typography>
      </Box>,
      <Box
        key={account + daoId}
        display={'flex'}
        justifyContent={'space-between'}
        sx={{
          cursor: 'pointer',
          '& svg path': {
            fill: '#D4D7E2'
          }
        }}
        onClick={() => {
          if (curAccount && account.toLocaleLowerCase() === curAccount.toLocaleLowerCase()) return
          if (memberLevel.job === 'superAdmin') {
            if (jobsLevel === 0) return
          } else if (memberLevel.job === 'admin') {
            if ([0, 1].includes(jobsLevel)) return
          }
          showModal(
            <MemberAuthorityAssignmentModal
              myLevel={adminLevelIndex[memberLevel.job as keyof typeof adminLevelIndex]}
              account={account}
              daoId={daoId}
              level={jobsLevel}
              onDimiss={() => {
                updateDaoMyJoinData()
                setRand(Math.random())
              }}
            />
          )
        }}
      >
        <Typography width={130} textAlign={'left'}>
          {DaoAdminLevelProp[jobsLevel as keyof typeof DaoAdminLevelProp] === 'superAdmin' ? 'Owner' : ''}
          {DaoAdminLevelProp[jobsLevel as keyof typeof DaoAdminLevelProp] === 'owner' ? 'Creator' : ''}
          {DaoAdminLevelProp[jobsLevel as keyof typeof DaoAdminLevelProp] === 'admin' ? 'Admin' : ''}
        </Typography>
        <ExpandMoreIcon />
      </Box>
    ])
  }, [curAccount, memberLevel.job, memberList, showModal, updateDaoMyJoinData])

  return (
    <Box
      sx={{
        padding: isSmDown ? '20px 16px' : '0 0 40px',
        borderRadius: '8px',
        '& table': {
          border: '1px solid #D4D7E2',
          borderColor: '#D4D7E2',
          borderRadius: '8px!important',
          borderSpacing: '0!important',
          '& .MuiTableHead-root': {
            height: 30,
            backgroundColor: '#F8FBFF',
            '& .MuiTableRow-root': {
              borderRadius: 0
            },
            '& .MuiTableCell-root': {
              textAlign: 'left',
              padding: 0,
              paddingLeft: 20
            },
            '& .MuiTableCell-root:nth-of-type(1)': {
              borderRadius: '8px 0 0 0',
              borderColor: '#D4D7E2'
            },
            '& .MuiTableCell-root:nth-of-type(3)': {
              borderRadius: '0 8px 0 0',
              borderColor: '#D4D7E2'
            },
            '& .MuiTableCell-root:nth-of-type(2)': {
              borderLeft: '1px solid #D4D7E2',
              borderRight: '1px solid #D4D7E2'
            }
          },
          '& .MuiTableBody-root': {
            '& .MuiTableRow-root .MuiTableCell-root': {
              padding: '13px 20px'
            },
            '& .MuiTableRow-root:last-child td': {
              borderBottom: 0
            },
            '& .MuiTableRow-root .MuiTableCell-root:nth-of-type(2)': {
              borderLeft: '1px solid #D4D7E2 !important',
              borderRight: '1px solid #D4D7E2 !important'
            }
          }
        }
      }}
    >
      <TopText>
        <Typography fontSize={14} color={'#80829F'} fontWeight={500} lineHeight={'16px'}>
          Jobs
        </Typography>
        <Box display={'flex'} gap={35} flexDirection={'row'}>
          <BlueButton actionText="Add Members" onClick={addMemberCB} />
          <BlueButton actionText="Add Jobs" onClick={addJobsCB} />
        </Box>
      </TopText>
      <Box
        mt={14}
        mb={20}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 15
        }}
      >
        {jobList.map((item, index) => (
          <JobCard key={item.title + index} {...item} onDimiss={() => setRandNum(Math.random())} />
        ))}
      </Box>
      {/* <Box mt={20} display={'flex'} justifyContent="center">
        <Pagination
          count={page.totalPage}
          page={page.currentPage}
          onChange={(_, value) => page.setCurrentPage(value)}
        />
      </Box> */}
      {tableList.length === 0 ? (
        <EmptyData sx={{ margin: '30px auto', width: '100%' }}>No data</EmptyData>
      ) : (
        <Table
          collapsible={false}
          firstAlign="left"
          variant="outlined"
          header={['Member', 'Address', 'Guests']}
          rows={tableList}
        />
      )}
    </Box>
  )
}

export function BlueButton({
  actionText,
  onClick,
  disabled = false
}: {
  actionText: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        '& p': {
          color: disabled ? '#8D8EA5' : '#97B7EF',
          fontSize: 14,
          lineHeight: '20px',
          fontFamily: 'Inter'
        }
      }}
    >
      <AddIcon />
      <Typography>{actionText}</Typography>
    </Box>
  )
}

function JobCard({
  daoId,
  jobBio,
  jobPublishId,
  level,
  title,
  onDimiss
}: {
  daoId: number
  jobBio: string
  jobPublishId: number
  level: number
  title: string
  onDimiss: () => void
}) {
  const { showModal, hideModal } = useModal()

  const editIconClick = useCallback(() => {
    hideModal()
    showModal(
      <AddJobsModal
        isEdit={true}
        originTitle={title}
        originContent={jobBio}
        originLevel={level}
        publishId={jobPublishId}
        chainId={daoId}
        onDimiss={onDimiss}
      />
    )
  }, [daoId, hideModal, jobBio, jobPublishId, level, onDimiss, showModal, title])

  const detailIconClick = useCallback(() => {
    showModal(
      <JobDetailModal
        title={title}
        content={jobBio}
        publishId={jobPublishId}
        chainId={daoId}
        level={level}
        onDimiss={onDimiss}
      />
    )
  }, [daoId, jobBio, jobPublishId, level, onDimiss, showModal, title])

  return (
    <Box
      sx={{
        display: 'flex',
        width: 463,
        height: 162,
        border: '1px solid #D4D7E2',
        borderRadius: '8px',
        padding: '20px 24px',
        flexDirection: 'column',
        '& p': {
          color: '#3F5170',
          lineHeight: 1
        }
      }}
    >
      <Box flexDirection={'row'} alignItems={'center'} display={'flex'} justifyContent={'space-between'}>
        <Typography
          fontSize={16}
          fontWeight={700}
          sx={{
            whiteSpace: 'nowrap',
            width: '100%',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 16,
            alignItems: 'center',
            '& img': {
              cursor: 'pointer'
            }
          }}
        >
          <Image width={16} src={EditIcon} onClick={editIconClick} />
          <div style={{ height: 13.5, width: 1, backgroundColor: '#D4D7E2' }}></div>
          <Image width={16} height={16} src={DetailIcon} onClick={detailIconClick} />
        </Box>
      </Box>
      <Box
        mt={20}
        sx={{
          '& p': {
            width: '413px',
            height: '82px',
            wordWrap: 'break-word',
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 3
          }
        }}
      >
        <Typography fontWeight={500} fontSize={16} width={'100%'} lineHeight={'26px !important'}>
          {jobBio.split('\n').map(v => {
            return (
              <>
                {v}
                <br />
              </>
            )
          })}
        </Typography>
      </Box>
    </Box>
  )
}
