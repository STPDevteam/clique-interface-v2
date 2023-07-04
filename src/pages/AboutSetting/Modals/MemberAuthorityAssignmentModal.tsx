import Modal from '../../../components/Modal/index'
import { Box, Typography, styled } from '@mui/material'
import useModal from 'hooks/useModal'
import { useCallback, useMemo } from 'react'
import OutlineButton from 'components/Button/OutlineButton'
import { useChangeAdminRole } from 'hooks/useBackedDaoServer'
import { toast } from 'react-toastify'
import DoubleCheckModal from './DoubleCheckModal'

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

export default function MemberAuthorityAssignmentModal({
  myLevel,
  account,
  daoId,
  level,
  onDimiss
}: {
  myLevel: number
  account: string
  daoId: number
  level: number
  onDimiss: () => void
}) {
  const { showModal, hideModal } = useModal()
  const changeRole = useChangeAdminRole()
  const btnDisabledList = useMemo(() => {
    if (myLevel === 1) {
      return [false, true, true]
    } else if (myLevel === 2) {
      return [false, false, true]
    }
    return [true, true, true]
  }, [myLevel])
  console.log(myLevel, level)

  const removeMemberClick = useCallback(
    (level: number) => {
      changeRole(account, level, daoId).then((res: any) => {
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'Network error')
          return
        }
        toast.success('Change success')
        hideModal()
        onDimiss()
      })
    },
    [account, changeRole, daoId, hideModal, onDimiss]
  )

  const changeAdminLevelClick = useCallback(
    (index: number) => {
      hideModal()
      showModal(<DoubleCheckModal action={() => removeMemberClick(index)} />)
    },
    [hideModal, removeMemberClick, showModal]
  )

  return (
    <Modal maxWidth="371px" width="100%" padding="10px 0">
      <Box
        display="flex"
        textAlign={'center'}
        justifyContent={'center'}
        width="100%"
        height="378px"
        flexDirection={'column'}
      >
        {levelList.map((item: any, index: number) => (
          <MemberCard
            key={item.name + index}
            className={btnDisabledList[index] ? '' : 'BannedClass'}
            onClick={() => {
              if (btnDisabledList[index]) {
                changeAdminLevelClick(index)
              }
            }}
          >
            <Typography fontSize={16}>{item.name}</Typography>
            <Typography fontSize={14} color={'#80829F'}>
              {item.des}
            </Typography>
          </MemberCard>
        ))}
        <OutlineButton
          style={{ margin: '12px auto 0' }}
          onClick={() => removeMemberClick(100)}
          noBold
          color="#E46767"
          width={'340px'}
          height="40px"
        >
          Remove
        </OutlineButton>
      </Box>
    </Modal>
  )
}
