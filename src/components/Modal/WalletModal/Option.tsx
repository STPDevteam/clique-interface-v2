import React from 'react'
import { Box } from '@mui/material'
import LogoText from 'components/LogoText'
import { Connection } from 'connection/types'
import { ActivationStatus, useActivationState } from 'connection/activate'
import { LoadingButton } from '@mui/lab'
import { ExternalLink } from 'theme/components'

// const GreenCircle = styled('div')(({ theme }) => ({
//   display: 'flex',
//   flexFlow: 'row nowrap',
//   justifyContent: 'center',
//   alignItems: 'center',
//   '& div ': {
//     height: 8,
//     width: 8,
//     marginRight: 8,
//     backgroundColor: theme.palette.success.main,
//     borderRadius: '50%'
//   }
// }))

export default function Option({
  link = null,
  header,
  icon,
  connection,
  active = false,
  id
}: {
  link?: string | null
  header: React.ReactNode
  active?: boolean
  icon: string
  connection?: Connection
  isModal?: boolean
  id: string
}) {
  const { activationState, tryActivation } = useActivationState()

  const activate = () =>
    active &&
    connection &&
    tryActivation(connection, () => {}).catch(err => {
      console.error('error message:', err)
    })

  const isSomeOptionPending = activationState.status === ActivationStatus.PENDING
  const isCurrentOptionPending = isSomeOptionPending && activationState.connection.type === connection?.type

  const content = (
    <>
      <LoadingButton
        variant="outlined"
        loadingPosition="start"
        key={id}
        fullWidth
        sx={{
          borderColor: active ? 'var(--ps-yellow-1)' : 'var(--ps-border-1)',
          ':disabled': {
            opacity: 0.5,
            backgroundColor: 'var(--ps-white)',
            color: 'var(--ps-black)',
            border: '1px solid rgba(18, 18, 18, 0.2)'
          }
        }}
        loading={isCurrentOptionPending}
        onClick={activate}
        disabled={!active}
      >
        <Box width={166}>
          <LogoText fontSize={14} logo={icon} text={header} />
        </Box>
      </LoadingButton>
    </>
  )
  if (link) {
    return <ExternalLink href={link}>{content}</ExternalLink>
  }
  return content
}
