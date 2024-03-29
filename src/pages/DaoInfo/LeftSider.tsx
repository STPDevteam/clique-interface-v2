import { Box, Drawer, List, ListItemText, styled, Typography, Stack } from '@mui/material'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ReactComponent as Proposal } from 'assets/svg/proposal.svg'
import { ReactComponent as Workspace } from 'assets/svg/workspace.svg'
// import { ReactComponent as treasury } from 'assets/svg/treasury.svg'
// import { ReactComponent as Idea } from 'assets/svg/Idea.svg'
import { ReactComponent as Bounty } from 'assets/svg/bounty.svg'
import { ReactComponent as Member } from 'assets/svg/member.svg'
import { ReactComponent as About } from 'assets/svg/about.svg'
import { ReactComponent as Setting } from 'assets/svg/setting.svg'
// import { ReactComponent as Add } from 'assets/svg/add.svg'
import { ReactComponent as ArrowIcon } from 'assets/svg/arrow_down.svg'
import { routes } from 'constants/routes'
import Image from 'components/Image'
// import robot from 'assets/images/robot.png'
// import ele from 'assets/images/ele.png'
// import trash from 'assets/images/trash.png'
// import meetingIcon from 'assets/images/meeting.png'
import taskIcon from 'assets/images/task.png'
// import calendarIcon from 'assets/images/calendar.png'
// import docsIcon from 'assets/images/docs.png'
// import { ExternalLink } from 'theme/components'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DaoAvatars } from 'components/Avatars'
import MyCollapse from 'components/Collapse'
import PopperCard from 'components/PopperCard'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { useBuildingDaoDataCallback, useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
import { useActiveWeb3React } from 'hooks'
import { DaoAdminLevelProp } from 'hooks/useDaoInfo'
import useModal from 'hooks/useModal'
import AddTeamspaceModal from 'pages/AboutSetting/Modals/AddTeamspaceModal'
import AddIcon from 'assets/images/add.png'
import { EmptyDaoItem } from 'components/Header/MySpace'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { useDaoInfoLeftSidedOpenStatus } from 'state/application/hooks'
import useBreakpoint from 'hooks/useBreakpoint'
import TooltipStyle from 'components/Tooltip'

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
  '& .menuLink svg': {
    width: 30,
    height: 30
  },
  '& .menuLink': {
    width: '100%',
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
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(0, 91, 198, 0.06)'
  },
  '.activemenuLink ul': {
    backgroundColor: '#fff'
  },
  '.activemenuLink ul:hover': {
    backgroundColor: '#F8FBFF'
  },
  '.activemenuLink>svg path': {
    fill: 'rgba(0, 73, 198, 1)'
  },
  '.activemenuLink>svg': {
    width: 30,
    height: 30
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
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  color: '#3f5170',
  cursor: 'pointer',
  padding: '0 20px',
  '& img': {
    width: 14
  },
  '& .ParentTitle': {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    '& svg path': {
      fill: '#97B7EF'
    }
  }
})

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

const ChildItem = styled(Box)({
  height: 40,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 16px 0 60px',
  '& .LBox': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    '& img': {
      width: 14
    },
    '& p': {
      width: 100,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: '#3F5170',
      fontSize: 14,
      fontWeight: 500
    }
  }
})

// export const TooltipStyle = styled(({ className, ...props }: TooltipProps) => (
//   <Tooltip {...props} classes={{ popper: className }} />
// ))(() => ({
//   [`& .${tooltipClasses.tooltip}`]: {
//     backgroundColor: '#F8FBFF !important',
//     color: '#97B7EF !important',
//     width: 300,
//     fontFamily: 'Inter',
//     fontWeight: 500,
//     fontSize: '12px',
//     lineHeight: '16px',
//     borderRadius: '6px',
//     border: ' 1px solid #97B7EF',
//     padding: '8px  8px 8px 12px',
//     '& .MuiTooltip-arrow': {
//       color: '#97B7EF !important'
//     }
//   }
// }))

export interface LeftSiderMenu {
  title: string
  link?: string
  icon?: ReactJSXElement
  route?: string
  logo?: string
  isPublic?: boolean
  defaultOpen?: boolean
  children?: LeftSiderMenu[]
}

export function DaoItem({ daoLogo, daoName }: { daoLogo: string; daoName: string }) {
  return (
    <Item>
      <DaoAvatars size={24} src={daoLogo} alt={daoName || '-'} />
      <Text noWrap>{daoName || '-'}</Text>
    </Item>
  )
}

