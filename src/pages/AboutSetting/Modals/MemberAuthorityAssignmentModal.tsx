import Modal from '../../../components/Modal/index'
import { Box, Typography, styled } from '@mui/material'
import useModal from 'hooks/useModal'
import { useCallback } from 'react'
import OutlineButton from 'components/Button/OutlineButton'

const MemberCard = styled(Box)({
  display: 'flex',
  textAlign: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  height: 100,
  color: '#3F5170',
  padding: 20,
  cursor: 'pointer',
  '&.BannedClass': {
    backgroundColor: '#005BC60F'
  },
  '& p': {
    width: '100%',
    fontWeight: 500,
    textAlign: 'left',
    lineHeight: '20px'
  }
})

const levelList = [
  {
    name: 'Owner',
    des: 'DAO owner Seed role',
    isDisable: false
  },
  {
    name: 'Super admin',
    des: 'Super administrator can edit workspace settings and invite new members.',
    isDisable: false
  },
  {
    name: 'Admin',
    des: 'DAO core members that can create and edit workspace.',
    isDisable: false
  }
]

export default function MemberAuthorityAssignmentModal({ level, onDimiss }: { level: number; onDimiss: () => void }) {
  const { hideModal } = useModal()

  console.log(level)

  const removeMemberClick = useCallback(() => {
    hideModal()
    onDimiss()
  }, [hideModal, onDimiss])

  return (
    <Modal maxWidth="371px" width="100%" padding="10px 0">
      <Box display="flex" textAlign={'center'} width="100%" height="270px" flexDirection={'column'}>
        {levelList.map((item: any, index: number) => (
          <MemberCard key={item.name + index} className={'BannedClass'}>
            <Typography fontSize={16}>{item.name}</Typography>
            <Typography fontSize={14} color={'#80829F'}>
              {item.des}
            </Typography>
          </MemberCard>
        ))}
        <OutlineButton onClick={removeMemberClick} noBold color="#E46767" width={'340px'} height="40px">
          Remove
        </OutlineButton>
      </Box>
    </Modal>
  )
}
