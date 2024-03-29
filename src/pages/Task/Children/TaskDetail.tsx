import {
  Box,
  Drawer,
  Typography,
  styled,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
  MenuItem,
  useTheme
} from '@mui/material'
import ConfirmButton from 'components/Button/Button'
import SaveButton from 'components/Button/OutlineButton'
import Image from 'components/Image'
import { timeStampToFormat } from 'utils/dao'
// import SearchSelect from 'components/Select/SearchSelect'
import Select from 'components/Select/Select'
import DateTimePicker from 'components/DateTimePicker'
import Input from 'components/Input'
import React, { SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import assign from 'assets/images/assign.png'
import select from 'assets/images/select.png'
import dateIcon from 'assets/images/date.png'
import proposalIcon from 'assets/images/proposal.png'
import { ReactComponent as ArrowBackIcon } from 'assets/svg/arrow_back.svg'
import { ReactComponent as Invite } from 'assets/svg/invite.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import ReactHtmlParser from 'react-html-parser'
import { useCreateTask, useGetTaskDetail, useJobsList, useUpdateTask } from 'hooks/useBackedTaskServer'
import { ITaskQuote } from 'pages/TeamSpaces/Task/DragTaskPanel'
import { shortenAddress } from 'utils'
import Editor from 'pages/DaoInfo/Children/Proposal/Editor'
import { ReactComponent as ViewDtailIcon } from 'assets/svg/viewDetailIcon.svg'
import { escapeAttrValue } from 'xss'
import useCopyClipboard from 'hooks/useCopyClipboard'
import { toast } from 'react-toastify'
import { ProposalListBaseProp } from 'hooks/useBackedProposalServer'

const ColSentence = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  flexDirection: 'row',
  alignItems: 'center',
  margin: '20px 0 0',
  '& button': {
    border: '1px solid #0049c6'
  },
  [theme.breakpoints.down('sm')]: {
    margin: '100px 0 0'
  }
}))

const EditContent = styled('div')({
  '& img': {
    maxWidth: '50%'
  }
})

const RowContent = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  alignItems: 'center',
  '& img': {
    maxWidth: '50%'
  },
  '& .lContent': {
    minWidth: 160,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    '& img': {
      width: 14,
      height: 14
    }
  },
  '& .css-jh7bmd-MuiInputBase-root': {
    width: 219,
    minHeight: 36
  },
  '& .css-jh7bmd-MuiInputBase-root.MuiInputBase-root': {
    padding: '0 0 0 20px'
  },
  // '& .MuiInputBase-root.Mui-focused, & .css-jh7bmd-MuiInputBase-root.Mui-focused, & .css-jh7bmd-MuiInputBase-root.MuiInputBase-root': {
  //   border: 'none!important'
  // },
  '& input': {
    padding: 0,
    // height: 30,
    '&::placeholder': {
      color: '#97b7ef'
    }
  },
  '& .css-1iid421-MuiFormControl-root-MuiTextField-root input': {
    paddingLeft: 20,
    fontSize: 14
  },
  '& button': {
    border: '1px solid #d4d7e2'
  }
}))

const TaskStatus: any = {
  'Not started': 'A_notStarted',
  'In progress': 'B_inProgress',
  Done: 'C_done',
  'No status': 'D_notStatus'
}

export const MapTaskStatus: any = {
  A_notStarted: 'Not started',
  B_inProgress: 'In progress',
  C_done: 'Done',
  D_notStatus: 'No status'
}

// const PriorityType: any = {
//   High: 'A_High',
//   Medium: 'B_Medium',
//   Low: 'C_Low'
// }

export const MapPriorityType: any = {
  A_High: 'High',
  B_Medium: 'Medium',
  C_Low: 'Low'
}

const statusList = ['Not started', 'In progress', 'Done', 'No status']
// const priorityList = ['High', 'Medium', 'Low']

