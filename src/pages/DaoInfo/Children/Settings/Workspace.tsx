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
import AddIcon from 'assets/images/add.png'
import Image from 'components/Image'
import avatar from 'assets/images/avatar.png'
import Select from 'components/Select/Select'
import { CreateDaoDataProp } from 'state/buildingGovDao/actions'
import { SpacesListProp, useGetSpacesList } from 'hooks/useBackedTaskServer'
import { useMemo, useState } from 'react'
import EmptyData from 'components/EmptyData'
import AddTeamspaceModal from 'pages/AboutSetting/Modals/AddTeamspaceModal'
import useModal from 'hooks/useModal'

export default function General({ daoInfo, daoId }: { daoInfo: CreateDaoDataProp; daoId: number }) {
  const { showModal } = useModal()
  const [rand, setRand] = useState(Math.random())
  const { result: dataList } = useGetSpacesList(daoId, rand)
  console.log(daoInfo)

  return (
    <Box>
      <Tablee dataList={dataList} />
      <Box
        sx={{ mt: 20, gap: 10, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => {
          showModal(<AddTeamspaceModal isEdit={false} daoId={daoId} onDimiss={() => setRand(Math.random())} />)
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

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    width: 188,
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
    borderLeft: '1px solid #D4D7E2',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
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

function Tablee({ dataList }: { dataList: SpacesListProp[] }) {
  console.log(dataList)

  const rows = useMemo(
    () =>
      dataList.map((item: any) => ({
        name: item.title,
        member: item.members,
        creator: item.creator,
        access: item.access,
        types: item.types
      })),
    [dataList]
  )

  return (
    <>
      {dataList.length === 0 ? (
        <EmptyData sx={{ margin: '30px auto', width: '100%' }}>No data</EmptyData>
      ) : (
        <TableContainer sx={{ border: '1px solid #D4D7E2', borderRadius: '8px', minWidth: 942 }}>
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
                  <StyledTableCell
                    style={{
                      width: 180,
                      maxWidth: 180,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Image width={18} height={18} src={row.creator.avatar || avatar} />
                      <Typography
                        noWrap
                        sx={{
                          width: 120,
                          maxWidth: 120,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {row.creator.nickname || 'unnamed'}
                      </Typography>
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {row.member}
                      <Link href="#">Manage</Link>
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Select
                      noBold
                      placeholder=""
                      style={{ fontWeight: 500, fontSize: 14, border: 'none' }}
                      height={40}
                      value={row.access}
                      // onChange={e => setCurrentProposalStatus(e.target.value)}
                    >
                      <MenuItem
                        sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                        value={row.access}
                      >
                        Public
                      </MenuItem>
                    </Select>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Link href="#">Manage</Link>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}
