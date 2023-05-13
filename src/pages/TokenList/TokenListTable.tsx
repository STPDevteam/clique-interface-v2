import { Box, Typography } from '@mui/material'
import DelayLoading from 'components/DelayLoading'
import Loading from 'components/Loading'
import Pagination from 'components/Pagination'
import Table from 'components/Table'
import { useTokenList } from 'hooks/useBackedDaoServer'
import { useMemo } from 'react'
import ChainText from 'components/LogoText/ChainText'
import { ShowTokenSupply, ShowCopyTokenAddress, ShowTokenInfo } from 'components/ShowTokenInfo'
import { ChainId } from 'constants/chain'

export default function TokenListTable({ chainId, account }: { chainId?: ChainId | null; account?: string }) {
  const { loading, result: tokenList, page } = useTokenList(account || '', chainId || '')

  const tableList = useMemo(() => {
    if (loading) return []
    return tokenList.map(({ tokenAddress, chainId }) => [
      <Box key={tokenAddress} display={'flex'}>
        <ShowTokenInfo address={tokenAddress} chainId={chainId} />
      </Box>,
      <ChainText key={tokenAddress} chainId={chainId} />,
      <ShowCopyTokenAddress key={2} address={tokenAddress} chainId={chainId} />,
      <Typography key={tokenAddress} fontWeight={600} fontSize={13}>
        <ShowTokenSupply address={tokenAddress} chainId={chainId} />
      </Typography>
    ])
  }, [loading, tokenList])

  return (
    <>
      <Table
        firstAlign="left"
        variant="outlined"
        header={['Token', 'Network', 'Contact', 'Total Supply']}
        rows={tableList}
      ></Table>
      <DelayLoading loading={loading}>
        <Loading sx={{ marginTop: 30 }} />
      </DelayLoading>
      <Box mt={40} display={'flex'} justifyContent="center">
        <Pagination
          count={page.totalPage}
          page={page.currentPage}
          onChange={(_, value) => page.setCurrentPage(value)}
        />
      </Box>
    </>
  )
}
