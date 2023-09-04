import { useState, useCallback, useMemo, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Breadcrumbs,
  Typography,
  styled as muiStyled,
  styled,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  Alert,
  useTheme
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import { ExternalLink } from 'theme/components'
import Web3Status from './Web3Status'
import { HideOnMobile } from 'theme/index'
// import PlainSelect from 'components/Select/PlainSelect'
import Image from 'components/Image'
import logo from '../../assets/svg/logo.svg'
import logoWhite from '../../assets/svg/logo_white.svg'
import { routes } from 'constants/routes'
import MobileMenu from './MobileMenu'
import NetworkSelect from './NetworkSelect'
import MySpace from './MySpace'
import PopperMenu from './PopperMenu'
// import { ReactComponent as DaosIcon } from 'assets/svg/daosIcon.svg'
// import { ReactComponent as HomeSvg } from 'assets/svg/homeIcon.svg'
// import { ReactComponent as RewardsIcon } from 'assets/svg/rewardsIcon.svg'
// import { ReactComponent as TokenIcon } from 'assets/svg/tokenIcon.svg'
// import { ReactComponent as SdkIcon } from 'assets/svg/sdkIcon.svg'
import { ReactComponent as TimeIcon } from 'assets/svg/time_icon.svg'
import NewTag from 'assets/svg/new_tag.svg'
import { ReactComponent as ArrowIcon } from 'assets/svg/arrow_down.svg'
import gitBookIcon from 'assets/images/gitbook.png'
import PopperCard from 'components/PopperCard'
import { useBuildingDaoDataCallback, useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
import { getWorkspaceInfo } from 'utils/fetch/server'
// import { useActiveWeb3React } from 'hooks'
// import { useWalletModalToggle } from 'state/application/hooks'
import { useUserInfo } from 'state/userInfo/hooks'
import { useDispatch } from 'react-redux'
import { updateIsShowHeaderModalStatus } from 'state/buildingGovDao/actions'

interface TabContent {
  title: string
  route?: string
  link?: string
  titleContent?: JSX.Element
}

interface Tab extends TabContent {
  subTab?: TabContent[]
}

export const Tabs: Tab[] = [
  // { title: 'HOME', route: routes.Home },
  {
    title: 'AW Solutions',
    route: '',
    subTab: [
      {
        title: 'Account Generator',
        route: routes.NftAccount,
        titleContent: (
          <Box display={'flex'} flexDirection={'row'} gap={30} alignItems={'center'}>
            <Typography color={'#3F5170'}>Account Generator</Typography>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 700,
                lineHeight: '20px',
                fontStyle: 'italic',
                background: 'linear-gradient(132deg, #01C092 0%, #15C030 57.81%, #015BC6 100%)',
                backgroundClip: 'text',
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'
              }}
            >
              NEW!
            </Typography>
          </Box>
        )
      }
    ]
  },

  {
    title: 'Workspace',
    route: '',
    subTab: [
      {
        title: 'Explore DAOs',
        route: routes.Governance,
        titleContent: (
          <Box display={'flex'} flexDirection={'row'}>
            <Typography color={'#3F5170'}>Explore DAOs</Typography>
          </Box>
        )
      }
    ]
  },
  {
    title: 'Discovery',
    route: '',
    subTab: [
      {
        title: 'Clique Discovery',
        route: routes.Activity,
        titleContent: (
          <Box display={'flex'} flexDirection={'row'}>
            <Typography color={'#3F5170'}>Clique Discovery</Typography>
          </Box>
        )
      },
      {
        title: 'Tools',
        route: routes.DappStore,
        titleContent: (
          <Box display={'flex'} flexDirection={'row'}>
            <Typography color={'#3F5170'}>Tools</Typography>
          </Box>
        )
      }
    ]
  }
  // { title: 'Explore DAOs', route: routes.Governance },
  // { title: 'Clique Discovery', route: routes.Activity },
  // { title: 'SDK', link: 'https://www.npmjs.com/package/@myclique/governance-sdk' },
  // {
  //   title: 'Creator',
  //   route: '',
  //   subTab: [
  // {
  //   title: 'DAO Rewards',
  //   route: routes.Activity,
  //   titleContent: (
  //     <Box display={'flex'} flexDirection={'row'}>
  //       <RewardsIcon />
  //       <Typography color={'#3F5170'}>DAO Rewards</Typography>
  //     </Box>
  //   )
  // },
  // {
  //   title: 'Create DAO',
  //   route: routes.CreateDao,
  //   titleContent: (
  //     <Box display={'flex'} flexDirection={'row'}>
  //       <DaosIcon />
  //       <Typography color={'#3F5170'}>Create DAO</Typography>
  //     </Box>
  //   )
  // },
  // {
  //   title: 'Create Token',
  //   route: routes.CreatorToken,
  //   titleContent: (
  //     <Box display={'flex'} flexDirection={'row'}>
  //       <TokenIcon />
  //       <Typography color={'#3F5170'}>Create Token</Typography>
  //     </Box>
  //   )
  // },
  // {
  //   title: 'Create SBT',
  //   route: routes.CreateSoulToken,
  //   titleContent: (
  //     <Box display={'flex'} flexDirection={'row'}>
  //       <TokenIcon />
  //       <Typography color={'#3F5170'}>Create SBT</Typography>
  //     </Box>
  //   )
  // }
  // {
  //   title: 'SDK',
  //   link: 'https://www.npmjs.com/package/@myclique/governance-sdk',
  //   titleContent: (
  //     <Box
  //       display={'flex'}
  //       flexDirection={'row'}
  //       sx={{
  //         '&:hover svg path': {
  //           fill: '#0049C6'
  //         }
  //       }}
  //     >
  //       <SdkIcon />
  //       <Typography color={'#3F5170'} flex={1}>
  //         SDK
  //       </Typography>
  //     </Box>
  //   )
  // },
  // {
  //   title: 'Tools',
  //   route: routes.DappStore,
  //   titleContent: (
  //     <Box display={'flex'} flexDirection={'row'}>
  //       <HomeSvg />
  //       <Typography color={'#3F5170'}>Tools</Typography>
  //     </Box>
  //   )
  // }
  //   ]
  // },
  // { title: 'Swap', route: routes.SaleList },
  // { title: 'Tokens', route: routes.Tokens },
  // { title: 'Tools', route: routes.DappStore }
  // { title: 'Bug Bounty', link: 'https://immunefi.com/bounty/stp/' }
]
const ComingSoonList: TabContent[] = [
  {
    title: 'Asset Portal',
    route: routes.Soon,
    titleContent: (
      <Box display={'flex'} flexDirection={'row'}>
        <Typography color={'#3F5170'}>Asset Portal </Typography>
      </Box>
    )
  },
  {
    title: 'Identity Engine',
    route: routes.Soon,
    titleContent: (
      <Box display={'flex'} flexDirection={'row'}>
        <Typography color={'#3F5170'}>Identity Engine </Typography>
      </Box>
    )
  },
  {
    title: 'Data APIs',
    route: routes.Soon,
    titleContent: (
      <Box display={'flex'} flexDirection={'row'}>
        <Typography color={'#3F5170'}>Data APIs </Typography>
      </Box>
    )
  }
]

