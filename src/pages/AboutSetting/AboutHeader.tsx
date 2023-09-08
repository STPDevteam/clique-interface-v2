import { Box, Link, styled, Typography, Tooltip, TooltipProps, tooltipClasses, useTheme } from '@mui/material'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import { ReactComponent as Youtobe } from 'assets/svg/youtobe.svg'
import { ReactComponent as Opensea } from 'assets/svg/opensea.svg'
import { useParams } from 'react-router-dom'
import { useGetUserQuitDao, useJoinDAO } from 'hooks/useBackedDaoServer'
import { isSocialUrl } from 'utils/dao'
import { DaoAvatars } from 'components/Avatars'
import AdminTag from '../DaoInfo/ShowAdminTag'
import useBreakpoint from 'hooks/useBreakpoint'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ReactComponent as AuthIcon } from 'assets/svg/auth_tag_icon.svg'
import { ReactComponent as QuitIcon } from 'assets/svg/quit_icon.svg'
import { useBuildingDaoDataCallback, useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { updateJoinDaoModalStatus } from 'state/buildingGovDao/actions'
import Button from 'components/Button/Button'
import { useActiveWeb3React } from 'hooks'
const StyledHeader = styled(Box)(({ theme }) => ({
  borderRadius: theme.borderRadius.default,
  minHeight: 142,
  background: theme.palette.common.white,
  padding: '20px 0 30px',
  display: 'flex',
  justifyContent: 'space-between'
}))

const Text = styled(Typography)({
  mt: 10,
  height: 20,
  fontWeight: 500,
  fontSize: '13px',
  lineHeight: '20px',
  color: '#E46767',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
  userSelect: 'none'
})

const LinkStyle = styled(Link)(() => ({
  display: 'flex',
  alignItems: 'center'
}))
const TooltipStyle = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#F8FBFF',
    color: '#97B7EF',
    maxWidth: 270,
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '16px',
    borderRadius: '6px',
    border: ' 1px solid #97B7EF',
    padding: '8px  8px 8px 12px'
  }
}))

