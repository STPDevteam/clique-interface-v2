import { Box, styled, Typography } from '@mui/material'
import SwitchBtn from 'components/Switch'
import Table from 'components/Table'
import { Tokens } from 'pages/Nft/Tokens'
import { useMemo, useState } from 'react'

const TableContentStyle = styled(Box)(({ theme }) => ({
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  svg: {
    width: '18px',
    height: '18px'
  },
  [theme.breakpoints.down('sm')]: {
    height: 36
  }
}))
const AssetsTokenList = [
  {
    Token: <Tokens Symbol="ETH" />,
    Balance: 0,
    USDValue: 0
  },
  {
    Token: <Tokens Symbol="WETH" />,
    Balance: 0,
    USDValue: 0
  },
  {
    Token: <Tokens Symbol="USDT" />,
    Balance: 0,
    USDValue: 0
  },
  {
    Token: <Tokens Symbol="USDC" />,
    Balance: 0,
    USDValue: 0
  },
  {
    Token: <Tokens Symbol="STPT" />,
    Balance: 0,
    USDValue: 0
  }
]

export function Assets() {
  const [isCheck, setCheck] = useState<boolean>(false)

  const AssetsTableList = useMemo(() => {
    return AssetsTokenList.map(({ Token, Balance, USDValue }, index) => [
      <TableContentStyle key={index}>{Token}</TableContentStyle>,
      <TableContentStyle key={index} style={{ justifyContent: 'center' }}>
        {Balance}
      </TableContentStyle>,
      <TableContentStyle key={index} style={{ justifyContent: 'end' }}>
        ${USDValue}
      </TableContentStyle>
    ])
  }, [])

  return (
    <Box display={'grid'} gap={'16px'}>
      <Box
        sx={{
          '& table': {
            marginTop: '16px',
            border: '1px solid #D4D7E2',
            borderColor: '#D4D7E2',
            borderRadius: '8px!important',
            borderSpacing: '0!important',
            '& .MuiTableHead-root': {
              height: 30,
              backgroundColor: '#F8FBFF',
              '& .MuiTableRow-root': {
                borderRadius: 0
              },
              '& .MuiTableCell-root': {
                padding: 0
              },
              '& .MuiTableCell-root:nth-of-type(1)': {
                borderRadius: '8px 0 0 0',
                borderColor: '#D4D7E2',
                paddingLeft: '30px',
                textAlign: 'left'
              },
              '& .MuiTableCell-root:nth-of-type(3)': {
                borderRadius: '0 8px 0 0',
                borderColor: '#D4D7E2',
                paddingRight: '30px',
                textAlign: 'right'
              }
            },
            '& .MuiTableBody-root': {
              '& .MuiTableRow-root .MuiTableCell-root': {
                padding: '0'
              },
              '& .MuiTableRow-root:last-child td': {
                borderBottom: 0
              },
              '& .MuiTableCell-root:nth-of-type(3)': {
                paddingRight: '30px'
              },
              '& .MuiTableCell-root:nth-of-type(1)': {
                paddingLeft: '30px'
              }
            }
          }
        }}
      >
        <Table
          collapsible={false}
          firstAlign="center"
          variant="outlined"
          header={['Token', 'Balance', 'USD Value']}
          rows={AssetsTableList}
        />
      </Box>
      <Typography color={'#3F5170'} display={'flex'} gap={'12px'} alignItems={'center'}>
        Hide assets with 0 balance{' '}
        <SwitchBtn
          checked={isCheck}
          onChange={() => {
            setCheck(!isCheck)
          }}
        />
      </Typography>
    </Box>
  )
}
