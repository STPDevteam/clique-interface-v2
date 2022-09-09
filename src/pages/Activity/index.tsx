import { Box, ButtonGroup, MenuItem, Typography, styled, Button as MuiButton } from '@mui/material'
import Select from 'components/Select/Select'
import { ActivityStatus } from 'hooks/useActivityInfo'
import { useActivityList } from 'hooks/useBackedActivityServer'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { ActivityType } from 'pages/DaoInfo/Children/Activity'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
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

const statusItemList = [
  { value: undefined, label: 'All' },
  { value: ActivityStatus.SOON, label: 'Soon' },
  { value: ActivityStatus.OPEN, label: 'Open' },
  { value: ActivityStatus.CLOSED, label: 'Closed' }
]

export default function Activity() {
  const { search, loading, result, page } = useActivityList()

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
              value={search.types}
              onChange={e => search.setTypes(e.target.value)}
            >
              {typeItemList.map((item, index) => (
                <MenuItem
                  key={index}
                  sx={{ fontWeight: 500 }}
                  value={item.value}
                  selected={search.types && search.types === item.value}
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
                className={search.status === item.value ? 'active' : ''}
                onClick={() => search.setStatus(item.value)}
              >
                {item.label}
              </MuiButton>
            ))}
          </StyledButtonGroup>
        </RowCenter>
        <List loading={loading} page={page} result={result} />
      </ContainerWrapper>
    </Box>
  )
}
