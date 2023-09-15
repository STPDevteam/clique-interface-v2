import { Box, Tooltip, Typography, useTheme } from '@mui/material'
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
import useBreakpoint from 'hooks/useBreakpoint'
import EmptyData from 'components/EmptyData'
import { routes } from 'constants/routes'
import { useNavigate } from 'react-router-dom'
import { PublishItemProp } from 'hooks/useBackedTaskServer'

export default function JobApplication({
  result,
  reFetch,
  jobsNum,
  daoId
}: {
  result: JobsApplyListProp[]
  reFetch: () => void
  jobsNum: PublishItemProp[]
  daoId: number
}) {
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()
  const reviewApply = useReviewApply()
  const opTypeCallback = useCallback(
    (op: string, applyId: number) => {
      if (!account) return
      if (op === 'agree') {
        reviewApply(true, applyId)
          .then((res: any) => {
            if (res.data.code !== 200) {
              toast.error(res.data.msg || 'Network error')
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
              toast.error(res.data.msg || 'Network error')
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
        justifyContent={isSmDown ? 'end' : 'start'}
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
        <Tooltip title={item.nickname || 'unnamed'} arrow placement="top">
          <Typography noWrap sx={{ width: isSmDown ? 'auto' : '100px', fontSize: 16, cursor: 'pointer' }}>
            {item.nickname || 'unnamed'}
          </Typography>
        </Tooltip>
      </Box>,
      <Typography key={item.message} fontWeight={400} fontSize={13} color={'#80829F'}>
        {JobsType[item.applyLevel]}
      </Typography>,
      <Typography key={item.message} fontWeight={400} fontSize={13} color={'#80829F'}>
        {timeStampToFormat(item.applyTime)}
      </Typography>,
      <Box key={item.message} width={'100%'} style={{ cursor: 'pointer' }}>
        <Tooltip title={item.message || '--'} arrow placement="top">
          <Typography
            sx={{
              width: '100%',
              lineHeight: '20px',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              '-webkit-box-orient': 'vertical',
              '-webkit-line-clamp': '2',
              textAlign: isSmDown ? 'right' : 'center',
              paddingLeft: isSmDown ? 10 : 0
            }}
            fontWeight={400}
            fontSize={12}
            color={'#80829F'}
            noWrap
          >
            {item.message || '--'}
          </Typography>
        </Tooltip>
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
  }, [isSmDown, opTypeCallback, result])

  return (
    <Box
      sx={{
        '& table tbody tr td:nth-of-type(4)': {
          maxWidth: '173px !important'
        },
        '& .MuiTableCell-root:last-child, .MuiTableCell-root:first-of-type': {
          borderRadius: 0
        }
      }}
    >
      {isSmDown && (
        <Typography
          sx={{
            cursor: 'pointer',
            color: '#0049C6',
            fontWeight: 500,
            textAlign: 'right',
            padding: '15px 10px 6px 0',
            fontSize: '13px'
          }}
          onClick={() => {
            navigate(routes._DaoInfo + `/${daoId}/settings?tab=3`)
          }}
        >
          View open jobs({jobsNum.length})&gt;
        </Typography>
      )}
      <Box
        sx={{
          width: 'auto',
          [theme.breakpoints.down('sm')]: {
            gap: 10,
            display: 'grid'
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

      {isSmDown && !tableList.length && <EmptyData />}
    </Box>
  )
}
