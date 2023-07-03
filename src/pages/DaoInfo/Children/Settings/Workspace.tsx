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
  MenuItem
} from '@mui/material'
import { ReactComponent as ArrowIcon } from 'assets/svg/arrow_down.svg'
import AddIcon from 'assets/images/add.png'
import Image from 'components/Image'
import avatar from 'assets/images/avatar.png'
import { SpacesListProp, useGetSpacesList } from 'hooks/useBackedTaskServer'
import { useCallback, useMemo, useState } from 'react'
import EmptyData from 'components/EmptyData'
import AddTeamspaceModal from 'pages/AboutSetting/Modals/AddTeamspaceModal'
import useModal from 'hooks/useModal'
import { useUpdateTeamspace } from 'hooks/useBackedDaoServer'
import { toast } from 'react-toastify'
import ManageMemberModal from '../Proposal/ManageMemberModal'
import PopperCard from 'components/PopperCard'
import DeleteSpaceModal from 'pages/AboutSetting/Modals/DeleteSpaceModal'
import TransferAdminModal from 'pages/AboutSetting/Modals/TransferAdminModal'
import { useActiveWeb3React } from 'hooks'
import { useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'

export default function General({ daoId }: { daoId: number }) {
  const { showModal } = useModal()
  const [rand, setRand] = useState(Math.random())
  const { result: dataList } = useGetSpacesList(daoId, rand)
  const { updateDaoMyJoinData } = useUpdateDaoDataCallback()

  return (
    <Box>
      <Tablee daoId={daoId} dataList={dataList} onDimiss={() => setRand(Math.random())} />
      <Box
        sx={{ mt: 20, gap: 10, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => {
          showModal(
            <AddTeamspaceModal
              isEdit={false}
              daoId={daoId}
              onDimiss={() => {
                updateDaoMyJoinData()
                setRand(Math.random())
              }}
            />
          )
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
const itemList = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' }
]
const editList = [
  { value: '0', label: 'Edit' },
  { value: '1', label: 'Leave Teamspace' },
  { value: '2', label: 'Delete Teamspace' }
]
function Tablee({ daoId, dataList, onDimiss }: { daoId: number; dataList: SpacesListProp[]; onDimiss: () => void }) {
  const { account } = useActiveWeb3React()
  const { showModal } = useModal()
  const update = useUpdateTeamspace()
  const { myJoinDaoData: adminLevel } = useUpdateDaoDataCallback()
  const { updateDaoMyJoinData } = useUpdateDaoDataCallback()

  const rows = useMemo(
    () =>
      dataList.map((item: any) => ({
        name: item.title,
        member: item.members,
        creator: item.creator,
        access: item.access,
        types: item.types,
        data: item
      })),
    [dataList]
  )

  const handleManageClick = useCallback(
    (spacesId: number) => {
      showModal(<ManageMemberModal spacesId={spacesId} />)
    },
    [showModal]
  )
  const handleChangeVisibility = useCallback(
    (access: string, data: SpacesListProp) => {
      update(access, data.bio, data.spacesId, data.title).then((res: any) => {
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'network error')
          return
        }
        toast.success('update success')
        onDimiss()
        updateDaoMyJoinData()
      })
    },
    [onDimiss, update, updateDaoMyJoinData]
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
                    <Typography
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        '& p': {
                          fontFamily: 'Inter',
                          color: '#0049C6',
                          fontWeight: 500,
                          fontSize: 14,
                          lineHeight: '20px'
                        },
                        '& p:hover': {
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {row.member}
                      <Typography
                        onClick={() => {
                          if (
                            adminLevel.job === 'owner' ||
                            (account && account.toLocaleLowerCase() === row.data.creator.account.toLocaleLowerCase())
                          ) {
                            handleManageClick(row.data.spacesId)
                          } else {
                            toast.error("You don't have permissions")
                          }
                        }}
                      >
                        Manage
                      </Typography>
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <PopperCard
                      sx={{
                        maxHeight: '50vh',
                        overflowY: 'auto',
                        width: 150,
                        '&::-webkit-scrollbar': {
                          display: 'none'
                        }
                      }}
                      placement="bottom"
                      targetElement={
                        <Box
                          flexDirection={'row'}
                          display={'flex'}
                          gap={12}
                          sx={{
                            height: 36,
                            padding: 0,
                            cursor: 'pointer',
                            '&:hover': {
                              borderColor: '#005BC60F'
                            },
                            '& svg': {
                              marginLeft: 'auto'
                            }
                          }}
                          alignItems={'center'}
                        >
                          <Typography fontWeight={500} fontSize={14} textAlign={'left'} sx={{ color: '#3F5170' }}>
                            {row.access.replace(/^\S/, (s: any) => s.toUpperCase())}
                          </Typography>
                          <ArrowIcon />
                        </Box>
                      }
                    >
                      <>
                        {itemList.map((item: any, index: number) => (
                          <MenuItem
                            key={item.value}
                            sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                            value={item.value}
                            onClick={() => {
                              if (
                                adminLevel.job === 'owner' ||
                                (account &&
                                  account.toLocaleLowerCase() === row.data.creator.account.toLocaleLowerCase())
                              ) {
                                handleChangeVisibility(itemList[index].value, row.data)
                              } else {
                                toast.error("You don't have permissions")
                              }
                            }}
                          >
                            {item.label}
                          </MenuItem>
                        ))}
                      </>
                    </PopperCard>
                  </StyledTableCell>
                  <StyledTableCell>
                    <PopperCard
                      sx={{
                        maxHeight: '50vh',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                          display: 'none'
                        }
                      }}
                      placement="bottom"
                      targetElement={
                        <Box
                          flexDirection={'row'}
                          display={'flex'}
                          gap={12}
                          sx={{
                            height: 36,
                            padding: 0,
                            cursor: 'pointer',
                            '&:hover': {
                              borderColor: '#97B7EF'
                            },
                            '& svg': {
                              marginLeft: 'auto'
                            }
                          }}
                          alignItems={'center'}
                        >
                          <Typography fontWeight={500} fontSize={14} textAlign={'left'} sx={{ color: '#3F5170' }}>
                            Manage
                          </Typography>
                          <ArrowIcon />
                        </Box>
                      }
                    >
                      <>
                        {editList.map((item: any, index: number) => (
                          <MenuItem
                            key={item.value}
                            sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                            value={item.value}
                            onClick={() => {
                              if (
                                adminLevel.job === 'owner' ||
                                (account &&
                                  account.toLocaleLowerCase() === row.data.creator.account.toLocaleLowerCase())
                              ) {
                                if (editList[index].value === '0') {
                                  showModal(
                                    <AddTeamspaceModal
                                      isEdit={true}
                                      daoId={daoId}
                                      spacesId={row.data.spacesId}
                                      onDimiss={() => {
                                        updateDaoMyJoinData()
                                        onDimiss()
                                      }}
                                      originContent={row.data.bio}
                                      originTitle={row.data.title}
                                      originAccess={row.data.access}
                                    />
                                  )
                                } else if (editList[index].value === '1') {
                                  showModal(
                                    <TransferAdminModal
                                      daoId={daoId}
                                      spacesId={row.data.spacesId}
                                      onDimiss={onDimiss}
                                      operator={adminLevel.job}
                                      isCreator={
                                        row.data &&
                                        account &&
                                        account.toLocaleLowerCase() === row.data.creator.account.toLocaleLowerCase()
                                      }
                                    />
                                  )
                                } else {
                                  showModal(<DeleteSpaceModal spacesId={row.data.spacesId} onDimiss={onDimiss} />)
                                }
                              } else toast.error("You don't have permissions")
                            }}
                          >
                            {item.label}
                          </MenuItem>
                        ))}
                      </>
                    </PopperCard>
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
