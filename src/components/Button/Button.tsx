import React from 'react'
import { ButtonBase, Theme, useTheme } from '@mui/material'
import { SxProps } from '@mui/system'

interface Props {
  onClick?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | (() => void)
  width?: string
  height?: string
  backgroundColor?: string
  borderRadius?: string
  disabled?: boolean
  color?: string
  children?: React.ReactNode
  fontSize?: string | number
  className?: string
  style?: React.CSSProperties & SxProps<Theme>
  active?: boolean
  disableRipple?: boolean
  hoverbg?: string
}

export default function Button(props: Props) {
  const {
    onClick,
    disabled,
    style,
    width,
    height,
    fontSize,
    backgroundColor,
    color,
    disableRipple,
    className,
    borderRadius,
    hoverbg
  } = props
  const theme = useTheme()
  return (
    <ButtonBase
      disableRipple={disableRipple}
      onClick={onClick}
      disabled={disabled}
      className={className}
      sx={{
        width: width || '100%',
        height: height || 36,
        fontSize: fontSize || 14,
        fontWeight: 700,
        transition: '.3s',
        borderRadius: borderRadius || `${theme.shape.borderRadius}px`,
        backgroundColor: backgroundColor || theme.palette.primary.main,
        color: color || theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: !!hoverbg ? hoverbg : theme.palette.primary.dark
        },
        '&:disabled': {
          backgroundColor: theme.palette.primary.light,
          border: 0
        },
        ...style
      }}
    >
      {props.children}
    </ButtonBase>
  )
}

export function BlackButton({ style, ...props }: Props) {
  const theme = useTheme()
  return (
    <Button
      {...props}
      style={{
        background: theme.palette.primary.main,
        '&:hover': {
          background: theme.palette.primary.dark
        },
        '&:disabled': {
          backgroundColor: theme.palette.text.disabled
        },
        ...style
      }}
    />
  )
}

export function DefaultButton({ style, active, ...props }: Props) {
  const theme = useTheme()

  return (
    <Button
      {...props}
      style={{
        color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
        backgroundColor: active ? theme.palette.primary.main : theme.palette.primary.contrastText,
        border: `1px solid ${active ? 'transparent' : 'rgba(0,0,0,0.1)'}`,
        '&:hover': {
          background: theme.palette.primary.main
        },
        ...style
      }}
    />
  )
}
