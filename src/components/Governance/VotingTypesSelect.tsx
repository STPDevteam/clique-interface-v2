import Select from 'components/Select/Select'
import { MenuItem } from '@mui/material'
import { VotingTypes } from 'state/buildingGovDao/actions'

const itemList = [
  { value: VotingTypes.ANY, label: 'Any' },
  { value: VotingTypes.SINGLE, label: 'Single-voting' },
  { value: VotingTypes.MULTI, label: 'Multi-voting' }
]

export default function VotingTypesSelect({
  value,
  onChange,
  width
}: {
  value?: VotingTypes
  onChange?: (e: any) => void
  width?: number
}) {
  return (
    <Select placeholder="" label="*Voting types" width={width || 163} value={value} onChange={onChange}>
      {itemList.map(item => (
        <MenuItem key={item.value} sx={{ fontWeight: 500 }} value={item.value} selected={value === item.value}>
          {item.label}
        </MenuItem>
      ))}
    </Select>
  )
}
