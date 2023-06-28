import { useState, useCallback, useMemo } from 'react'
import { NavLink, useHistory, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  Breadcrumbs,
  Typography,
  styled as muiStyled,
  styled,
  Tooltip,
  TooltipProps,
  tooltipClasses
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import { ExternalLink } from 'theme/components'
import Web3Status from './Web3Status'
import { HideOnMobile } from 'theme/index'
// import PlainSelect from 'components/Select/PlainSelect'
import Image from 'components/Image'
import logo from '../../assets/svg/logo.svg'
import { routes } from 'constants/routes'
import MobileMenu from './MobileMenu'
import NetworkSelect from './NetworkSelect'
import MySpace from './MySpace'
import PopperMenu from './PopperMenu'
import { useUserInfo } from 'state/userInfo/hooks'
import { ReactComponent as DaosIcon } from 'assets/svg/daosIcon.svg'
// import { ReactComponent as HomeSvg } from 'assets/svg/homeIcon.svg'
// import { ReactComponent as RewardsIcon } from 'assets/svg/rewardsIcon.svg'
import { ReactComponent as TokenIcon } from 'assets/svg/tokenIcon.svg'
// import { ReactComponent as SdkIcon } from 'assets/svg/sdkIcon.svg'
import { ReactComponent as ArrowIcon } from 'assets/svg/arrow_down.svg'
import gitBookIcon from 'assets/images/gitbook.png'
import PopperCard from 'components/PopperCard'
import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'

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
  { title: 'Explore DAOs', route: routes.Governance },
  { title: 'DAO Rewards', route: routes.Activity },
  { title: 'SDK', link: 'https://www.npmjs.com/package/@myclique/governance-sdk' },
  {
    title: 'Creater',
    route: '',
    subTab: [
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
      {
        title: 'Create DAO',
        route: routes.CreateDao,
        titleContent: (
          <Box display={'flex'} flexDirection={'row'}>
            <DaosIcon />
            <Typography color={'#3F5170'}>Create DAO</Typography>
          </Box>
        )
      },
      {
        title: 'Create Token',
        route: routes.CreatorToken,
        titleContent: (
          <Box display={'flex'} flexDirection={'row'}>
            <TokenIcon />
            <Typography color={'#3F5170'}>Create Token</Typography>
          </Box>
        )
      }
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
    ]
  },
  // { title: 'Swap', route: routes.SaleList },
  // { title: 'Tokens', route: routes.Tokens },
  { title: 'Tools', route: routes.DappStore },
  { title: 'Bug Bounty', link: 'https://immunefi.com/bounty/stp/' }
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
  backgroundColor: theme.palette.background.paper,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: 'inset 0px -1px 0px #E4E4E4',
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
    display: 'flex',
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

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function Header() {
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
  console.log('header', daoId, daoInfo)

  const curPath = useMemo(() => pathname.replace(/^\/governance\/daoInfo\/[\d]+\//, ''), [pathname])

  const makeBreadcrumbs = useMemo(() => {
    if (!daoInfo?.daoName) {
      return []
    }
    const _list = curPath.split('/').map(v => {
      if (v === 'about_setting') {
        return 'About & Setting'
      }
      return capitalizeFirstLetter(v.replace(/_/g, ' '))
    })
    return [daoInfo.daoName, ..._list]
  }, [curPath, daoInfo?.daoName])

  const isGovernance = useMemo(() => pathname.includes('/governance'), [pathname])

  if (isGovernance) {
    return (
      <StyledAppBar
        sx={{
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
                {v}
              </Typography>
            ))}
          </Breadcrumbs>
          <HeaderRight />
        </Box>
      </StyledAppBar>
    )
  }
  return (
    <>
      <MobileMenu isOpen={mobileMenuOpen} onDismiss={handleMobileMenueDismiss} />
      <Filler />
      <StyledMobileAppBar>
        <TabsBox />
      </StyledMobileAppBar>

      <StyledAppBar>
        <Box display="flex" alignItems="center">
          <MainLogo to={routes.Governance}>
            <Image src={logo} alt={'logo'} />
          </MainLogo>
          <HideOnMobile breakpoint="md">
            <TabsBox />
          </HideOnMobile>
        </Box>
        <HeaderRight />
      </StyledAppBar>
    </>
  )
}

function TabsBox() {
  const { pathname } = useLocation()
  const history = useHistory()

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
              display: 'flex'
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
                    color: '#808189',
                    fontWeight: 600,
                    cursor: 'pointer',
                    gap: 10,
                    '& svg:hover path': {
                      fill: '#0049C6'
                    },
                    '& svg:hover rect': {
                      stroke: '#97B7EF'
                    }
                  }}
                  alignItems={'center'}
                >
                  {title}
                  <ArrowIcon />
                </Box>
              }
            >
              <>
                {subTab.map(option => (
                  <Box
                    sx={{
                      width: 150,
                      height: 40,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#0049C60D',
                        colorr: '#0049C6'
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
                    onClick={() => (option.route ? history.push(option.route) : window.open(option.link, '_blank'))}
                  >
                    {option.titleContent ?? option.title}
                  </Box>
                ))}
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

export function HeaderRight() {
  const { pathname } = useLocation()
  const userInfo = useUserInfo()
  return (
    <Box
      display={{ sm: 'flex', xs: 'grid' }}
      gridTemplateColumns={{ sm: 'unset', xs: 'auto auto auto auto' }}
      alignItems="center"
      gap={{ xs: '10px', sm: '10px' }}
    >
      <NetworkSelect />
      {userInfo?.loggedToken && <MySpace />}
      <Web3Status />
      {pathname === routes.DappStore || pathname === routes.Governance ? (
        <Box mr={20}>
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
