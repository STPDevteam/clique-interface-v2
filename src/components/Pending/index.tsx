import { Box, styled, Typography, useTheme } from '@mui/material'
import IconLaunching from 'assets/svg/icon-launching.svg'
import { useIsTransactionPending } from 'state/transactions/hooks'
import IconDone from 'assets/svg/icon-launched.svg'
import { Link } from 'react-router-dom'

const Wrapper = styled(Box)(({}) => ({
  width: 326,
  height: 326,
  position: 'relative',
  '& .outer': {
    '@keyframes spin': {
      from: {
        transform: 'rotate(0)'
      },
      to: {
        transform: 'rotate(360deg)'
      }
    },
    animation: 'spin 3.2s linear infinite',
    width: '100%',
    objectFit: 'contain'
  },
  '& .content': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'grid',
    justifyItems: 'center',
    alignContent: 'center'
  }
}))

export default function Pending({
  hash,
  doneText,
  doneLink
}: {
  hash: string | undefined
  doneText: string
  doneLink: string
}) {
  const theme = useTheme()
  const isTransactionPending = useIsTransactionPending(hash)

  return (
    <Wrapper>
      {isTransactionPending ? (
        <>
          <img className="outer" src={IconLaunching} />
          <Box className="content">
            <Typography maxWidth={'70%'} textAlign="center" fontWeight={600} fontSize={24}>
              Launching...
            </Typography>
            <Typography
              maxWidth={'70%'}
              textAlign="center"
              variant="body1"
              mt={8}
              fontSize={12}
              color={theme.palette.text.secondary}
            >
              Please do not close this page
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <img className="outer" src={IconDone} />
          <Box className="content">
            <Typography maxWidth={'70%'} textAlign="center" fontWeight={600} fontSize={24}>
              Done!
            </Typography>
            <Link style={{ maxWidth: '70%' }} to={doneLink}>
              <Typography textAlign="center" variant="body1" mt={8} fontSize={12} color={theme.palette.text.secondary}>
                {doneText}
              </Typography>
            </Link>
          </Box>
        </>
      )}
    </Wrapper>
  )
}
