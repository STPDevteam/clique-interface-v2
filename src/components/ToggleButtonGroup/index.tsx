import { useState } from 'react'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'

interface ListItem {
  label: string
  value: string
}
export default function ToggleButtn({
  Props,
  setToggleValue
}: {
  Props: ListItem[]
  setToggleValue: (value: string) => void
}) {
  const UnselectedStyle = {
    padding: '0',
    width: '100px',
    height: '18px',
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '12px',
    color: '#80829F',
    lineHeight: '20px',
    border: 'none',
    borderRadius: '48px'
  }
  const SelectedStyle = {
    padding: '0',
    boxSizing: 'border-box',
    width: '100px',
    height: '18px',
    background: '#0049C6',
    color: '#fff',
    border: '1px solid #97B7EF',
    borderRadius: '48px',
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '20px'
  }

  const [alignment, setAlignment] = useState(Props[0].value)

  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    setAlignment(newAlignment)
    setToggleValue(newAlignment)
  }
  return (
    <>
      <ToggleButtonGroup
        sx={{
          boxSizing: 'border-box',
          height: '20px',
          border: ' 1px solid #D4D7E2',
          borderRadius: ' 48px',
          whiteSpace: 'nowrap'
        }}
        color="primary"
        exclusive
        onChange={handleChange}
      >
        {Props.map((v, index) => (
          <ToggleButton key={index} value={v.label} style={alignment == v.value ? SelectedStyle : UnselectedStyle}>
            {v.value}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </>
  )
}
