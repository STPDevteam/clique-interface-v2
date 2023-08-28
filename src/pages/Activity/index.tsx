import { Box, Link, MenuItem, Typography, Tab, Tabs, styled } from '@mui/material'
import BannerWrapper from 'components/BannerWrapper'
import Select from 'components/Select/Select'
import { ActivityStatus } from 'hooks/useActivityInfo'
import { useActivityList } from 'hooks/useBackedActivityServer'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
// import { ActivityType } from 'pages/DaoInfo/Children/Activity'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import List from './List'
import SoulTokenList from './SoulTokenList'
import BannerImg from 'assets/images/activity_banner.jpg'
import BannerMobileImg from 'assets/images/activity_banner_mobile.jpeg'
import useBreakpoint from 'hooks/useBreakpoint'
import { useState } from 'react'
import { ChainList } from 'constants/chain'
import { useSbtList } from 'hooks/useBackedSbtServer'

// const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
//   display: 'grid',
//   gridTemplateColumns: '1fr 1fr 1fr 1fr',
//   '& button': {
//     borderWidth: '2px',
//     color: theme.palette.text.primary,
//     fontWeight: 600,
//     height: 36,
//     width: 88,
//     '&:hover': {
//       borderWidth: '2px'
//     },
//     '&.active': {
//       backgroundColor: theme.palette.primary.main,
//       color: theme.palette.common.white
//     }
//   }
// }))

export const TabStyle = styled(Tabs)(({ theme }) => ({
  '& .MuiButtonBase-root': {
    fontWeight: 500,
    fontSize: 18,
    lineHeight: '22px',
    color: '#3F5170',
    textTransform: 'none',
    padding: 0
  },
  '& .MuiTabs-indicator': {
    height: 4,
    background: '#0049C6',
    borderRadius: '2px',
    margin: 'auto'
  },
  '& .active': {
    fontWeight: 700,
    fontSize: 18,
    lineHeight: '22px',
    color: '#0049C6'
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiButtonBase-root': {
      fontSize: 16
    },
    '& .active': {
      fontSize: 16
    }
  }
}))

const statusItemList = [
  { value: '', label: 'All Status' },
  { value: ActivityStatus.SOON, label: ActivityStatus.SOON },
  { value: ActivityStatus.ACTIVE, label: 'Active' },
  { value: ActivityStatus.ENDED, label: ActivityStatus.ENDED },
  { value: ActivityStatus.AIRDROP, label: 'Clique Rewards' },
  { value: ActivityStatus.CLOSED, label: ActivityStatus.CLOSED }
]
const tabList = [
  { value: 'Clique Rewards', label: 'Clique Rewards' },
  { value: 'Soulbound Token', label: 'Soulbound Token' }
]

export default function Activity() {
  const { search, loading, result, page } = useActivityList()
  const { search: searchSbt, loading: loadingSbt, result: resultSbt, page: pageSbt } = useSbtList()
  const isSmDown = useBreakpoint('sm')
  const [tabValue, setTabValue] = useState(searchSbt.category || 0)

  const [chainIdVal, setChainId] = useState<number | string>(searchSbt.chainId || '')
  const [statusVal, setStatus] = useState<string>(search.status || searchSbt.status || '')

  const handleChange = (event: any, newValue: any) => {
    searchSbt.setCategory(newValue)
  }

  return (
    <div>
      <BannerWrapper imgSrc={isSmDown ? BannerMobileImg : BannerImg}>
        <Typography
          color="#fff"
          fontSize={22}
          fontWeight={700}
          sx={{
            width: { sm: '100%', xs: '50%' },
            ml: { sm: 0, xs: '16px' },
            mt: { sm: 0, xs: '30%' }
          }}
        >
          {/* {`Community rewards are live!`} */}
          <Link
            sx={{ color: 'inherit', textDecoration: 'none' }}
            target="_blank"
            href="https://stp-dao.gitbook.io/verse-network/clique/daodrop"
          >
            {`Traverse and find new worlds through rewards and education!`}
          </Link>
          {/* {` Click to know how it works. `} */}
        </Typography>
      </BannerWrapper>
      <Box
        sx={{
          padding: { sm: '40px 20px', xs: '16px' }
        }}
      >
        <ContainerWrapper maxWidth={1150}>
          <RowCenter
            sx={{
              mb: 30,
              flexDirection: isSmDown ? 'column' : '',
              gap: isSmDown ? 20 : 0,
              alignItems: isSmDown ? 'stretch' : 'center'
            }}
          >
            <TabStyle value={tabValue} onChange={handleChange}>
              {tabList.map((item, idx) => (
                <Tab
                  key={item.label + idx}
                  label={item.label}
                  onClick={() => {
                    setTabValue(idx)
                  }}
                  sx={{ gap: 10, marginRight: 50 }}
                  className={tabValue === idx ? 'active' : ''}
                ></Tab>
              ))}
            </TabStyle>
            <Box sx={{ display: 'flex', gap: isSmDown ? 10 : 16 }}>
              {tabValue === 1 && (
                <Select
                  placeholder=""
                  noBold
                  width={isSmDown ? '175px' : '250px'}
                  height={isSmDown ? '36px' : '40px'}
                  value={chainIdVal}
                  onChange={e => {
                    // search.setChainId(e.target.value)
                    searchSbt.setChainId(e.target.value)
                    setChainId(e.target.value)
                  }}
                >
                  <MenuItem sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }} value={''}>
                    All Chain
                  </MenuItem>
                  {ChainList.map(item => (
                    <MenuItem
                      key={item.id}
                      sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                      value={item.id}
                      selected={searchSbt.chainId === item.id}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              )}

              <Select
                placeholder=""
                noBold
                width={isSmDown ? '175px' : '250px'}
                height={isSmDown ? '36px' : '40px'}
                value={statusVal}
                onChange={e => {
                  search.setStatus(e.target.value)
                  searchSbt.setStatus(e.target.value)
                  setStatus(e.target.value)
                }}
              >
                {statusItemList.map((item, index) => (
                  <MenuItem
                    key={index}
                    sx={{ fontWeight: 500 }}
                    value={item.value}
                    selected={tabValue === 0 ? search.status === item.value : searchSbt.status === item.value}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </RowCenter>
          {tabValue === 0 ? (
            <>
              <List loading={loading} page={page} result={result} />
            </>
          ) : (
            <>
              <SoulTokenList loading={loadingSbt} page={pageSbt} result={resultSbt} />
            </>
          )}
        </ContainerWrapper>
      </Box>
    </div>
  )
}
