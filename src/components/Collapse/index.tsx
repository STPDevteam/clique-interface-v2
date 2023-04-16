import { Box, Collapse, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

export default function Index({
  children,
  title,
  defaultOpen,
  hiddenArrow,
  bodyPl
}: {
  children: any
  title: string | JSX.Element
  defaultOpen?: boolean
  hiddenArrow?: boolean
  bodyPl?: number
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen || false)
  const theme = useTheme()
  return (
    <Box>
      <Box
        sx={{
          height: 40,
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          cursor: 'pointer'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {!hiddenArrow ? isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> : null}
        <Typography fontSize={13} fontWeight={600} variant="body1" color={theme.palette.text.primary}>
          {title}
        </Typography>
      </Box>
      <Collapse in={isOpen}>
        <Box
          pl={bodyPl !== undefined ? bodyPl : 28}
          fontSize={12}
          fontWeight={500}
          color={theme.palette.text.secondary}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  )
}
