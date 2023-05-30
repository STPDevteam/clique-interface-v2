import { Container } from '@mui/material'

export default function DaoContainer({ children }: { children: JSX.Element }) {
  return (
    <Container
      sx={{
        maxWidth: '1180px !important',
        // maxWidth: '100%!important',
        padding: '48px 130px 0 106px!important',
        marginLeft: '0!important'
      }}
    >
      {children}
    </Container>
  )
}
