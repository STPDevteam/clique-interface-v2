import { Box, Drawer, List, ListItemText, styled, Typography } from '@mui/material'
import { NavLink, useHistory, useLocation, useParams } from 'react-router-dom'
import { ReactComponent as proposal } from 'assets/svg/proposal.svg'
import { ReactComponent as workspace } from 'assets/svg/workspace.svg'
// import { ReactComponent as treasury } from 'assets/svg/treasury.svg'
// import { ReactComponent as Idea } from 'assets/svg/Idea.svg'
import { ReactComponent as bounty } from 'assets/svg/bounty.svg'
import { ReactComponent as member } from 'assets/svg/member.svg'
import { ReactComponent as setting } from 'assets/svg/setting.svg'
// import { ReactComponent as Add } from 'assets/svg/add.svg'
import { ReactComponent as ArrowIcon } from 'assets/svg/arrow_down.svg'
import { routes } from 'constants/routes'
// import Image from 'components/Image'
// import robot from 'assets/images/robot.png'
// import ele from 'assets/images/ele.png'
// import trash from 'assets/images/trash.png'
// import meetingIcon from 'assets/images/meeting.png'
// import taskIcon from 'assets/images/task.png'
// import calendarIcon from 'assets/images/calendar.png'
// import docsIcon from 'assets/images/docs.png'
// import { ExternalLink } from 'theme/components'
import { useCallback, useMemo } from 'react'
import { DaoAvatars } from 'components/Avatars'
// import MyCollapse from 'components/Collapse'
import PopperCard from 'components/PopperCard'
import { useMyJoinedDao } from 'hooks/useBackedDaoServer'
import { useSelector } from 'react-redux'
import { AppState } from 'state'

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
    color: '#3F5170',
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

// const StyledTeamMenu = styled(Box)({
//   paddingLeft: 30,
//   display: 'flex',
//   justifyContent: 'flex-start',
//   flexDirection: 'row',
//   alignItems: 'center',
//   gap: 10,
//   color: '#3f5170',
//   cursor: 'pointer',
//   '& img': {
//     width: 14
//   },
//   '& svg path': {
//     fill: '#d4d7e2'
//   }
// })

const Text = styled(Typography)(({ theme }) => ({
  width: 64,
  fontSize: 12,
  fontWeight: 500,
  marginTop: 6,
  lineHeight: '20px',
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

const Item = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyItems: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  width: 150,
  padding: '5px 5px 5px 10px',
  gap: 10,
  '&:hover': {
    backgroundColor: '#0049C60D'
  },
  '& img': {
    width: 24,
    height: 24,
    border: '1px solid #0049C60D',
    borderRadius: '50%'
  },
  '& p': {
    marginTop: 0,
    textAlign: 'left',
    fontSize: 14,
    flex: 1
  },
  '& p:hover': {
    color: '#0049C6'
  }
}))

export interface LeftSiderMenu {
  title: string
  link?: string
  icon: string
  defaultOpen?: boolean
  children?: LeftSiderMenu[]
}

export function DaoItem() {
  const daoBaseInfo = useSelector((state: AppState) => state.buildingGovernanceDao.createDaoData)

  return (
    <Item>
      <DaoAvatars size={24} src={daoBaseInfo?.daoLogo} alt={daoBaseInfo?.daoName || '-'} />
      <Text noWrap>{daoBaseInfo?.daoName || '-'}</Text>
    </Item>
  )
}

