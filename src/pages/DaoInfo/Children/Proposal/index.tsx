import { Box, Grid, MenuItem } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import Select from 'components/Select/Select'
import { ProposalStatus } from 'hooks/useProposalInfo'
import { useState } from 'react'
import ProposalItem from './ProposalItem'
import { useHistory, useParams } from 'react-router'
import { routes } from 'constants/routes'

const itemList = [
  { value: undefined, label: 'All proposals' },
  { value: ProposalStatus.SOON, label: 'Soon' },
  { value: ProposalStatus.OPEN, label: 'Open' },
  { value: ProposalStatus.CLOSED, label: 'Closed' }
]

export default function Proposal() {
  const [currentProposalStatus, setCurrentProposalStatus] = useState<ProposalStatus>()
  const history = useHistory()
  const params = useParams<{ chainId: string; address: string }>()

  return (
    <ContainerWrapper maxWidth={1248}>
      <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
        <BlackButton
          width="252px"
          onClick={() => history.push(routes._DaoInfo + `/${params.chainId}/${params.address}/proposal/create`)}
        >
          + Create a proposal
        </BlackButton>
        <Select
          placeholder=""
          width={235}
          value={currentProposalStatus}
          onChange={e => setCurrentProposalStatus(e.target.value)}
        >
          {itemList.map(item => (
            <MenuItem
              key={item.value}
              sx={{ fontWeight: 500 }}
              value={item.value}
              selected={currentProposalStatus && currentProposalStatus === item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box mt={17}>
        <Grid container rowSpacing={18} columnSpacing={34}>
          {[1, 2, 3, 4].map(v => (
            <Grid item key={v} lg={6} xs={12}>
              <ProposalItem />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ContainerWrapper>
  )
}
