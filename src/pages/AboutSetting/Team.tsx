import { Box, Typography, styled } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import { ReactComponent as AddIcon } from 'assets/svg/newIcon.svg'
import { useCallback } from 'react'
import useModal from 'hooks/useModal'
import AddJobsModal from './Modals/AddJobsModal'
import AddMemberModal from './Modals/AddMemberModal'

const TopText = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
})

export default function Team() {
  const isSmDown = useBreakpoint('sm')
  const { showModal, hideModal } = useModal()

  const createNewJob = useCallback(() => {}, [])
  const createNewMember = useCallback(() => {}, [])

  const addMemberCB = useCallback(() => {
    showModal(<AddMemberModal onClose={hideModal} onClick={createNewMember} />)
  }, [createNewMember, hideModal, showModal])
  const addJobsCB = useCallback(() => {
    showModal(<AddJobsModal onClose={hideModal} onClick={createNewJob} />)
  }, [createNewJob, hideModal, showModal])

  return (
    <Box sx={{ padding: isSmDown ? '20px 16px' : undefined }}>
      <TopText>
        <Typography fontSize={14} color={'#80829F'} fontWeight={500} lineHeight={'16px'}>
          Jobs
        </Typography>
        <Box display={'flex'} gap={35} flexDirection={'row'}>
          <BlueButton actionText="Add Members" onClick={addMemberCB} />
          <BlueButton actionText="Add Jobs" onClick={addJobsCB} />
        </Box>
      </TopText>
    </Box>
  )
}

export function BlueButton({
  actionText,
  onClick,
  disabled = false
}: {
  actionText: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        '& p': {
          color: disabled ? '#b5b7cf' : '#97B7EF',
          fontSize: 14,
          lineHeight: '20px',
          fontFamily: 'Inter'
        }
      }}
    >
      <AddIcon />
      <Typography>{actionText}</Typography>
    </Box>
  )
}