// const navLinkSX = () => ({
//   textDecoration: 'none',
//   fontSize: 14,
//   color: '#3F5170',
//   '&:hover p': {
//     color: '#0049C6'
//   },
//   '&:hover svg path': {
//     fill: '#0049C6'
//   }
// })

// const StyledNavLink = styled(NavLink)(navLinkSX)

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  height: theme.height.header,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 40px',
  zIndex: theme.zIndex.drawer,
  // [theme.breakpoints.down('md')]: {
  //   position: 'fixed',
  //   bottom: 0,
  //   left: 0,
  //   top: 'unset',
  //   borderTop: '1px solid ' + theme.bgColor.bg4,
  //   justifyContent: 'center'
  // },
  '& .link': {
    textDecoration: 'none',
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.text.secondary,
    marginRight: 30,
    fontWeight: 600,
    paddingBottom: '30px',
    paddingTop: '30px',
    borderBottom: '4px solid transparent',
    '&.active': {
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main
    },
    '&:hover': {
      color: theme.palette.primary.main
    },
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '10px'
    }
  },
  '& .menuLink': {
    textDecoration: 'none',
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.text.secondary,
    marginRight: 30,
    fontWeight: 600,
    paddingBottom: '16px',
    '&.active': {
      color: theme.palette.primary.main,
      borderColor: 'rgba(0, 91, 198, 0.06)'
    },
    '&:hover': {
      color: theme.palette.primary.main
    },
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '10px'
    }
  },
  [theme.breakpoints.down('lg')]: {
    '& .link': { marginRight: 20 },
    padding: '0 24px'
  },
  [theme.breakpoints.down('md')]: {
    '& .link': { marginRight: 15 },
    position: 'fixed'
  },
  [theme.breakpoints.down('sm')]: {
    '& .link': { marginRight: 24 },
    // justifyContent: 'space-around',
    height: theme.height.mobileHeader,
    padding: '0 15px',
    boxShadow: 'none'
  }
}))

