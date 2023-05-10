import { Box, Link, Stack, styled, Typography, useTheme } from '@mui/material'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import { useCallback } from 'react'
import { DaoAdminLevelProp, useDaoAdminLevel, useDaoInfo } from 'hooks/useDaoInfo'
import { useMemberJoinDao } from 'hooks/useBackedDaoServer'
import { useParams } from 'react-router-dom'
import { ChainId } from 'constants/chain'
import { useBackedDaoInfo } from 'hooks/useBackedDaoServer'
import { isSocialUrl } from 'utils/dao'
import { BlackButton } from 'components/Button/Button'
import { useActiveWeb3React } from 'hooks'
import { DaoAvatars } from 'components/Avatars'
import AdminTag from '../DaoInfo/ShowAdminTag'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useWalletModalToggle } from 'state/application/hooks'
import { ReactComponent as AuthIcon } from 'assets/svg/auth_tag_icon.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import CategoryChips from 'pages/DaoInfo/CategoryChips'

const StyledHeader = styled(Box)(({ theme }) => ({
  borderRadius: theme.borderRadius.default,
  minHeight: 138,
  background: theme.palette.common.white,
  boxShadow: theme.boxShadow.bs2,
  padding: '30px 45px',
  position: 'relative',
  '& .top1': {
    display: 'grid',
    gridTemplateColumns: '100px 1fr'
  },
  '& .sdk': {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontSize: 0
  },
  [theme.breakpoints.down('sm')]: {
    padding: '20px 20px 0',
    '& .top1': {
      gridTemplateColumns: '60px 1fr'
    }
  }
}))

const StyledJoin = styled(Box)(({ theme }) => ({
  '& button': {
    borderRadius: '8px'
  },
  '& .joined': {
    backgroundColor: theme.palette.text.disabled,
    '&:hover': {
      backgroundColor: theme.palette.text.disabled
    }
  }
}))

export default function Header() {
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')
  const { account } = useActiveWeb3React()
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const { result: backedDaoInfo } = useBackedDaoInfo(daoAddress, curDaoChainId)
  const daoAdminLevel = useDaoAdminLevel(daoAddress, curDaoChainId, account || undefined)

  const daoInfo = useDaoInfo(daoAddress, curDaoChainId)
  const { isJoined, switchJoin } = useMemberJoinDao(backedDaoInfo?.joinSwitch || false, backedDaoInfo?.members || 0)
  const walletModalToggle = useWalletModalToggle()

  const toSwitchJoin = useCallback(
    async (join: boolean) => {
      if (!account) {
        walletModalToggle()
        return
      }
      switchJoin(join, curDaoChainId, daoAddress)
    },
    [account, curDaoChainId, daoAddress, switchJoin, walletModalToggle]
  )

  return (
    <Box
      sx={{
        padding: { sm: '20px 0 40px', xs: 0 }
      }}
    >
      <ContainerWrapper maxWidth={1248}>
        <StyledHeader>
          <div className="top1">
            <DaoAvatars size={isSmDown ? 60 : 100} src={daoInfo?.daoLogo} />
            <Box ml={'24px'}>
              <Box
                display={'flex'}
                justifyContent="space-between"
                alignItems={'center'}
                flexWrap="wrap"
                marginBottom={6}
              >
                <Stack direction="row" flexWrap="wrap" spacing={8} alignItems="center">
                  <Typography variant="h5">{daoInfo?.name || '--'}</Typography>
                  {backedDaoInfo?.verified && <AuthIcon />}
                  <AdminTag level={daoAdminLevel} />
                  <StyledJoin>
                    <BlackButton
                      width="79px"
                      height="32px"
                      className={isJoined ? 'joined' : ''}
                      onClick={() => {
                        if (daoAdminLevel === DaoAdminLevelProp.SUPER_ADMIN) return
                        toSwitchJoin(!isJoined)
                      }}
                    >
                      {isJoined ? 'Followed' : 'Follow'}
                    </BlackButton>
                  </StyledJoin>
                </Stack>
              </Box>
              <Box display={'flex'} justifyContent="space-between" mb={6} flexWrap="wrap">
                <Typography fontSize={16} variant="body2" noWrap fontWeight={400} maxWidth={'200px'}>
                  @{daoInfo?.handle}
                </Typography>
                <Box display={'flex'} alignItems="center" flexWrap="wrap">
                  {daoInfo?.twitter && isSocialUrl('twitter', daoInfo.twitter) && (
                    <Link target={'_blank'} href={daoInfo.twitter} underline="none" mr={10}>
                      <Twitter />
                    </Link>
                  )}
                  {daoInfo?.discord && isSocialUrl('discord', daoInfo.discord) && (
                    <Link target={'_blank'} href={daoInfo.discord} underline="none" mr={10}>
                      <Discord />
                    </Link>
                  )}
                  {daoInfo?.github && isSocialUrl('github', daoInfo.github) && (
                    <Link fontSize={12} target={'_blank'} href={daoInfo.github} underline="none" mr={10}>
                      <GitHubIcon sx={{ width: 16, color: theme.palette.text.secondary }} />
                    </Link>
                  )}
                  {daoInfo?.website && isSocialUrl('', daoInfo.website) && (
                    <Link fontSize={12} target={'_blank'} href={daoInfo.website} underline="none">
                      {daoInfo.website}
                    </Link>
                  )}
                </Box>
              </Box>
              <Typography mb={8} color={theme.palette.text.secondary} sx={{ wordBreak: 'break-all' }}>
                {daoInfo?.description}
              </Typography>
              <CategoryChips categoryStr={daoInfo?.category} />
            </Box>
          </div>
        </StyledHeader>
      </ContainerWrapper>
    </Box>
  )
}
