import { Box } from '@mui/material'
import DragTaskPanel from './DragTaskPanel'

export default function Task() {
  return (
    <Box sx={{ position: 'relative' }}>
      <DragTaskPanel />
    </Box>
  )
}
