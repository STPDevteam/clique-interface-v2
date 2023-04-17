import { Box, Drawer, Typography, styled } from '@mui/material'
import SaveButton from 'components/Button/OutlineButton'
import ConfirmButton from 'components/Button/Button'
import Image from 'components/Image'
import { timeStampToFormat } from 'utils/dao'
import Select from 'components/Select/SearchSelect'
import DateTimePicker from 'components/DateTimePicker'
import Input from 'components/Input'
import Back from 'components/Back'
import React, { SetStateAction, useCallback, useState } from 'react'
import assign from 'assets/images/assign.png'
import select from 'assets/images/select.png'
import dateIcon from 'assets/images/date.png'
import proposalIcon from 'assets/images/proposal.png'
// import rewardIcon from 'assets/images/reward.png'
// import addIcon from 'assets/images/add.png'
import useBreakpoint from 'hooks/useBreakpoint'

const ColSentence = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'center',
  margin: '60px 0 0',
  '& button': {
    color: '#0049c6',
    border: '1px solid #0049c6'
  },
  '& button:nth-of-type(2)': {
    color: '#fff'
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

enum TaskStatus {
  'A_notStarted' = 'Not started',
  'B_inProgress' = 'In progress',
  'C_done' = 'Done',
  'D_notStatus' = 'Not status'
}

enum PriorityType {
  'A_High' = 'High',
  'B_Medium' = 'Medium',
  'C_Low' = 'Low'
}

const statusList = ['No Type', 'In progress', 'Not started', 'Done']
const assigneeList = ['admin', 'super admin', 'none']
const priorityList = ['High', 'Medium', 'Low']
const proposalList = ['proposal0', 'proposal1', 'proposal2', 'proposal3']
console.log(TaskStatus, priorityList, PriorityType)

export default function SidePanel({ open, onDismiss }: { open: boolean; onDismiss: () => void }) {
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
  const [currentStatus, setCurrentStatus] = useState()
  const [assignees, setAssignees] = useState()
  const [priority, setPriority] = useState()
  const [proposal, setProposal] = useState()
  const [value, setValue] = useState<string>('')
  const [endTime, setEndTime] = useState<number>()

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
          }
        }}
        anchor={'right'}
        open={open}
        onClose={toggleDrawer}
      >
        <Back />
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
            multiple={true}
            onChange={(value: any) => {
              setAssignees(value)
            }}
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
            onChange={(value: any) => {
              setCurrentStatus(value)
            }}
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
            onChange={(value: any) => {
              setPriority(value)
            }}
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
          <Typography>{timeStampToFormat(new Date().getTime())}</Typography>
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
            onChange={(value: any) => {
              setProposal(value)
            }}
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
          <SaveButton width={140} height={36} onClick={() => {}}>
            Save
          </SaveButton>
          <ConfirmButton width="140px" height="36px" onClick={() => {}}>
            Confirm
          </ConfirmButton>
        </ColSentence>
      </Drawer>
    </Box>
  )
}
