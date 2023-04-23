import { Box, Drawer, Typography, styled } from '@mui/material'
import SaveButton from 'components/Button/OutlineButton'
import ConfirmButton from 'components/Button/Button'
import Image from 'components/Image'
import { timeStampToFormat } from 'utils/dao'
import Select from 'components/Select/SearchSelect'
import DateTimePicker from 'components/DateTimePicker'
import Input from 'components/Input'
import React, { SetStateAction, useCallback, useMemo, useState } from 'react'
import assign from 'assets/images/assign.png'
import select from 'assets/images/select.png'
import dateIcon from 'assets/images/date.png'
import proposalIcon from 'assets/images/proposal.png'
import { ReactComponent as ArrowBackIcon } from 'assets/svg/arrow_back.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import { useCreateTask, useJobsList, useUpdateTask } from 'hooks/useBackedTaskServer'
import { ITaskQuote } from 'pages/TeamSpaces/Task/DragTaskPanel'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from 'hooks/useModal'
import { shortenAddress } from 'utils'

const ColSentence = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'row',
  alignItems: 'center',
  margin: '60px 0 0',
  '& button': {
    border: '1px solid #0049c6'
  }
}))

const RowContent = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  alignItems: 'center',
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
  '& .MuiInputBase-root.Mui-focused, & .css-jh7bmd-MuiInputBase-root.Mui-focused, & .css-jh7bmd-MuiInputBase-root.MuiInputBase-root': {
    border: 'none!important'
  },
  '& input': {
    padding: 0,
    height: 30,
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
  'Not status': 'D_notStatus'
}

export const MapTaskStatus: any = {
  A_notStarted: 'Not started',
  B_inprogress: 'In progress',
  C_done: 'Done',
  D_notStatus: 'Not status'
}

const PriorityType: any = {
  High: 'A_High',
  Medium: 'B_Medium',
  Low: 'C_Low'
}

export const MapPriorityType: any = {
  A_High: 'High',
  B_Medium: 'Medium',
  C_Low: 'Low'
}

const statusList = ['Not started', 'In progress', 'Done', 'Not status']
const priorityList = ['High', 'Medium', 'Low']

