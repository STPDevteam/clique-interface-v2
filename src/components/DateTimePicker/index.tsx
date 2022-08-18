import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDateTimePicker } from '@mui/x-date-pickers'
import { TextField } from '@mui/material'
import moment from 'moment'

export default function DateTimePicker({
  value,
  onValue
}: {
  value: Date | null
  onValue: (timestamp: number | undefined) => void
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDateTimePicker
        DialogProps={{ sx: { '& .MuiPaper-root': { padding: '30px 0 0' } } }}
        inputFormat={value ? moment(value).format('YYYY-MM-DD HH:mm') : ''}
        disablePast
        value={value}
        ampm={false}
        label=""
        onChange={date => {
          onValue(date ? Number((date.getTime() / 1000).toFixed()) : undefined)
        }}
        renderInput={params => {
          return (
            <TextField
              sx={{
                '& fieldset': {
                  display: 'none'
                },
                '& input': {
                  height: 56,
                  boxSizing: 'border-box',
                  backgroundColor: theme => theme.bgColor.bg4,
                  borderRadius: '14px',
                  fontSize: 12,
                  fontWeight: 500
                }
              }}
              placeholder="Select Date"
              {...params}
            />
          )
        }}
      />
    </LocalizationProvider>
  )
}
