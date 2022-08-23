import { Checkbox, FormControlLabel, useTheme } from '@mui/material'
import { ReactComponent as CheckboxIcon } from '../../assets/componentsIcon/checkbox.svg'
import { ReactComponent as CheckboxCheckedIcon } from '../../assets/componentsIcon/checkbox_checked.svg'

interface Props {
  checked: boolean
  onChange?: (e: any) => void
  label?: string
  disabled?: boolean
}

export default function NewCheckbox(props: Props) {
  const theme = useTheme()
  const { checked, onChange, label = '', disabled } = props
  return (
    <FormControlLabel
      sx={{
        margin: 0,
        fontSize: 13,
        fontWeight: 600,
        color: checked ? theme.palette.text.primary : theme.palette.text.secondary
      }}
      control={
        <Checkbox
          sx={{ padding: 0, marginRight: '12px' }}
          icon={<CheckboxIcon />}
          checkedIcon={<CheckboxCheckedIcon />}
        />
      }
      label={label}
      labelPlacement="end"
      onChange={onChange}
      checked={checked}
      disabled={disabled}
    />
  )
}
