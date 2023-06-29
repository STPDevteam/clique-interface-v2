import { Box, Link, styled, Typography } from '@mui/material'
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
import { useCallback, useMemo } from 'react'
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
  padding: '20px 0',
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

export default function Header() {
  const isSmDown = useBreakpoint('sm')
  const dispatch = useDispatch()
  const { daoId: curDaoId } = useParams<{ daoId: string }>()
  const { account } = useActiveWeb3React()
  const { myJoinDaoData, updateDaoMyJoinData } = useUpdateDaoDataCallback()
  const { buildingDaoData: daoInfo } = useBuildingDaoDataCallback()
  console.log(myJoinDaoData)

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
      dispatch(updateJoinDaoModalStatus({ isShowJoinDaoModal: true }))
      toast.success('Quit success')
    })
  }, [curDaoId, quit, updateDaoMyJoinData, dispatch])

  const joinDaoClick = useCallback(() => {
    cb(Number(curDaoId)).then((res: any) => {
      if (res.data.code !== 200) {
        toast.error(res.data.msg || 'network error')
        return
      }
      updateDaoMyJoinData()
      toast.success('Join success')
      dispatch(updateJoinDaoModalStatus({ isShowJoinDaoModal: false }))
    })
  }, [cb, curDaoId, dispatch, updateDaoMyJoinData])

  return (
    <Box>
      <ContainerWrapper maxWidth={1180}>
        <StyledHeader>
          <Box
            sx={{
              display: 'flex'
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
            <Box sx={{ ml: 35, height: 142 }}>
              <Box sx={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Typography variant="h5" sx={{ font: '600 24px/29px "Inter" ' }}>
                  {daoInfo?.daoName || '--'}
                </Typography>
                {daoInfo?.approve && <AuthIcon />}
                <AdminTag level={myJoinDaoData?.job} />
              </Box>
              <Typography sx={{ mt: 6, font: ' 500 14px/17px "Inter"', color: '#97B7EF' }}>
                @{daoInfo?.handle}
              </Typography>
              <Box sx={{ display: 'flex' }}>
                {categoryList.map((name, index) => (
                  <Box
                    key={index}
                    sx={{
                      mr: 6,
                      mt: 25,
                      padding: '1px 14px',
                      gap: '10px',
                      height: '22px',
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
                {daoInfo?.discord && isSocialUrl('discord', daoInfo.discord) && (
                  <LinkStyle target={'_blank'} href={daoInfo.discord} underline="none">
                    <Discord />
                  </LinkStyle>
                )}
                {daoInfo?.github && isSocialUrl('github', daoInfo.github) && (
                  <LinkStyle fontSize={12} target={'_blank'} href={daoInfo.github} underline="none" mr={10}>
                    <Youtobe />
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
          {!account ? null : myJoinDaoData?.job === 'owner' ? null : myJoinDaoData.isJoin ? (
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
