import { SxProps, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Popper from '@mui/material/Popper'
import React, { useState } from 'react'
export default function PopperCard({
  sx,
  targetElement,
  children
}: {
  popperSx?: SxProps<Theme>
  sx?: SxProps<Theme>
  targetElement: JSX.Element
  children: JSX.Element | string | number
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = !!anchorEl
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  return (
    <ClickAwayListener
      onClickAway={() => {
        setAnchorEl(null)
      }}
    >
      <Box width={'100%'}>
        <Box onClick={handleClick}>{targetElement}</Box>
        <Popper open={open} anchorEl={anchorEl} style={{ zIndex: 9999, borderColor: '#D4D7E2' }}>
          <Box
            onClick={() => setAnchorEl(null)}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid rgba(18, 18, 18, 0.06)',
              borderRadius: '8px',
              padding: '6px',
              ...sx
            }}
          >
            {children}
          </Box>
        </Popper>
      </Box>
    </ClickAwayListener>
  )
}
