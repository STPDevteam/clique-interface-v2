import { Box, Typography, styled, Divider, MenuList, MenuItem } from '@mui/material'
import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ChainId } from 'constants/chain'
import DaoInfoAbout from 'pages/DaoInfo/Children/About'
import Header from './AboutHeader'
import GovernanceSetting from 'pages/DaoInfo/Children/Settings/GovernanceSetting'
import { DaoAdminLevelProp, useDaoAdminLevel, useDaoInfo } from 'hooks/useDaoInfo'
// import ComingSoon from 'pages/ComingSoon'
import General from 'pages/DaoInfo/Children/Settings/General'
import { useActiveWeb3React } from 'hooks'
import Admin from 'pages/DaoInfo/Children/Settings/Admin'
import DaoContainer from 'components/DaoContainer'
import Team from './Team'

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  width: 'fit-content',
  margin: '22px 40px 8px 0',
  padding: '0 14px 0 0',
  fontSize: 14,
  fontWeight: 500,
  color: theme.palette.text.secondary,
  lineHeight: '14px',
  position: 'relative',
  '&.active': {
    color: '#0049C6',
    fontWeight: 700,
    '&:before': {
      content: `''`,
      position: 'absolute',
      bottom: 0,
      top: 0,
      left: 0,
      backgroundColor: theme.palette.text.primary
    }
  },
  '& ,MuiMenuItem-root:hover': {
    backgroundColor: 'unset !important'
  },
  [theme.breakpoints.down('sm')]: {
    margin: '0'
  }
}))

export default function AboutSetting() {
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const { account } = useActiveWeb3React()
  const [tabValue, setTabValue] = useState(0)
  const curDaoChainId = Number(daoChainId) as ChainId
  const daoInfo = useDaoInfo(daoAddress, curDaoChainId)
  const daoAdminLevel = useDaoAdminLevel(daoAddress, curDaoChainId, account || undefined)

  const tabList = useMemo(() => {
    return [
      {
        label: 'About',
        component: (
          <>
            <Header />
            <DaoInfoAbout />
          </>
        )
      },
      {
        label: 'General',
        component: daoInfo ? (
          <Box mt={20}>
            <General daoInfo={daoInfo} daoChainId={curDaoChainId} />
          </Box>
        ) : null
      },
      // {
      //   label: 'Token',
      //   component: <ComingSoon />
      // },
      {
        label: 'Governance Settings',
        component: (
          <Box mt={20}>
            <GovernanceSetting daoInfo={daoInfo} daoChainId={curDaoChainId} />
          </Box>
        )
      },
      {
        label: 'Team',
        component: (
          <Box mt={20}>
            <Team />
          </Box>
        )
      },
      {
        label: 'Admin',
        component: (
          <Box mt={20}>
            <Admin />
          </Box>
        )
      }
      // {
      //   label: 'Teamspaces',
      //   component: <ComingSoon />
      // },
      // {
      //   label: 'Member',
      //   component: <ComingSoon />
      // },
    ]
  }, [curDaoChainId, daoInfo])

  const currentTabLinks = useMemo(() => {
    const list =
      daoAdminLevel === DaoAdminLevelProp.SUPER_ADMIN || daoAdminLevel === DaoAdminLevelProp.ADMIN
        ? tabList
        : tabList.filter(i => i.label === 'About')

    return list
  }, [daoAdminLevel, tabList])

  return (
    <DaoContainer>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            '& button': {
              width: 125,
              height: 36,
              borderRadius: '8px'
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography fontSize={30} lineHeight={'20px'} color={'#3f5170'} fontWeight={600}>
              ⚙️ About & Setting
            </Typography>
          </Box>
        </Box>
        <MenuList
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'row'
          }}
        >
          {currentTabLinks.map(({ label }, index) => (
            <StyledMenuItem
              key={label}
              onClick={() => setTabValue(index)}
              className={`${index === tabValue ? 'active' : ''}`}
            >
              {label}
            </StyledMenuItem>
          ))}
        </MenuList>
        <Divider />
        {currentTabLinks[tabValue]?.component}
      </Box>
    </DaoContainer>
  )
}
