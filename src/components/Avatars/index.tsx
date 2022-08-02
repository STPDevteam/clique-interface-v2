import { Avatar } from '@mui/material'
import defaultAvatar from 'assets/svg/default-avatar.svg'

export function DaoAvatars({ size, alt, src }: { size?: number; alt?: string; src?: string }) {
  return (
    <Avatar alt={alt} src={src} sx={{ width: size || undefined, height: size || undefined }}>
      <img src={defaultAvatar} />
    </Avatar>
  )
}
