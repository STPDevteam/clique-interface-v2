import Button from 'components/Button/Button'
import Modal from '../../../components/Modal/index'
import { Box, MenuItem, Stack, Typography, styled } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import useModal from 'hooks/useModal'
import { toast } from 'react-toastify'
import PopperCard from 'components/PopperCard'
import { ReactComponent as ArrowIcon } from 'assets/svg/arrow_down.svg'
import { useJobsList, useTransferSpacesMember } from 'hooks/useBackedDaoServer'
import { useActiveWeb3React } from 'hooks'

const Text = styled(Typography)({
  marginTop: 0,
  color: '#80829F',
  width: '100%',
  textAlign: 'left',
  fontFamily: 'Inter',
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px'
})

const Title = styled(Typography)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  color: '#3F5170',
  fontSize: 14,
  fontWeight: 500
})

export default function TransferAdminModal({
  daoId,
  spacesId,
  onDimiss
}: {
  daoId: number
  spacesId: number
  onDimiss: () => void
}) {
  const { hideModal } = useModal()
  const { account } = useActiveWeb3React()
  const { result: memberList } = useJobsList(daoId)
  // const { result: memberList } = useGetSpacesMemberList(spacesId)
  const filteredList = useMemo(
    () => memberList.filter(item => item.account.toLocaleLowerCase() !== account?.toLocaleLowerCase()),
    [account, memberList]
  )
  const [currentStatus, setCurrentStatus] = useState('')
  const transfer = useTransferSpacesMember()

  const transferClick = useCallback(() => {
    if (!currentStatus) return
    transfer(spacesId, currentStatus)
      .then((res: any) => {
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'network error')
          return
        }
        toast.success('Transfer success')
        hideModal()
        onDimiss()
      })
      .catch(err => toast.error(err))
  }, [currentStatus, hideModal, onDimiss, spacesId, transfer])

  return (
    <Modal maxWidth="480px" width="100%" closeIcon padding="13px 28px">
      <Box display="grid" textAlign={'center'} width="100%" height="180px">
        <Title>Leave workspace</Title>
        <Text>Transfer this workspace to an admin.</Text>
        <PopperCard
          sx={{
            marginTop: 13,
            maxHeight: '50vh',
            overflowY: 'auto',
            width: 422,
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
          placement="bottom-start"
          targetElement={
            <Box
              flexDirection={'row'}
              display={'flex'}
              gap={12}
              sx={{
                height: 36,
                padding: '0 14px',
                border: '1px solid #D4D7E2',
                borderRadius: '8px',
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
                {currentStatus}
              </Typography>
              <ArrowIcon />
            </Box>
          }
        >
          <>
            {filteredList.map((item: any) => (
              <MenuItem
                key={item.account + item.id}
                sx={{
                  fontWeight: 500,
                  fontSize: '13px !important',
                  padding: 6,
                  '& p:fitst-child': {
                    width: 394
                  },
                  '& p:nth-of-type(2)': {
                    width: 80,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
                value={item.account}
                selected={currentStatus === item.account}
                onClick={() => {
                  setCurrentStatus(item.account)
                }}
              >
                <Typography>{item.account}-</Typography>
                <Typography>{item.nickname || 'unnamed'}</Typography>
              </MenuItem>
            ))}
          </>
        </PopperCard>
        <Stack justifyContent={'center'} mt={20}>
          <Button width="100%" height="40px" onClick={transferClick}>
            Transfer and leave
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
