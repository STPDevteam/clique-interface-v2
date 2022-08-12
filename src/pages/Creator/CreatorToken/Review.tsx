import { Box } from '@mui/material'
import { routes } from 'constants/routes'
import Pending from '../../../components/Pending'

export default function Review({ hash }: { hash: string | undefined }) {
  return (
    <Box mt={60} display="flex" justifyContent={'center'}>
      <Pending doneLink={routes.Tokens} doneText="Back to token list" hash={hash} />
    </Box>
  )
}