export default function Header() {
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')
  const dispatch = useDispatch()
  const { daoId: curDaoId } = useParams<{ daoId: string }>()
  const { account } = useActiveWeb3React()
  const { myJoinDaoData, updateDaoMyJoinData, updateMyJoinedDaoListData } = useUpdateDaoDataCallback()
  const { buildingDaoData: daoInfo } = useBuildingDaoDataCallback()
  const TextRef = useRef<HTMLSpanElement | null>(null)
  const [isOverflowed, setIsOverflowed] = useState(false)
  const [open, setOpen] = useState(false)

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  const quit = useGetUserQuitDao()
  const cb = useJoinDAO()
  const categoryList = useMemo(() => {
    if (!daoInfo?.category) return []
    return daoInfo.category
  }, [daoInfo?.category])

  const handleQuitClick = useCallback(() => {
    quit(Number(curDaoId)).then((res: any) => {
      if (res.data.code !== 200) {
        toast.error(res.data.msg || 'network error')
        return
      }
      updateDaoMyJoinData()
      updateMyJoinedDaoListData()
      dispatch(updateJoinDaoModalStatus({ isShowJoinDaoModal: true }))
      toast.success('Quit success')
    })
  }, [quit, curDaoId, updateDaoMyJoinData, updateMyJoinedDaoListData, dispatch])

  const joinDaoClick = useCallback(() => {
    cb(Number(curDaoId)).then((res: any) => {
      if (res.data.code !== 200) {
        toast.error(res.data.msg || 'network error')
        return
      }
      updateDaoMyJoinData()
      updateMyJoinedDaoListData()
      toast.success('Join success')
      dispatch(updateJoinDaoModalStatus({ isShowJoinDaoModal: false }))
    })
  }, [cb, curDaoId, dispatch, updateDaoMyJoinData, updateMyJoinedDaoListData])

  useEffect(() => {
    const element = TextRef.current
    if ((element?.scrollHeight || 0) > (element?.clientHeight || 0)) {
      setIsOverflowed(true)
    } else {
      setIsOverflowed(false)
    }
  }, [daoInfo?.bio])

  return (
    <Box>
      <ContainerWrapper maxWidth={1180}>
        <StyledHeader>
          <Box
            sx={{
              display: 'flex',
              gap: 35,
              [theme.breakpoints.down('sm')]: {
                display: 'grid',
                gap: 10
              }
            }}
          >
            <Box
              sx={{
                width: 'auto',
                [theme.breakpoints.down('sm')]: {
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between'
                }
              }}
            >
              <Box
                sx={{
                  height: 142,
                  width: 142,
                  border: '1px solid #D4D7E2',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <DaoAvatars size={isSmDown ? 60 : 100} src={daoInfo?.daoLogo} />
              </Box>

              {!isSmDown ? null : !account ? null : myJoinDaoData?.job === 'owner' ? null : myJoinDaoData.isJoin ? (
                <Text onClick={handleQuitClick}>
                  <QuitIcon />
                  Quit DAO
                </Text>
              ) : (
                <Button width="87px" height="36px" onClick={joinDaoClick}>
                  Join DAO
                </Button>
              )}
            </Box>

            <Box sx={{ height: 142 }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center'
                }}
              >
                <Typography variant="h5" sx={{ width: '50vw', font: '600 24px/29px "Inter"', wordWrap: 'break-word' }}>
                  {daoInfo?.daoName || '--'}
                </Typography>
                {daoInfo?.approve && <AuthIcon />}
                <AdminTag level={myJoinDaoData?.job} />
                <Typography sx={{ font: ' 500 14px/17px "Inter"', color: '#97B7EF' }}>
                  @{daoInfo?.handle || '--'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography
                  ref={TextRef}
                  variant="body1"
                  sx={{
                    maxWidth: 540,
                    height: 40,
                    mt: 8,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                    display: '-webkit-box',
                    '-webkit-box-orient': 'vertical',
                    '-webkit-line-clamp': '2',
                    wordBreak: 'break-all',
                    lineHeight: '20px',
                    [theme.breakpoints.down('sm')]: {
                      maxWidth: '100vw'
                    }
                  }}
                >
                  {daoInfo?.bio || '--'}
                </Typography>
                {isOverflowed && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <TooltipStyle onClose={handleTooltipClose} open={open} title={daoInfo?.bio}>
                      <Link
                        onClick={handleTooltipOpen}
                        variant="body1"
                        sx={{ cursor: 'pointer', color: '#0049C6', lineHeight: '20px' }}
                      >
                        more
                      </Link>
                    </TooltipStyle>
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', mt: 10 }}>
                {categoryList.map((name, index) => (
                  <Box
                    key={index}
                    sx={{
                      mr: 6,
                      padding: '1px 14px',
                      gap: '10px',
                      height: '20px',
                      background: ' rgba(0, 91, 198, 0.06)',
                      borderRadius: '30px'
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        fontSize: '13px',
                        lineHeight: '20px',
                        color: '#3F5170'
                      }}
                    >
                      {name}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 13, gap: 10, display: 'flex', alignItems: 'center' }}>
                {daoInfo?.twitter && isSocialUrl('twitter', daoInfo.twitter) && (
                  <LinkStyle target={'_blank'} href={daoInfo.twitter} underline="none">
                    <Twitter />
                  </LinkStyle>
                )}
                {daoInfo?.github && isSocialUrl('github', daoInfo.github) && (
                  <LinkStyle fontSize={12} target={'_blank'} href={daoInfo.github} underline="none">
                    <Youtobe />
                  </LinkStyle>
                )}
                {daoInfo?.discord && isSocialUrl('discord', daoInfo.discord) && (
                  <LinkStyle target={'_blank'} href={daoInfo.discord} underline="none">
                    <Discord />
                  </LinkStyle>
                )}
                {daoInfo?.website && isSocialUrl('', daoInfo.website) && (
                  <LinkStyle fontSize={12} target={'_blank'} href={daoInfo.website} underline="none">
                    <Opensea />
                  </LinkStyle>
                )}
              </Box>
            </Box>
          </Box>
          {isSmDown ? null : !account ? null : myJoinDaoData?.job === 'owner' ? null : myJoinDaoData.isJoin ? (
            <Text onClick={handleQuitClick}>
              <QuitIcon />
              Quit DAO
            </Text>
          ) : (
            <Button width="87px" height="36px" onClick={joinDaoClick}>
              Join DAO
            </Button>
          )}
        </StyledHeader>
      </ContainerWrapper>
    </Box>
  )
}
