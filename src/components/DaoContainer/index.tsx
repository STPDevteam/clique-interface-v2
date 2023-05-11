import { Container } from '@mui/material'

export default function DaoContainer({ children }: { children: JSX.Element }) {
  return (
    <Container
      sx={{
        maxWidth: '1002px !important',
        padding: '48px 30px!important'
      }}
    >
      {children}
    </Container>
  )
}