export default function TaskDetail({
  open,
  onDismiss,
  proposalBaseList,
  daoId,
  spacesId,
  editData,
  identity,
  initStatus
}: {
  open: boolean
  onDismiss: () => void
  proposalBaseList: ProposalListBaseProp[]
  daoId: number
  spacesId: number
  editData: ITaskQuote | any
  identity: string
  initStatus: string
}) {
  const preStatus = useMemo(() => {
    const status = MapTaskStatus[editData?.status] ? MapTaskStatus[editData?.status] : initStatus
    return status
  }, [editData, initStatus])

  const { result: jobsList } = useJobsList(daoId)
  const assigneeList = useMemo(() => {
    if (!jobsList) return []
    const _arr: any = []
    jobsList.map(item => {
      _arr.push(
        Object.assign({}, item, { label: item.nickname + '-' + shortenAddress(item.account), value: item.account })
      )
    })
    return _arr
  }, [jobsList])
  const proposalList = useMemo(() => {
    if (!proposalBaseList) return []
    const arr: any = []
    proposalBaseList.map((item: any) => {
      arr.push(Object.assign({}, item, { label: item.title, value: item.proposalId }))
    })
    return arr
  }, [proposalBaseList])
  console.log('list', editData, proposalList)

  const updateProposal = useMemo(() => {
    if (!editData || !proposalBaseList) return
    const res = proposalBaseList.filter((item: any) => editData.proposalId === item.proposalId)[0]
    return res ? res.proposalId : ''
  }, [editData, proposalBaseList])

  const toggleDrawer = useCallback(
    (e: React.KeyboardEvent<Element>) => {
      if (
        e.type === 'keydown' &&
        ((e as React.KeyboardEvent).key === 'Tab' || (e as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }
      onDismiss()
    },
    [onDismiss]
  )
  const [isSubmit, setIsSubmit] = useState(false)
  const isSmDown = useBreakpoint('sm')
  const theme = useTheme()
  const [isCopied, setCopied] = useCopyClipboard()
  const [isEdit, setIsEdit] = useState<any>(!!editData ?? false)
  const { result: taskDetailData } = useGetTaskDetail(editData?.taskId)
  const [currentStatus, setCurrentStatus] = useState(preStatus ?? '')
  const [assignees, setAssignees] = useState<any>(editData?.assignAccount ?? '')
  const [priority, setPriority] = useState<any>(editData?.priority ?? '')
  const [proposal, setProposal] = useState(updateProposal ?? '')
  const [value, setValue] = useState(editData?.taskName ?? '')
  const [endTime, setEndTime] = useState<any>(editData?.deadline ?? null)
  const [content, setContent] = useState<any>(taskDetailData?.content ?? '')
  const { loading: createLoading, CreateTaskCallback } = useCreateTask()
  const { loading: updateLoading, updateTaskCallback } = useUpdateTask()
  const link = useMemo(() => {
    return window.location.toString()
  }, [])
  useEffect(() => {
    setContent(taskDetailData?.content)
  }, [taskDetailData?.content])

  const createCallback = useCallback(() => {
    setIsSubmit(true)
    if (!value.trim()) return
    if (!spacesId) return
    CreateTaskCallback(
      assignees,
      content,
      endTime,
      priority,
      Number(proposal),
      '0',
      spacesId,
      currentStatus ? TaskStatus[currentStatus] : 'A_notStarted',
      value
    ).then((res: any) => {
      if (res.data.code === 200) {
        onDismiss()
        toast.success('Create task success')
      } else toast.error('Network error')
      setIsSubmit(false)
    })
  }, [value, spacesId, CreateTaskCallback, assignees, content, endTime, priority, proposal, currentStatus, onDismiss])

  const updateCallback = useCallback(() => {
    setIsSubmit(true)
    if (!value.trim()) return
    if (!editData) return
    updateTaskCallback(
      assignees,
      content,
      endTime,
      false,
      priority,
      Number(proposal),
      '0',
      editData.spacesId,
      TaskStatus[currentStatus],
      editData.taskId,
      value,
      editData.weight
    ).then((res: any) => {
      onDismiss()
      if (res.data.code !== 200) {
        toast.error(res.data.msg || 'Network error')
        setIsSubmit(false)
        return
      }
      toast.success('Update success')
      setIsSubmit(false)
    })
  }, [assignees, content, currentStatus, editData, endTime, onDismiss, priority, proposal, updateTaskCallback, value])

  const getActions = useCallback(() => {
    if (editData) {
      return (
        <SaveButton disabled={updateLoading} width="140px" height="36px" color="#0049C6" onClick={updateCallback}>
          Save
        </SaveButton>
      )
    } else {
      return (
        <ConfirmButton disabled={createLoading} width="140px" height="36px" color="#ffffff" onClick={createCallback}>
          Confirm
        </ConfirmButton>
      )
    }
  }, [createCallback, createLoading, editData, updateCallback, updateLoading])

  return (
    <Box maxWidth="608px" width="100%">
      <Drawer
        sx={{
          width: '100%',
          '& .MuiDrawer-paper': {
            padding: '20px 20px 20px 40px',
            width: '40vw'
          },
          '& .title': {
            margin: '10px 0',
            paddingLeft: 0
          },
          [theme.breakpoints.down('sm')]: {
            '& .MuiDrawer-paper': {
              width: '100vw',
              padding: '20px'
            }
          }
          // '& .Mui-focused, & .MuiInputBase-root': {
          //   border: 'none!important'
          // }
        }}
        anchor={'right'}
        open={open}
        onClose={toggleDrawer}
      >
        {(identity && identity === 'visitor') || isEdit === true ? (
          <>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              sx={{
                marginTop: { sm: 20, xs: 10 },
                '& button': {
                  gap: 6
                }
              }}
            >
              <Typography
                sx={{ cursor: 'pointer' }}
                fontWeight={600}
                display={'inline-flex'}
                onClick={onDismiss}
                alignItems="center"
              >
                <ArrowBackIcon style={{ marginRight: 10 }}></ArrowBackIcon>
                Back
              </Typography>
              <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={20}>
                {isEdit && identity !== 'visitor' ? (
                  <>
                    <Box
                      onClick={() => setCopied(link)}
                      sx={{
                        width: 'fit-contet',
                        height: 'auto',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 10,
                        '& svg ': {
                          width: 14
                        },
                        '& svg path': {
                          fill: '#97B7EF'
                        }
                      }}
                    >
                      <Invite />
                      <Typography maxWidth={'100%'} fontWeight={500} fontSize={14} color={'#3F5170'}>
                        {isCopied ? 'Copied Link' : 'Share'}
                      </Typography>
                    </Box>
                    <ConfirmButton
                      width="127px"
                      height="25px"
                      color="#ffffff"
                      onClick={(e: any) => {
                        setIsEdit(false)
                        e.stopPropagation()
                      }}
                    >
                      <ViewDtailIcon />
                      <Typography>Edit Details</Typography>
                    </ConfirmButton>
                  </>
                ) : (
                  ''
                )}
              </Box>
            </Box>
            <Input
              disabled
              className="title"
              value={value}
              hideBorder={true}
              onChange={e => setValue(e.target.value)}
              placeholder="Untitled"
              focused
              style={{ fontSize: 30, color: '#3F5170', fontWeight: 700 }}
            />
            <RowContent>
              <Box className={'lContent'}>
                <Image src={assign}></Image>
                <Typography>Assignee</Typography>
              </Box>
              {/* <Select
                disabled
                options={assigneeList}
                placeholder="Empty"
                width={isSmDown ? 160 : 219}
                height={isSmDown ? 40 : undefined}
                value={assignees}
                multiple={false}
                onChange={(value: any, option: any) => {
                  console.log('values', value, option)
                  setAssignees(option.value)
                }}
              /> */}
              <Select
                disabled
                noBold
                placeholder="Empty"
                style={{ fontWeight: 500, fontSize: 14 }}
                width={isSmDown ? 160 : 248}
                height={isSmDown ? '30px' : '40px'}
                value={assignees}
                onChange={e => setAssignees(e.target.value)}
              >
                {assigneeList.map((item: any) => (
                  <MenuItem
                    key={item.label}
                    sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                    value={item.value}
                    selected={assignees === item.value}
                  >
                    {item.nickname
                      ? item.nickname.length > 7
                        ? item.nickname.slice(0, 7) + '...'
                        : item.nickname
                      : 'unnamed'}
                    {'(' + shortenAddress(item.account, 3) + ')'}
                  </MenuItem>
                ))}
              </Select>
            </RowContent>
            <RowContent>
              <Box className={'lContent'}>
                <Image src={select}></Image>
                <Typography>Status</Typography>
              </Box>
              {/* <SearchSelect
                disabled
                options={statusList}
                placeholder="Empty"
                width={isSmDown ? 160 : 219}
                height={isSmDown ? 40 : undefined}
                value={currentStatus}
                multiple={false}
                onChange={(value: any) => setCurrentStatus(value)}
              /> */}
              <Select
                disabled
                noBold
                placeholder="Empty"
                style={{ fontWeight: 500, fontSize: 14, marginTop: 10 }}
                width={isSmDown ? 160 : 248}
                height={isSmDown ? '30px' : '40px'}
                value={currentStatus}
                onChange={e => setCurrentStatus(e.target.value)}
              >
                {statusList.map((item: any) => (
                  <MenuItem
                    key={item}
                    sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                    value={item}
                    selected={currentStatus === item}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </RowContent>
            <RowContent>
              <Box className={'lContent'}>
                <Image src={select}></Image>
                <Typography>Priority</Typography>
              </Box>
              {/* <Select
            options={priorityList}
            placeholder="Empty"
            width={isSmDown ? 160 : 219}
            height={isSmDown ? 40 : undefined}
            value={priority}
            multiple={false}
            onChange={(value: any) => setPriority(value)}
          /> */}
              <RadioGroup
                sx={{ marginLeft: 10 }}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={priority}
                onChange={(e: any) => setPriority(e.target.value)}
              >
                <FormControlLabel
                  value="A_High"
                  disabled
                  control={<Radio />}
                  label="High"
                  sx={{
                    marginRight: 10,
                    '& svg path': {
                      fill: '#E46767'
                    },
                    '& .Mui-checked svg path': {
                      fill: '#E46767'
                    }
                  }}
                />
                <FormControlLabel
                  value="B_Medium"
                  disabled
                  control={<Radio />}
                  label="Medium"
                  sx={{
                    marginRight: 10,
                    '& svg path': {
                      fill: '#EFCC97'
                    },
                    '& .Mui-checked svg path': {
                      fill: '#EFCC97'
                    }
                  }}
                />
                <FormControlLabel
                  value="C_Low"
                  disabled
                  control={<Radio />}
                  label="Low"
                  sx={{
                    marginRight: 10,
                    '& svg path': {
                      fill: '#CAE7ED'
                    },
                    '& .Mui-checked svg path': {
                      fill: '#CAE7ED'
                    }
                  }}
                />
              </RadioGroup>
            </RowContent>
            <RowContent>
              <Box className={'lContent'}>
                <Image src={dateIcon}></Image>
                <Typography>Due date</Typography>
              </Box>
              <DateTimePicker
                disabled
                label="Empty"
                value={endTime ? new Date(endTime * 1000) : null}
                onValue={(timestamp: SetStateAction<number | undefined>) => setEndTime(timestamp)}
              ></DateTimePicker>
            </RowContent>
            <RowContent mt={10}>
              <Box className={'lContent'}>
                <Image src={dateIcon}></Image>
                <Typography>Date Created</Typography>
              </Box>
              <Typography fontSize={16} marginLeft={14}>
                {timeStampToFormat(taskDetailData ? taskDetailData?.createTime * 1000 : 0, 'Y-MM-DD HH:mm')}
              </Typography>
            </RowContent>
            <RowContent mt={10} mb={10}>
              <Box className={'lContent'}>
                <Image src={proposalIcon}></Image>
                <Typography>Proposal</Typography>
              </Box>
              {/* <SearchSelect
                disabled
                options={proposalList}
                placeholder="Choose a proposal"
                width={isSmDown ? 160 : 219}
                height={isSmDown ? 40 : undefined}
                value={proposal}
                multiple={false}
                onChange={(value: any) => {
                  setProposal(value)
                }}
              /> */}
              <Box
                width={'246.88px'}
                sx={{
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #D4D7E2',
                  borderRadius: '10px'
                }}
              >
                {taskDetailData?.proposalTitle ? (
                  <Typography
                    noWrap
                    sx={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      maxWidth: 246,
                      paddingLeft: 16,
                      fontSize: 14,
                      color: '#3f5170',
                      fontWeight: 500
                    }}
                  >
                    {taskDetailData?.proposalTitle}
                  </Typography>
                ) : (
                  <Typography
                    sx={{
                      maxWidth: 246,
                      paddingLeft: 16,
                      fontSize: 14,
                      color: '#808191',
                      fontWeight: 400
                    }}
                  >
                    Empty
                  </Typography>
                )}
              </Box>
            </RowContent>
            <EditContent>
              {ReactHtmlParser(
                filterXSS(taskDetailData?.content || '', {
                  onIgnoreTagAttr: function (_, name, value) {
                    if (name === 'class' || name === 'style') {
                      return name + '="' + escapeAttrValue(value) + '"'
                    }
                    return undefined
                  }
                })
              )}
            </EditContent>
          </>
        ) : (
          <>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              sx={{
                marginTop: { sm: 20, xs: 10 },
                '& button': {
                  gap: 6
                }
              }}
            >
              <Typography
                sx={{ cursor: 'pointer' }}
                fontWeight={600}
                display={'inline-flex'}
                onClick={onDismiss}
                alignItems="center"
              >
                <ArrowBackIcon style={{ marginRight: 10 }}></ArrowBackIcon>
                Back
              </Typography>
              <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={20}>
                {/* <Box
                  onClick={() => setCopied(link)}
                  sx={{
                    width: 'fit-contet',
                    height: 'auto',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 10,
                    '& svg ': {
                      width: 14
                    },
                    '& svg path': {
                      fill: '#97B7EF'
                    }
                  }}
                >
                  <Invite />
                  <Typography maxWidth={'100%'} fontWeight={500} fontSize={14} color={'#3F5170'}>
                    {isCopied ? 'Copied Link' : 'Share'}
                  </Typography>
                </Box> */}
                {isEdit === true ? (
                  <ConfirmButton
                    width="127px"
                    height="25px"
                    color="#ffffff"
                    onClick={(e: any) => {
                      setIsEdit(false)
                      e.stopPropagation()
                    }}
                  >
                    <ViewDtailIcon />
                    <Typography>Edit Details</Typography>
                  </ConfirmButton>
                ) : (
                  ''
                )}
              </Box>
            </Box>
            <Input
              className="title"
              value={value}
              hideBorder={true}
              onChange={e => setValue(e.target.value)}
              placeholder="Untitled"
              style={{ fontSize: 30, color: '#3F5170', fontWeight: 700 }}
            />
            <RowContent>
              <Box className={'lContent'}>
                <Image src={assign}></Image>
                <Typography>Assignee</Typography>
              </Box>
              <Select
                noBold
                placeholder="Empty"
                style={{ fontWeight: 500, fontSize: 14 }}
                width={isSmDown ? 160 : 248}
                height={isSmDown ? '30px' : '40px'}
                value={assignees}
                onChange={e => setAssignees(e.target.value)}
              >
                {assigneeList.map((item: any) => (
                  <MenuItem
                    key={item.label}
                    sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                    value={item.value}
                    selected={assignees === item.value}
                  >
                    {item.nickname
                      ? item.nickname.length > 7
                        ? (isSmDown ? item.nickname.slice(0, 3) : item.nickname.slice(0, 7)) + '...'
                        : item.nickname
                      : 'unnamed'}
                    {'(' + shortenAddress(item.account, 3) + ')'}
                  </MenuItem>
                ))}
              </Select>
            </RowContent>
            <RowContent>
              <Box className={'lContent'}>
                <Image src={select}></Image>
                <Typography>Status</Typography>
              </Box>
              {/* <SearchSelect
                options={statusList}
                placeholder="Empty"
                width={isSmDown ? 160 : 219}
                height={isSmDown ? 40 : undefined}
                value={currentStatus}
                multiple={false}
                onChange={(value: any) => setCurrentStatus(value)}
              /> */}
              <Select
                noBold
                placeholder="Empty"
                style={{ fontWeight: 500, fontSize: 14, marginTop: 10 }}
                width={isSmDown ? 160 : 248}
                height={isSmDown ? '30px' : '40px'}
                value={currentStatus}
                onChange={e => setCurrentStatus(e.target.value)}
              >
                {statusList.map((item: any) => (
                  <MenuItem
                    key={item}
                    sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                    value={item}
                    selected={currentStatus === item}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </RowContent>
            <RowContent>
              <Box className={'lContent'}>
                <Image src={select}></Image>
                <Typography>Priority</Typography>
              </Box>
              {/* <Select
            options={priorityList}
            placeholder="Empty"
            width={isSmDown ? 160 : 219}
            height={isSmDown ? 40 : undefined}
            value={priority}
            multiple={false}
            onChange={(value: any) => setPriority(value)}
          /> */}
              <RadioGroup
                sx={{ marginLeft: 10 }}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={priority}
                onChange={(e: any) => setPriority(e.target.value)}
              >
                <FormControlLabel
                  value="A_High"
                  control={<Radio />}
                  label="High"
                  sx={{
                    marginRight: 10,
                    '& svg path': {
                      fill: '#E46767'
                    },
                    '& .Mui-checked svg path': {
                      fill: '#E46767'
                    }
                  }}
                />
                <FormControlLabel
                  value="B_Medium"
                  control={<Radio />}
                  label="Medium"
                  sx={{
                    marginRight: 10,
                    '& svg path': {
                      fill: '#EFCC97'
                    },
                    '& .Mui-checked svg path': {
                      fill: '#EFCC97'
                    }
                  }}
                />
                <FormControlLabel
                  value="C_Low"
                  control={<Radio />}
                  label="Low"
                  sx={{
                    marginRight: 10,
                    '& svg path': {
                      fill: '#CAE7ED'
                    },
                    '& .Mui-checked svg path': {
                      fill: '#CAE7ED'
                    }
                  }}
                />
              </RadioGroup>
            </RowContent>
            <RowContent>
              <Box className={'lContent'}>
                <Image src={dateIcon}></Image>
                <Typography>Due date</Typography>
              </Box>
              <DateTimePicker
                label="Empty"
                value={endTime ? new Date(endTime * 1000) : null}
                onValue={(timestamp: SetStateAction<number | undefined>) => setEndTime(timestamp)}
              ></DateTimePicker>
            </RowContent>
            <RowContent mt={10}>
              <Box className={'lContent'}>
                <Image src={dateIcon}></Image>
                <Typography>Date Created</Typography>
              </Box>
              <Typography fontSize={16} marginLeft={14}>
                {timeStampToFormat(new Date().getTime(), 'Y-MM-DD HH:mm')}
              </Typography>
            </RowContent>
            <RowContent mt={10} mb={10}>
              <Box className={'lContent'}>
                <Image src={proposalIcon}></Image>
                <Typography>Proposal</Typography>
              </Box>
              {/* <SearchSelect
                options={proposalList}
                placeholder="Choose a proposal"
                width={isSmDown ? 160 : 219}
                height={isSmDown ? 40 : undefined}
                value={proposal}
                multiple={false}
                onChange={(value: any) => {
                  setProposal(value)
                }}
              /> */}
              <Select
                placeholder="Choose a proposal"
                noBold
                style={{ fontWeight: 500, fontSize: 14 }}
                width={isSmDown ? 160 : 248}
                height={isSmDown ? '30px' : '40px'}
                value={proposal}
                onChange={e => setProposal(e.target.value)}
              >
                {proposalList.length > 0 ? (
                  proposalList.map((item: any) => (
                    <MenuItem
                      key={item.proposalId}
                      sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                      value={item.proposalId}
                      selected={proposal === item.proposalId}
                    >
                      {item.label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled sx={{ fontWeight: 500, fontSize: '14px !important', color: '#808191' }}>
                    No more options are available
                  </MenuItem>
                )}
              </Select>
            </RowContent>
            <RowContent
              sx={{
                '& .ql-container': {
                  height: 260
                }
              }}
            >
              <Editor content={content} setContent={setContent} />
            </RowContent>
            {!value.trim() && isSubmit && (
              <Alert style={{ marginTop: isSmDown ? 45 : 20 }} severity="error">
                Task title required
              </Alert>
            )}
            <ColSentence>{getActions()}</ColSentence>
          </>
        )}
      </Drawer>
    </Box>
  )
}
