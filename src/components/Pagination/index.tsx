import { styled, Pagination, Typography, Box } from '@mui/material'

export const StyledPagination = styled(Pagination)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  '& .MuiPaginationItem-page': {
    fontSize: 16,
    color: theme.textColor.text1,
    margin: 0,
    borderRadius: '10px'
  },
  '& .MuiPaginationItem-previousNext': {
    background: theme.bgColor.bg1,
    borderRadius: '10px',
    minWidth: 40,
    height: 40,
    '&:hover': {
      background: theme.palette.primary.main,
      '& svg': {
        fill: theme.palette.common.white
      },
      '&.Mui-disabled': {
        background: theme.bgColor.bg1,
        borderRadius: '10px'
      }
    }
  },
  '& .MuiPaginationItem-root': {
    color: theme.textColor.text1
  },
  '& .MuiPaginationItem-page.Mui-selected': {
    backgroundColor: 'transparent',
    // borderColor: theme.palette.text.primary
    color: theme.palette.primary.main
  }
}))

interface PaginationProps {
  count: number
  page: number
  siblingCount?: number
  boundaryCount?: number
  // setPage: (page: number) => void
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange?: (event: object, page: number) => void
  perPage?: number
  total?: number
}
export default function PaginationView({
  count,
  page,
  onChange,
  // setPage,
  siblingCount,
  boundaryCount,
  perPage,
  total
}: PaginationProps) {
  return (
    <>
      {count > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: { xs: 5, sm: 8 },
            flexDirection: { xs: 'column', sm: 'row' },
            marginBottom: 10
          }}
        >
          {perPage && (
            <Box
              sx={{
                width: { xs: '100%', sm: 'fit-content' }
              }}
            >
              <Typography color="#B3B9CB">
                {(page - 1) * perPage + 1} - {total && page * perPage > total ? total : page * perPage} items of {total}
              </Typography>
            </Box>
          )}
          <StyledPagination
            count={count}
            page={page}
            siblingCount={siblingCount || 1}
            boundaryCount={boundaryCount || 1}
            // variant="outlined"
            shape="rounded"
            onChange={onChange}
          />
        </Box>
      )}
    </>
  )
}
