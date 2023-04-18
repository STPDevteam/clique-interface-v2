import { Box, styled } from '@mui/material'
// import { DataGrid, GridColDef } from '@mui/x-data-grid'
// import { timeStampToFormat } from 'utils/dao'

styled(Box)(() => ({
  width: 'fit-content',
  padding: '10px 16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '40px',
  '& .Done': {
    backgroundColor: '#21C331'
  },
  '& .In progress': {
    backgroundColor: '#2C9EF0'
  },
  '& .Not started': {
    backgroundColor: '#80829F'
  }
}))

// const columns: GridColDef[] = [
//   { field: 'id', headerName: 'ID', width: 50, align: 'center', sortable: false, headerAlign: 'center' },
//   {
//     field: 'taskName',
//     headerName: 'Task Name',
//     flex: 2,
//     align: 'center',
//     sortable: false,
//     headerAlign: 'center'
//   },
//   {
//     field: 'assign',
//     headerName: 'Assign',
//     align: 'center',
//     sortable: false,
//     headerAlign: 'center',
//     flex: 1
//   },
//   { field: 'dueTime', headerName: 'Due', align: 'center', sortable: false, headerAlign: 'center', flex: 1 },
//   {
//     field: 'status',
//     headerName: 'Status',
//     align: 'center',
//     sortable: false,
//     headerAlign: 'center',
//     minWidth: 150,
//     renderCell: params => {
//       return <StatusBg className={params.value}>{params.value}</StatusBg>
//     }
//   }
// ]

// const rows = [
//   {
//     id: 0,
//     taskName: 'Planned task title',
//     assign: 'Admin',
//     dueTime: `${timeStampToFormat(1681791358361)}`,
//     status: 'Not started'
//   },
//   {
//     id: 1,
//     taskName: 'Planned task title',
//     assign: 'Lulu',
//     dueTime: `${timeStampToFormat(1681791358361)}`,
//     status: 'In progress'
//   },
//   {
//     id: 2,
//     taskName: 'Planned task title',
//     assign: 'Alan',
//     dueTime: `${timeStampToFormat(1681791358361)}`,
//     status: 'Done'
//   },
//   {
//     id: 3,
//     taskName: 'Planned task title',
//     assign: 'Alan',
//     dueTime: `${timeStampToFormat(1681791358361)}`,
//     status: 'Not type'
//   }
// ]
export default function AllTaskTable() {
  return (
    <Box
      sx={{
        mt: 20,
        width: '100%',
        textAlign: 'center',
        '& .MuiDataGrid-columnHeaders.css-okt5j6-MuiDataGrid-columnHeaders': {
          width: '100%'
        },
        '& .css-dld2hn-MuiTablePagination-displayedRows': {
          display: 'none'
        },
        '& .MuiTablePagination-actions': {
          display: 'none'
        }
      }}
    >
      {/* <DataGrid
        disableColumnMenu
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      /> */}
    </Box>
  )
}
