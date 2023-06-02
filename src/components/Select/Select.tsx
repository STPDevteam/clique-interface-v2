import {
  Select as MuiSelect,
  InputLabel as MuiInputLabel,
  styled,
  InputBase,
  useTheme,
  Theme,
  MenuItem,
  Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SelectedIcon from 'assets/componentsIcon/selected_icon.svg'
// import SelectedHoverIcon from 'assets/componentsIcon/selected_hover_icon.svg'
import CheckboxMulIcon from '../../assets/componentsIcon/checkbox.svg'
import SelectedMulIcon from '../../assets/componentsIcon/checkbox_checked.svg'

import React, { useMemo, useState } from 'react'
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
  color?: string
  renderValue?: any
  style?: React.CSSProperties | SxProps<Theme>
  noBold?: boolean
}

const StyledInputLabel = styled(MuiInputLabel)(({ theme }) => ({
  // opacity: 0.6,
  textAlign: 'left',
  fontSize: 12,
  textAlign: 'left',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  marginBottom: '8px'
}))

const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: '10px',
  position: 'relative',
  padding: '10px',
  '& .MuiSelect-icon': {
    color: '#D4D7E2',
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
    style,
    color,
    noBold
  } = props
  const theme = useTheme()
  const hasValue = useMemo(() => {
    if (!value && !defaultValue) return false
    if (value instanceof Array) {
      if (value.length === 1 && value[0] === '') return false
    }
    return true
  }, [defaultValue, value])
  const [open, setOpen] = useState(false)

  return (
    <div>
      {label && <StyledInputLabel>{label}</StyledInputLabel>}
      <StyledSelect
        open={multiple ? open : undefined}
        onClick={() => multiple && setOpen(true)}
        sx={{
          // backgroundColor: primary ? theme.palette.primary.main : theme.bgColor.bg1,
          backgroundColor: color ? 'transparent' : primary ? theme.palette.primary.main : 'transparent',
          width: width || '100%',
          height: height || '40px',
          padding: '0',
          fontWeight: noBold ? 400 : 600,
          border: `${noBold ? 1 : 2}px solid`,
          borderColor: color ? color : '#D4D7E2',
          '& .MuiSelect-select': {
            width: '100%',
            maxWidth: 'calc(100vw - 70px)',
            height: '100%',
            padding: '0 50px 0 20px !important',
            display: 'flex',
            color: color ? color : '#3f5170',
            fontFamily: 'Inter',
            alignItems: 'center'
            // '&:hover': {
            //   color: 'white'
            // }
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
            fontWeight: '400!important'
          },
          '& .MuiSelect-icon': {
            display: disabled ? 'none' : 'block',
            color: color ? color : '#D4D7E2'
          },
          '&:hover': {
            color: disabled ? theme.palette.text.primary : theme.palette.common.white,
            backgroundColor: disabled ? theme.palette.background.paper : theme.palette.primary.main,
            '& .MuiSelect-select': {
              color: 'white'
            },
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
                backgroundColor: theme => theme.bgColor.bg1
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
                '&::after': {
                  content: multiple ? `url(${CheckboxMulIcon})` : "''",
                  width: 30,
                  height: 20,
                  display: 'flex',
                  justifyContent: 'center'
                },
                '&.Mui-selected::after': {
                  content: `url(${multiple ? SelectedMulIcon : SelectedIcon})`
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
        {multiple && (
          <MenuItem
            onClick={e => {
              setOpen(false)
              e.stopPropagation()
            }}
            sx={{
              width: '100%',
              padding: '15px 12px 10px !important',
              '&::after': {
                display: 'none !important'
              }
            }}
          >
            <Typography width="100%" textAlign={'center'}>
              Confirm
            </Typography>
          </MenuItem>
        )}
      </StyledSelect>
    </div>
  )
}
