import { Box, Typography, Tabs, Tab, Divider, styled } from '@mui/material'
import Button from 'components/Button/Button'
import { useCallback, useState } from 'react'
import SidePanel from './Children/SidePanel'
import TaskIcon from 'assets/images/task.png'
import Image from 'components/Image'
import useModal from 'hooks/useModal'
import { ReactComponent as Board } from 'assets/svg/board.svg'
import { ReactComponent as ALlTask } from 'assets/svg/allTask.svg'
import TeamSpacesTask from 'pages/TeamSpaces/Task'
import AllTaskTable from './Children/AllTaskTable'

const StyledTabs = styled('div')(({ theme }) => ({
  display: 'flex',
  fontWeight: 600,
  fontSize: 14,
  listStyle: 'none',
  padding: 0,
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
    '&:hover': {
      color: '#0049c6'
    },
    '&:hover svg path': {
      fill: '#0049c6'
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
      }
    }
  }
}))

const tabList = [
  {
    label: 'Board · By Status',
    icon: <Board />
  },
  {
    label: 'All task',
    icon: <ALlTask />
  }
]

export default function Index() {
  const [tabValue, setTabValue] = useState(0)

  const { showModal, hideModal } = useModal()
  const showSidePanel = useCallback(() => {
    showModal(<SidePanel open={true} onDismiss={hideModal} />)
  }, [hideModal, showModal])
  return (
    <Box gap={10}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 20
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            '& p': {
              fontWeight: 600,
              fontSize: 30,
              textAlign: 'left',
              color: '#3f5170'
            }
          }}
        >
          <Image src={TaskIcon}></Image>
          <Typography>Task</Typography>
        </Box>
        <Button width="100px" height="36px" onClick={showSidePanel}>
          + New
        </Button>
      </Box>
      <Typography maxWidth={740}>
        Use this template to track your personal tasks. Click{' '}
        <span style={{ color: '#0049C6', fontWeight: 700 }}>+ New</span> to create a new task directly on this board.
        Click an existing task to add additional context or subtasks.
      </Typography>
      <StyledTabs>
        <Tabs value={tabValue}>
          {tabList.map((item, idx) => (
            <Tab
              key={item.label + idx}
              icon={item.icon}
              iconPosition="start"
              label={item.label}
              onClick={() => setTabValue(idx)}
              sx={{ gap: 10 }}
              className={tabValue === idx ? 'active' : ''}
            ></Tab>
          ))}
        </Tabs>
      </StyledTabs>
      <Divider />
      {tabValue === 0 ? <TeamSpacesTask /> : <AllTaskTable />}
    </Box>
  )
}
