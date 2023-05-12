import { Avatar, SxProps, Theme } from '@mui/material'
import defaultAvatar from 'assets/svg/default-avatar.svg'

export function DaoAvatars({
  size,
  alt,
  src,
  sx
}: {
  size?: number
  alt?: string
  src?: string
  sx?: SxProps<Theme> | undefined
}) {
  return (
    <Avatar
      alt={alt}
      src={src?.replace(/^http\:/, 'https:')}
      sx={{ width: size || undefined, height: size || undefined, backgroundColor: '#efefef', ...sx }}
    >
      <img src={defaultAvatar} style={{ width: '100%' }} />
    </Avatar>
  )
}
