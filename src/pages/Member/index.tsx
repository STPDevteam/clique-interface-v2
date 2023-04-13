import { Box, Typography, styled, Tabs, Tab, Divider } from '@mui/material'
import { ReactComponent as MemberIcon } from 'assets/svg/member.svg'
import Button from 'components/Button/Button'
// import Image from 'components/Image'
import { ReactComponent as View } from 'assets/svg/view.svg'
import { ReactComponent as Job } from 'assets/svg/job.svg'
import { ReactComponent as Invite } from 'assets/svg/invite.svg'
import { useState } from 'react'
import CardView from './Children/CardView'
import JobApplication from './Children/JobApplication'
import InviteUser from './Children/InviteUser'

const StyledTabs = styled('div')(({ theme }) => ({
  display: 'flex',
  fontWeight: 600,
  fontSize: 14,
  listStyle: 'none',
  padding: 0,
  '&>*': {
    marginRight: 60,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    color: '#0049c6',
    cursor: 'pointer',
    '&:hover': {
      color: '#0049c6'
    },
    '&.active': {
      color: '#0049c6'
    }
  },
  '& .css-1jxw4rn-MuiTabs-indicator': {
    width: '0!important'
  },
  '& button': {
    display: 'flex',
    alignItems: 'center',
    border: 0,
    '&:hover': {
      color: '#0049c6'
    },
    '&:hover svg path': {
      fill: '#0049c6'
    },
    '&.active svg path': {
      fill: '#0049c6'
    }
  },
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'space-evenly',
    '&>*': {
      marginRight: 0,
      '&:last-child': {
        marginRight: 0
      }
    }
  }
}))

const tabList = [
  {
    label: 'Card View',
    icon: <View />
  },
  {
    label: 'Job Application',
    icon: <Job />
  },
  {
    label: 'Invite User',
    icon: <Invite />
  }
]

export default function Member() {
  const [tabValue, setTabValue] = useState(0)

  return (
    <Box
      sx={{
        margin: '0 auto'
      }}
    >
      <Box display={'flex'} justifyContent={'space-between'} flexDirection={'row'} alignItems={'center'}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            mb: 20,
            '& svg path': {
              fill: '#0049C6'
            },
            '& p': {
              fontWeight: 600,
              fontSize: 30,
              textAlign: 'left',
              color: '#3f5170'
            }
          }}
        >
          <MemberIcon />
          <Typography>Member</Typography>
        </Box>
        <Button width="125px" height="36px" borderRadius="8px">
          + Add Member
        </Button>
      </Box>
      <Typography
        variant="h5"
        sx={{
          width: '700px',
          textAlign: 'left',
          color: '#3f5170',
          fontSize: 14
        }}
      >
        Manage members here, add them by address, and define roles for them. Make sure to turn on your notifications to
        receive information about new openings.
      </Typography>
      <StyledTabs>
        <Tabs value={tabValue}>
          {tabList.map((item, idx) => (
            <Tab
              key={item.label + idx}
              icon={item.icon}
              iconPosition="start"
              label={item.label}
              onClick={() => setTabValue(idx)}
              sx={{ gap: 10 }}
              className={tabValue === idx ? 'active' : ''}
            ></Tab>
          ))}
        </Tabs>
      </StyledTabs>
      <Divider />
      {tabValue === 0 ? <CardView /> : tabValue === 1 ? <JobApplication /> : <InviteUser />}
    </Box>
  )
}
