// import { Close } from '@mui/icons-material'
import Button from 'components/Button/OutlineButton'
import { Typography, Box, Avatar, Stack, styled, keyframes } from '@mui/material'
import { useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
import { useCallback } from 'react'
import blueBg from 'assets/images/blueBg.png'
import close from 'assets/images/closeModal.png'
import Image from 'components/Image'
import { useJoinDAO } from 'hooks/useBackedDaoServer'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { useActiveWeb3React } from 'hooks'
import { useDispatch } from 'react-redux'
import { updateJoinDaoModalStatus, updateJoinDaoModalShakeStatus } from 'state/buildingGovDao/actions'
import useBreakpoint from 'hooks/useBreakpoint'

const slideIn = keyframes`
  from {
    transform: translateY(100%)
  },
  to {
    transform: translateY(0)
  }
`

const shake = keyframes`
  0% { transform: translateY(0); }
  25% { transform: translateY(-5px); }
  75% { transform: translateY(5px); }
  100% { transform: translateY(0); }
`

const Wrapper = styled(Stack)(({}) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 10000,
  gridTemplateColumns: '200px 1fr 200px',
  minHeight: 153,
  height: 'auto',
  flexDirection: 'row',
  alignItems: 'center',
  background: `url(${blueBg})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  // animation: `${slideIn} 1s ease`,
  '& .close': {
    width: 18,
    height: 18,
    position: 'absolute',
    right: 14,
    top: 14,
    cursor: 'pointer'
  },
  '&.bottom-popup.out': {
    display: 'none',
    bottom: -200
  }

  // '&.shake-animation': {
  //   animation: `${shake} 0.5s`
  // }
}))

const CategoryWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  '& span': {
    color: '#3F5170',
    borderRadius: '30px',
    fontSize: 14,
    fontWeight: 600,
    padding: '0 13px'
  },
  '& .colorItem0': {
    backgroundColor: '#EBFFD2'
  },
  '& .colorItem1': {
    backgroundColor: '#E9FAFF'
  },
  '& .colorItem2': {
    backgroundColor: '#FFEDF9'
  },
  '& .colorItem3': {
    backgroundColor: '#F6F2FF'
  },
  '& .colorItem4': {
    backgroundColor: '#FFF0D2'
  },
  '& .colorItem5': {
    backgroundColor: '#BD73F6'
  },

  [theme.breakpoints.down('sm')]: {
    flexWrap: 'wrap',
    gap: 6,
    '& span': {
      fontSize: 12
    }
  }
}))

export default function JoinDaoFrame() {
  const isSmDown = useBreakpoint('sm')
  const { daoId: daoId } = useParams<{ daoId: string }>()
  const { createDaoData, updateDaoMyJoinData, isOpen, isShake, updateMyJoinedDaoListData } = useUpdateDaoDataCallback()
  const toggleWalletModal = useWalletModalToggle()
  const loginSignature = useLoginSignature()
  const { account } = useActiveWeb3React()
  const userSignature = useUserInfo()
  // const [disable, setDisable] = useState(false)
  const cb = useJoinDAO()
  const dispatch = useDispatch()
  const closeClick = useCallback(() => {
    dispatch(updateJoinDaoModalStatus({ isShowJoinDaoModal: false }))
    dispatch(updateJoinDaoModalShakeStatus({ isShakeJoinDaoModal: undefined }))
  }, [dispatch])
  const onClickJoinDao = useCallback(() => {
    if (!daoId) return
    if (!account) {
      toggleWalletModal()
    } else if (!userSignature?.loggedToken) {
      loginSignature().then(() => {
        cb(Number(daoId)).then((res: any) => {
          if (res.data.code !== 200) {
            toast.error(res.data.msg || 'Network error')
            // setDisable(false)
            return
          }
          updateDaoMyJoinData()
          toast.success('Join success')
          // setDisable(false)
          dispatch(updateJoinDaoModalStatus({ isShowJoinDaoModal: false }))
          dispatch(updateJoinDaoModalShakeStatus({ isShakeJoinDaoModal: undefined }))
        })
      })
    } else {
      // setDisable(true)
      cb(Number(daoId)).then((res: any) => {
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'Network error')
          return
        }
        updateDaoMyJoinData()
        updateMyJoinedDaoListData()
        toast.success('Join success')
        // setDisable(false)
        dispatch(updateJoinDaoModalStatus({ isShowJoinDaoModal: false }))
        dispatch(updateJoinDaoModalShakeStatus({ isShakeJoinDaoModal: undefined }))
      })
    }
  }, [
    account,
    cb,
    daoId,
    dispatch,
    loginSignature,
    toggleWalletModal,
    updateDaoMyJoinData,
    updateMyJoinedDaoListData,
    userSignature?.loggedToken
  ])

  return (
    <Wrapper
      className={`bottom-popup ${isOpen ? '' : 'out'}`}
      sx={{
        animation: `${isOpen && isShake ? shake : isOpen && isShake === undefined && slideIn} .5s ease`
      }}
    >
      <Box display="grid" width={isSmDown ? 200 : 260}>
        <Box display={isSmDown ? 'grid' : 'flex'} justifyContent={'center'} gap={isSmDown ? 10 : 0}>
          <Avatar
            sx={{ width: isSmDown ? 60 : 88, height: isSmDown ? 60 : 88, margin: 'auto' }}
            src={createDaoData?.daoLogo || ''}
          ></Avatar>
          {isSmDown && (
            <Button
              onClick={onClickJoinDao}
              noBold
              style={{ border: 0, color: '#0049C6', backgroundColor: '#fff', fontWeight: 700 }}
              width="87px"
              height="32px"
            >
              Join DAO
            </Button>
          )}
        </Box>
      </Box>
      <Box display="grid" textAlign={'left'} width="100%" gap={12}>
        <Box display={isSmDown ? 'grid' : 'flex'} justifyContent={'flex-start'} gap={isSmDown ? 10 : 22}>
          <Typography variant="inherit" lineHeight={'20px'} fontSize={isSmDown ? 20 : 27} fontWeight={600} color="#fff">
            {createDaoData?.daoName}
          </Typography>
          <CategoryWrapper>
            {createDaoData?.category?.map((item: any, index: number) => (
              <span key={item} className={'colorItem' + index}>
                {item}
              </span>
            ))}
          </CategoryWrapper>
        </Box>
        <Typography
          variant="inherit"
          sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
            paddingRight: 20,
            textOverflow: 'ellipsis',
            wordBreak: ' break-all'
          }}
          height={47}
          lineHeight={'22px'}
          fontSize={isSmDown ? 13 : 14}
          fontWeight={400}
          color="#fff"
        >
          {createDaoData?.bio}
        </Typography>
      </Box>
      {!isSmDown && (
        <Box display="grid" width={260}>
          <Button
            onClick={onClickJoinDao}
            noBold
            style={{ border: 0, color: '#0049C6', backgroundColor: '#fff', fontWeight: 700 }}
            width="87px"
            height="36px"
          >
            Join DAO
          </Button>
        </Box>
      )}
      <Image src={close} alt="" className="close" onClick={closeClick} />
    </Wrapper>
  )
}
