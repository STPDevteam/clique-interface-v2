import { Box, Typography } from '@mui/material'
// import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import Image from 'components/Image'
import { timeStampToFormat } from 'utils/dao'
import Table from 'components/Table'
import { useMemo } from 'react'
// import Button from 'components/Button/Button'

export default function JobApplication({ result }: any) {
  const tableList = useMemo(() => {
    return result.map((item: any) => [
      <Box
        key={item.message}
        display={'flex'}
        gap={10}
        alignItems={'center'}
        fontWeight={500}
        sx={{
          minWidth: '924px',
          width: '100%',
          '& img': {
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: '1px solid #D4DCE2'
          }
        }}
      >
        <Image src={item.avatar}></Image>
        {item.nickname}
      </Box>,
      <Typography key={item.message} fontWeight={400} fontSize={13} color={'#80829F'}>
        {item.applyRole}
      </Typography>,
      <Typography key={item.message} fontWeight={400} fontSize={13} color={'#80829F'}>
        {timeStampToFormat(item.applyTime)}
      </Typography>,
      <Typography key={item.message} fontWeight={400} fontSize={13} color={'#80829F'}>
        {item.message}
      </Typography>,
      <Box
        key={item.message}
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
        <Typography key={item.message} fontWeight={400} fontSize={13} color={'#3F5170'}>
          Agree
        </Typography>
        <Typography key={item.message} fontWeight={400} fontSize={13}>
          |
        </Typography>
        <Typography key={item.message} fontWeight={400} fontSize={13} color={'#e46767'}>
          Reject
        </Typography>
      </Box>
    ])
  }, [result])

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
