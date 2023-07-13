import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import { ChangeEvent } from 'react'
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 25,
  height: 14,
  padding: 0,
  display: 'flex',
  boxSizing: 'border-box',
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#fff',
        border: '1px solid #97B7EF'
      },
      '& .MuiSwitch-thumb': {
        backgroundColor: '#97B7EF'
      }
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    transition: theme.transitions.create(['width'], {
      duration: 200
    })
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: '#0049C6',
    border: '1px solid #97B7EF'
  }
}))

export default function SwitchBtn({
  checked,
  onChange
}: {
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  return <AntSwitch checked={checked} onChange={onChange} />
}
