import { Box } from '@mui/material'
import LeftMenu from './LeftSider'

export default function GovernanceContainer({ children }: { children: any }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr',
        minHeight: '100%',
        width: '100%'
      }}
    >
      <LeftMenu />
      <Box
        sx={{
          padding: '24px 32px'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
