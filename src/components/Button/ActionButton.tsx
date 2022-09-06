import Button from './Button'
import OutlineButton from './OutlineButton'
import Spinner from 'components/Spinner'
import { Typography } from '@mui/material'
import { BlackButton } from './Button'

export default function ActionButton({
  error,
  pending,
  success,
  onAction,
  actionText,
  pendingText,
  height,
  width,
  disableAction,
  successText,
  black
}: {
  error?: string | undefined
  pending?: boolean
  success?: boolean
  onAction: (() => void) | undefined
  actionText: string
  pendingText?: string
  successText?: string
  height?: string
  width?: string
  disableAction?: boolean
  black?: boolean
}) {
  return (
    <>
      {error || pending ? (
        <OutlineButton primary disabled height={height} width={width}>
          {pending ? (
            <>
              <Spinner marginRight={16} />
              {pendingText || 'Waiting Confirmation'}
            </>
          ) : (
            error
          )}
        </OutlineButton>
      ) : success ? (
        black ? (
          <BlackButton disabled height={height} width={width}>
            <Typography variant="inherit">{successText ?? actionText}</Typography>
          </BlackButton>
        ) : (
          <Button disabled height={height} width={width}>
            <Typography variant="inherit">{successText ?? actionText}</Typography>
          </Button>
        )
      ) : black ? (
        <BlackButton height={height} width={width} onClick={onAction} disabled={disableAction}>
          {actionText}
        </BlackButton>
      ) : (
        <Button height={height} width={width} onClick={onAction} disabled={disableAction}>
          {actionText}
        </Button>
      )}
    </>
  )
}
