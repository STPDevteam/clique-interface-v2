import { Box, Typography } from '@mui/material'
import ChainSelect from 'components/Select/ChainSelect'
import Table from 'components/Table'
import { ChainList } from 'constants/chain'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'

export default function index() {
  return (
    <Box padding="50px 20px">
      <ContainerWrapper maxWidth={1152}>
        <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
          <Typography fontSize={20} fontWeight="600">
            Token list
          </Typography>
          <ChainSelect width="235px" chainList={ChainList} selectedChain={ChainList[0]}></ChainSelect>
        </Box>
        <Box mt={50}>
          <Table
            variant="outlined"
            header={['Token', 'Network', 'Contact', 'DAO', 'Total Supply']}
            rows={[[1, 1, 1, 1, 1]]}
          ></Table>
        </Box>
      </ContainerWrapper>
    </Box>
  )
}
