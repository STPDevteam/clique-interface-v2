import { Box, Typography, styled, Divider, MenuList, MenuItem } from '@mui/material'
import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ChainId } from 'constants/chain'
import DaoInfoAbout from 'pages/DaoInfo/Children/About'
import Header from './AboutHeader'
import GovernanceSetting from 'pages/DaoInfo/Children/Settings/GovernanceSetting'
import { useDaoInfo } from 'hooks/useDaoInfo'
// import ComingSoon from 'pages/ComingSoon'
import General from 'pages/DaoInfo/Children/Settings/General'

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  width: 'fit-content',
  margin: '16px 40px 8px 0',
  padding: '0 14px 0 0',
  fontSize: 14,
  fontWeight: 500,
  color: theme.palette.text.secondary,
  lineHeight: '26px',
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
  [theme.breakpoints.down('sm')]: {
    margin: '0'
  }
}))

export default function AboutSetting() {
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const [tabValue, setTabValue] = useState(0)
  const curDaoChainId = Number(daoChainId) as ChainId
  const daoInfo = useDaoInfo(daoAddress, curDaoChainId)

  const tabList = useMemo(() => {
    return [
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
        label: 'Governance settings',
        component: (
          <Box mt={20}>
            <GovernanceSetting daoInfo={daoInfo} daoChainId={curDaoChainId} />
          </Box>
        )
      },
      // {
      //   label: 'Teamspaces',
      //   component: <ComingSoon />
      // },
      // {
      //   label: 'Member',
      //   component: <ComingSoon />
      // },
      {
        label: 'About',
        component: (
          <>
            <Header />
            <DaoInfoAbout />
          </>
        )
      }
    ]
  }, [curDaoChainId, daoInfo])
  return (
    <Box
      sx={{
        margin: '40px 110px',
        minWidth: 942
      }}
    >
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
            alignItems: 'center',
            mb: 20
          }}
        >
          <Typography fontFamily={'Inter'} fontSize={30} lineHeight={'20px'} color={'#3f5170'} fontWeight={600}>
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
        {tabList.map(({ label }, index) => (
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
      {tabList[tabValue]?.component}
    </Box>
  )
}
