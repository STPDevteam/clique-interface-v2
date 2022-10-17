import { Box, Typography } from '@mui/material'
import ChainSelect from 'components/Select/ChainSelect'
import { ChainList } from 'constants/chain'
import { Chain } from 'models/chain'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { useState } from 'react'
import TokenListTable from './TokenListTable'
import BannerWrapper from 'components/BannerWrapper'
import TokenImg from 'assets/images/token_banner.jpg'
import { Link } from 'react-router-dom'
import { routes } from 'constants/routes'

export default function TokenList() {
  const [selectChain, setSelectChain] = useState<Chain | null>(null)

  return (
    <Box>
      <BannerWrapper imgSrc={TokenImg}>
        <Typography color="#fff" fontSize={22} fontWeight={700}>
          Tokenize your DAO with a purpose!
          <Link
            style={{ color: 'inherit', textDecoration: 'none' }}
            to={routes.CreatorToken}
          >{` Create your token here >`}</Link>
        </Typography>
      </BannerWrapper>
      <Box padding="40px 20px">
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
    </Box>
  )
}
