import { Box, Typography, styled, Divider, MenuList, MenuItem } from '@mui/material'
import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
// import DaoInfoAbout from 'pages/DaoInfo/Children/About'
// import Header from './AboutHeader'
// import GovernanceSetting from 'pages/DaoInfo/Children/Settings/GovernanceSetting'
import Governance from 'pages/DaoInfo/Children/Settings/Governance'
import { DaoAdminLevelProp } from 'hooks/useDaoInfo'
// import ComingSoon from 'pages/ComingSoon'
import NewGeneral from 'pages/DaoInfo/Children/Settings/NewGeneral'
import Workspace from 'pages/DaoInfo/Children/Settings/Workspace'
// import Admin from 'pages/DaoInfo/Children/Settings/Admin'
import DaoContainer from 'components/DaoContainer'
import Team from './Team'
import Setting from 'assets/images/settingImg.png'
import Image from 'components/Image'
// import { useIsJoined } from 'hooks/useBackedDaoServer'
import { useBuildingDaoDataCallback, useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
import { useActiveWeb3React } from 'hooks'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useUserInfo } from 'state/userInfo/hooks'

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
  const { account } = useActiveWeb3React()
  const userSignature = useUserInfo()
  const history = useHistory()
  const [tabValue, setTabValue] = useState(0)
  const { buildingDaoData: daoInfo } = useBuildingDaoDataCallback()
  // const { isJoined: myJoinDaoData } = useIsJoined(Number(curDaoId))
  const { myJoinDaoData } = useUpdateDaoDataCallback()
  const tabList = useMemo(() => {
    return [
      // {
      //   label: 'About',
      //   component: (
      //     <>
      //       <Header />
      //       <DaoInfoAbout />
      //     </>
      //   )
      // },
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
            <Governance daoId={Number(curDaoId)} />
          </Box>
        ) : null
      },
      {
        label: 'Workspace',
        component: daoInfo ? (
          <Box mt={20}>
            <Workspace daoId={Number(curDaoId)} />
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
      myJoinDaoData?.job === DaoAdminLevelProp[1] || myJoinDaoData?.job === DaoAdminLevelProp[0]
        ? tabList
        : tabList.filter(i => i.label === 'About')

    return list
  }, [myJoinDaoData?.job, tabList])
  useEffect(() => {
    if (
      myJoinDaoData?.job !== DaoAdminLevelProp[1] ||
      myJoinDaoData?.job !== DaoAdminLevelProp[0] ||
      myJoinDaoData?.job !== DaoAdminLevelProp[2]
    ) {
      return setTabValue(0)
    }
  }, [myJoinDaoData?.job])
  useEffect(() => {
    if (
      !account ||
      !userSignature ||
      (myJoinDaoData?.job !== DaoAdminLevelProp[1] && myJoinDaoData?.job !== DaoAdminLevelProp[0])
    ) {
      history.replace(routes._DaoInfo + `/${curDaoId}/proposal`)
    }
  }, [account, history, myJoinDaoData?.job, userSignature, curDaoId])

  return (
    <DaoContainer>
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Image src={Setting} width={38} />
          <Typography fontSize={30} lineHeight={'20px'} color={'#3f5170'} fontWeight={600}>
            Settings
          </Typography>
        </Box>
        <MenuList
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            paddingTop: 0
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
