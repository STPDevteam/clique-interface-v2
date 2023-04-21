import {
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Box,
  Typography,
  styled,
  IconButton,
  Collapse,
  TableSortLabel
} from '@mui/material'
import { useState } from 'react'
import useBreakpoint from '../../hooks/useBreakpoint'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import EmptyData from 'components/EmptyData'
// import { visuallyHidden } from '@mui/utils'

const Profile = styled('div')(`
  display: flex;
  align-items: center;
`)

export const TableProfileImg = styled('div', {
  shouldForwardProp: () => true
})(({ url }: { url?: string }) => ({
  height: '24px',
  width: '24px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginRight: '8px',
  background: `#000000 ${url ? `url(${url})` : ''}`
}))

export function OwnerCell({ url, name }: { url?: string; name: string }) {
  return (
    <Profile>
      <TableProfileImg url={url} />
      {name}
    </Profile>
  )
}

const StyledTableContainer = styled(TableContainer)({
  display: 'table',
  borderRadius: '40px',
  '& .MuiTableCell-root': {
    borderBottom: 'none',
    fontWeight: 400,
    padding: '14px 20px',
    '&:first-of-type': {
      paddingLeft: 20
    },
    '&:last-child': {
      paddingRight: 20
    }
  },
  '& table': {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 8px'
  }
})

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  borderRadius: 8,
  overflow: 'hidden',
  '& .MuiTableCell-root': {
    fontWeight: 400,
    fontSize: '14px!important',
    whiteSpace: 'pre',
    lineHeight: '12px',
    // background: theme.bgColor.bg1,
    padding: '18px 20px 18px 0',
    color: '#80829F',
    borderBottom: `1px solid ${theme.bgColor.bg2}`,
    '& .MuiTableSortLabel-root': {
      // fontWeight: 600,
      // fontSize: '14px!important',
      color: '#80829F'
    },
    '&:first-of-type': {
      paddingLeft: 20,
      borderRadius: '8px 0 0 8px'
    },
    '&:last-child': {
      paddingRight: 20,
      borderRadius: '0 8px 8px 0'
    }
  }
}))

const StyledTableRow = styled(TableRow, { shouldForwardProp: () => true })<{
  variant: 'outlined' | 'grey'
  fontSize?: string
}>(({ variant, theme, fontSize }) => ({
  minHeight: 72,
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'relative',
  whiteSpace: 'pre',
  background: variant === 'outlined' ? 'transparent' : theme.palette.background.default,
  '& + tr .MuiCollapse-root': {
    background: variant === 'outlined' ? 'transparent' : theme.palette.background.default
  },
  '& .MuiTableCell-root': {
    fontSize: fontSize ?? '16px',
    justifyContent: 'flex-start',
    paddingLeft: 0,
    borderBottom: '1px solid',
    borderColor: variant === 'outlined' ? theme.bgColor.bg2 : 'transparent',
    borderRight: 'none',
    borderLeft: 'none',
    textAlign: 'center',
    '&:first-of-type': {
      borderColor: variant === 'outlined' ? theme.bgColor.bg2 : 'transparent',
      paddingLeft: '20px'
    },
    '&:last-child': {
      borderColor: variant === 'outlined' ? theme.bgColor.bg2 : 'transparent',
      paddingRight: '20px'
    }
  },
  '&:hover': {
    '& + tr .MuiCollapse-root': {
      backgroundColor: variant === 'outlined' ? theme.bgColor.bg5 : '#E2E7F0'
    },
    backgroundColor: variant === 'outlined' ? theme.bgColor.bg5 : '#E2E7F0'
  }
}))

const Card = styled('div')({
  // backgroundColor: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: 16,
  padding: 16,
  '& > div': {
    width: '100%'
  }
})

const sortIcon = ({ className }: { className: string }) => (
  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      className="sort-down"
      d="M1.0875 6.5791L3 8.48743L4.9125 6.5791L5.5 7.1666L3 9.6666L0.5 7.1666L1.0875 6.5791Z"
      fill="#00000099"
    />
    <path
      className="sort-up"
      d="M1.0875 3.421L3 1.51266L4.9125 3.421L5.5 2.8335L3 0.333496L0.5 2.8335L1.0875 3.421Z"
      fill="#00000099"
    />
  </svg>
)

const CardRow = styled('div')(`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-template-columns: auto 100%;
  > div:first-of-type {
    white-space: nowrap;
  }
  > div:last-child {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`)

