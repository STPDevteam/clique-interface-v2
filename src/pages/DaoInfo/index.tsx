import { Avatar, Box, Link, styled, Typography, useTheme } from '@mui/material'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { getEtherscanLink } from 'utils'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import { useState } from 'react'

const StyledHeader = styled(Box)(({ theme }) => ({
  borderRadius: theme.borderRadius.default,
  minHeight: 138,
  background: theme.palette.common.white,
  boxShadow: theme.boxShadow.bs2,
  padding: '30px 45px 0',
  '& .top1': {
    display: 'grid',
    gridTemplateColumns: '100px 1fr'
  }
}))

const StyledTabs = styled('ul')(({ theme }) => ({
  display: 'flex',
  fontWeight: 600,
  fontSize: 14,
  listStyle: 'none',
  padding: 0,
  marginTop: 20,
  li: {
    padding: '15px 0',
    marginRight: 60,
    color: theme.palette.text.secondary,
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.common.black
    },
    '&.active': {
      color: theme.palette.common.black
    }
  }
}))

enum Tabs {
  PROPOSAL = 'Proposal',
  ACTIVITY = 'Activity',
  ABOUT = 'About',
  SETTINGS = 'Settings'
}
const tabLinks = Object.values(Tabs)

export default function DaoInfo() {
  const theme = useTheme()
  const [currentTab, setCurrentTab] = useState(Tabs.PROPOSAL)

  return (
    <Box padding="0 20px">
      <ContainerWrapper maxWidth={1248}>
        <StyledHeader>
          <div className="top1">
            <Avatar sx={{ width: 100, height: 100 }} src={''}></Avatar>
            <Box ml={'24px'}>
              <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
                <Box display="flex" alignItems={'center'} gap="5px" marginBottom={5}>
                  <Typography variant="h5" mt={5}>
                    Dao name
                  </Typography>
                  {/* <VerifiedTag address={daoInfo?.daoAddress} /> */}
                </Box>
                <Box display={'flex'} alignItems="center">
                  <Typography mr={5} variant="caption" color={theme.palette.text.secondary}>
                    Members
                  </Typography>
                  <Typography variant="caption">4,532</Typography>
                </Box>
              </Box>
              <Box display={'flex'} justifyContent="space-between" mb={6}>
                <Link target={'_blank'} underline="none" href={getEtherscanLink(1, '', 'address')}>
                  USDT
                </Link>
                <Box display={'flex'} alignItems="center">
                  <Link target={'_blank'} href={''} underline="none" ml={10}>
                    <Twitter />
                  </Link>
                  <Link target={'_blank'} href={''} underline="none" ml={10}>
                    <Discord />
                  </Link>
                  <Link fontSize={12} target={'_blank'} href={''} underline="none" ml={10}>
                    https://google.com
                  </Link>
                </Box>
              </Box>
              <Typography color={theme.palette.text.secondary}>
                Build decentralized automated organization, Build decentralized automated organization...
              </Typography>
              {/* <Button className={'btn-common btn-01'}>Join</Button> */}
            </Box>
          </div>

          <StyledTabs>
            {tabLinks.map(item => (
              <li
                key={item}
                onClick={() => setCurrentTab(item)}
                className={`border-tab-item ${currentTab === item ? 'active' : ''}`}
              >
                {item}
              </li>
            ))}
          </StyledTabs>
        </StyledHeader>
      </ContainerWrapper>
    </Box>
  )
}
