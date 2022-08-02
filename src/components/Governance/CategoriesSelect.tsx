import Select from 'components/Select/Select'
import { MenuItem } from '@mui/material'
import { CategoriesTypeProp } from 'state/buildingGovDao/actions'
import { useMemo } from 'react'

const itemList = Object.values(CategoriesTypeProp).map(item => ({
  value: item,
  label: item
}))

export default function CategoriesSelect({ value, onChange }: { value?: string; onChange?: (val: string) => void }) {
  const currentValues = useMemo(() => value?.split(',') || [], [value])
  return (
    <Select
      multiple
      placeholder="Categories"
      label="*Categories (Multi-select)"
      value={currentValues}
      onChange={e => onChange && onChange(e.target.value?.filter((i: string) => i)?.join(',') || '')}
    >
      {itemList.map(item => (
        <MenuItem key={item.value} sx={{ fontWeight: 500 }} value={item.value} selected={value?.includes(item.value)}>
          {item.label}
        </MenuItem>
      ))}
    </Select>
  )
}
