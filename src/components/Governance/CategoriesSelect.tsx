import Select from 'components/Select/Select'
import { MenuItem, Theme } from '@mui/material'
import { CategoriesTypeProp } from 'state/buildingGovDao/actions'
import { SxProps } from '@mui/system'
import { useMemo } from 'react'

const itemList = Object.values(CategoriesTypeProp)
  .map(item => ({
    value: item,
    label: item
  }))
  .filter(item => item.value !== CategoriesTypeProp.ALL)

export default function CategoriesSelect({
  value,
  onChange,
  style
}: {
  value?: string
  onChange?: (val: string) => void
  style?: React.CSSProperties | SxProps<Theme>
}) {
  const currentValues = useMemo(() => value?.split(',') || [], [value])
  return (
    <Select
      multiple
      style={style}
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
