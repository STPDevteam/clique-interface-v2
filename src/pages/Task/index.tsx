import { Box, Typography, Tabs, Tab, Divider, styled, MenuItem } from '@mui/material'
import Select from 'components/Select/Select'
import Button from 'components/Button/Button'
// import OutlinedButton from 'components/Button/OutlineButton'
import { useState } from 'react'
import TaskIcon from 'assets/images/task.png'
import EditIcon from 'assets/images/edit.png'
import Image from 'components/Image'
import { ReactComponent as Board } from 'assets/svg/board.svg'
import { ReactComponent as ALlTask } from 'assets/svg/allTask.svg'
import TeamSpacesTask from 'pages/TeamSpaces/Task'
// import useBreakpoint from 'hooks/useBreakpoint'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
  GridSelectionModel
} from '@mui/x-data-grid'
import { useGetTaskList, useSpacesInfo } from 'hooks/useBackedTaskServer'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { timeStampToFormat } from 'utils/dao'
import { MapPriorityType, MapTaskStatus } from './Children/SidePanel'

const StatusWrapper = styled(Box)(() => ({
  width: 100,
  padding: '4px 10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '40px',
  color: '#fff',
  '&.C_done': {
    backgroundColor: '#21C331'
  },
  '&.B_inProgress': {
    backgroundColor: '#2C9EF0'
  },
  '&.A_notStarted, &.D_notStatus': {
    backgroundColor: '#80829F'
  },
  '&.A_High': {
    backgroundColor: '#E46767'
  },
  '&.B_Medium': {
    backgroundColor: '#EFCC97'
  },
  '&.C_Low': {
    color: '#7FB6C1',
    backgroundColor: '#CAE7ED'
  }
}))

const columns: GridColDef[] = [
  // { field: 'id', headerName: 'ID', width: 0, align: 'center', sortable: false, headerAlign: 'center' },
  {
    field: 'taskName',
    headerName: 'Task Name',
    flex: 2,
    align: 'center',
    sortable: false,
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams) => {
      return (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            '& p': {
              textOverflow: 'ellipsis'
            }
          }}
        >
          <Typography noWrap textAlign={'left'}>
            {params.value}
          </Typography>
          <StatusWrapper className={params.row.priority} sx={{ width: '88px!important' }}>
            {MapPriorityType[params.row.priority]}
          </StatusWrapper>
        </Box>
      )
    }
  },
  {
    field: 'assign',
    headerName: 'Assign',
    align: 'center',
    sortable: false,
    headerAlign: 'center',
    flex: 1
  },
  {
    field: 'deadline',
    headerName: 'Due',
    align: 'center',
    sortable: false,
    headerAlign: 'center',
    flex: 1,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      if (params.value == null) {
        return '-'
      }
      return timeStampToFormat(params.value * 1000).toLocaleString()
    }
  },
  {
    field: 'status',
    headerName: 'Status',
    align: 'center',
    sortable: false,
    headerAlign: 'center',
    minWidth: 150,
    renderCell: (params: GridRenderCellParams) => {
      return <StatusWrapper className={params.value}>{MapTaskStatus[params.value]}</StatusWrapper>
    }
  }
]

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

const priorityFilter = [
  { value: undefined, label: 'All priority' },
  { value: 'A_High', label: 'High' },
  { value: 'B_Medium', label: 'Medium' },
  { value: 'C_Low', label: 'Low' }
]

const statusFilter = [
  { value: undefined, label: 'All status' },
  { value: 'A_notStarted', label: 'Not started' },
  { value: 'B_inProgress', label: 'In progress' },
  { value: 'C_done', label: 'Done' },
  { value: 'C_notStatus', label: 'Not status' }
]

