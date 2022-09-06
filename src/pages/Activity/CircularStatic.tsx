import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material'

export default function CircularStatic(props: CircularProgressProps & { value: number; over?: boolean }) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CircularProgress
        sx={{
          position: 'relative',
          '&:after': {
            content: `''`,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            border: `10px solid ${theme.bgColor.bg2}`,
            borderRadius: '50%',
            zIndex: -1
          }
        }}
        variant="determinate"
        style={{ width: 118, height: 118 }}
        {...props}
        value={props.over ? 0 : props.value}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {props.over ? 'Sold out' : `${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  )
}