export default function Table({
  header,
  rows,
  variant = 'grey',
  collapsible,
  hiddenParts,
  fontSize,
  sortHeaders,
  order,
  orderBy,
  firstAlign,
  createSortfunction
}: {
  sortHeaders?: string[]
  header: string[]
  rows: (string | number | JSX.Element)[][]
  variant?: 'outlined' | 'grey'
  collapsible?: boolean
  hiddenParts?: JSX.Element[]
  fontSize?: string
  order?: 'asc' | 'desc'
  orderBy?: string
  firstAlign?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined
  createSortfunction?: (label: string) => () => void
}) {
  const matches = useBreakpoint('md')

  return (
    <>
      {matches ? (
        <>
          {rows.map((data, index) => (
            <Card key={index}>
              <Box display="grid" gap="16px">
                {header.map((headerString, index) => (
                  <CardRow key={index}>
                    <Typography variant="inherit" component="div" fontSize={12} color="#000000" sx={{ opacity: 0.5 }}>
                      {headerString}
                    </Typography>
                    <Typography sx={{ color: '#80829F' }} component="div">
                      {data[index] ?? null}
                    </Typography>
                    {collapsible && index + 1 === header.length && (
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        // onClick={() => setIsOpen(open => !open)}
                        sx={{ flexGrow: 0 }}
                      >
                        <KeyboardArrowUpIcon />
                        {/* {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} */}
                      </IconButton>
                    )}
                  </CardRow>
                ))}
              </Box>
            </Card>
          ))}
        </>
      ) : (
        <StyledTableContainer>
          <table>
            <StyledTableHead>
              <TableRow>
                {header.map((string, idx) => (
                  <TableCell key={idx} align={idx === 0 && firstAlign ? firstAlign : 'center'}>
                    {sortHeaders && sortHeaders.includes(string) && order && orderBy && createSortfunction ? (
                      <TableSortLabel
                        active={orderBy === string}
                        direction={orderBy === string ? order : 'asc'}
                        onClick={createSortfunction(string)}
                        IconComponent={sortIcon}
                        sx={{
                          '& .MuiTableSortLabel-icon': {
                            transform: 'none',
                            opacity: 1
                          },
                          '& .MuiTableSortLabel-iconDirectionDesc .sort-down': {
                            fill: theme =>
                              orderBy === string
                                ? order === 'desc'
                                  ? theme.palette.primary.main
                                  : '#00000099'
                                : '#00000099'
                          },
                          '& .MuiTableSortLabel-iconDirectionAsc .sort-up': {
                            fill: theme =>
                              orderBy === string
                                ? order === 'asc'
                                  ? theme.palette.primary.main
                                  : '#00000099'
                                : '#00000099'
                          }
                        }}
                      >
                        {string}

                        {/* <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box> */}
                      </TableSortLabel>
                    ) : (
                      string
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <Row
                  fontSize={fontSize}
                  row={row}
                  collapsible={collapsible}
                  key={row[0].toString() + idx}
                  variant={variant}
                  hiddenPart={hiddenParts && hiddenParts[idx]}
                />
              ))}
            </TableBody>
          </table>
          {rows.length === 0 && <EmptyData sx={{ margin: '30px auto', width: '100%' }}>No data</EmptyData>}
        </StyledTableContainer>
      )}
    </>
  )
}

function Row({
  row,
  variant,
  collapsible,
  hiddenPart,
  fontSize
}: {
  row: (string | number | JSX.Element)[]
  variant: 'outlined' | 'grey'
  collapsible?: boolean
  hiddenPart?: JSX.Element
  fontSize?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <StyledTableRow
        fontSize={fontSize}
        variant={variant}
        sx={
          isOpen
            ? {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                '& .MuiTableCell-root': {
                  '&:first-of-type': { borderBottomLeftRadius: 0 },
                  '&:last-child': { borderBottomRightRadius: 0 }
                }
              }
            : undefined
        }
      >
        {row.map((data, idx) => (
          <TableCell key={idx}>{data}</TableCell>
        ))}
        {collapsible && (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setIsOpen(open => !open)}
              sx={{ flexGrow: 0 }}
            >
              {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
      </StyledTableRow>
      {collapsible && (
        <TableRow>
          <TableCell style={{ padding: 0 }} colSpan={row.length + 5}>
            <Collapse
              in={isOpen}
              timeout="auto"
              sx={{
                borderBottomRightRadius: 16,
                borderBottomLeftRadius: 16,
                width: '100%',
                marginTop: -8
              }}
            >
              <Box
                sx={{
                  padding: 28,
                  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                  transition: '.5s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {hiddenPart}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
