import { Select as MuiSelect, InputLabel as MuiInputLabel, styled, InputBase, useTheme, Theme } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SelectedIcon from 'assets/componentsIcon/selected_icon.svg'
import React, { useMemo } from 'react'
import { SxProps } from '@mui/system'
interface Props {
  children?: React.ReactNode
  onChange?: (e: any) => void
  defaultValue?: any
  value?: string | string[] | number | number[]
  disabled?: boolean
  selected?: React.ReactNode
  placeholder?: string
  width?: string | number
  height?: string | number
  multiple?: boolean
  primary?: boolean
  label?: string
  renderValue?: any
  style?: React.CSSProperties | SxProps<Theme>
}

const StyledInputLabel = styled(MuiInputLabel)(({ theme }) => ({
  // opacity: 0.6,
  fontSize: 12,
  fontWeight: 500,
  color: theme.palette.text.secondary,
  marginBottom: '8px'
}))

const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: '10px',
  border: '2px solid transparent',
  position: 'relative',
  padding: '10px',
  '& .MuiSelect-icon': {
    color: theme.palette.primary.contrastText,
    right: '10px'
  },
  '&.Mui-focused': {
    borderColor: theme.palette.primary.main
  }
}))

export default function Select(props: Props) {
  const {
    disabled,
    onChange,
    children,
    width,
    height,
    label,
    primary,
    value,
    defaultValue,
    placeholder,
    renderValue,
    multiple,
    style
  } = props
  const theme = useTheme()
  const hasValue = useMemo(() => {
    if (!value && !defaultValue) return false
    if (value instanceof Array) {
      if (value.length === 1 && value[0] === '') return false
    }
    return true
  }, [defaultValue, value])

  return (
    <div>
      {label && <StyledInputLabel>{label}</StyledInputLabel>}
      <StyledSelect
        sx={{
          backgroundColor: primary ? theme.palette.primary.main : theme.bgColor.bg1,
          width: width || '100%',
          height: height || '56px',
          padding: '0',
          fontWeight: 600,
          '& .MuiSelect-select': {
            width: '100%',
            height: '100%',
            padding: '0 50px 0 20px !important',
            display: 'flex',
            alignItems: 'center'
          },
          '& span': {
            fontWeight: '600!important'
          },
          '&:before': {
            content: hasValue ? "''" : `"${placeholder}"`,
            position: 'absolute',
            left: 24,
            // top: 10,
            zIndex: 999,
            color: theme.palette.text.secondary,
            fontSize: 16,
            fontWeight: '600!important'
          },
          '& .MuiSelect-icon': {
            display: disabled ? 'none' : 'block',
            color: theme.palette.text.primary
          },
          '&:hover': {
            color: disabled ? theme.palette.text.primary : theme.palette.common.white,
            backgroundColor: disabled ? theme.palette.background.paper : theme.palette.primary.main,
            '& .MuiSelect-icon': {
              color: disabled ? theme.palette.text.primary : theme.palette.common.white
            }
          },
          '& .Mui-disabled.MuiInputBase-input': {
            color: theme.palette.text.primary,
            WebkitTextFillColor: theme.palette.text.primary
          },
          ...style
        }}
        value={value}
        displayEmpty
        multiple={multiple}
        disabled={disabled}
        MenuProps={{
          sx: {
            '& .MuiPaper-root': {
              width: width ?? 'unset',
              borderRadius: '10px',
              mt: '10px',
              boxShadow: theme => theme.shadows[4],
              transform: width ? 'translateX(-12px)!important' : 'none',
              '& li': {
                fontSize: 16,
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 0',
                '& span': {
                  fontWeight: '600!important'
                },
                '&.Mui-selected': {
                  backgroundColor: 'transparent'
                }
              },
              '& li:hover': {
                backgroundColor: theme => theme.palette.primary.light
              },
              '& li:last-child': {
                borderBottom: 'none'
              },
              '& .MuiMenuItem-root': {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
                padding: 15,
                '&.Mui-selected::after': {
                  content: `url(${SelectedIcon})`,
                  width: 30,
                  height: 20,
                  display: 'flex',
                  justifyContent: 'center'
                }
              }
            }
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
        input={<InputBase />}
        IconComponent={ExpandMoreIcon}
        onChange={onChange}
        renderValue={renderValue || undefined}
      >
        {children}
      </StyledSelect>
    </div>
  )
}
