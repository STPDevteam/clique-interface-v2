import { Box, Typography, styled, Divider, MenuList, MenuItem } from '@mui/material'
import { ReactComponent as View } from 'assets/svg/view.svg'
import { ReactComponent as Job } from 'assets/svg/job.svg'
import { ReactComponent as Invite } from 'assets/svg/invite.svg'
import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ChainId } from 'constants/chain'

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  margin: '16px 0 8px',
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

export default function Member() {
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const [tabValue, setTabValue] = useState(0)
  const curDaoChainId = Number(daoChainId) as ChainId

  console.log(curDaoChainId, daoAddress)

  const tabList = useMemo(() => {
    return [
      {
        label: 'General',
        component: <View />
      },
      {
        label: 'Token',
        component: <Job />
      },
      {
        label: 'Governance settings',
        component: <Invite />
      },
      {
        label: 'Teamspaces',
        component: <Job />
      },
      {
        label: 'Member',
        component: <Invite />
      },
      {
        label: 'About',
        component: <Job />
      }
    ]
  }, [])
  return (
    <Box
      sx={{
        margin: '40px 110px'
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
          gridTemplateColumns: { sm: '1fr 1fr 1fr 1fr 1fr 1fr', xs: 'unset' },
          display: 'grid'
          // flexDirection: 'row',
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
