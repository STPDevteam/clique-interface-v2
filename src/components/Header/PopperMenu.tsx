import { Box, Typography } from '@mui/material'
import { ReactComponent as ShowDropDown } from 'assets/svg/moreMenuIcon.svg'
import { ReactComponent as DaosIcon } from 'assets/svg/daosIcon.svg'
// import { ReactComponent as RewardsIcon } from 'assets/svg/rewardsIcon.svg'
import { ReactComponent as SdkIcon } from 'assets/svg/sdkIcon.svg'
import { ReactComponent as BugIcon } from 'assets/svg/bugIcon.svg'
import PopperCard from 'components/PopperCard'
import { routes } from 'constants/routes'
import { useHistory } from 'react-router-dom'

const menuList = [
  {
    title: 'DAOs',
    icon: <DaosIcon />,
    route: routes.Governance
  },
  // {
  //   title: 'Rewards',
  //   icon: <RewardsIcon />,
  //   route: routes.Activity
  // },
  {
    title: 'Dapp Store',
    icon: <SdkIcon />,
    route: routes.DappStore
  },
  {
    title: 'Bug Bounty',
    icon: <BugIcon />,
    link: 'https://immunefi.com/bounty/stp/'
  }
]

export default function PopperMenu() {
  const history = useHistory()
  return (
    <Box>
      <PopperCard
        sx={{
          marginTop: 13,
          maxHeight: '50vh',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
        placement="bottom-start"
        targetElement={
          <Box
            flexDirection={'row'}
            display={'flex'}
            sx={{
              cursor: 'pointer',
              '& svg': {
                width: 36,
                height: 36
              },
              '& svg:hover path': {
                fill: '#0049C6'
              },
              '& svg:hover rect': {
                stroke: '#97B7EF'
              }
            }}
            alignItems={'center'}
          >
            <ShowDropDown />
          </Box>
        }
      >
        <>
          {menuList.map(option => (
            <Box
              sx={{
                width: 150,
                height: 40,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#0049C60D',
                  colorr: '#0049C6'
                },
                '&:hover svg path': {
                  fill: '#0049C6'
                },
                '&:hover p': {
                  color: '#0049C6'
                }
              }}
              key={option.title}
              onClick={() => (option.route ? history.push(option.route) : window.open(option.link, '_blank'))}
            >
              {option.icon}
              <Typography fontWeight={500} fontSize={14}>
                {option.title}
              </Typography>
            </Box>
          ))}
        </>
      </PopperCard>
    </Box>
  )
}
