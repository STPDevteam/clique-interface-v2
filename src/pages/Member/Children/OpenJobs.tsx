import { Box, Typography } from '@mui/material'
import Button from 'components/Button/Button'
import Input from 'components/Input'
import { useState } from 'react'

export default function OpenJobs() {
  const [inputValue, setInputValue] = useState('')

  return (
    <Box gap={10} mt={10}>
      <Box
        sx={{
          width: '100%',
          minHeight: 185,
          textAlign: 'left',
          border: '1px solid #d4d7e2',
          padding: '16px 20px',
          borderRadius: '8px'
        }}
      >
        <Typography fontWeight={600} fontSize={20} color={'#3F5170'} mb={10}>
          Contract developer
        </Typography>
        <Typography fontWeight={400} fontSize={13} color={'#3F5170'}>
          1、Job requirements
        </Typography>
        <Typography fontWeight={400} fontSize={13} color={'#3F5170'}>
          2、Work content
        </Typography>
        <Typography fontWeight={400} fontSize={13} color={'#3F5170'}>
          3、Benefits...
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 10,
            gap: 10,
            '& button': {
              width: 141,
              height: 40
            }
          }}
        >
          <Input
            outlined={true}
            height={40}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Say something (300 character limit)."
            maxLength={300}
          />
          <Button>Apply</Button>
        </Box>
      </Box>
    </Box>
  )
}
