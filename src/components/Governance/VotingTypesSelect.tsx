import Select from 'components/Select/Select'
import { MenuItem } from '@mui/material'
import { VotingTypes, VotingTypesName } from 'state/buildingGovDao/actions'

const itemList = [
  { value: VotingTypes.ANY, label: VotingTypesName[VotingTypes.ANY] },
  { value: VotingTypes.SINGLE, label: VotingTypesName[VotingTypes.SINGLE] },
  { value: VotingTypes.MULTI, label: VotingTypesName[VotingTypes.MULTI] }
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
    <Select noBold placeholder="" label="*Voting Types" width={width || 163} value={value} onChange={onChange}>
      {itemList.map(item => (
        <MenuItem key={item.value} sx={{ fontWeight: 500 }} value={item.value} selected={value === item.value}>
          {item.label}
        </MenuItem>
      ))}
    </Select>
  )
}
