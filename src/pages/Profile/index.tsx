import { Box, styled } from '@mui/material'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'

const StyledHeader = styled(Box)(({ theme }) => ({
  borderRadius: theme.borderRadius.default,
  minHeight: 215,
  background: theme.palette.common.white,
  boxShadow: theme.boxShadow.bs2,
  padding: '32px 48px 20px'
}))

export default function Profile() {
  return (
    <ContainerWrapper maxWidth={1248} margin={'24px auto 80px'}>
      <StyledHeader></StyledHeader>
    </ContainerWrapper>
  )
}
