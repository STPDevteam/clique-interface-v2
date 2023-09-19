import { Box, styled } from '@mui/material'
import Table from 'components/Table'
import { Tokens } from 'pages/Nft/Tokens'
import { useMemo } from 'react'

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
    Type: 'Send',
    Token: <Tokens Symbol="ETH" />,
    Amount: 0.4,
    TxID: '0x3222...3214'
  },
  {
    Type: 'Receive',

    Token: <Tokens Symbol="WETH" />,
    Amount: 10000000000,
    TxID: '0x3222...3214'
  },
  {
    Type: 'Mint',

    Token: <Tokens Symbol="USDT" />,
    Amount: 1,
    TxID: '0x3222...3214'
  },
  {
    Type: 'Approve',

    Token: <Tokens Symbol="USDC" />,
    Amount: 0,
    TxID: '0x3222...3214'
  },
  {
    Type: 'Send',
    Token: <Tokens Symbol="STPT" />,
    Amount: 4,
    TxID: '0x3222...3214'
  }
]

export function History() {
  const AssetsTableList = useMemo(() => {
    return AssetsTokenList.map(({ Type, Token, Amount, TxID }, index) => [
      <TableContentStyle key={index}>{Type}</TableContentStyle>,
      <TableContentStyle key={index} justifyContent={'center'}>
        {Token}
      </TableContentStyle>,
      <TableContentStyle key={index} style={{ justifyContent: 'center' }}>
        {Amount}
      </TableContentStyle>,
      <TableContentStyle key={index} style={{ justifyContent: 'end' }}>
        ${TxID}
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
              '& .MuiTableCell-root:nth-of-type(4)': {
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
              '& .MuiTableCell-root:nth-of-type(4)': {
                paddingRight: '10px'
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
          header={['Type', 'Token', 'Amount', 'TxID']}
          rows={AssetsTableList}
        />
      </Box>
    </Box>
  )
}
