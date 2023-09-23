import { Container, useTheme } from '@mui/material'

export default function DaoContainer({ children }: { children: JSX.Element }) {
  const theme = useTheme()

  return (
    <Container
      sx={{
        maxWidth: '1180px !important',
        // maxWidth: '100%!important',
        padding: '48px 130px 0 106px!important',
        marginLeft: '0!important',
        [theme.breakpoints.down('sm')]: {
          maxWidth: 'calc(100vw - 32px) !important',
          padding: '48px 0 !important'
        }
      }}
    >
      {children}
    </Container>
  )
}
