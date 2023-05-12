import { Container } from '@mui/material'

export default function DaoContainer({ children }: { children: JSX.Element }) {
  return (
    <Container
      sx={{
        // maxWidth: '1002px !important',
        maxWidth: '100%!important',
        padding: '48px 109px!important'
      }}
    >
      {children}
    </Container>
  )
}
