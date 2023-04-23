import { Box, Typography, styled } from '@mui/material'
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
import { MapPriorityType, MapTaskStatus } from './SidePanel'

const StatusWrapper = styled(Box)(() => ({
  width: 'fit-conent',
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
      return (
        <StatusWrapper className={params.value} sx={{ width: '88px!important' }}>
          {MapTaskStatus[params.value]}
        </StatusWrapper>
      )
    }
  }
]
export default function AllTaskTable({
  priority,
  status
}: {
  priority: string | undefined
  status: string | undefined
}) {
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const { result: TeamSpacesInfo } = useSpacesInfo(Number(daoChainId), daoAddress)
  const { result: taskTypeListRes } = useGetTaskList(TeamSpacesInfo?.teamSpacesId, status, priority)
  const rows = useMemo(() => {
    if (!taskTypeListRes) return []
    const _arr: any = []
    taskTypeListRes.map((item, index) => {
      _arr.push(Object.assign({}, item, { id: index }))
    })
    return _arr
  }, [taskTypeListRes])
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