export default function LeftSider() {
  const { pathname } = useLocation()
  const history = useHistory()
  const { daoId: daoId } = useParams<{ daoId: string }>()
  const daoInfo = useSelector((state: AppState) => state.buildingGovernanceDao.createDaoData)
  const { result: myJoinedDaoList } = useMyJoinedDao()
  const makeRouteLink = useCallback(
    (route: string) => {
      return route.replace(':daoId', daoId)
    },
    [daoId]
  )

  const menuList = useMemo(
    () => [
      {
        text: 'Proposal',
        icon: proposal,
        route: makeRouteLink(routes.Proposal)
      },
      {
        text: 'Workspace',
        icon: workspace,
        route: makeRouteLink(routes.DaoTeamTask)
      },
      // {
      //   text: 'Treasury',
      //   icon: treasury,
      //   route: makeRouteLink(routes.DaoTreasury)
      // },
      // {
      //   text: 'Idea',
      //   icon: Idea,
      //   route: makeRouteLink(routes.DaoIdea)
      // },
      {
        text: 'DAO Rewards',
        icon: bounty,
        route: makeRouteLink(routes.DaoInfoActivity)
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

  // const teamspacesList: LeftSiderMenu[] = useMemo(
  //   () => [
  //     {
  //       title: 'Genernal',
  //       icon: robot,
  //       defaultOpen: true,
  //       children: [
  //         // {
  //         //   title: 'Meetings',
  //         //   link: makeRouteLink(routes.DaoTeamMeetings),
  //         //   icon: meetingIcon
  //         // },
  //         // { title: 'Docs', link: makeRouteLink(routes.DaoTeamDocs), icon: docsIcon },
  //         { title: 'Task', link: makeRouteLink(routes.DaoTeamTask), icon: taskIcon }
  //         // { title: 'Calendar', link: makeRouteLink(routes.DaoTeamCalendar), icon: calendarIcon }
  //       ]
  //     }
  //     // {
  //     //   title: 'Game',
  //     //   icon: ele,
  //     //   children: []
  //     // }
  //   ],
  //   [makeRouteLink]
  // )

  return (
    <StyledAppBar>
      <Drawer
        sx={{
          width: 260,
          flexShrink: 0,
          borderColor: '#D4D7E2',
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
          width={'100%'}
          padding="16px 20px 5px"
        >
          <PopperCard
            sx={{
              marginTop: 13,
              maxHeight: '50vh',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '0!important',
                display: 'none!important'
              }
            }}
            placement="bottom-end"
            targetElement={
              <Box
                display={'grid'}
                gridTemplateColumns={'auto auto 1fr'}
                flexDirection={'row'}
                width={'100%'}
                gap={12}
                sx={{
                  cursor: 'pointer',
                  '& svg': {
                    marginLeft: 'auto'
                  }
                }}
                alignItems={'center'}
              >
                <DaoAvatars size={50} src={daoInfo?.daoLogo} />
                <Typography
                  sx={{
                    width: 134,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    fontWeight: 600,
                    fontSize: '16px',
                    lineHeight: '20px',
                    color: '#3F5170',
                    textAlign: 'left'
                  }}
                >
                  {daoInfo?.daoName || '-'}
                </Typography>
                <ArrowIcon />
              </Box>
            }
          >
            <>
              {myJoinedDaoList.map(option => (
                <Box
                  key={option.daoAddress + option.chainId}
                  onClick={() => history.push(`${routes._DaoInfo}/${option.chainId}`)}
                >
                  <DaoItem />
                </Box>
              ))}
            </>
          </PopperCard>
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
                outline: 'none',
                marginRight: 0,
                paddingLeft: 20
              }}
            >
              <item.icon width={30} height={30} />
              <ListItemText primary={item.text} />
            </NavLink>
          ))}
        </List>
        {/* <Box display={'flex'} justifyContent={'flex-start'} flexDirection={'row'} alignItems={'center'}>
          <Typography variant="h5" textAlign={'left'} fontSize={16} sx={{ color: '#3F5170', padding: '6px 24px 16px' }}>
            Teamspaces
          </Typography>
        </Box> */}
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
          {/* {teamspacesList.map((item, idx) => (
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
          ))} */}
          {/* <List
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
                padding: '8px 24px 8px 30px',
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
            <NavLink to={makeRouteLink(routes.DaoTeamTrash) || ''}>
              <Image src={trash}></Image>
              <p>Trash</p>
            </NavLink>
          </List> */}
          {/* <ExternalLink
            href={routes.DaoTeamTrash}
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
          </ExternalLink> */}
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
