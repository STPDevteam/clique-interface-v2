import { Box, Drawer, List, ListItemText, MenuItem, styled, Typography } from '@mui/material'
import { NavLink, useLocation } from 'react-router-dom'
import proposal from 'assets/images/proposal.png'
import treasury from 'assets/images/treasury.png'
import Idea from 'assets/images/Idea.png'
import bounty from 'assets/images/bounty.png'
import member from 'assets/images/member.png'
import setting from 'assets/images/setting.png'
import stp from 'assets/images/stp.png'
import { routes } from 'constants/routes'
import Image from 'components/Image'
// import Input from 'components/Input'
import robot from 'assets/images/robot.png'
import ele from 'assets/images/ele.png'
import trash from 'assets/images/trash.png'
import PlainSelect from 'components/Select/PlainSelect'
import { ExternalLink } from 'theme/components'

const Wrapper = styled('div')(({ theme }) => ({
  borderRight: `1px solid ${theme.bgColor.bg2}`,
  // height: `calc(100vh - ${theme.height.header} - 48px)`,
  // overflowY: 'auto',
  padding: '16px 8px',
  // '&::-webkit-scrollbar': {
  //   display: 'none'
  // },
  [theme.breakpoints.up('sm')]: {
    '& .dao-box': {
      overflowY: 'auto',
      height: `calc(100vh - ${theme.height.header} - 48px - 210px)`,
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    }
  },
  [theme.breakpoints.down('sm')]: {
    display: 'grid',
    gridTemplateColumns: '1fr 138px',
    borderRight: 0,
    padding: '10px 16px',
    height: 84,
    '& .dao-box': {
      overflowY: 'hidden',
      overflowX: 'auto',
      height: '84px',
      width: `calc(100vw - 32px - 138px)`,
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    }
  }
}))

const StyledAppBar = styled(Box)(({ theme }) => ({
  position: 'fixed',
  boxShadow: 'inset 0px -1px 0px #E4E4E4',
  padding: '0 40px',
  zIndex: theme.zIndex.drawer,

  '& .menuLink': {
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
  },
  '.activemenuLink': {
    textDecoration: 'none',
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.primary.main,
    marginRight: 30,
    fontWeight: 600,
    padding: '16px',
    backgroundColor: 'rgba(0, 91, 198, 0.06)'
  }
}))

const menuList = [
  {
    text: 'Proposal',
    icon: proposal,
    route: routes.Governance
  },
  {
    text: 'Treasury',
    icon: treasury,
    route: routes._DaoInfo
  },
  {
    text: 'Idea',
    icon: Idea,
    route: routes._DaoInfo
  },
  {
    text: 'Bounty',
    icon: bounty,
    route: routes._DaoInfo
  },
  {
    text: 'Member',
    icon: member,
    route: routes._DaoInfo
  },
  {
    text: 'About & Settings',
    icon: setting,
    route: routes._DaoInfo
  }
]

const teamspacesList = [
  {
    text: 'Genernal',
    icon: robot,
    children: [
      { title: 'Meetings', link: '', icon: robot },
      { title: 'Docs', link: '', icon: robot },
      { title: 'Task', link: '', icon: robot },
      { title: 'Calendar', link: '', icon: robot }
    ]
  },
  {
    text: 'Game',
    icon: ele,
    children: []
  },
  {
    text: 'Trash',
    icon: trash
  }
]

export default function LeftSider() {
  const { pathname } = useLocation()

  return (
    <Wrapper>
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
                <Image width={30} src={item.icon} alt={'logo'} style={{ marginRight: 10 }} />
                <ListItemText primary={item.text} />
              </NavLink>
            ))}
          </List>
          <Box display={'flex'} justifyContent={'flex-start'} flexDirection={'row'} alignItems={'center'} gap={10}>
            <Typography
              variant="h5"
              textAlign={'left'}
              fontSize={16}
              sx={{ color: theme => theme.palette.text.secondary, paddingLeft: 24 }}
            >
              Teamspaces
            </Typography>
          </Box>
          <List>
            {teamspacesList.map((item, idx) => (
              <PlainSelect
                key={item.text + idx}
                placeholder={item.text}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  gap: 10,
                  marginRight: 0,
                  paddingLeft: 20
                }}
              >
                {item.children
                  ? item.children.map((sub, i) => (
                      <MenuItem
                        key={sub.title + i}
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
                          {sub.title}
                        </ExternalLink>
                      </MenuItem>
                    ))
                  : ''}
              </PlainSelect>
            ))}
          </List>
        </Drawer>
      </StyledAppBar>
    </Wrapper>
  )
}

// function DaoItem({ chainId, daoAddress, daoName }: { chainId: ChainId; daoAddress: string; daoName: string }) {
//   const history = useHistory()
//   const daoBaseInfo = useDaoBaseInfo(daoAddress, chainId)

//   return (
//     <Item onClick={() => history.push(`${routes._DaoInfo}/${chainId}/${daoAddress}`)}>
//       <DaoAvatars src={daoBaseInfo?.daoLogo} alt={daoBaseInfo?.name || daoName} />
//       <Text noWrap>{daoBaseInfo?.name || daoName}</Text>
//     </Item>
//   )
// }
