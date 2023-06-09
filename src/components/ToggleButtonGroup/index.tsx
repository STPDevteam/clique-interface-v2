import { useState } from 'react'
import { ToggleButtonGroup, ToggleButton, styled } from '@mui/material'

// interface ListItem {
//   label: string
//   value: string
// }

const CustomToggleButton = styled(ToggleButton)(() => ({
  textTransform: 'none',
  padding: '0',
  fontFamily: 'Inter',
  fontWeight: 500,
  fontSize: '12px',
  lineHeight: '20px'
}))

export default function ToggleButtn({
  Props,
  setToggleValue,
  itemWidth
}: {
  Props: { label: string; value: string }[]
  setToggleValue: (value: string) => void
  itemWidth?: number
}) {
  const UnselectedStyle = {
    width: itemWidth || '100px',
    color: '#80829F',
    borderRadius: '48px',
    border: 'none'
  }

  const SelectedStyle = {
    boxSizing: 'border-box',
    width: itemWidth || '100px',
    background: '#0049C6',
    color: '#fff',
    border: '1px solid #97B7EF',
    borderRadius: '48px'
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
          <CustomToggleButton
            key={index}
            value={v.value}
            style={alignment == v.value ? SelectedStyle : UnselectedStyle}
          >
            {v.label}
          </CustomToggleButton>
        ))}
      </ToggleButtonGroup>
    </>
  )
}
