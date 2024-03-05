import { Box, Link, styled, useTheme } from '@mui/material'
import Table from 'components/Table'
import Copy from 'components/essential/Copy'
import { useTokenHistoryCallback } from 'hooks/useBackedNftCallback'
// import { Tokens } from 'pages/Nft/Tokens'
import { useMemo } from 'react'
import EmptyData from 'components/EmptyData'
import { getEtherscanLink } from 'utils'
import Image from 'components/Image'
import placeholderImage from 'assets/images/placeholder.png'
import Loading from 'components/Loading'

const TableContentStyle = styled(Box)(({ theme }) => ({
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  color: 'var(--word-color, #3F5170)',
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '20px',
  svg: {
    width: '18px',
    height: '18px'
  },
  [theme.breakpoints.down('sm')]: {
    height: 36
  }
}))

export function History({ chainId, nftAddress }: { chainId: number | undefined; nftAddress: string | undefined }) {
  const { result: HistoryList, loading } = useTokenHistoryCallback(chainId, nftAddress)
  const theme = useTheme()

  console.log(' HistoryList=>', HistoryList, loading)

  const AssetsTableList = useMemo(() => {
    return HistoryList?.history_list.map((item, index) => [
      <TableContentStyle key={index}>{item?.cate_id || 'unknown'}</TableContentStyle>,
      <TableContentStyle key={index} gap={5}>
        <Image
          src={
            (item.sends?.length && HistoryList.token_dict[item.sends[0].token_id]?.logo_url) ||
            (item.receives?.length && HistoryList.token_dict[item.receives[0].token_id]?.logo_url) ||
            placeholderImage
          }
          height={'18px'}
          width={'18px'}
          style={{ borderRadius: '50%' }}
        />

        {(item.sends?.length && HistoryList.token_dict[item.sends[0].token_id]?.name) ||
          (item.receives?.length && HistoryList.token_dict[item.receives[0].token_id]?.name) ||
          'unknown'}
      </TableContentStyle>,
      <TableContentStyle key={index} sx={{ justifyContent: 'center' }}>
        {item.tx?.value || (item.sends && item.sends[0]?.amount) || (item.receives && item.receives[0]?.amount) || 0}
      </TableContentStyle>,
      <TableContentStyle key={index} sx={{ justifyContent: 'end', gap: 8, '& svg': { margin: 0 } }}>
        {chainId && (
          <Link
            underline="none"
            target={'_blank'}
            href={getEtherscanLink(chainId, item.id, 'transaction')}
            maxWidth={100}
            noWrap
          >
            {item.id}
          </Link>
        )}
        <Copy toCopy={item.id} />
      </TableContentStyle>
    ])
  }, [HistoryList?.history_list, HistoryList?.token_dict, chainId])

  return (
    <Box display={'grid'} gap={'16px'}>
      {loading ? (
        <Box>
          <Loading sx={{ marginTop: 30 }} />
        </Box>
      ) : (
        <>
          {AssetsTableList ? (
            <Box
              sx={{
                marginTop: '16px',
                '& table': {
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
                    '& .MuiTableCell-root:nth-of-type(2)': {
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
                },
                [theme.breakpoints.down('sm')]: {
                  display: 'grid',
                  gap: 10,
                  '.mobile_row': {
                    gap: '0 !important'
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
          ) : (
            <Box mt={16}>
              <EmptyData>No data</EmptyData>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}
