import { Box, styled } from '@mui/material'

export const ContainerWrapper = styled('main')(
  ({ maxWidth, margin }: { maxWidth?: string | number; margin?: string }) => ({
    maxWidth: maxWidth || 964,
    margin: margin || 'auto'
  })
)

export const CreatorBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.bgColor.bg2}`,
  boxShadow: `inset 0px -1px 0px ${theme.bgColor.bg2}`,
  borderRadius: theme.borderRadius.default,
  padding: '32px 40px',
  margin: '29px auto'
}))
