import { Box } from '@mui/material'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'

export default function BannerWrapper({ imgSrc, children }: { imgSrc: string; children: string | JSX.Element }) {
  return (
    <Box position={'relative'}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <ContainerWrapper maxWidth={1152}>{children}</ContainerWrapper>
      </Box>
      <img style={{ width: '100%' }} src={imgSrc} alt="" />
    </Box>
  )
}
