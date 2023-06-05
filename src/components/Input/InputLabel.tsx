import React from 'react'
import { InputLabel as MuiInputLabel, useTheme } from '@mui/material'
import { ReactComponent as InfoIcon } from '../../assets/componentsIcon/info_icon.svg'

export default function InputLabel({
  children,
  infoIcon,
  style
}: {
  children?: React.ReactNode
  infoIcon?: boolean
  style?: React.CSSProperties
}) {
  const theme = useTheme()
  return (
    <MuiInputLabel
      sx={{
        color: `${theme.palette.text.secondary} !important`,
        position: 'relative !important',
        transform: 'none',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        '& .MuiFormLabel-asterisk': {
          display: 'none !important'
        }
      }}
    >
      <div
        style={{
          // opacity: 0.6,
          fontSize: 14,
          fontWeight: 500,
          lineHeight: '148.69%',
          ...style
        }}
      >
        {children}
      </div>
      {infoIcon && (
        <InfoIcon
          style={{
            marginLeft: 4,
            cursor: 'pointer'
          }}
        />
      )}
    </MuiInputLabel>
  )
}
