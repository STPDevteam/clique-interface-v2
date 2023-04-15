import { Box, Drawer, List, ListItemText, styled, Typography } from '@mui/material'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import { ReactComponent as proposal } from 'assets/svg/proposal.svg'
import { ReactComponent as treasury } from 'assets/svg/treasury.svg'
import { ReactComponent as Idea } from 'assets/svg/Idea.svg'
import { ReactComponent as bounty } from 'assets/svg/bounty.svg'
import { ReactComponent as member } from 'assets/svg/member.svg'
import { ReactComponent as setting } from 'assets/svg/setting.svg'
// import { ReactComponent as Add } from 'assets/svg/add.svg'
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
import { useCallback, useMemo } from 'react'
import { useDaoInfo } from 'hooks/useDaoInfo'
import { ChainId } from 'constants/chain'
import { DaoAvatars } from 'components/Avatars'
import MyCollapse from 'components/Collapse'

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

const StyledTeamMenu = styled(Box)({
  paddingLeft: 30,
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
})

export interface LeftSiderMenu {
  title: string
  link?: string
  icon: string
  defaultOpen?: boolean
  children?: LeftSiderMenu[]
}

export default function LeftSider() {
  const { pathname } = useLocation()
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const daoInfo = useDaoInfo(daoAddress, (daoChainId as unknown) as ChainId)

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

  const teamspacesList: LeftSiderMenu[] = useMemo(
    () => [
      {
        title: 'Genernal',
        icon: robot,
        defaultOpen: true,
        children: [
          {
            title: 'Meetings',
            link: makeRouteLink(routes.DaoTeamMeetings),
            icon: meetingIcon
          },
          { title: 'Docs', link: makeRouteLink(routes.DaoTeamDocs), icon: docsIcon },
          { title: 'Task', link: makeRouteLink(routes.DaoTeamTask), icon: taskIcon },
          { title: 'Calendar', link: makeRouteLink(routes.DaoTeamCalendar), icon: calendarIcon }
        ]
      },
      {
        title: 'Game',
        icon: ele,
        children: []
      }
    ],
    [makeRouteLink]
  )

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
          <DaoAvatars size={30} src={daoInfo?.daoLogo} />
          <Typography variant="h5" textAlign={'left'} sx={{ color: theme => theme.palette.text.secondary }}>
            {daoInfo?.name || '-'}
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
          {teamspacesList.map((item, idx) => (
            <Box key={idx}>
              <MyCollapse
                hiddenArrow
                bodyPl={0}
                defaultOpen={item.defaultOpen}
                title={
                  <StyledTeamMenu>
                    <Image src={item.icon}></Image>
                    <p>{item.title}</p>
                  </StyledTeamMenu>
                }
              >
                {item?.children?.map((item, idx1) => (
                  <List
                    key={idx1}
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
                        padding: '8px 24px 8px 52px',
                        textDecoration: 'none',
                        '&.active': {
                          backgroundColor: '#F0F5FC'
                        },
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
                    <NavLink to={item.link || ''}>
                      <Image src={item.icon}></Image>
                      <p>{item.title}</p>
                    </NavLink>
                  </List>
                ))}
              </MyCollapse>
            </Box>
          ))}
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
