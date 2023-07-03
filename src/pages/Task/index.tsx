import { Box, Typography, Tabs, Tab, Divider, styled, MenuItem, Stack, Tooltip } from '@mui/material'
import Select from 'components/Select/Select'
// import Button from 'components/Button/Button'
// import OutlinedButton from 'components/Button/OutlineButton'
import { useCallback, useState } from 'react'
import TaskIcon from 'assets/images/workspace.png'
// import EditIcon from 'assets/images/edit.png'
import Image from 'components/Image'
import { ReactComponent as Board } from 'assets/svg/board.svg'
import { ReactComponent as ALlTask } from 'assets/svg/allTask.svg'
import TeamSpacesTask from 'pages/TeamSpaces/Task'
// import useBreakpoint from 'hooks/useBreakpoint'
import owl from 'assets/images/owl.png'
import EmptyPage from 'pages/DaoInfo/Children/emptyPage'

import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
  GridSelectionModel
} from '@mui/x-data-grid'
import { useGetTaskList } from 'hooks/useBackedTaskServer'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { timeStampToFormat } from 'utils/dao'
import DaoContainer from 'components/DaoContainer'
import { MapPriorityType, MapTaskStatus } from './Children/TaskDetail'
import { useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'

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
              textOverflow: 'ellipsis',
              marginLeft: 20
            }
          }}
        >
          <Typography noWrap>{params.value}</Typography>
          <StatusWrapper className={params.row.priority} sx={{ width: '88px!important' }}>
            {MapPriorityType[params.row.priority]}
          </StatusWrapper>
        </Box>
      )
    }
  },
  {
    field: 'assignAccount',
    headerName: 'Assign',
    align: 'center',
    sortable: false,
    headerAlign: 'center',
    flex: 1,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            '& img': {
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: '1px solid #D4DCE2'
            },
            '& p': {
              textOverflow: 'ellipsis'
            }
          }}
        >
          <Tooltip title={params.row?.assignAccount} arrow>
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={10}>
              <Image src={params.row?.assignAvatar || owl}></Image>
              <Typography noWrap textAlign={'left'}>
                {params.row?.assignNickname || 'Unnamed'}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      )
    }
  },
  {
    field: 'deadline',
    headerName: 'Due',
    align: 'center',
    sortable: false,
    headerAlign: 'center',
    minWidth: 180,
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
    minWidth: 180,
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
  '& .MuiTabs-indicator': {
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
    '&.active': {
      fontWeight: 700
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
  { value: '', label: 'All priority' },
  { value: 'A_High', label: 'High' },
  { value: 'B_Medium', label: 'Medium' },
  { value: 'C_Low', label: 'Low' }
]

const statusFilter = [
  { value: '', label: 'All status' },
  { value: 'A_notStarted', label: 'Not started' },
  { value: 'B_inProgress', label: 'In progress' },
  { value: 'C_done', label: 'Done' },
  { value: 'D_notStatus', label: 'No status' }
]

const AllTaskTable = function({ priority, status }: { priority: string | undefined; status: string | undefined }) {
  // const [selectedRow, setSelectRow] = useState<GridSelectionModel>()
  const { spacesId } = useParams<{ spacesId: string }>()
  const { result: taskTypeListRes } = useGetTaskList(Number(spacesId), status, priority)
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

  const editTask = useCallback(
    (newRowSelectionModel: GridSelectionModel) => {
      if (!rows || !newRowSelectionModel) return
      console.log(rows.newRowSelectionModel, newRowSelectionModel)
    },
    [rows]
  )

  return (
    <Box
      sx={{
        minWidth: 800,
        width: '100%',
        textAlign: 'center',
        margin: '20px auto 40px',
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
        onSelectionModelChange={editTask}
      />
    </Box>
  )
}

export default function Index() {
  // const isSmDown = useBreakpoint('sm')
  const [tabValue, setTabValue] = useState(0)
  const [currentPriority, setCurrentPriority] = useState('')
  const [currentStatus, setCurrentStatus] = useState('')
  const { myJoinDaoData: isJoined } = useUpdateDaoDataCallback()

  // const handleEdit = useCallback(() => {}, [])

  return (
    <DaoContainer>
      {isJoined.isJoin ? (
        <Stack
          spacing={10}
          sx={{
            position: 'relative'
          }}
        >
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
              <Image width={38} src={TaskIcon}></Image>
              <Typography>Workspace</Typography>
            </Box>
            {/* {tabValue === 1 ? (
          <Button
            onClick={handleEdit}
            style={{
              width: '80px',
              height: '36px',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 16px'
            }}
          >
            <Image width={16} src={EditIcon}></Image>
            Edit
          </Button>
        ) : (
          ''
        )} */}
          </Box>
          <Typography maxWidth={740} sx={{ marginTop: '0!important' }}>
            Use this template to track your personal tasks. Click{' '}
            <span style={{ color: '#0049C6', fontWeight: 700 }}>+ New</span> to create a new task directly on this
            board. Click an existing task to add additional context or subtasks.
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
                  style={{ borderRadius: '40px' }}
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
                      selected={currentPriority === item.value}
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
                  style={{ borderRadius: '40px' }}
                  onChange={e => {
                    setCurrentStatus(e.target.value)
                  }}
                >
                  {statusFilter.map(item => (
                    <MenuItem
                      key={item.value}
                      sx={{ fontWeight: 500, fontSize: 10 }}
                      value={item.value}
                      selected={currentStatus === item.value}
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
        </Stack>
      ) : (
        <EmptyPage />
      )}
    </DaoContainer>
  )
}
