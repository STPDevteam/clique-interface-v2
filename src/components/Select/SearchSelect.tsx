import { styled, useTheme, Theme } from '@mui/material'
import { MultipleSelect, SelectOption, SingleSelect } from 'react-select-material-ui'
import React from 'react'
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
  },
  '& .css-1u9des2-indicatorSeparator': {
    width: 0
  },
  '& .css-1jqq78o-placeholder': {
    color: '#97B7EF'
  }
}))

const StyledSelect = styled(SingleSelect)(({ theme }) => ({
  minWidth: 219,
  width: 'fit-content',
  cursor: 'pointer',
  borderRadius: '10px',
  border: '2px solid transparent',
  position: 'relative',
  padding: '0 10px',
  '& .MuiFormLabel-root': {
    paddingLeft: 5
  },
  '& .css-qbdosj-Input': {
    position: 'absolute'
  },
  '& .MuiSelect-icon': {
    color: theme.palette.primary.contrastText,
    right: '10px'
  },
  '&.Mui-focused': {
    borderColor: theme.palette.primary.main
  },
  '& .css-1u9des2-indicatorSeparator': {
    width: 0
  },
  '& .css-1jqq78o-placeholder': {
    color: '#97B7EF'
  }
}))

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
            isMulti: multiple,
            isCreatable: false,
            isClearable: multiple || undefined,
            width: width ?? 'unset',
            height: height ?? 'auto',
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
            isClearable: multiple || undefined,
            width: width ?? 'unset',
            height: height ?? 'auto',
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
