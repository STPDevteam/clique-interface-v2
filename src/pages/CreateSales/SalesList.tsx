import { Box, MenuItem, Stack, Typography } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import { routes } from 'constants/routes'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import List from './List'
import Select from 'components/Select/Select'
import banner from 'assets/images/a.png'
import { usePublicSaleBaseList } from 'hooks/useBackedPublicSaleServer'
import { Link } from 'react-router-dom'
import useBreakpoint from 'hooks/useBreakpoint'
// import { SwapStatus } from 'hooks/useCreatePublicSaleCallback'
import { publicSaleStatus } from 'hooks/useBackedPublicSaleServer'

const statusItemList = [
  { value: undefined, label: 'All' },
  { value: publicSaleStatus.SOON, label: 'Soon' },
  { value: publicSaleStatus.OPEN, label: 'Active' },
  { value: publicSaleStatus.ENDED, label: 'Ended' },
  { value: publicSaleStatus.CANCEL, label: 'Cancelled' }
]

export default function SalesList() {
  const isSmDown = useBreakpoint('sm')
  const { search, loading, result, page } = usePublicSaleBaseList()

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
          <RowCenter mb={50}>
            <Typography variant="h5" mr={24}>
              Swap List
            </Typography>
            <Link to={routes.CreateSales} style={{ width: 252, textDecoration: 'none' }}>
              <BlackButton>Create pool</BlackButton>
            </Link>
          </RowCenter>
          <Select
            placeholder=""
            width={isSmDown ? '175px' : '235px'}
            height={isSmDown ? '40px' : '48px'}
            value={search.status}
            onChange={e => search.setStatus(e.target.value)}
          >
            {statusItemList.map((item, index) => (
              <MenuItem
                key={index}
                sx={{ fontWeight: 500 }}
                value={item.value}
                selected={search.status && search.status === item.value}
              >
                {item.label}
              </MenuItem>
            ))}
          </Select>
          <List loading={loading} page={page} result={result} />
        </ContainerWrapper>
      </Box>
    </div>
  )
}
