import { Box, Typography } from '@mui/material'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { timeStampToFormat } from 'utils/dao'
import Table from 'components/Table'
import { useMemo } from 'react'
// import Button from 'components/Button/Button'
const applicationList = [
  {
    icon: <Twitter />,
    userName: 'User001',
    applyFor: 'Manager',
    applyTime: new Date().getTime(),
    message: 'There is a bio'
  },
  {
    icon: <Twitter />,
    userName: 'User002',
    applyFor: 'Manager',
    applyTime: new Date().getTime(),
    message: 'There is a bio'
  },
  {
    icon: <Twitter />,
    userName: 'User003',
    applyFor: 'Manager',
    applyTime: new Date().getTime(),
    message: 'There is a bio'
  }
]
export default function JobApplication() {
  const tableList = useMemo(() => {
    return applicationList.map(({ icon, userName, applyFor, applyTime, message }) => [
      <Box key={message} display={'flex'} gap={10} alignItems={'center'} fontWeight={500}>
        {icon}
        {userName}
      </Box>,
      <Typography key={message} fontWeight={400} fontSize={13} color={'#80829F'}>
        {applyFor}
      </Typography>,
      <Typography key={message} fontWeight={400} fontSize={13} color={'#80829F'}>
        {timeStampToFormat(applyTime)}
      </Typography>,
      <Typography key={message} fontWeight={400} fontSize={13} color={'#80829F'}>
        {message}
      </Typography>,
      <Box
        key={message}
        sx={{
          gap: 10,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          '& p': {
            cursor: 'pointer'
          }
        }}
      >
        <Typography key={message} fontWeight={400} fontSize={13} color={'#3F5170'}>
          Agree
        </Typography>
        <Typography key={message} fontWeight={400} fontSize={13}>
          |
        </Typography>
        <Typography key={message} fontWeight={400} fontSize={13} color={'#e46767'}>
          Reject
        </Typography>
      </Box>
    ])
  }, [])

  return (
    <Box sx={{}}>
      <Table
        firstAlign="left"
        variant="outlined"
        header={['User', 'Role applied for', 'Applied Time', 'Message', '']}
        rows={tableList}
      ></Table>
    </Box>
  )
}
