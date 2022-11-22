import { useState, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Alert,
  AppBar,
  Badge,
  Box,
  // IconButton,
  Link,
  MenuItem,
  styled as muiStyled,
  styled,
  useTheme
} from '@mui/material'
import { ExternalLink } from 'theme/components'
import Web3Status from './Web3Status'
import { HideOnMobile } from 'theme/index'
import PlainSelect from 'components/Select/PlainSelect'
import Image from 'components/Image'
import logo from '../../assets/svg/logo.svg'
import { ReactComponent as NotificationIcon } from '../../assets/svg/notification_icon.svg'
import { routes } from 'constants/routes'
import MobileMenu from './MobileMenu'
import NetworkSelect from './NetworkSelect'
import { useActiveWeb3React } from 'hooks'
import { useNotificationListPaginationCallback } from 'state/pagination/hooks'

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
  // {
  //   title: 'Test',
  //   subTab: [
  //     { title: 'Test1', route: routes.test1 },
  //     { title: 'Test2', route: routes.test2 }
  //   ]
  // },

  { title: 'Governance', route: routes.Governance },
  { title: 'DAO Rewards', route: routes.Activity },
  // { title: 'Tokens', route: routes.Tokens },
  { title: 'Creator', route: routes.Creator },
  { title: 'SDK', link: 'https://www.npmjs.com/package/@myclique/governance-sdk' },
  { title: 'Bug Bounty', link: 'https://immunefi.com/bounty/stp/' }
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
  position: 'relative',
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
    paddingBottom: '36px',
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

const NoticeMsg = muiStyled(NavLink)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: '50%',
  width: '48px',
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.5s',
  backgroundColor: theme.bgColor.bg1,
  '&:hover': {
    backgroundColor: theme.bgColor.bg2
  },
  '&.active': {
    backgroundColor: theme.palette.primary.main,
    '& svg path': {
      stroke: theme.palette.common.white
    }
  },
  [theme.breakpoints.down('sm')]: {
    height: 30,
    width: 30
  }
}))

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const theme = useTheme()
  const {
    data: { unReadCount: notReadCount }
  } = useNotificationListPaginationCallback()

  const handleMobileMenueDismiss = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <>
      <MobileMenu isOpen={mobileMenuOpen} onDismiss={handleMobileMenueDismiss} />
      <Filler />
      <Alert
        icon={false}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          borderRadius: 0,
          color: '#fff',
          backgroundColor: theme.palette.primary.main
        }}
      >
        {`You’re now on Clique V2, if you’d like to visit the old version please navigate to:`}{' '}
        <Link href="https://v1.myclique.io/" target={'_blank'} color="inherit">
          https://v1.myclique.io/
        </Link>
      </Alert>
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

        <Box display="flex" alignItems="center" gap={{ xs: '10px', sm: '24px' }}>
          <NetworkSelect />
          {account && (
            <NoticeMsg to={routes.Notification}>
              <Badge badgeContent={notReadCount} color="success">
                <NotificationIcon />
              </Badge>
            </NoticeMsg>
          )}
          <Web3Status />
          {/* <ShowOnMobile breakpoint="sm">
            <IconButton
              sx={{
                border: '1px solid rgba(0, 0, 0, 0.1)',
                height: { xs: 24, sm: 32 },
                width: { xs: 24, sm: 32 },
                mb: { xs: 0, sm: 15 },
                mt: { xs: 0, sm: 8 },
                padding: '4px',
                borderRadius: '8px'
              }}
              onClick={() => {
                setMobileMenuOpen(open => !open)
              }}
            >
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="#252525">
                <path d="M1 1H13" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M1 7H13" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </IconButton>
          </ShowOnMobile> */}
        </Box>
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
