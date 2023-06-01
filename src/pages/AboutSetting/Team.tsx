import { Box, Typography, styled } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import { ReactComponent as AddIcon } from 'assets/svg/newIcon.svg'
import { useCallback, useMemo, useState } from 'react'
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
import { ChainId } from 'constants/chain'
import { useGetPublishJobList, useJobsList } from 'hooks/useBackedTaskServer'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MemberAuthorityAssignmentModal from './Modals/MemberAuthorityAssignmentModal'

const TopText = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
})

export default function Team() {
  const isSmDown = useBreakpoint('sm')
  const [rand, setRand] = useState(Math.random())
  const [randNum, setRandNum] = useState(Math.random())
  const { showModal, hideModal } = useModal()
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const { result: jobList } = useGetPublishJobList(curDaoChainId, daoAddress, randNum)
  const { result: memberList } = useJobsList('A_superAdmin', daoAddress, curDaoChainId, rand)

  const addMemberCB = useCallback(() => {
    showModal(<AddMemberModal onClose={hideModal} daoAddress={daoAddress} />)
  }, [daoAddress, hideModal, showModal])

  const addJobsCB = useCallback(() => {
    showModal(
      <AddJobsModal
        isEdit={false}
        chainId={curDaoChainId}
        daoAddress={daoAddress}
        onDimiss={() => setRandNum(Math.random())}
      />
    )
  }, [curDaoChainId, daoAddress, showModal])

  const tableList = useMemo(() => {
    return memberList.map(({ avatar, chainId, account, nickname, jobId }) => [
      <Box
        key={account + chainId}
        display={'flex'}
        alignItems={'center'}
        gap={10}
        width={158}
        sx={{
          textOverflow: 'ellipsis',
          overflow: 'hidden'
        }}
      >
        <Image width={18} height={18} src={avatar || Avatar} />
        <Typography textAlign={'left'} width={'100%'} color={'#3F5170'} fontWeight={500} fontSize={14} noWrap>
          {nickname || 'unnamed'}
        </Typography>
      </Box>,
      <Box key={account + chainId} display={'flex'} justifyContent={'flex-start'}>
        <Typography>{account}</Typography>
      </Box>,
      <Box
        key={account + chainId}
        display={'flex'}
        justifyContent={'space-between'}
        sx={{
          cursor: 'pointer',
          '& svg path': {
            fill: '#D4D7E2'
          }
        }}
        onClick={() => {
          showModal(
            <MemberAuthorityAssignmentModal
              chainId={curDaoChainId}
              daoAddress={daoAddress}
              id={jobId}
              onDimiss={() => setRand(Math.random())}
            />
          )
        }}
      >
        <Typography width={130} textAlign={'left'}>
          Admin
        </Typography>
        <ExpandMoreIcon />
      </Box>
    ])
  }, [curDaoChainId, daoAddress, memberList, showModal])

  return (
    <Box
      sx={{
        padding: isSmDown ? '20px 16px' : '0 0 20px',
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
      <Table
        collapsible={false}
        firstAlign="left"
        variant="outlined"
        header={['Member', 'Address', 'Guests']}
        rows={tableList}
      ></Table>
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
          color: disabled ? '#b5b7cf' : '#97B7EF',
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
  title,
  access,
  chainId,
  daoAddress,
  jobBio,
  jobPublishId,
  onDimiss
}: {
  title: string
  access: string
  chainId: number
  daoAddress: string
  jobBio: string
  jobPublishId: number
  onDimiss: () => void
}) {
  console.log(access)
  const { showModal, hideModal } = useModal()

  const editIconClick = useCallback(() => {
    hideModal()
    showModal(
      <AddJobsModal
        isEdit={true}
        originTitle={title}
        originContent={jobBio}
        publishId={jobPublishId}
        chainId={chainId}
        daoAddress={daoAddress}
        onDimiss={onDimiss}
      />
    )
  }, [chainId, daoAddress, hideModal, jobBio, jobPublishId, onDimiss, showModal, title])

  const detailIconClick = useCallback(() => {
    showModal(
      <JobDetailModal
        title={title}
        content={jobBio}
        publishId={jobPublishId}
        chainId={chainId}
        daoAddress={daoAddress}
      />
    )
  }, [chainId, daoAddress, jobBio, jobPublishId, showModal, title])

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
            height: '80px',
            wordWrap: 'break-word',
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 5
          }
        }}
      >
        <Typography fontWeight={500} fontSize={16} width={'100%'}>
          {jobBio}
        </Typography>
      </Box>
    </Box>
  )
}
