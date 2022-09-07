import React from 'react'
import { ButtonBase, useTheme } from '@mui/material'

interface Props {
  onClick?: (() => void) | null
  primary?: boolean
  children: React.ReactNode
  width?: string | number
  height?: string | number
  fontSize?: string | number
  disabled?: boolean
  color?: string
  fontWeight?: number
  borderRadius?: string
  style?: React.CSSProperties
}

export default function OutlineButton(props: Props) {
  const {
    onClick,
    disabled,
    style,
    fontWeight,
    width,
    fontSize,
    color,
    primary,
    height,
    borderRadius,
    children
  } = props
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick ?? undefined}
      disabled={disabled}
      sx={{
        width: width || '100%',
        border: theme =>
          `2px solid ${color ? color : primary ? theme.palette.primary.main : theme.palette.common.black}`,
        fontSize: fontSize || 14,
        fontWeight: fontWeight || 700,
        height: height || 56,
        color: primary ? theme.palette.primary.main : theme.palette.common.black,
        borderRadius: borderRadius ?? 1,
        '&:hover': {
          // color: theme.palette.common.white,
          color: theme.palette.primary.main,
          // backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main
        },
        '&:disabled': {
          opacity: theme.palette.action.disabledOpacity,
          backgroundColor: theme.bgColor.bg1
        },
        ...style
      }}
    >
      {children}
    </ButtonBase>
  )
}