export default function LeftSider() {
  const isOpen = useSelector((state: AppState) => state.application.openDaoLeftSided)
  const setSidedStatusCallBack = useDaoInfoLeftSidedOpenStatus()
  const isSmDown = useBreakpoint('sm')
  const { pathname } = useLocation()
  const { account } = useActiveWeb3React()
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState([false, false, false, false, false, false])
  const { daoId: daoId } = useParams<{ daoId: string }>()
  const { buildingDaoData: daoInfo } = useBuildingDaoDataCallback()
  const {
    createDaoListData: myJoinedDaoList,
    spaceListData,
    myJoinDaoData,
    updateWrokspaceListData
  } = useUpdateDaoDataCallback()
  const makeRouteLink = useCallback((route: string) => route.replace(':daoId', daoId || ''), [daoId])
  const [activeIdx, setActiveIdx] = useState(-1)
  const { showModal } = useModal()

  const workspaceList = useMemo(
    () =>
      spaceListData.map(item => ({
        title: item.title,
        link: makeRouteLink(routes.DaoTeamTask) + '/task/' + item.spacesId,
        logo: taskIcon,
        isPublic: item.access === 'public' ? true : false
      })),
    [makeRouteLink, spaceListData]
  )
  const teamspacesList: LeftSiderMenu[] = useMemo(
    () => [
      {
        title: 'Proposal',
        icon: <Proposal />,
        route: makeRouteLink(routes.Proposal),
        defaultOpen: false
      },
      {
        title: 'Workspace',
        icon: <Workspace />,
        defaultOpen: pathname.includes(makeRouteLink(routes.DaoTeamTask)),
        route: '',
        children: workspaceList
      },
      {
        title: 'Clique Rewards & SBT',
        icon: <Bounty />,
        defaultOpen: false,
        route: makeRouteLink(routes.DaoInfoActivity)
      },
      { title: 'Member', icon: <Member />, defaultOpen: false, route: makeRouteLink(routes.DaoMember) },
      { title: 'About', icon: <About />, defaultOpen: false, route: makeRouteLink(routes.DaoInfoAbout) },
      {
        title: 'Settings',
        icon: <Setting />,
        defaultOpen: false,
        route: makeRouteLink(routes.DaoAboutSetting)
      }
    ],
    [makeRouteLink, pathname, workspaceList]
  )
  const currentTabLinks = useMemo(() => {
    const list =
      myJoinDaoData?.job === DaoAdminLevelProp[1] || myJoinDaoData?.job === DaoAdminLevelProp[0]
        ? teamspacesList
        : teamspacesList.filter(i => i.title !== 'Settings')

    return list
  }, [myJoinDaoData?.job, teamspacesList])
  useEffect(() => {
    if (pathname.includes(makeRouteLink(routes.DaoTeamTask))) {
      setActiveIndex(() => {
        const newItems = [false, true, false, false, false, false]
        return newItems
      })
      setActiveIdx(workspaceList.findIndex(item => item.link === pathname))
    } else {
      setActiveIndex(() => {
        const newItems = [
          pathname.includes(makeRouteLink(routes.Proposal)),
          false,
          pathname === makeRouteLink(routes.DaoInfoActivity),
          pathname === makeRouteLink(routes.DaoMember),
          pathname === makeRouteLink(routes.DaoInfoAbout),
          pathname === makeRouteLink(routes.DaoAboutSetting)
        ]
        return newItems
      })
    }
  }, [makeRouteLink, pathname, workspaceList])

  const IsOpenSided = useMemo(() => {
    if (!isSmDown) {
      return true
    }
    return isOpen
  }, [isOpen, isSmDown])

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
        variant="persistent"
        anchor="left"
        open={IsOpenSided}
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
              {myJoinedDaoList.length === 0 && <EmptyDaoItem />}
              {account &&
                myJoinedDaoList?.map(option => (
                  <Box
                    key={option.daoId + option.daoName}
                    onClick={() => navigate(`${routes._DaoInfo}/${option.daoId}/proposal`)}
                  >
                    <DaoItem {...option} />
                  </Box>
                ))}
            </>
          </PopperCard>
        </Box>
        <div />
        <Box
          gap={10}
          mt={8}
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
          {currentTabLinks.map((item, idx) => (
            <Box
              onClick={() => {
                setActiveIdx(-1)
                setActiveIndex(() => {
                  const newItems = [false, false, false, false, false, false]
                  newItems[idx] = true
                  return newItems
                })
              }}
              key={idx}
              minHeight={50}
              className={activeIndex[idx] ? 'activemenuLink' : ' '}
            >
              <MyCollapse
                hiddenArrow
                bodyPl={0}
                defaultOpen={item.defaultOpen}
                height={50}
                title={
                  <>
                    {item.children ? (
                      <StyledTeamMenu>
                        <Box className={item.route && pathname === item.route ? 'active ParentTitle' : 'ParentTitle'}>
                          {item.icon}
                          <ListItemText primary={item.title} />
                        </Box>
                        <ArrowIcon />
                      </StyledTeamMenu>
                    ) : (
                      <NavLink
                        key={item.title + idx}
                        id={`${item.route}-nav-link`}
                        to={item.route ?? ''}
                        className={(item?.route && pathname.includes(item?.route) ? 'active' : '') + 'menuLink'}
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          flexDirection: 'row',
                          gap: 10,
                          outline: 'none',
                          marginRight: 0,
                          padding: 10,
                          paddingLeft: 20
                        }}
                      >
                        {item.icon}
                        <ListItemText primary={item.title} />
                      </NavLink>
                    )}
                  </>
                }
              >
                {item?.children?.map((item, idx1) => (
                  <List
                    key={idx1}
                    disablePadding
                    style={{ marginRight: 0 }}
                    sx={{
                      cursor: 'pointer',
                      '& .activeChild': {
                        backgroundColor: '#005BC60F'
                      },
                      '&:hover': {
                        backgroundColor: '#F8FBFF'
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
                    <ChildItem
                      className={activeIdx === idx1 ? 'activeChild' : ''}
                      onClick={(e: any) => {
                        if (
                          myJoinDaoData.job === 'owner' ||
                          item.isPublic ||
                          (account &&
                            account.toLocaleLowerCase() === spaceListData[idx1].creator.account.toLocaleLowerCase()) ||
                          (!item.isPublic && myJoinDaoData.privateSpaces[idx1]?.isJoin)
                        ) {
                          setActiveIdx(idx1)
                          navigate(item.link || '')
                          e.stopPropagation()
                        } else if (!item.isPublic && !myJoinDaoData.privateSpaces[idx1]?.isJoin) {
                          return
                        }
                      }}
                    >
                      {item.isPublic ? (
                        <>
                          <Box className={'LBox'}>
                            <Image src={item.logo || ''}></Image>
                            <Typography noWrap>{item.title}</Typography>
                          </Box>
                          <Typography></Typography>
                        </>
                      ) : myJoinDaoData && myJoinDaoData.privateSpaces[idx1]?.isJoin ? (
                        <>
                          <Box className={'LBox'}>
                            <Image src={item.logo || ''}></Image>
                            <Typography noWrap>{item.title}</Typography>
                          </Box>
                          <Typography>🔒</Typography>
                        </>
                      ) : (
                        <>
                          <TooltipStyle
                            isShowIcon
                            value={'Private space, visible only to those invited.'}
                            placement={isSmDown ? 'top' : 'left'}
                          >
                            <Box
                              className={'LBox'}
                              sx={{ cursor: myJoinDaoData.job === 'owner' ? 'pointer' : 'not-allowed' }}
                            >
                              <Image src={item.logo || ''}></Image>
                              <Typography noWrap sx={{ opacity: 0.3 }}>
                                {item.title}
                              </Typography>
                            </Box>
                          </TooltipStyle>
                          <Typography sx={{ opacity: 0.4 }}>🔒</Typography>
                        </>
                      )}
                    </ChildItem>
                  </List>
                ))}
                {item.title === 'Workspace' &&
                (myJoinDaoData?.job === DaoAdminLevelProp[1] || myJoinDaoData?.job === DaoAdminLevelProp[0]) ? (
                  <Box
                    sx={{
                      height: 40,
                      padding: '0 16px 0 60px',
                      gap: 10,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      backgroundColor: '#fff',
                      '&:hover': {
                        backgroundColor: '#F8FBFF'
                      }
                    }}
                    onClick={() => {
                      showModal(
                        <AddTeamspaceModal
                          isEdit={false}
                          daoId={Number(daoId)}
                          onDimiss={() => {
                            updateWrokspaceListData()
                          }}
                        />
                      )
                    }}
                  >
                    <img src={AddIcon} width={14} />
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: 14,
                        lineHeight: '20px',
                        color: '#97B7EF'
                      }}
                    >
                      Add Workspace
                    </Typography>
                  </Box>
                ) : item.title === 'Workspace' ? (
                  <Box
                    sx={{
                      height: 40,
                      padding: '0 16px 0 60px',
                      gap: 10,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      backgroundColor: '#fff'
                    }}
                  >
                    <TooltipStyle isShowIcon value={"This feature is only available to DAO's owner."} placement="right">
                      <Stack flexDirection={'row'} alignItems={'center'} gap={10}>
                        <img src={AddIcon} width={14} height={14} />
                        <Typography
                          sx={{
                            fontWeight: 400,
                            fontSize: 14,
                            lineHeight: '20px',
                            color: '#97B7EF'
                          }}
                        >
                          Add Workspace
                        </Typography>
                      </Stack>
                    </TooltipStyle>
                  </Box>
                ) : null}
              </MyCollapse>
            </Box>
          ))}
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
      {isSmDown && isOpen && (
        <Box
          onClick={() => {
            setSidedStatusCallBack(false)
          }}
          sx={{ height: '100vh', width: '100vw', background: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0 }}
        />
      )}
    </StyledAppBar>
  )
}