function AllTaskTable({ priority, status }: { priority: string | undefined; status: string | undefined }) {
  // const [selectedRow, setSelectRow] = useState<GridSelectionModel>()
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const { result: TeamSpacesInfo } = useSpacesInfo(Number(daoChainId), daoAddress)
  const { result: taskTypeListRes } = useGetTaskList(TeamSpacesInfo?.teamSpacesId, status, priority)
  // const remove = useRemoveTask()

  const rows = useMemo(() => {
    if (!taskTypeListRes) return []
    const _arr: any = []
    taskTypeListRes.map((item, index) => {
      _arr.push(Object.assign({}, item, { id: index }))
    })
    return _arr
  }, [taskTypeListRes])

  // const deleteTask = useCallback(() => {
  //   if (!selectedRow || !rows) return
  //   console.log(rows)
  //   return
  // }, [rows, selectedRow])

  console.log(rows)

  return (
    <Box
      sx={{
        mt: 20,
        width: '100%',
        height: '400px',
        textAlign: 'center',
        '& .MuiDataGrid-columnHeaders.css-okt5j6-MuiDataGrid-columnHeaders': {
          width: '100%'
        },
        '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
          borderRight: `1px solid #f0f0f0`
        },
        '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
          borderBottom: `1px solid #f0f0f0`
        },
        '& .MuiDataGrid-columnHeaders .MuiDataGrid-iconSeparator': {
          display: 'none'
        }
      }}
    >
      <DataGrid
        disableColumnMenu
        rows={rows}
        columns={columns}
        autoHeight={true}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
        hideFooterPagination={true}
        onSelectionModelChange={(newRowSelectionModel: GridSelectionModel) => {
          console.log(newRowSelectionModel)
        }}
      />
    </Box>
  )
}

export default function Index() {
  // const isSmDown = useBreakpoint('sm')
  const [tabValue, setTabValue] = useState(0)
  const [currentPriority, setCurrentPriority] = useState()
  const [currentStatus, setCurrentStatus] = useState()

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
        <Button
          onClick={() => {}}
          style={{ width: '80px', height: '36px', display: 'flex', justifyContent: 'space-between', padding: '0 16px' }}
        >
          <Image width={16} src={EditIcon}></Image>
          Edit
        </Button>
      </Box>
      <Typography maxWidth={740}>
        Use this template to track your personal tasks. Click{' '}
        <span style={{ color: '#0049C6', fontWeight: 700 }}>+ New</span> to create a new task directly on this board.
        Click an existing task to add additional context or subtasks.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center'
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
                sx={{ gap: 10 }}
                className={tabValue === idx ? 'active' : ''}
              ></Tab>
            ))}
          </Tabs>
        </StyledTabs>
        {tabValue === 1 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10
            }}
          >
            <Select
              placeholder=""
              width={130}
              height={25}
              color="#80829F"
              noBold
              value={currentPriority}
              onChange={e => {
                setCurrentPriority(e.target.value)
              }}
            >
              {priorityFilter.map(item => (
                <MenuItem
                  key={item.value}
                  sx={{ fontWeight: 500, fontSize: 10 }}
                  value={item.value}
                  selected={currentPriority && currentPriority === item.value}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            <Select
              placeholder=""
              width={140}
              height={25}
              color="#80829F"
              noBold
              value={currentStatus}
              onChange={e => {
                setCurrentStatus(e.target.value)
              }}
            >
              {statusFilter.map(item => (
                <MenuItem
                  key={item.value}
                  sx={{ fontWeight: 500, fontSize: 10 }}
                  value={item.value}
                  selected={currentStatus && currentStatus === item.value}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            {/* <OutlinedButton width={'95px'} height={'25px'} color="#80829F" borderRadius="40px" noBold>
              Duplicate
            </OutlinedButton> */}
            {/* <OutlinedButton
              width={'95px'}
              height={'25px'}
              color="#E46767"
              borderRadius="40px"
              noBold
              onClick={() => {}}
            >
              Delete
            </OutlinedButton> */}
          </Box>
        ) : (
          ''
        )}
      </Box>
      <Divider />
      {tabValue === 0 ? <TeamSpacesTask /> : <AllTaskTable priority={currentPriority} status={currentStatus} />}
    </Box>
  )
}
