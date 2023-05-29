import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDateTimePicker } from '@mui/x-date-pickers'
import { TextField } from '@mui/material'
import moment from 'moment'
import { currentTimeStamp } from 'utils'

export default function DateTimePicker({
  value,
  onValue,
  disabled,
  inputWidth,
  minDateTime,
  label,
  height
}: {
  value: Date | null
  onValue: (timestamp: number | undefined) => void
  disabled?: boolean
  minDateTime?: Date
  inputWidth?: string
  label?: string
  height?: number
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDateTimePicker
        DialogProps={{
          sx: { '& .MuiPaper-root': { padding: '30px 0 0' }, '& .MuiPickersToolbar-penIconButton': { display: 'none' } }
        }}
        inputFormat={value ? moment(value).format('YYYY-MM-DD HH:mm') : ''}
        disablePast
        disableIgnoringDatePartForTimeValidation
        minDateTime={minDateTime}
        value={value}
        disabled={disabled}
        ampm={false}
        label=""
        onOpen={() => {
          if (!value) {
            onValue(currentTimeStamp())
          }
        }}
        onChange={(date: Date | null) => {
          onValue(date ? Number((date.getTime() / 1000).toFixed()) : undefined)
        }}
        renderInput={params => {
          return (
            <TextField
              sx={{
                width: inputWidth || 'unset',
                '& fieldset': {
                  display: 'none'
                },
                '& input': {
                  height: height ? height : 56,
                  boxSizing: 'border-box',
                  backgroundColor: theme => theme.bgColor.bg4,
                  borderRadius: '14px',
                  fontSize: 16,
                  paddingLeft: '14px!important',
                  fontWeight: 500,
                  '&::placeholder': {
                    color: '#0049C6',
                    fontWeight: 500,
                    fontSize: 16
                  }
                }
              }}
              placeholder={label ?? 'Select Date'}
              {...params}
            />
          )
        }}
      />
    </LocalizationProvider>
  )
}
