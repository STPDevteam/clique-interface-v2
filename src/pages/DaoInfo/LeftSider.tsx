import { Box, Collapse, Drawer, List, ListItemText, styled, Typography } from '@mui/material'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import { ReactComponent as proposal } from 'assets/svg/proposal.svg'
import { ReactComponent as treasury } from 'assets/svg/treasury.svg'
import { ReactComponent as Idea } from 'assets/svg/Idea.svg'
import { ReactComponent as bounty } from 'assets/svg/bounty.svg'
import { ReactComponent as member } from 'assets/svg/member.svg'
import { ReactComponent as setting } from 'assets/svg/setting.svg'
// import { ReactComponent as Add } from 'assets/svg/add.svg'
import stp from 'assets/images/stp.png'
import { routes } from 'constants/routes'
import Image from 'components/Image'
import robot from 'assets/images/robot.png'
import ele from 'assets/images/ele.png'
import trash from 'assets/images/trash.png'
import meetingIcon from 'assets/images/meeting.png'
import taskIcon from 'assets/images/task.png'
import calendarIcon from 'assets/images/calendar.png'
import docsIcon from 'assets/images/docs.png'
import { ExternalLink } from 'theme/components'
import { useCallback, useMemo, useState } from 'react'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

const StyledAppBar = styled(Box)(({ theme }) => ({
  position: 'fixed',
  boxShadow: 'inset 0px -1px 0px #E4E4E4',
  padding: '0 40px',
  zIndex: theme.zIndex.drawer,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  '& .menuLink:hover svg path': {
    fill: 'rgba(0, 73, 198, 1)'
  },
  '& .menuLink': {
    textDecoration: 'none',
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.text.secondary,
    marginRight: 30,
    fontWeight: 600,
    padding: '9px 16px',
    '& .active': {
      color: theme.palette.primary.main,
      backgroundColor: 'rgba(0, 91, 198, 0.06)'
    },
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'rgba(0, 91, 198, 0.06)'
    },
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '10px'
    }
  },
  '.activemenuLink': {
    textDecoration: 'none',
    padding: '9px 16px',
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(0, 91, 198, 0.06)'
  },
  '.activemenuLink svg path': {
    fill: 'rgba(0, 73, 198, 1)'
  },
  '& .collapse': {
    textDecoration: 'none',
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.text.secondary,
    marginRight: 30,
    fontWeight: 600,
    padding: '16px',
    '& .active': {
      color: theme.palette.primary.main,
      backgroundColor: 'rgba(0, 91, 198, 0.06)'
    },
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'rgba(0, 91, 198, 0.06)'
    },
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '10px'
    }
  }
}))

