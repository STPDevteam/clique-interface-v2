import { Box, Typography } from '@mui/material'
import ChainSelect from 'components/Select/ChainSelect'
import { ChainList } from 'constants/chain'
import { Chain } from 'models/chain'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { useState } from 'react'
import TokenListTable from './TokenListTable'

export default function TokenList() {
  const [selectChain, setSelectChain] = useState<Chain | null>(null)

  return (
    <Box padding="50px 20px">
      <ContainerWrapper maxWidth={1152}>
        <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
          <Typography fontSize={20} fontWeight="600">
            Token list
          </Typography>
          <ChainSelect
            empty
            placeholder="All chains"
            width="235px"
            chainList={ChainList}
            selectedChain={selectChain}
            onChange={chain => setSelectChain(chain)}
          ></ChainSelect>
        </Box>
        <Box mt={40}>
          <TokenListTable chainId={selectChain?.id || null} />
        </Box>
      </ContainerWrapper>
    </Box>
  )
}
