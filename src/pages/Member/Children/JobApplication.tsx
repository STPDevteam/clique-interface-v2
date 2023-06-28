import { Box, Typography } from '@mui/material'
// import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import Image from 'components/Image'
import { timeStampToFormat } from 'utils/dao'
import Table from 'components/Table'
import { useCallback, useMemo } from 'react'
import { JobsApplyListProp } from 'hooks/useBackedDaoServer'
import { useReviewApply } from 'hooks/useBackedTaskServer'
import { useActiveWeb3React } from 'hooks'
import { JobsType } from './CardView'
import avatar from 'assets/images/avatar.png'
import { toast } from 'react-toastify'
// import Button from 'components/Button/Button'

export default function JobApplication({ result, reFetch }: { result: JobsApplyListProp[]; reFetch: () => void }) {
  const { account } = useActiveWeb3React()
  const reviewApply = useReviewApply()
  const opTypeCallback = useCallback(
    (op: string, applyId: number) => {
      if (!account) return
      if (op === 'agree') {
        reviewApply(true, applyId)
          .then((res: any) => {
            if (res.data.code !== 200) {
              toast.error(res.data.msg || 'network error')
              return
            }
            reFetch()
            toast.success('Agree success')
          })
          .catch(e => console.log(e))
      } else {
        reviewApply(false, applyId)
          .then((res: any) => {
            if (res.data.code !== 200) {
              toast.error(res.data.msg || 'network error')
              return
            }
            reFetch()
            toast.success('Reject success')
          })
          .catch(e => console.log(e))
      }
    },
    [account, reFetch, reviewApply]
  )

  const tableList = useMemo(() => {
    return result.map((item: JobsApplyListProp) => [
      <Box
        key={item.message}
        display={'flex'}
        gap={10}
        alignItems={'center'}
        fontWeight={500}
        sx={{
          width: '100%',
          '& img': {
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: '1px solid #D4DCE2'
          }
        }}
      >
        <Image src={item.avatar || avatar}></Image>
        {item.nickname || 'unnamed'}
      </Box>,
      <Typography key={item.message} fontWeight={400} fontSize={13} color={'#80829F'}>
        {JobsType[item.applyRole]}
      </Typography>,
      <Typography key={item.message} fontWeight={400} fontSize={13} color={'#80829F'}>
        {timeStampToFormat(item.applyTime)}
      </Typography>,
      <Box key={item.message} width={'100%'}>
        <Typography
          noWrap
          sx={{
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          fontWeight={400}
          fontSize={12}
          color={'#80829F'}
        >
          {item.message || '--'}
        </Typography>
      </Box>,
      <Box
        key={item.message}
        sx={{
          gap: 10,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          '& p': {
            cursor: 'pointer'
          }
        }}
      >
        <Typography
          key={item.message + 1}
          fontWeight={400}
          fontSize={13}
          color={'#3F5170'}
          onClick={() => {
            opTypeCallback('agree', item.applyId)
          }}
        >
          Agree
        </Typography>
        <Typography key={item.message} fontWeight={400} fontSize={13} color={'#D4D7E2'}>
          |
        </Typography>
        <Typography
          key={item.message + 2}
          fontWeight={400}
          fontSize={13}
          color={'#e46767'}
          onClick={() => {
            opTypeCallback('reject', item.applyId)
          }}
        >
          Reject
        </Typography>
      </Box>
    ])
  }, [opTypeCallback, result])

  return (
    <Box
      sx={{
        '& table tbody tr td:nth-of-type(4)': {
          maxWidth: '173px !important'
        }
      }}
    >
      <Table
        firstAlign="left"
        variant="outlined"
        header={['User', 'Role applied for', 'Applied Time', 'Message', '']}
        rows={tableList}
      ></Table>
    </Box>
  )
}
