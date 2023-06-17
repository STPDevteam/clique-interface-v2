import { Box, Typography } from '@mui/material'
import Button from 'components/Button/Button'
import Input from 'components/Input'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { ChainId } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { useApplyMember } from 'hooks/useBackedDaoServer'
import { useGetPublishJobList } from 'hooks/useBackedTaskServer'
import useModal from 'hooks/useModal'
import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function OpenJobs() {
  const { account } = useActiveWeb3React()
  const joinApply = useApplyMember()
  const { showModal } = useModal()
  const { chainId: daoChainId } = useParams<{ chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const { result: jobList } = useGetPublishJobList(curDaoChainId)
  const [input, setInput] = useState(Array(jobList.length).fill(''))

  const applyCallback = useCallback(
    (index: number, publishId: number) => {
      if (!account) return
      joinApply(publishId, input[index]).then((res: any) => {
        if (res.data.code === 400) {
          showModal(<MessageBox type="error">{res.data.msg}</MessageBox>)
        } else {
          showModal(<MessageBox type="success">Apply success</MessageBox>)
        }
      })
    },
    [account, input, joinApply, showModal]
  )

  const handleInputChange = (index: number, value: string) => {
    setInput(prevState => {
      const updateValues = [...prevState]
      updateValues[index] = value
      return updateValues
    })
  }

  return (
    <Box gap={10} mt={10}>
      {jobList.map((item, index) => (
        <Box
          key={item.jobPublishId + index}
          mb={20}
          sx={{
            width: '100%',
            minHeight: 185,
            textAlign: 'left',
            border: '1px solid #d4d7e2',
            padding: '16px 20px',
            borderRadius: '8px',
            '& p': {
              width: 742
            }
          }}
        >
          <Typography
            fontWeight={600}
            fontSize={20}
            color={'#3F5170'}
            mb={10}
            noWrap
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {item.title}
          </Typography>
          <Typography
            fontWeight={400}
            fontSize={13}
            color={'#3F5170'}
            height={72}
            sx={{
              wordBreak: 'break-word',
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 3
            }}
          >
            {item.jobBio}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 10,
              gap: 10,
              '& input': {
                color: '#3F5170'
              },
              '& button': {
                width: 141,
                height: 40
              }
            }}
          >
            <Input
              outlined={true}
              height={40}
              value={input[index]}
              onChange={e => handleInputChange(index, e.target.value)}
              placeholder="Say something (300 character limit)."
              maxLength={300}
            />
            <Button onClick={() => applyCallback(index, item.jobPublishId)}>Apply</Button>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
