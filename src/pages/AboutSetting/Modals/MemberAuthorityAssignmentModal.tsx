import Modal from '../../../components/Modal/index'
import { Box, Typography, styled } from '@mui/material'
import { useChangeAdminRole } from 'hooks/useBackedDaoServer'
import useModal from 'hooks/useModal'
import { useCallback } from 'react'

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

export default function MemberAuthorityAssignmentModal({
  chainId,
  daoAddress,
  id
}: {
  chainId: number
  daoAddress: string
  id: number
}) {
  const { hideModal } = useModal()
  const { changeRole } = useChangeAdminRole()

  const clickMember = useCallback(() => {
    changeRole(chainId, daoAddress, id)
      .then(res => {
        console.log(res)
        hideModal()
      })
      .catch(err => console.log(err))
  }, [chainId, changeRole, daoAddress, hideModal, id])

  return (
    <Modal maxWidth="371px" width="100%" padding="10px 0">
      <Box display="flex" textAlign={'center'} width="100%" height="390px" flexDirection={'column'}>
        <MemberCard className={'BannedClass'}>
          <Typography fontSize={16}>Owner</Typography>
          <Typography fontSize={14} color={'#80829F'}>
            DAO owner Seed role
          </Typography>
        </MemberCard>
        <MemberCard className={'BannedClass'}>
          <Typography fontSize={16}>Super admin</Typography>
          <Typography fontSize={14} color={'#80829F'}>
            Super administrator can edit workspace settings and invite new members.
          </Typography>
        </MemberCard>
        <MemberCard className={'BannedClass'}>
          <Typography fontSize={16}>Admin</Typography>
          <Typography fontSize={14} color={'#80829F'}>
            DAO core members that can create and edit workspace.
          </Typography>
        </MemberCard>
        <MemberCard className={'Member'} onClick={clickMember}>
          <Typography fontSize={16}>Member</Typography>
          <Typography fontSize={14} color={'#80829F'}>
            Browse workspace and settings
          </Typography>
        </MemberCard>
      </Box>
    </Modal>
  )
}