export default function LeftSider() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [gameOpen, setGameOpen] = useState(false)
  const handleClick = () => {
    setOpen(prevOpen => !prevOpen)
  }
  const handleGameClick = () => {
    setGameOpen(prevOpen => !prevOpen)
  }
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()

  const makeRouteLink = useCallback(
    (route: string) => {
      return route.replace(':chainId', daoChainId).replace(':address', daoAddress)
    },
    [daoAddress, daoChainId]
  )

  const menuList = useMemo(
    () => [
      {
        text: 'Proposal',
        icon: proposal,
        route: makeRouteLink(routes.Proposal)
      },
      {
        text: 'Treasury',
        icon: treasury,
        route: makeRouteLink(routes.DaoTreasury)
      },
      {
        text: 'Idea',
        icon: Idea,
        route: makeRouteLink(routes.DaoIdea)
      },
      {
        text: 'Bounty',
        icon: bounty,
        route: makeRouteLink(routes.DaoBounty)
      },
      {
        text: 'Member',
        icon: member,
        route: makeRouteLink(routes.DaoMember)
      },
      {
        text: 'About & Settings',
        icon: setting,
        route: makeRouteLink(routes.DaoAboutSetting)
      }
    ],
    [makeRouteLink]
  )

  const teamspacesList = [
    {
      text: 'Genernal',
      icon: robot,
      link: '/general',
      children: [
        {
          title: 'Meetings',
          link: '/governance/daoInfo/5/0xb6dbd00a199b3a616be3d38c621b337f48a065ce',
          icon: meetingIcon
        },
        { title: 'Docs', link: '/general/docs', icon: docsIcon },
        { title: 'Task', link: '/general/task', icon: taskIcon },
        { title: 'Calendar', link: '/general/calendar', icon: calendarIcon }
      ]
    },
    {
      text: 'Game',
      icon: ele,
      children: []
    }
  ]

  return (
    <StyledAppBar>
      <Drawer
        sx={{
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box'
          }
        }}
        variant="permanent"
        anchor="left"
      >
        <Box
          display={'flex'}
          justifyContent={'flex-start'}
          flexDirection={'row'}
          alignItems={'center'}
          gap={10}
          padding="16px 20px"
        >
          <Image width={30} src={stp} alt="stp"></Image>
          <Typography variant="h5" textAlign={'left'} sx={{ color: theme => theme.palette.text.secondary }}>
            STP
          </Typography>
        </Box>
        <div />
        <List>
          {menuList.map((item, idx) => (
            <NavLink
              key={item.text + idx}
              id={`${item.route}-nav-link`}
              to={item.route ?? ''}
              className={(item.route && pathname === item.route ? 'active' : '') + 'menuLink'}
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                flexDirection: 'row',
                gap: 10,
                marginRight: 0,
                paddingLeft: 20
              }}
            >
              <item.icon width={30} height={30} />
              <ListItemText primary={item.text} />
            </NavLink>
          ))}
        </List>
        <Box display={'flex'} justifyContent={'flex-start'} flexDirection={'row'} alignItems={'center'}>
          <Typography
            variant="h5"
            textAlign={'left'}
            fontSize={16}
            sx={{ color: theme => theme.palette.text.secondary, padding: '6px 24px 16px' }}
          >
            Teamspaces
          </Typography>
        </Box>
        <Box
          gap={10}
          sx={{
            '& li a': {
              paddingLeft: 80
            },
            '& li::marker': {
              display: 'inline-block',
              content: '""'
            }
          }}
        >
          <Box
            onClick={handleClick}
            sx={{
              paddingLeft: 20,
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              color: '#3f5170',
              cursor: 'pointer',
              '& img': {
                width: 14
              },
              '& svg path': {
                fill: '#d4d7e2'
              }
            }}
          >
            {open ? <ExpandMore /> : <ExpandLess />}
            <Image src={robot}></Image>
            <p>General</p>
          </Box>
          <Collapse component="li" in={open} timeout="auto" unmountOnExit>
            {teamspacesList?.[0].children.map((item, idx) => (
              <List
                key={idx}
                disablePadding
                style={{ marginRight: 0 }}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 91, 198, 0.06)'
                  },
                  '& a': {
                    color: theme => theme.palette.text.secondary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '16px 24px',
                    textDecoration: 'none',
                    '& img': {
                      width: 14
                    },
                    '& p': {
                      fontSize: 14,
                      fontWeight: 500,
                      margin: 0,
                      color: '#3f5170'
                    }
                  }
                }}
              >
                <NavLink to={item.link}>
                  <Image src={item.icon}></Image>
                  <p>{item.title}</p>
                </NavLink>
              </List>
            ))}
          </Collapse>
          <Box
            onClick={handleGameClick}
            sx={{
              paddingLeft: 20,
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              color: '#3f5170',
              cursor: 'pointer',
              '& img': {
                width: 14
              },
              '& svg path': {
                fill: '#d4d7e2'
              }
            }}
          >
            {gameOpen ? <ExpandMore /> : <ExpandLess />}
            <Image src={ele}></Image>
            <p>Game</p>
          </Box>
          <Collapse component="li" in={gameOpen} timeout="auto" unmountOnExit></Collapse>
          <ExternalLink
            href={''}
            className={'link'}
            color="#000050"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              padding: '16px 54px',
              '&:hover': {
                color: '#232323!important'
              }
            }}
          >
            <Image width={14} src={trash} alt=""></Image>
            <Typography textAlign={'left'} fontSize={14} sx={{ color: theme => theme.palette.text.secondary }}>
              Trash
            </Typography>
          </ExternalLink>
        </Box>
        {/* <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={10}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              borderTop: '2px solid #d4d7e2'
            }}
          >
            <Add />
            <Typography textAlign={'left'} fontSize={14} sx={{ color: theme => theme.palette.text.secondary }}>
              New page
            </Typography>
          </Box> */}
      </Drawer>
    </StyledAppBar>
  )
}
