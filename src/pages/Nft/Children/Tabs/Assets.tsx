import { Box, styled, Typography } from '@mui/material'
import SwitchBtn from 'components/Switch'
import Table from 'components/Table'
import { TokenListMap } from 'pages/Nft/Tokens'
import Image from 'components/Image'
import { useMemo, useState } from 'react'
import { useCurrencyBalance } from 'state/wallet/hooks'

const TableContentStyle = styled(Box)(({ theme }) => ({
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  color: 'var(--word-color, #3F5170)',
  fontSize: '14px',
  svg: {
    width: '18px',
    height: '18px',
    borderRadius: '50%'
  },
  [theme.breakpoints.down('sm')]: {
    height: 36
  }
}))

export function Assets({ chainId, nftAddress }: { chainId: number; nftAddress: string | undefined }) {
  const [isCheck, setCheck] = useState<boolean>(false)
  const TokenList = TokenListMap(chainId)

  const AssetsTableList = useMemo(() => {
    return TokenList.map((v, index) => [
      <TableContentStyle key={index} sx={{ gap: 8 }}>
        <Image src={v?.logo || ''} height={18} width={18} />
        {v.symbol}
      </TableContentStyle>,
      <ItemBalance key={index} network={v} nftAddress={nftAddress} chainId={chainId} />,
      <TableContentStyle key={index} style={{ justifyContent: 'end' }}>
        ${0}
      </TableContentStyle>
    ])
  }, [TokenList, chainId, nftAddress])

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

function ItemBalance({
  network,
  nftAddress,
  chainId
}: {
  network: any
  nftAddress: string | undefined
  chainId: number
}) {
  const airdropCurrencyBalance = useCurrencyBalance(nftAddress || undefined, network || undefined, chainId || undefined)

  return (
    <>
      <TableContentStyle style={{ justifyContent: 'center' }}>
        {airdropCurrencyBalance?.toSignificant(6) || '--'}
      </TableContentStyle>
    </>
  )
}
