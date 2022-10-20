import { Box, Link, Stack, styled, Typography, useTheme } from '@mui/material'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import { ReactComponent as SDK } from 'assets/svg/sdk.svg'
import { useCallback, useMemo } from 'react'
import { DaoAdminLevelProp, useDaoAdminLevel, useDaoInfo } from 'hooks/useDaoInfo'
import { useMemberJoinDao } from 'hooks/useBackedDaoServer'
// import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import { NavLink, useHistory, useParams } from 'react-router-dom'
import { ChainId } from 'constants/chain'
import { useBackedDaoInfo } from 'hooks/useBackedDaoServer'
import { isSocialUrl } from 'utils/dao'
import { BlackButton } from 'components/Button/Button'
import CategoryChips from './CategoryChips'
import { useActiveWeb3React } from 'hooks'
import AdminTag from './ShowAdminTag'
import { routes } from 'constants/routes'
import { DaoAvatars } from 'components/Avatars'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useWalletModalToggle } from 'state/application/hooks'
import { ReactComponent as AuthIcon } from 'assets/svg/auth_tag_icon.svg'
// import MembersModal from './MembersModal'
// import useModal from 'hooks/useModal'

const StyledHeader = styled(Box)(({ theme }) => ({
  borderRadius: theme.borderRadius.default,
  minHeight: 138,
  background: theme.palette.common.white,
  boxShadow: theme.boxShadow.bs2,
  padding: '30px 45px 0',
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
  }
}))

const StyledTabs = styled('div')(({ theme }) => ({
  display: 'flex',
  fontWeight: 600,
  fontSize: 14,
  listStyle: 'none',
  padding: 0,
  marginTop: 20,
  '&>*': {
    padding: '15px 0',
    marginRight: 60,
    textDecoration: 'none',
    color: theme.palette.text.secondary,
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.common.black
    },
    '&.active': {
      color: theme.palette.common.black
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

const tabs = [
  {
    name: 'Proposal',
    routeSuffix: 'proposal'
  },
  {
    name: 'DAO Rewards',
    routeSuffix: 'active_info'
  },
  {
    name: 'About',
    routeSuffix: 'about'
  },
  {
    name: 'Settings',
    routeSuffix: 'settings'
  }
]

export default function DaoInfo({ children }: { children: any }) {
  const theme = useTheme()
  const history = useHistory()
  // const { showModal } = useModal()
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

  const currentTabLinks = useMemo(() => {
    const list =
      daoAdminLevel === DaoAdminLevelProp.SUPER_ADMIN || daoAdminLevel === DaoAdminLevelProp.ADMIN
        ? tabs
        : tabs.filter(i => i.name !== 'Settings')

    return list.map(({ name, routeSuffix }) => ({
      name,
      link: routes._DaoInfo + `/${daoChainId}/${daoAddress}${routeSuffix ? '/' + routeSuffix : ''}`
    }))
  }, [daoAddress, daoAdminLevel, daoChainId])

  const isDefaultTabIndex = useMemo(() => {
    if (history.location.pathname === routes._DaoInfo + `/${daoChainId}/${daoAddress}`) {
      return true
    }
    return false
  }, [history.location.pathname, daoAddress, daoChainId])

  return (
    <Box padding="0 20px">
      <ContainerWrapper maxWidth={1248}>
        <StyledHeader>
          <div className="top1">
            <DaoAvatars size={100} src={daoInfo?.daoLogo} />
            <Box ml={'24px'}>
              <Box display={'flex'} justifyContent="space-between" alignItems={'center'} marginBottom={6}>
                <Stack direction="row" spacing={8} alignItems="center">
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
                      {isJoined ? 'Joined' : 'Join'}
                    </BlackButton>
                  </StyledJoin>
                </Stack>
                {/* <Box
                  display={'flex'}
                  alignItems="center"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => showModal(<MembersModal chainId={curDaoChainId} daoAddress={daoAddress} />)}
                >
                  <Typography mr={5} variant="caption" color={theme.palette.text.secondary}>
                    Members
                  </Typography>
                  <Typography variant="caption">{toFormatGroup(curMembers)}</Typography>
                </Box> */}
              </Box>
              <Box display={'flex'} justifyContent="space-between" mb={6}>
                <Typography fontSize={16} variant="body2" noWrap fontWeight={400} maxWidth={'200px'}>
                  @{daoInfo?.handle}
                </Typography>
                <Box display={'flex'} alignItems="center">
                  {daoInfo?.twitter && isSocialUrl('twitter', daoInfo.twitter) && (
                    <Link target={'_blank'} href={daoInfo.twitter} underline="none" ml={10}>
                      <Twitter />
                    </Link>
                  )}
                  {daoInfo?.discord && isSocialUrl('discord', daoInfo.discord) && (
                    <Link target={'_blank'} href={daoInfo.discord} underline="none" ml={10}>
                      <Discord />
                    </Link>
                  )}
                  {daoInfo?.github && isSocialUrl('github', daoInfo.github) && (
                    <Link fontSize={12} target={'_blank'} href={daoInfo.github} underline="none" ml={10}>
                      <GitHubIcon sx={{ width: 16, color: theme.palette.text.secondary }} />
                    </Link>
                  )}
                  {daoInfo?.website && isSocialUrl('', daoInfo.website) && (
                    <Link fontSize={12} target={'_blank'} href={daoInfo.website} underline="none" ml={10}>
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

          <StyledTabs>
            {currentTabLinks.map((item, index) => (
              <NavLink
                key={item.name}
                to={item.link}
                // onClick={() => history.replace(item.link)}
                className={`border-tab-item ${isDefaultTabIndex && index === 0 ? 'active' : ''}`}
              >
                {item.name}
              </NavLink>
            ))}
          </StyledTabs>

          <Link
            className="sdk"
            href="https://www.npmjs.com/package/@myclique/governance-sdk"
            target={'_blank'}
            underline="none"
          >
            <SDK />
          </Link>
        </StyledHeader>
        <Box padding="30px 45px">{children}</Box>
      </ContainerWrapper>
    </Box>
  )
}
