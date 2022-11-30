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
import useBreakpoint from 'hooks/useBreakpoint'
// import { useUpgradeDaoCallback } from 'hooks/useGovernanceDaoCallback'
// import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
// import { triggerSwitchChain } from 'utils/triggerSwitchChain'
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
  },
  [theme.breakpoints.down('sm')]: {
    padding: '20px 20px 0',
    '& .top1': {
      gridTemplateColumns: '60px 1fr'
    }
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
    whiteSpace: 'nowrap',
    color: theme.palette.text.secondary,
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.common.black
    },
    '&.active': {
      color: theme.palette.common.black
    }
  },
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'space-evenly',
    '&>*': {
      marginRight: 0,
      '&:last-child': {
        marginRight: 0
      }
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
    <Box
      sx={{
        padding: { sm: '0 20px', xs: 0 }
      }}
    >
      {/* <UpgradeDao
        curDaoChainId={curDaoChainId}
        daoAddress={daoAddress}
        isSuper={daoAdminLevel === DaoAdminLevelProp.SUPER_ADMIN}
      /> */}
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

          {!isSmDown && (
            <Link
              className="sdk"
              href="https://www.npmjs.com/package/@myclique/governance-sdk"
              target={'_blank'}
              underline="none"
            >
              <SDK />
            </Link>
          )}
        </StyledHeader>
        <Box
          sx={{
            padding: { sm: '30px 45px', xs: '24px 0' }
          }}
        >
          {children}
        </Box>
      </ContainerWrapper>
    </Box>
  )
}

// function UpgradeDao({
//   daoAddress,
//   curDaoChainId,
//   isSuper
// }: {
//   daoAddress: string
//   curDaoChainId: ChainId
//   isSuper: boolean
// }) {
//   const { chainId, account, library } = useActiveWeb3React()
//   const isLatest = useDaoVersion(daoAddress, curDaoChainId)
//   const upgradeDaoCallback = useUpgradeDaoCallback(daoAddress)
//   const { claimSubmitted: isUpgrading } = useUserHasSubmittedClaim(`${daoAddress}_upgrade`)
//   const theme = useTheme()
//   const history = useHistory()

//   const toUpgrade = useCallback(() => {
//     if (chainId !== curDaoChainId) {
//       triggerSwitchChain(library, curDaoChainId, account || '')
//       return
//     }
//     upgradeDaoCallback()
//   }, [account, chainId, curDaoChainId, library, upgradeDaoCallback])

//   return (
//     <Backdrop
//       sx={{ color: theme.palette.common.white, zIndex: theme => theme.zIndex.drawer + 1 }}
//       open={isLatest === false}
//     >
//       <Box display={'grid'} justifyItems="center" gap={15}>
//         {isSuper ? (
//           <>
//             <Alert severity="error">This is a very important update, please click to upgrade.</Alert>
//             <Button width="200px" disabled={isUpgrading} onClick={toUpgrade}>
//               {isUpgrading ? 'Upgrading...' : 'Upgrade'}
//             </Button>
//           </>
//         ) : (
//           <>
//             <Typography>The DAO is waiting for its creator to upgrade.</Typography>
//             <Button width="200px" onClick={() => history.goBack()}>
//               Close
//             </Button>
//           </>
//         )}
//       </Box>
//     </Backdrop>
//   )
// }
