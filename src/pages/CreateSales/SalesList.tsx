import { Box, Link, Stack, Typography } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import { routes } from 'constants/routes'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import List from './List'
import banner from 'assets/images/a.png'
import { usePublicSaleBaseList } from 'hooks/useBackedPublicSaleServer'

export default function SalesList() {
  const { loading, result: result, page } = usePublicSaleBaseList()

  return (
    <div>
      <Stack width="100%">
        <img src={banner} alt="" />
      </Stack>
      <Box
        sx={{
          padding: { sm: '40px 20px', xs: '16px' }
        }}
      >
        <ContainerWrapper maxWidth={1150}>
          <RowCenter>
            <Typography variant="h5" mr={24}>
              Swap list
            </Typography>
            <BlackButton
              style={{
                width: '252px',
                '& a': {
                  color: '#fff',
                  textDecoration: 'none'
                }
              }}
            >
              <Link href={routes.CreateSales}>Create pool</Link>
            </BlackButton>
          </RowCenter>
          <List loading={loading} page={page} result={result} />
        </ContainerWrapper>
      </Box>
    </div>
  )
}