const StyledMobileAppBar = styled(StyledAppBar)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
    position: 'unset',
    marginTop: 10,
    height: `calc(${theme.height.mobileHeader} - 10px)`
  }
}))

const Filler = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    height: theme.height.header,
    display: 'block'
  },
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 20px'
  }
}))

const MainLogo = styled(NavLink)(({ theme }) => ({
  '& img': {
    // width: 180.8,
    height: 40
  },
  '&:hover': {
    cursor: 'pointer'
  },
  [theme.breakpoints.down('sm')]: {
    '& img': { width: 80, height: 'auto' },
    marginBottom: -10,
    marginRight: 5
  }
}))

const LinksWrapper = muiStyled('div')(({ theme }) => ({
  margin: '0 40px',
  display: 'flex',
  [theme.breakpoints.down('lg')]: {
    margin: '0 30px'
  },
  [theme.breakpoints.down('md')]: {
    margin: '0 15px'
  },
  [theme.breakpoints.down('sm')]: {
    margin: '0',
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    height: 40,
    scrollbarWidth: 'none' /* firefox */,
    '-ms-overflow-style': 'none' /* IE 10+ */,
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  }
}))

// const StyledBreadcrumb = styled(Chip)(({ theme }) => {
//   const backgroundColor = theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800]
//   return {
//     backgroundColor,
//     // height: theme.spacing(3),
//     color: theme.palette.text.primary,
//     fontWeight: theme.typography.fontWeightRegular,
//     '&:hover, &:focus': {
//       backgroundColor: emphasize(backgroundColor, 0.06)
//     },
//     '&:active': {
//       boxShadow: theme.shadows[1],
//       backgroundColor: emphasize(backgroundColor, 0.12)
//     }
//   }
// }) as typeof Chip

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function Header() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { headerLinkIsShow } = useUpdateDaoDataCallback()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const handleMobileMenueDismiss = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])
  const { pathname } = useLocation()
  const daoId = useMemo(() => {
    const path = pathname.split('/')
    return path[3]
  }, [pathname])
  const { buildingDaoData: daoInfo } = useBuildingDaoDataCallback()
  const makeRouteLink = useCallback((route: string) => route.replace(':daoId', daoId), [daoId])
  const [workspaceTitle, setWorkspaceTitle] = useState('')
  const IsNftPage = useMemo(() => {
    if (pathname.includes(makeRouteLink(routes._NftAccount))) {
      return true
    }
    return false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
  const curPath = useMemo(() => pathname.replace(/^\/governance\/daoInfo\/[\d]+\//, ''), [pathname])
  // const isShow = useMemo(() => {
  //   if (curPath === routes.CreateDao) {
  //     return false
  //   }
  //   return true
  // }, [curPath])
  useEffect(() => {
    if (curPath === routes.CreateDao || pathname.includes(makeRouteLink(routes.DaoInfo))) {
      dispatch(updateIsShowHeaderModalStatus({ isShowHeaderModal: false }))
    } else {
      dispatch(updateIsShowHeaderModalStatus({ isShowHeaderModal: true }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curPath])
  const makeBreadcrumbs = useMemo(() => {
    if (!daoInfo?.daoName) {
      return []
    }
    const _list = curPath.split('/').map(v => {
      if (v === 'settings') {
        return 'Settings'
      }
      if (v === 'task') {
        getWorkspaceInfo(Number(curPath.split('/')[curPath.split('/').length - 1])).then(res => {
          if (res.data.data) {
            setWorkspaceTitle(res.data.data.title)
          }
        })
        return workspaceTitle || 'task'
      }
      if (v === 'DAO_Rewards') {
        return 'Clique Rewards'
      }
      return capitalizeFirstLetter(v.replace(/_/g, ' '))
    })
    const listData = _list.filter((v, index) => {
      const isNumber = !/\d/.test(v)
      const isLastItem = _list.length - 1 !== index
      return isNumber || isLastItem
    })
    return [daoInfo.daoName, ...listData]
  }, [curPath, daoInfo.daoName, workspaceTitle])

  const isGovernance = useMemo(() => pathname.includes('/governance'), [pathname])

  if (isGovernance) {
    return (
      <>
        <StyledAppBar
          sx={{
            backgroundColor: theme.palette.background.paper,
            boxShadow: 'inset 0px -1px 0px #E4E4E4',
            paddingLeft: '292px !important'
          }}
        >
          <Box
            width={'100%'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            sx={{
              fontWeight: 500,
              '& li a svg path': {
                fill: '#0049C6'
              },
              '& li a': {
                color: '#3F5170',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none'
              }
            }}
          >
            <Breadcrumbs aria-label="breadcrumb">
              <NavLink to="/">
                <HomeIcon fontSize="small" style={{ marginRight: 10 }} />
                DAOs
              </NavLink>
              {makeBreadcrumbs.map((v, i) => (
                <Typography
                  key={v}
                  color={makeBreadcrumbs.length - 1 === i ? '#0049C6' : '#3F5170'}
                  fontWeight={makeBreadcrumbs.length - 1 === i ? 600 : 500}
                >
                  {pathname.includes(makeRouteLink(routes.Proposal)) && i !== makeBreadcrumbs.length - 1 && i !== 0 ? (
                    <NavLink to={makeRouteLink(routes.Proposal)}>{v}</NavLink>
                  ) : (
                    v
                  )}
                </Typography>
              ))}
            </Breadcrumbs>
            <HeaderRight IsNftPage={IsNftPage} />
          </Box>
        </StyledAppBar>
      </>
    )
  }
  return (
    <>
      {headerLinkIsShow && (
        <>
          {!IsNftPage && (
            <>
              <Box height={50} />
              <Alert
                icon={<></>}
                sx={{
                  height: 50,
                  position: 'fixed',
                  top: 0,
                  width: '100%',
                  left: 0,
                  zIndex: 1000,
                  display: 'flex',
                  justifyContent: 'center',
                  borderRadius: '0'
                }}
              >
                You’re now on Clique V3, if you’d like to use the old site please navigate to{' '}
                <a href="https://v2.myclique.io/" target="_blank" rel="noreferrer">
                  https://v2.myclique.io/
                </a>
              </Alert>
            </>
          )}
          <MobileMenu isOpen={mobileMenuOpen} onDismiss={handleMobileMenueDismiss} />
          <Filler />
          <StyledMobileAppBar>
            <TabsBox IsNftPage={IsNftPage} />
          </StyledMobileAppBar>

          <StyledAppBar
            sx={{
              top: isGovernance || IsNftPage ? 0 : 50,
              backgroundColor: IsNftPage ? 'transparent' : theme.palette.background.paper,
              boxShadow: IsNftPage ? 'none' : 'inset 0px -1px 0px #E4E4E4'
            }}
          >
            <Box display="flex" alignItems="center">
              <MainLogo to={routes.Governance}>
                <Image src={IsNftPage ? logoWhite : logo} alt={'logo'} />
              </MainLogo>
              <HideOnMobile breakpoint="md">
                <TabsBox IsNftPage={IsNftPage} />
              </HideOnMobile>
            </Box>
            <HeaderRight IsNftPage={IsNftPage} />
          </StyledAppBar>
        </>
      )}
    </>
  )
}

function TabsBox({ IsNftPage }: { IsNftPage: boolean }) {
  const theme = useTheme()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  // const toggleWalletModal = useWalletModalToggle()
  // const loginSignature = useLoginSignature()
  // const { account } = useActiveWeb3React()
  // const userSignature = useUserInfo()
  return (
    <LinksWrapper>
      {Tabs.map(({ title, route, subTab, link, titleContent }, idx) =>
        subTab ? (
          <Box
            sx={{
              color: '#3F5170',
              marginRight: {
                xs: 15,
                lg: 30
              },
              height: 'auto',
              paddingBottom: '30px',
              borderColor: theme =>
                subTab.some(tab => tab.route && pathname.includes(tab.route))
                  ? theme.palette.text.primary
                  : 'transparnet',
              display: 'flex',
              [theme.breakpoints.down('sm')]: {
                paddingBottom: 0
              }
            }}
            key={title + idx}
          >
            <PopperCard
              sx={{
                marginTop: 13,
                maxHeight: '50vh',
                overflowY: 'auto',
                padding: '6px 20px',
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
              placement="bottom-start"
              targetElement={
                <Box
                  flexDirection={'row'}
                  display={'flex'}
                  sx={{
                    paddingTop: 30,
                    fontSize: 14,
                    color: IsNftPage ? '#fff' : '#808189',
                    fontWeight: 600,
                    cursor: 'pointer',
                    gap: 10,
                    [theme.breakpoints.down('sm')]: {
                      paddingTop: 0
                    },
                    '& svg:hover path': {
                      fill: '#0049C6'
                    },
                    '& svg:hover rect': {
                      stroke: '#97B7EF'
                    }
                  }}
                  alignItems={'center'}
                >
                  {title === 'AW Solutions' ? (
                    <>
                      <Box display={'flex'} alignItems={'center'} gap={4}>
                        <img src={NewTag} alt="" />
                        {title}
                      </Box>

                      <ArrowIcon />
                    </>
                  ) : (
                    <>
                      {title}
                      <ArrowIcon />
                    </>
                  )}
                </Box>
              }
            >
              <>
                {title === 'AW Solutions' ? (
                  <>
                    {subTab.map(option => (
                      <Box
                        key={option.title}
                        gap={30}
                        sx={{
                          minWidth: '150px',
                          height: 40,
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          '&:hover': {
                            backgroundColor: '#E8F1FF',
                            color: '#0049C6'
                          },
                          '& p': {
                            marginLeft: 8
                          }
                        }}
                        onClick={() => {
                          option.route ? navigate(option.route) : window.open(option.link, '_blank')
                        }}
                      >
                        {option.titleContent ?? option.title}
                      </Box>
                    ))}
                    <ComingSoonListStyle options={ComingSoonList} />
                  </>
                ) : (
                  subTab.map(option => (
                    <Box
                      sx={{
                        // width: 150,
                        minWidth: '150px',
                        height: 40,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#0049C60D',
                          color: '#0049C6'
                        },
                        '&:hover svg path': {
                          fill: '#0049C6'
                        },
                        '& p': {
                          marginLeft: 8
                        },
                        '&:hover p': {
                          color: '#0049C6'
                        }
                      }}
                      key={option.title}
                      onClick={() => {
                        option.route ? navigate(option.route) : window.open(option.link, '_blank')
                      }}
                    >
                      {option.titleContent ?? option.title}
                    </Box>
                  ))
                )}
              </>
            </PopperCard>
            {/* <PlainSelect
              key={title + idx}
              placeholder={title}
              autoFocus={false}
              width={title === 'Test' ? '70px' : undefined}
              style={{
                height: '16px'
              }}
            >
              {subTab.map((sub, idx) =>
                sub.link ? (
                  <MenuItem
                    key={sub.link + idx}
                    sx={{ backgroundColor: 'transparent!important', background: 'transparent!important' }}
                    selected={false}
                  >
                    <ExternalLink
                      href={sub.link}
                      className={'link'}
                      sx={{
                        '& p': {
                          color: '#3F5170'
                        },
                        '&:hover p': {
                          color: '#0049C6'
                        }
                      }}
                    >
                      {sub.titleContent ?? sub.title}
                    </ExternalLink>
                  </MenuItem>
                ) : (
                  <MenuItem key={sub.title + idx}>
                    <StyledNavLink to={sub.route ?? ''}>{sub.titleContent ?? sub.title}</StyledNavLink>
                  </MenuItem>
                )
              )}
            </PlainSelect> */}
          </Box>
        ) : link ? (
          <ExternalLink href={link} className={'link'} key={link + idx} style={{ fontSize: 14 }}>
            {titleContent ?? title}
          </ExternalLink>
        ) : (
          <NavLink
            key={title + idx}
            id={`${route}-nav-link`}
            to={route ?? ''}
            className={
              (route
                ? pathname.includes(route)
                  ? 'active'
                  : pathname.includes('account')
                  ? route.includes('account')
                    ? 'active'
                    : ''
                  : ''
                : '') + ' link'
            }
          >
            {titleContent ?? title}
          </NavLink>
        )
      )}
    </LinksWrapper>
  )
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({}) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'transparent'
  }
}))

export function HeaderRight({ IsNftPage }: { IsNftPage: boolean }) {
  const { pathname } = useLocation()
  const userInfo = useUserInfo()
  const theme = useTheme()
  return (
    <Box
      display={{ sm: 'flex', xs: 'grid' }}
      gridTemplateColumns={{ sm: 'unset', xs: 'auto auto auto auto' }}
      alignItems="center"
      gap={{ xs: '10px', sm: '10px' }}
    >
      <NetworkSelect IsNftPage={IsNftPage} />
      {userInfo?.loggedToken && <MySpace IsNftPage={IsNftPage} />}
      <Web3Status IsNftPage={IsNftPage} />
      {pathname === routes.DappStore || pathname === routes.Governance ? (
        <Box
          mr={20}
          sx={{
            [theme.breakpoints.down('sm')]: {
              display: 'none'
            }
          }}
        >
          <LightTooltip
            title={
              <div
                style={{
                  border: '1px solid #97B7EF',
                  borderRadius: '8px',
                  width: 103,
                  height: 28,
                  lineHeight: '28px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: 14,
                  backgroundColor: '#F8FBFF',
                  color: '#97B7EF'
                }}
                onClick={() =>
                  window.open('https://stp-dao.gitbook.io/verse-network/clique/overview-of-clique', '_blank')
                }
              >
                Learn more
              </div>
            }
          >
            <div>
              <Image width={17} src={gitBookIcon} />
            </div>
          </LightTooltip>
        </Box>
      ) : (
        <PopperMenu />
      )}
    </Box>
  )
}

function ComingSoonListStyle({ options }: { options: TabContent[] }) {
  return (
    <>
      <Box
        sx={{
          background: '#F2F7FF',
          padding: '5px 5px 15px',
          marginBottom: 5,
          borderRadius: '7px'
        }}
      >
        <Box
          sx={{
            width: '100%',
            background: '#E8F1FF',
            borderRadius: '6px',
            height: 27,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            paddingLeft: 12,
            '& svg path': {
              fill: '#97B7EF'
            }
          }}
        >
          <TimeIcon />
          <Typography
            sx={{
              color: 'var(--button-line, #97B7EF)',
              fontSize: '12px',
              fontWeight: '500',
              lineHeight: '20px'
            }}
          >
            Coming soon
          </Typography>
        </Box>
        {options.map(option => (
          <Box
            sx={{
              // width: 150,
              minWidth: '200px',
              height: 40,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              cursor: 'pointer',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: '#E8F1FF',
                color: '#0049C6',
                cursor: 'no-drop'
              },
              '& p': {
                marginLeft: 8
              }
            }}
            key={option.title}
            onClick={e => {
              e.stopPropagation()
            }}
          >
            {option.titleContent ?? option.title}
          </Box>
        ))}
      </Box>
    </>
  )
}
