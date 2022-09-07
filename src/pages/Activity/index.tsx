import { Box, ButtonGroup, MenuItem, Typography, styled, Button as MuiButton } from '@mui/material'
import Select from 'components/Select/Select'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { ActivityType } from 'pages/DaoInfo/Children/Activity'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import { useState } from 'react'
import List from './List'

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr',
  '& button': {
    borderWidth: '2px',
    color: theme.palette.text.primary,
    fontWeight: 600,
    height: 36,
    width: 88,
    '&:hover': {
      borderWidth: '2px'
    },
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    }
  }
}))

const typeItemList = [
  { value: undefined, label: 'All types' },
  { value: ActivityType.PUBLIC_SALE, label: ActivityType.PUBLIC_SALE },
  { value: ActivityType.AIRDROP, label: ActivityType.AIRDROP }
]

export enum ActivityStatus {
  SOON = 1,
  OPEN = 2,
  CLOSED = 3
}

const statusItemList = [
  { value: undefined, label: 'All' },
  { value: ActivityStatus.SOON, label: 'Soon' },
  { value: ActivityStatus.OPEN, label: 'Open' },
  { value: ActivityStatus.CLOSED, label: 'Closed' }
]

export default function Activity() {
  const [currentActivityType, setCurrentActivityType] = useState<ActivityType>()
  const [currentStatus, setCurrentStatus] = useState<ActivityStatus>()
  return (
    <Box padding="50px 20px">
      <ContainerWrapper maxWidth={1150}>
        <RowCenter>
          <RowCenter>
            <Typography variant="h5" mr={24}>
              DAO Activity
            </Typography>
            <Select
              placeholder=""
              width={235}
              height={48}
              value={currentActivityType}
              onChange={e => setCurrentActivityType(e.target.value)}
            >
              {typeItemList.map(item => (
                <MenuItem
                  key={item.value}
                  sx={{ fontWeight: 500 }}
                  value={item.value}
                  selected={currentActivityType && currentActivityType === item.value}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </RowCenter>
          <StyledButtonGroup variant="outlined">
            {statusItemList.map(item => (
              <MuiButton
                key={item.label}
                className={currentStatus === item.value ? 'active' : ''}
                onClick={() => setCurrentStatus(item.value)}
              >
                {item.label}
              </MuiButton>
            ))}
          </StyledButtonGroup>
        </RowCenter>
        <List />
      </ContainerWrapper>
    </Box>
  )
}
