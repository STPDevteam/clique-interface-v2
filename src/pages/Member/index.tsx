import { Box, Typography } from '@mui/material'
import { ReactComponent as MemberIcon } from 'assets/svg/member.svg'
import Button from 'components/Button/Button'
// import Image from 'components/Image'

export default function Member() {
  return (
    <Box
      sx={{
        margin: '0 120px'
      }}
    >
      <Box display={'flex'} justifyContent={'space-between'} flexDirection={'row'} alignItems={'center'}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            mb: 20,
            '& svg path': {
              fill: '#0049C6'
            },
            '& p': {
              fontWeight: 600,
              fontSize: 30,
              textAlign: 'left',
              color: '#3f5170'
            }
          }}
        >
          <MemberIcon />
          <Typography>Member</Typography>
        </Box>
        <Button width="125px" height="36px" borderRadius="8px">
          + Add Member
        </Button>
      </Box>
      <Typography
        variant="h5"
        sx={{
          width: '700px',
          textAlign: 'left',
          color: '#3f5170',
          fontSize: 14
        }}
      >
        Manage members here, add them by address, and define roles for them. Make sure to turn on your notifications to
        receive information about new openings.
      </Typography>
    </Box>
  )
}
