import { Box, Typography, styled } from '@mui/material'
import Image from 'components/Image'
import ReadBook from 'assets/images/readBook.png'
import Button from 'components/Button/Button'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
import { updateJoinDaoModalStatus, updateJoinDaoModalShakeStatus } from 'state/buildingGovDao/actions'

const Wrapper = styled(Box)({
  marginTop: 169,
  backgroundColor: '#fff',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 20,
  '& img': {
    width: 74.25
  },
  '& p': {
    fontSize: 14,
    fontWeight: 400,
    color: '#97B7EF'
  }
})

export default function EmptyPage() {
  const dispatch = useDispatch()
  const { isOpen } = useUpdateDaoDataCallback()
  const [isEndTime, setIsEndTime] = useState<boolean>(false)

  const joinDaoClick = useCallback(() => {
    if (isOpen && !isEndTime) {
      setIsEndTime(true)
      dispatch(updateJoinDaoModalShakeStatus({ isShakeJoinDaoModal: true }))
      setTimeout(() => {
        dispatch(updateJoinDaoModalShakeStatus({ isShakeJoinDaoModal: false }))
        setIsEndTime(false)
      }, 500)
      return
    }
    //TODO can be better
    setTimeout(() => {
      dispatch(updateJoinDaoModalStatus({ isShowJoinDaoModal: true }))
    })
  }, [dispatch, isEndTime, isOpen])

  return (
    <Wrapper>
      <Image src={ReadBook} />
      <Typography>Please Join DAO to visit this page</Typography>
      <Button width="158px" height="36px" onClick={joinDaoClick}>
        Join DAO
      </Button>
    </Wrapper>
  )
}