export default function SidePanel({
  open,
  onDismiss,
  proposalBaseList,
  TeamSpacesInfo,
  editData
}: {
  open: boolean
  onDismiss: () => void
  proposalBaseList: any
  TeamSpacesInfo: any
  editData: ITaskQuote
}) {
  const { result: jobsList } = useJobsList(TeamSpacesInfo?.daoAddress, Number(TeamSpacesInfo?.chainId))
  const assigneeList = jobsList.map((item: any) => shortenAddress(item.account))
  const proposalList = proposalBaseList.map((item: any) => item.proposalId + '.' + item.title)
  const updateProposal = useMemo(() => {
    if (!editData || !proposalBaseList) return
    const res = proposalBaseList.filter((item: any) => editData.proposalId === item.proposalId)[0]
    return res ? editData.proposalId + '.' + res.title : ''
  }, [editData, proposalBaseList])

  const toggleDrawer = useCallback(
    e => {
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

  const isSmDown = useBreakpoint('sm')
  const [currentStatus, setCurrentStatus] = useState(MapTaskStatus[editData?.status] ?? '')
  const [assignees, setAssignees] = useState(editData?.assignAccount ?? '')
  const [priority, setPriority] = useState<any>(MapPriorityType[editData?.priority] ?? '')
  const [proposal, setProposal] = useState(updateProposal ?? '')
  const [value, setValue] = useState(editData?.taskName ?? '')
  const [endTime, setEndTime] = useState<any>(editData?.deadline ?? null)
  const create = useCreateTask()
  const update = useUpdateTask()
  const { showModal } = useModal()
  const createCallback = useCallback(() => {
    if (!TeamSpacesInfo || !value) return
    const proposalId = Number(proposal.split('.')[0])

    create(
      assignees,
      '',
      endTime,
      PriorityType[priority],
      proposalId,
      '0',
      TeamSpacesInfo.teamSpacesId,
      'A_notStarted',
      value
    ).then((res: any) => {
      if (res.code === 200) {
        onDismiss()
        showModal(<MessageBox type="success">Create task success</MessageBox>)
      }
    })
  }, [TeamSpacesInfo, assignees, create, endTime, onDismiss, priority, proposal, showModal, value])

  const updateCallback = useCallback(() => {
    if (!editData) return
    update(
      assignees,
      '',
      endTime,
      PriorityType[priority],
      editData?.proposalId,
      '0',
      editData.spacesId,
      TaskStatus[currentStatus],
      editData.taskId,
      value,
      editData.weight
    ).then(res => {
      onDismiss()
      showModal(<MessageBox type="success">Update success</MessageBox>)
      console.log(res)
    })
  }, [assignees, currentStatus, editData, endTime, onDismiss, priority, showModal, update, value])

  const getActions = useCallback(() => {
    if (!value)
      return (
        <ConfirmButton disabled width="140px" height="36px">
          Title required
        </ConfirmButton>
      )
    if (editData) {
      return (
        <SaveButton width="140px" height="36px" color="#0049C6" onClick={updateCallback}>
          Save
        </SaveButton>
      )
    } else {
      return (
        <ConfirmButton width="140px" height="36px" color="#ffffff" onClick={createCallback}>
          Confirm
        </ConfirmButton>
      )
    }
  }, [createCallback, editData, updateCallback, value])

  return (
    <Box maxWidth="608px" width="100%">
      <Drawer
        sx={{
          width: '100%',
          '& .css-ld25lh-MuiPaper-root-MuiDrawer-paper': {
            padding: 20,
            width: '50vw'
          },
          '& .title': {
            margin: '10px 0'
          },
          '& .css-jh7bmd-MuiInputBase-root.MuiInputBase-root': {
            padding: '0 0 0 20px'
          },
          '& .MuiInputBase-root.Mui-focused, & .css-jh7bmd-MuiInputBase-root.Mui-focused, & .css-jh7bmd-MuiInputBase-root.MuiInputBase-root': {
            border: 'none!important'
          },
          '& input': {
            color: '#3F5170',
            fontWeight: 700,
            fontSize: 30
          }
        }}
        anchor={'right'}
        open={open}
        onClose={toggleDrawer}
      >
        <Box sx={{ marginLeft: { sm: 20, xs: 0 }, marginTop: { sm: 20, xs: 10 } }}>
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
        </Box>
        <Input
          className="title"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Untitled"
          focused
        />
        <RowContent>
          <Box className={'lContent'}>
            <Image src={assign}></Image>
            <Typography>Assignee</Typography>
          </Box>
          <Select
            options={assigneeList}
            placeholder="Empty"
            width={isSmDown ? 160 : 219}
            height={isSmDown ? 40 : undefined}
            value={assignees}
            multiple={false}
            onChange={(value: any) => setAssignees(value)}
          />
        </RowContent>
        <RowContent>
          <Box className={'lContent'}>
            <Image src={select}></Image>
            <Typography>Status</Typography>
          </Box>
          <Select
            options={statusList}
            placeholder="Empty"
            width={isSmDown ? 160 : 219}
            height={isSmDown ? 40 : undefined}
            value={currentStatus}
            multiple={false}
            onChange={(value: any) => setCurrentStatus(value)}
          />
        </RowContent>
        <RowContent>
          <Box className={'lContent'}>
            <Image src={select}></Image>
            <Typography>Priority</Typography>
          </Box>
          <Select
            options={priorityList}
            placeholder="Empty"
            width={isSmDown ? 160 : 219}
            height={isSmDown ? 40 : undefined}
            value={priority}
            multiple={false}
            onChange={(value: any) => setPriority(value)}
          />
        </RowContent>
        {/* <RowContent>
          <Box className={'lContent'}>
            <Image src={select}></Image>
            <Typography>Task Type</Typography>
          </Box>
          <Input value={value} onChange={e => setValue(e.target.value)} placeholder="Empty" />
        </RowContent> */}
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
        <RowContent mt={10}>
          <Box className={'lContent'}>
            <Image src={proposalIcon}></Image>
            <Typography>Proposal</Typography>
          </Box>
          <Select
            options={proposalList}
            placeholder="Choose a proposal"
            width={isSmDown ? 160 : 219}
            height={isSmDown ? 40 : undefined}
            value={proposal}
            multiple={false}
            onChange={(value: any) => setProposal(value)}
          />
        </RowContent>
        {/* <RowContent mt={10}>
          <Box className={'lContent'}>
            <Image src={rewardIcon}></Image>
            <Typography>Reward</Typography>
          </Box>
          <SaveButton width={125} height={26} fontWeight={400} onClick={() => {}}>
            Set Reward
          </SaveButton>
        </RowContent> */}
        {/* <Box
          sx={{
            mt: 20,
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            '& img': {
              width: 14,
              height: 14
            }
          }}
        >
          <Image src={addIcon}></Image>
          <Typography>Add Property</Typography>
        </Box> */}
        <ColSentence>
          {/* <SaveButton width={140} height={36} onClick={() => {}}>
            Save
          </SaveButton> */}
          {getActions()}
        </ColSentence>
      </Drawer>
    </Box>
  )
}
