import {
  Box,
  Typography,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  MenuItem,
  Link
} from '@mui/material'
import { DaoInfoProp } from 'hooks/useDaoInfo'
import AddIcon from 'assets/images/add.png'
import { ChainId } from 'constants/chain'
import Image from 'components/Image'
import avatar from 'assets/images/avatar.png'
import Select from 'components/Select/Select'
export default function General({ daoInfo, daoChainId }: { daoInfo: DaoInfoProp; daoChainId: ChainId }) {
  return (
    <Box>
      <Tablee />

      <Box
        sx={{ mt: 20, gap: 10, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => {
          console.log(daoInfo, daoChainId)
        }}
      >
        <img src={AddIcon} width={14} />
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: 14,
            lineHeight: '20px',
            color: '#97B7EF'
          }}
        >
          New teamspace
        </Typography>
      </Box>
    </Box>
  )
}

function Tablee() {
  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      padding: 0,
      paddingLeft: 20,
      height: '31px',
      backgroundColor: '#F8FBFF',
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '20px',
      color: '#3F5170',
      border: 'none',
      borderLeft: '1px solid #D4D7E2'
    },
    [`&.${tableCellClasses.head}.firstColumn`]: {
      borderLeft: 'none'
    },
    [`&.${tableCellClasses.body}`]: {
      padding: '0px 20px',
      height: '50px',
      fontFamily: 'Inter',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '20px',
      color: '#3F5170'
    }
  }))

  const StyledTableRow = styled(TableRow)(() => ({
    '& td': {
      borderTop: '1px solid #D4D7E2',
      borderLeft: '1px solid #D4D7E2'
    },
    '& td:first-of-type': {
      borderLeft: 'none'
    },
    '&:last-child td': {
      borderBottom: 'none'
    }
  }))

  const rows = [
    { Name: 'Task1', Created: 'Eveyguan', Member: 23, Access: 'Private', Manage: 'Manage' },
    { Name: 'Task1', Created: 'Eveyguan', Member: 23, Access: 'Private', Manage: 'Manage' }
  ]

  return (
    <TableContainer sx={{ border: '1px solid #D4D7E2', borderRadius: '8px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell className="firstColumn">Name</StyledTableCell>
            <StyledTableCell>Created by</StyledTableCell>
            <StyledTableCell>Member</StyledTableCell>
            <StyledTableCell>Access (Super admin)</StyledTableCell>
            <StyledTableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>{row.Name}</StyledTableCell>
              <StyledTableCell>
                <Typography style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Image width={18} height={18} src={avatar} />
                  {row.Created}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {row.Member}
                  <Link href="#">Manage</Link>
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Select
                  noBold
                  placeholder=""
                  style={{ fontWeight: 500, fontSize: 14, border: 'none' }}
                  height={40}
                  value={row.Access}
                  // onChange={e => setCurrentProposalStatus(e.target.value)}
                >
                  <MenuItem sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }} value={row.Access}>
                    Public
                  </MenuItem>
                </Select>
              </StyledTableCell>
              <StyledTableCell>
                <Link href="#">{row.Manage} </Link>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
