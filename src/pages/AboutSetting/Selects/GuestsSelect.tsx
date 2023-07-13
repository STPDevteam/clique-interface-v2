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

export default function GuestsSelect({
  value,
  onChange,
  placeholder,
  style
}: {
  value?: string
  onChange?: (val: string) => void
  placeholder?: string
  style?: React.CSSProperties | SxProps<Theme>
}) {
  const currentValues = useMemo(() => value?.split(',') || [], [value])
  return (
    <Select
      multiple
      noBold
      style={style}
      placeholder={placeholder ? placeholder : ''}
      label="Guests"
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
