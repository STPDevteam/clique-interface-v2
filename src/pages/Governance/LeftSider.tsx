import { AppBar, Box, Drawer, List, ListItemText, MenuItem, styled, Typography } from '@mui/material'
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
// import magnifier from 'assets/images/magnifier.png'
// import { ReactComponent as AddIcon } from 'assets/svg/add_icon.svg'
// import { ReactComponent as SearchIcon } from 'assets/svg/search_icon.svg'
// import { routes } from 'constants/routes'
// import useModal from 'hooks/useModal'
// import { useHistory } from 'react-router-dom'
// import { CreateGovernanceModal } from 'components/Governance/CreateGovernanceModal'
// import { useDaoBaseInfo } from 'hooks/useDaoInfo'
// import { useMyJoinedDao } from 'hooks/useBackedDaoServer'
// import { ChainId } from 'constants/chain'
// import { DaoAvatars } from 'components/Avatars'

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

// const Text = styled(Typography)(({ theme }) => ({
//   width: 64,
//   fontSize: 12,
//   fontWeight: 500,
//   marginTop: 6,
//   lineHeight: '20px',
//   textAlign: 'center',
//   color: theme.palette.text.secondary
// }))

// const Item = styled(Box)(({ theme }) => ({
//   display: 'grid',
//   justifyItems: 'center',
//   cursor: 'pointer',
//   marginBottom: 16,
//   '& .action': {
//     width: 48,
//     height: 48,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: '16px',
//     transition: 'all 0.5s',
//     '&:hover': {
//       backgroundColor: theme.palette.primary.main,
//       '& svg path': {
//         fill: '#fff'
//       }
//     }
//   }
// }))
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
  // const theme = useTheme()
  // const { showModal } = useModal()
  // const history = useHistory()
  // const { result: myJoinedDaoList } = useMyJoinedDao()
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

      {/* <Box
        className="dao-box"
        sx={{
          display: { sm: 'block', xs: 'inline-flex' }
        }}
      >
        {myJoinedDaoList.map(({ daoAddress, chainId, daoName }) => (
          <DaoItem key={daoAddress + chainId} chainId={chainId} daoName={daoName} daoAddress={daoAddress} />
        ))}
      </Box>
      <Box
        sx={{
          display: { sm: 'block', xs: 'inline-flex' },
          justifyContent: { xs: 'flex-end', sm: undefined }
        }}
      >
        <Box mt={10} sx={{ background: theme.bgColor.bg2, marginBottom: 16, height: '1px' }} />
        <Item
          sx={{ borderLeft: { sm: 'none', xs: `1px solid ${theme.bgColor.bg2}` } }}
          onClick={() => history.push(routes.Governance)}
        >
          <div className="action">
            <SearchIcon></SearchIcon>
          </div>
          <Text mt={'0 !important'} noWrap>
            Search
          </Text>
        </Item>
        <Item onClick={() => showModal(<CreateGovernanceModal />)}>
          <div className="action">
            <AddIcon width={16}></AddIcon>
          </div>
          <Text mt={'0 !important'} noWrap>
            Add DAO
          </Text>
        </Item>
      </Box> */}
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
