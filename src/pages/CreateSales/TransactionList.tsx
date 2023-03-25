import { Box, Link, Stack, Typography } from '@mui/material'
import DelayLoading from 'components/DelayLoading'
import EmptyData from 'components/EmptyData'
import Loading from 'components/Loading'
import Pagination from 'components/Pagination'
import { TokenAmount } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { PublicSaleListBaseProp, transactionListProp, usePublicSaleBaseList } from 'hooks/useBackedPublicSaleServer'
import JSBI from 'jsbi'
import { useToken } from 'state/wallet/hooks'
import theme from 'theme'
import { getEtherscanLink } from 'utils'
import { timeStampToFormat } from 'utils/dao'
import isZero from 'utils/isZero'

export default function TransactionList({
  loading,
  page,
  result0,
  saleId
}: {
  loading: boolean
  page: {
    setCurrentPage: (currentPage: number) => void
    currentPage: number
    total: number
    totalPage: number
    pageSize: number
  }
  result0: transactionListProp[]
  saleId: string
}) {
  const { chainId } = useActiveWeb3React()
  const { result } = usePublicSaleBaseList(saleId)
  const SwapData: PublicSaleListBaseProp = result[0]
  const saleToken = useToken(SwapData?.saleToken, SwapData?.chainId)
  const receiveToken = useToken(SwapData?.receiveToken, SwapData?.chainId)
  console.log(result)
  console.log(result0)

  return (
    <>
      <Box minHeight={150}>
        {!loading && !result0.length && <EmptyData sx={{ marginTop: 30 }}>No data</EmptyData>}
        <DelayLoading loading={loading}>
          <Loading sx={{ marginTop: 30 }} />
        </DelayLoading>
        <Stack mt={40} spacing={40}>
          {result0.map(item => {
            return (
              <Stack key={item.saleId} display={'flex'} justifyContent={'space-between'} flexDirection={'row'}>
                <Link
                  href={
                    receiveToken && chainId && !isZero(receiveToken?.address)
                      ? getEtherscanLink(chainId, receiveToken?.address, 'address')
                      : undefined
                  }
                >
                  Swap{' '}
                  {item.payAmount &&
                    receiveToken &&
                    new TokenAmount(receiveToken, JSBI.BigInt(item.payAmount)).toSignificant()}{' '}
                  {item.payTokenName} to{' '}
                  {item.buy_amount &&
                    saleToken &&
                    new TokenAmount(saleToken, JSBI.BigInt(item.buy_amount)).toSignificant()}{' '}
                  {item.buyTokenName}
                </Link>
                <Typography color={theme.palette.text.secondary} fontWeight={500} lineHeight={1.5} variant="inherit">
                  {timeStampToFormat(Number(item.time))}
                </Typography>
              </Stack>
            )
          })}
        </Stack>
      </Box>
      <Box mt={20} display={'flex'} justifyContent="center">
        <Pagination
          count={page.totalPage}
          page={page.currentPage}
          onChange={(_, value) => page.setCurrentPage(value)}
        />
      </Box>
    </>
  )
}
