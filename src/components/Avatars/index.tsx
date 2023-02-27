import { Avatar } from '@mui/material'
import defaultAvatar from 'assets/svg/default-avatar.svg'

export function DaoAvatars({ size, alt, src }: { size?: number; alt?: string; src?: string }) {
  return (
    <Avatar
      alt={alt}
      src={src?.replace(/^http\:/, 'https:')}
      sx={{ width: size || undefined, height: size || undefined, backgroundColor: '#efefef' }}
    >
      <img src={defaultAvatar} style={{ width: '100%' }} />
    </Avatar>
  )
}
