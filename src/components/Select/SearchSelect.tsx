import { styled, useTheme, Theme } from '@mui/material'
import { MultipleSelect, SelectOption, SingleSelect } from 'react-select-material-ui'
import React from 'react'
import { StylesConfig } from 'react-select'
import { SxProps } from '@mui/system'
interface Props {
  options: string[] | SelectOption[]
  children?: React.ReactNode
  onChange: (value: any, option?: SelectOption | SelectOption[]) => void
  defaultValue?: any
  value?: string | string[] | number | number[]
  disabled?: boolean
  selected?: React.ReactNode
  placeholder?: string
  width?: string | number
  height?: string | number
  multiple?: boolean
  label?: string
  renderValue?: any
  style?: React.CSSProperties | SxProps<Theme>
}

const StyledMultiSelect = styled(MultipleSelect)(({ theme }) => ({
  width: 219,
  cursor: 'pointer',
  borderRadius: '10px',
  border: '2px solid transparent',
  position: 'relative',
  padding: '0 10px',
  '& .MuiSelect-icon': {
    color: theme.palette.primary.contrastText,
    right: '10px'
  },
  '&.Mui-focused': {
    borderColor: theme.palette.primary.main
  }
}))

const StyledSelect = styled(SingleSelect)(({ theme }) => ({
  minWidth: 268,
  width: 'fit-content',
  cursor: 'pointer',
  borderRadius: '10px',
  border: '2px solid transparent',
  position: 'relative',
  padding: '0 10px',
  '& .MuiFormLabel-root': {
    paddingLeft: 5
  },
  '& .MuiSelect-icon': {
    color: theme.palette.primary.contrastText,
    right: '10px'
  },
  '&.Mui-focused': {
    borderColor: theme.palette.primary.main
  }
}))

const stylesFn: StylesConfig<unknown, false> = {
  clearIndicator: (base: any) => ({
    ...base
  }),
  control: (base: any) => ({
    ...base,
    background: 'transparent',
    borderBottomColor: '#D4D7E2',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderRadius: 0,
    boxShadow: 'none',
    marginRight: 15,
    '&:hover': {
      borderBottomColor: '#1e80ff'
    }
  }),
  input: (base: any) => ({
    ...base,
    position: 'absolute'
  }),
  indicatorSeparator: (base: any) => ({
    ...base,
    width: 0
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#97B7EF'
  }),
  dropdownIndicator: (base: any) => ({
    ...base
  }),
  menuList: (base: any) => ({
    ...base
  }),
  multiValue: (base: any) => ({
    ...base
  }),
  multiValueLabel: (base: any) => ({
    ...base
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: '#ffff80',
    '&:hover': { color: '#000', backgroundColor: 'rgba(0,0,0,0)' }
  }),
  noOptionsMessage: (base: any) => ({
    ...base
  }),
  option: (base: any) => ({
    ...base
  }),
  singleValue: (base: any) => ({
    ...base
  })
}

export default function SearchSelect(props: Props) {
  const { options, disabled, onChange, width, height, label, value, defaultValue, placeholder, multiple, style } = props
  useTheme()

  return (
    <div>
      {multiple ? (
        <StyledMultiSelect
          options={options}
          label={label}
          onChange={onChange}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          defaltValue={defaultValue}
          SelectProps={{
            isMulti: true,
            isCreatable: false,
            isClearable: true,
            width: width ?? 'unset',
            height: height ?? 'auto',
            styles: stylesFn,
            sx: {
              ...style
            },
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left'
            }
          }}
        ></StyledMultiSelect>
      ) : (
        <StyledSelect
          options={options}
          label={label}
          onChange={onChange}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          defaltValue={defaultValue}
          SelectProps={{
            isCreatable: false,
            isClearable: true,
            width: width ?? 'unset',
            height: height ?? 'auto',
            styles: stylesFn,
            sx: {
              ...style
            },
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left'
            }
          }}
        ></StyledSelect>
      )}
    </div>
  )
}
