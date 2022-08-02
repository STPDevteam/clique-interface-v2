import React, { ChangeEvent, InputHTMLAttributes, useCallback, useMemo, useRef, useState } from 'react'
import { Box, InputBase, styled, Typography } from '@mui/material'
import { inputBaseClasses } from '@mui/material/InputBase'
import InputLabel from './InputLabel'
import { isURL } from 'utils/dao'
import { escapeRegExp, isAddress } from 'utils'

export interface InputProps {
  placeholder?: string
  value: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  label?: string
  disabled?: boolean
  focused?: boolean
  outlined?: boolean
  type?: string
  endAdornment?: React.ReactNode
  startAdornment?: React.ReactNode
  onEnter?: () => void
  maxWidth?: string | number
  height?: string | number
  error?: boolean
  smallPlaceholder?: boolean
  subStr?: string
  multiline?: boolean
  rows?: string | number
  rightLabel?: React.ReactNode
  errSet?: () => void
  userPattern?: string
}

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  [`&.${inputBaseClasses.root}`]: {
    fontSize: 16,
    color: theme.palette.text.primary,
    fontWeight: 600,
    backgroundColor: theme.bgColor.bg4,
    padding: '5px 0 5px 20px',
    borderRadius: 14
  },
  [`&.${inputBaseClasses.focused}`]: { border: `1px solid ${theme.palette.primary.main} !important` },
  [`& .${inputBaseClasses.input}`]: {
    maxWidth: '100%',
    '&::-webkit-outer-spin-button': {
      WebkitAppearance: 'none'
    },
    '&::-webkit-inner-spin-button': {
      WebkitAppearance: 'none'
    },
    '&.Mui-disabled': {
      WebkitTextFillColor: theme.palette.text.secondary,
      color: theme.palette.text.secondary
    }
  },
  [`&.${inputBaseClasses.disabled}`]: {
    cursor: 'not-allowed'
  }
}))

const StyledInputWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  fontSize: 16,
  color: theme.palette.text.primary,
  fontWeight: 600,
  backgroundColor: theme.bgColor.bg4,
  paddingLeft: 20,
  borderRadius: 14,
  border: '2px solid transparent',
  zIndex: 1,
  cursor: 'text',
  display: 'flex',
  alignItems: 'center',
  [`&.placeholder`]: {
    fontSize: 14,
    color: theme.palette.text.secondary,
    fontWeight: 600,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
}))

export default function Input({
  focused,
  placeholder,
  onChange,
  value,
  disabled,
  type,
  outlined,
  startAdornment,
  onEnter,
  showFormatWrapper,
  multiline,
  rows,
  rightLabel,
  endAdornment,
  maxWidth,
  label,
  userPattern,
  height,
  error,
  smallPlaceholder,
  subStr,
  errSet,
  ...rest
}: InputProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement> & {
      showFormatWrapper?: () => string
    },
    'color' | 'outline' | 'size'
  >) {
  const [hideFormatWrapper, setHideFormatWrapper] = useState(false)
  const showFormatWrapperValue = useMemo(() => showFormatWrapper && showFormatWrapper(), [showFormatWrapper])
  const inputUserRef = useRef()

  const enforcer = useCallback(
    (nextUserInput: string) => {
      if (userPattern) {
        if (new RegExp(userPattern).test(escapeRegExp(nextUserInput))) {
          return nextUserInput
        }
        return null
      }
      return nextUserInput
    },
    [userPattern]
  )
  const handleChange = useCallback(
    event => {
      // replace commas with periods
      const formatted = enforcer(event.target.value)
      if (formatted === null) {
        return
      }
      event.target.value = formatted
      onChange && onChange(event)
    },
    [enforcer, onChange]
  )

  return (
    <div style={{ width: '100%', maxWidth: maxWidth || 'unset' }}>
      <Box display={'flex'} justifyContent="space-between" alignItems="center">
        {label ? <InputLabel>{label}</InputLabel> : <div />}
        {rightLabel && <InputLabel>{rightLabel}</InputLabel>}
      </Box>
      <Box position={'relative'}>
        {showFormatWrapper && !hideFormatWrapper && (
          <StyledInputWrapper
            onClick={() => {
              setHideFormatWrapper(true)
              const el = (inputUserRef?.current as unknown) as Element
              el.querySelector('input')?.focus()
            }}
            className={!showFormatWrapperValue ? 'placeholder' : ''}
          >
            {!showFormatWrapperValue ? placeholder : showFormatWrapperValue}
          </StyledInputWrapper>
        )}
        <StyledInputBase
          ref={inputUserRef}
          sx={{
            minHeight: height || 56,
            '& input': {
              paddingRight: '15px',
              fontWeight: 600
            },
            [`&.${inputBaseClasses.root}`]: {
              border: theme =>
                `2px solid ${outlined ? 'rgba(255,255,255,.4)' : error ? theme.palette.error.main : 'transparent'}`
            },
            [`&.${inputBaseClasses.focused}`]: {
              border: theme =>
                error
                  ? `2px solid ${theme.palette.error.main}!important`
                  : `2px solid ${theme.palette.primary.main}!important`
            },
            [`& .${inputBaseClasses.input}`]: {
              '&::placeholder': {
                fontSize: smallPlaceholder ? 12 : 14,
                fontWeight: 600
                // textOverflow: 'ellipsis',
                // whiteSpace: 'nowrap',
                // overflow: 'hidden'
              }
            }
          }}
          color={error ? 'error' : 'primary'}
          fullWidth={true}
          placeholder={placeholder}
          inputRef={input => input && focused && input.focus()}
          onChange={handleChange}
          onBlur={e => {
            setHideFormatWrapper(false)
            if (type === 'url' && errSet) {
              if (!isURL(e.target.value)) {
                errSet()
              }
            } else if (type === 'address' && errSet) {
              if (!isAddress(e.target.value)) {
                errSet()
              }
            }
          }}
          value={value}
          multiline={multiline}
          rows={rows}
          onKeyUp={e => e.key === 'Enter' && onEnter && onEnter()}
          disabled={disabled}
          type={type}
          startAdornment={
            startAdornment && (
              <Box display={'flex'} alignItems="center" style={{ paddingRight: 20 }}>
                {startAdornment}
              </Box>
            )
          }
          endAdornment={endAdornment && <span style={{ paddingRight: 20 }}>{endAdornment}</span>}
          {...rest}
        />
      </Box>
      {subStr && (
        <Typography fontSize={12} mt={12} sx={{ opacity: 0.5 }}>
          {subStr}
        </Typography>
      )}
    </div>
  )
}
