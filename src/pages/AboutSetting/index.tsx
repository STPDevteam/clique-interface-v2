import { Box, Typography, styled, Divider, MenuList, MenuItem } from '@mui/material'
import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import DaoInfoAbout from 'pages/DaoInfo/Children/About'
import Header from './AboutHeader'
// import GovernanceSetting from 'pages/DaoInfo/Children/Settings/GovernanceSetting'
import Governance from 'pages/DaoInfo/Children/Settings/Governance'
import { DaoAdminLevelProp } from 'hooks/useDaoInfo'
// import ComingSoon from 'pages/ComingSoon'
import NewGeneral from 'pages/DaoInfo/Children/Settings/NewGeneral'
import Workspace from 'pages/DaoInfo/Children/Settings/Workspace'
// import Admin from 'pages/DaoInfo/Children/Settings/Admin'
import DaoContainer from 'components/DaoContainer'
import Team from './Team'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { useIsJoined } from 'hooks/useBackedDaoServer'

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
  const { daoId: curDaoId } = useParams<{ daoId: string }>()
  const [tabValue, setTabValue] = useState(0)
  const daoInfo = useSelector((state: AppState) => state.buildingGovernanceDao.createDaoData)
  const { isJoined: daoAuthData } = useIsJoined(Number(curDaoId))

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
      // {
      //   label: 'General',
      //   component: daoInfo ? (
      //     <Box mt={20}>
      //       <General daoInfo={daoInfo} daoChainId={daoId} />
      //     </Box>
      //   ) : null
      // },
      {
        label: 'General',
        component: daoInfo ? (
          <Box mt={20}>
            <NewGeneral daoInfo={daoInfo} daoChainId={Number(curDaoId)} />
          </Box>
        ) : null
      },
      // {
      //   label: 'Governance Settings',
      //   component: (
      //     <Box mt={20}>
      //       <GovernanceSetting daoInfo={daoInfo} daoChainId={Number(curDaoId)} />
      //     </Box>
      //   )
      // },
      {
        label: 'Governance',
        component: daoInfo ? (
          <Box mt={14}>
            <Governance daoInfo={daoInfo} daoId={Number(curDaoId)} />
          </Box>
        ) : null
      },
      {
        label: 'Workspace',
        component: daoInfo ? (
          <Box mt={20}>
            <Workspace daoInfo={daoInfo} daoId={Number(curDaoId)} />
          </Box>
        ) : null
      },
      {
        label: 'Team',
        component: (
          <Box mt={20}>
            <Team />
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
  }, [curDaoId, daoInfo])

  const currentTabLinks = useMemo(() => {
    const list =
      daoAuthData?.job === DaoAdminLevelProp.SUPER_ADMIN || daoAuthData?.job === DaoAdminLevelProp.OWNER
        ? tabList
        : daoAuthData?.job === DaoAdminLevelProp.ADMIN
        ? tabList.filter(i => ['About', 'General', 'Governance Settings'].includes(i.label))
        : tabList.filter(i => i.label === 'About')

    return list
  }, [daoAuthData?.job, tabList])

  return (
    <DaoContainer>
      <Box>
        <Box
          sx={{
            mb: 30,
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
