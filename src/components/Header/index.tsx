import { useState, useCallback, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AppBar, Box, Breadcrumbs, MenuItem, Typography, styled as muiStyled, styled } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import { ExternalLink } from 'theme/components'
import Web3Status from './Web3Status'
import { HideOnMobile } from 'theme/index'
import PlainSelect from 'components/Select/PlainSelect'
import Image from 'components/Image'
import logo from '../../assets/svg/logo.svg'
import { routes } from 'constants/routes'
import MobileMenu from './MobileMenu'
import NetworkSelect from './NetworkSelect'
import { useDaoInfo } from 'hooks/useDaoInfo'
import { ChainId } from 'constants/chain'
import MySpace from './MySpace'
import PopperMenu from './PopperMenu'
import { useActiveWeb3React } from 'hooks'

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
  { title: 'DAOs', route: routes.Governance },
  { title: 'Dapp Store', route: routes.DappStore }
  // { title: 'DAO Rewards', route: routes.Activity },
  // { title: 'Swap', route: routes.SaleList },
  // { title: 'Tokens', route: routes.Tokens },
  // { title: 'Creator', route: routes.Creator },
  // { title: 'SDK', link: 'https://www.npmjs.com/package/@myclique/governance-sdk' },
  // { title: 'Bug Bounty', link: 'https://immunefi.com/bounty/stp/' }
]

const navLinkSX = ({ theme }: any) => ({
  textDecoration: 'none',
  fontSize: 14,
  color: theme.palette.text.primary,
  opacity: 0.5,
  '&:hover': {
    opacity: 1
  }
})

const StyledNavLink = styled(NavLink)(navLinkSX)

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
  margin: '0 80px',
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
  const [daoChainId, daoAddress] = useMemo(() => {
    const path = pathname.split('/')
    return [path[3], path[4]]
  }, [pathname])
  const daoInfo = useDaoInfo(daoAddress, (daoChainId as unknown) as ChainId)

  const curPath = useMemo(() => pathname.replace(/^\/governance\/daoInfo\/[\d]+\/0x[\da-zA-Z]+\//, ''), [pathname])
  const makeBreadcrumbs = useMemo(() => {
    if (!daoInfo?.name) {
      return []
    }
    const _list = curPath.split('/').map(v => {
      if (v === 'about_setting') {
        return 'About & Setting'
      }
      return capitalizeFirstLetter(v.replace(/_/g, ' '))
    })
    return [daoInfo.name, ..._list]
  }, [curPath, daoInfo?.name])

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
              <HomeIcon fontSize="small" />
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

  return (
    <LinksWrapper>
      {Tabs.map(({ title, route, subTab, link, titleContent }, idx) =>
        subTab ? (
          <Box
            sx={{
              marginRight: {
                xs: 15,
                lg: 48
              },
              height: 'auto',
              paddingBottom: '30px',
              borderBottom: '2px solid transparent',
              borderColor: theme =>
                subTab.some(tab => tab.route && pathname.includes(tab.route))
                  ? theme.palette.text.primary
                  : 'transparnet',
              display: 'inline'
            }}
            key={title + idx}
          >
            <PlainSelect
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
                      color="#00000050"
                      sx={{
                        '&:hover': {
                          color: '#232323!important'
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
            </PlainSelect>
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

export function HeaderRight() {
  const { account } = useActiveWeb3React()
  return (
    <Box
      display={{ sm: 'flex', xs: 'grid' }}
      gridTemplateColumns={{ sm: 'unset', xs: 'auto auto auto auto' }}
      alignItems="center"
      gap={{ xs: '10px', sm: '10px' }}
    >
      <NetworkSelect />
      {account && <MySpace />}
      <Web3Status />
      <PopperMenu />
    </Box>
  )
}
