import { Box, Typography } from '@mui/material'
import Button from 'components/Button/OutlineButton'
import { ReactComponent as Invite } from 'assets/svg/invite.svg'
import useCopyClipboard from 'hooks/useCopyClipboard'
import { useMemo } from 'react'

export default function InviteUser() {
  const [isCopied, setCopied] = useCopyClipboard()
  const link = useMemo(() => {
    return window.location.toString()
  }, [])

  return (
    <Box mt={10}>
      <Typography maxWidth={'100%'} color="#3f5170" fontWeight={500} fontSize={14}>
        Share this secret link to invite people to this workspace. Only users who can invite members can see this. You
        can reset the link for all space members to generate a new invite link.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
          mt: 10,
          background: '#F8FBFF',
          border: '1px solid #d4d7e2',
          borderRadius: '8px',
          '& .css-jh7bmd-MuiInputBase-root.MuiInputBase-root': {
            padding: '0 0 0 20px'
          },
          '& .MuiInputBase-root.Mui-focused, & .css-jh7bmd-MuiInputBase-root.Mui-focused, & .css-jh7bmd-MuiInputBase-root.MuiInputBase-root': {
            border: 'none!important'
          },
          '& .input': {
            width: '100% - 160px',
            fontSize: 14,
            fontWeight: 500,
            color: '#80829f',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            padding: '10px 0 10px 10px'
          },
          '& button': {
            gap: 10,
            width: 160,
            height: 36,
            marginRight: 10,
            border: '1px solid #97b7ef',
            borderRadius: '8px',
            '&:hover': {
              borderColor: '#97b7ef'
            },
            '& svg path': {
              fill: '#97b7ef'
            },
            '& p': {
              fontWeight: 500,
              fontSize: 14,
              color: '#97b7ef'
            }
          }
        }}
      >
        <Box className="input">{link}</Box>
        <Button onClick={() => setCopied(link)}>
          <Invite />
          <Typography maxWidth={'100%'}>{isCopied ? 'Copied Link' : 'Copy Link'}</Typography>
        </Button>
      </Box>
    </Box>
  )
}
