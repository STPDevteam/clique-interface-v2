import { Box, Typography } from '@mui/material'
import DelayLoading from 'components/DelayLoading'
import EmptyData from 'components/EmptyData'
import Loading from 'components/Loading'
import Pagination from 'components/Pagination'
import ChainSelect from 'components/Select/ChainSelect'
import Table from 'components/Table'
import { ChainList } from 'constants/chain'
import { useTokenList } from 'hooks/useBackedDaoServer'
import { Chain } from 'models/chain'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { useMemo, useState } from 'react'
import ChainText from 'components/LogoText/ChainText'
import { ShowTokenSupply, ShowCopyTokenAddress, ShowTokenInfo } from 'components/ShowTokenInfo'

export default function TokenList() {
  const [selectChain, setSelectChain] = useState<Chain | null>(null)
  const { loading, result: tokenList, page } = useTokenList('', selectChain?.id || '')

  const tableList = useMemo(() => {
    if (loading) return []
    return tokenList.map(({ tokenAddress, chainId }) => [
      <ShowTokenInfo key={0} address={tokenAddress} chainId={chainId} />,
      <ChainText key={1} chainId={chainId} />,
      <ShowCopyTokenAddress key={2} address={tokenAddress} chainId={chainId} />,
      <Typography key={3} fontWeight={600} fontSize={13}>
        <ShowTokenSupply address={tokenAddress} chainId={chainId} />
      </Typography>
    ])
  }, [loading, tokenList])

  return (
    <Box padding="50px 20px">
      <ContainerWrapper maxWidth={1152}>
        <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
          <Typography fontSize={20} fontWeight="600">
            Token list
          </Typography>
          <ChainSelect
            empty
            width="235px"
            chainList={ChainList}
            selectedChain={selectChain}
            onChange={chain => setSelectChain(chain)}
          ></ChainSelect>
        </Box>
        <Box mt={50}>
          <Table variant="outlined" header={['Token', 'Network', 'Contact', 'Total Supply']} rows={tableList}></Table>
          {!loading && !tokenList.length && <EmptyData sx={{ marginTop: 30 }}>No data</EmptyData>}
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
        </Box>
      </ContainerWrapper>
    </Box>
  )
}
