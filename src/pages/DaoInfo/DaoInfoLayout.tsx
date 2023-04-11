import { Box } from '@mui/material'
import LeftMenu from './LeftSider'

export default function DaoInfoLayout({ children }: { children: any }) {
  return (
    <Box
      sx={{
        display: 'grid',
        // gridTemplateColumns: { xs: '1fr', sm: '80px 1fr' },
        minHeight: '100%',
        width: '100%'
      }}
    >
      <LeftMenu />
      <Box
        sx={{
          padding: { sm: '24px 32px 24px 284px', xs: '20px 16px' }
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
