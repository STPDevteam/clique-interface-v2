import { Box, styled, Typography, useTheme } from '@mui/material'
import InputNumerical from 'components/Input/InputNumerical'
import { useMemo } from 'react'
import { getVotingNumberByTimestamp, getVotingTimestampByNumber } from 'utils/dao'

const StyledItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [`& .label`]: {
    color: theme.palette.text.secondary,
    fontSize: 14,
    fontWeight: 600,
    marginLeft: 10
  }
}))

export default function DateTimeSet({ value, onUpdate }: { value: number; onUpdate: (number: number) => void }) {
  const { day, hour, minute } = useMemo(() => getVotingNumberByTimestamp(value), [value])
  const calcMax = (cur: number | string, max: number) => (!cur ? 0 : Number(cur) > max ? max : Number(cur))

  const theme = useTheme()
  return (
    <Box maxWidth={700}>
      <Typography fontSize={12} fontWeight={500} color={theme.palette.text.secondary}>
        *Default Voting Period
      </Typography>
      <Box
        display={'grid'}
        sx={{
          gap: 8,
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }
        }}
      >
        <StyledItem>
          <InputNumerical
            maxWidth={90}
            value={day.toString()}
            onChange={e => {
              onUpdate(getVotingTimestampByNumber(calcMax(e.target.value, 100), hour, minute))
            }}
            placeholder="0"
          />
          <Typography className="label">Days</Typography>
        </StyledItem>
        <StyledItem>
          <InputNumerical
            maxWidth={90}
            placeholder="0"
            value={hour.toString()}
            onChange={e => {
              onUpdate(getVotingTimestampByNumber(day, calcMax(e.target.value, 23), minute))
            }}
          />
          <Typography className="label">Hours</Typography>
        </StyledItem>
        <StyledItem>
          <InputNumerical
            maxWidth={90}
            placeholder="0"
            value={minute.toString()}
            onChange={e => onUpdate(getVotingTimestampByNumber(day, hour, calcMax(e.target.value, 59)))}
          />
          <Typography className="label">Minutes</Typography>
        </StyledItem>
      </Box>
    </Box>
  )
}
