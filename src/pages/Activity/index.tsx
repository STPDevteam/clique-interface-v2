import { Box, Link, MenuItem, Typography, Tab, Tabs, styled } from '@mui/material'
import BannerWrapper from 'components/BannerWrapper'
import Select from 'components/Select/Select'
import { ActivityStatus } from 'hooks/useActivityInfo'
import { useActivityList } from 'hooks/useBackedActivityServer'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
// import { ActivityType } from 'pages/DaoInfo/Children/Activity'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import List from './List'
import SoulboundList from './SoulboundList'
import BannerImg from 'assets/images/activity_banner.jpg'
import BannerMobileImg from 'assets/images/activity_banner_mobile.jpeg'
import useBreakpoint from 'hooks/useBreakpoint'
import { useState } from 'react'

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

const TabStyle = styled(Tabs)(() => ({
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
  }
}))

const statusItemList = [
  { value: undefined, label: 'All status' },
  { value: ActivityStatus.SOON, label: ActivityStatus.SOON },
  { value: ActivityStatus.OPEN, label: ActivityStatus.OPEN },
  { value: ActivityStatus.ENDED, label: ActivityStatus.ENDED },
  { value: ActivityStatus.AIRDROP, label: 'DAO Rewards' },
  { value: ActivityStatus.CLOSED, label: ActivityStatus.CLOSED }
]
const tabList = [
  { value: 'DAO Rewards', label: 'DAO Rewards' },
  { value: 'Soulbound Token on DAO', label: 'Soulbound Token on DAO' }
]

export default function Activity() {
  const { search, loading, result, page } = useActivityList()
  const isSmDown = useBreakpoint('sm')
  const [tabValue, setTabValue] = useState(0)

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
          {`Community rewards are live!`}
          <Link
            sx={{ color: 'inherit', textDecoration: 'none' }}
            target="_blank"
            href="https://stp-dao.gitbook.io/verse-network/clique/daodrop"
          >{` Click to know how it works. `}</Link>
        </Typography>
      </BannerWrapper>
      <Box
        sx={{
          padding: { sm: '40px 20px', xs: '16px' }
        }}
      >
        <ContainerWrapper maxWidth={1150}>
          <RowCenter sx={{ mb: 30 }}>
            <TabStyle value={tabValue}>
              {tabList.map((item, idx) => (
                <Tab
                  key={item.label + idx}
                  label={item.label}
                  onClick={() => setTabValue(idx)}
                  sx={{ gap: 10, marginRight: 50 }}
                  className={tabValue === idx ? 'active' : ''}
                ></Tab>
              ))}
            </TabStyle>
            <Box sx={{ display: 'flex', gap: 16 }}>
              <Select
                placeholder=""
                noBold
                width={isSmDown ? '175px' : '270px'}
                height={isSmDown ? '36px' : '40px'}
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
              <Select
                placeholder=""
                noBold
                width={isSmDown ? '175px' : '270px'}
                height={isSmDown ? '36px' : '40px'}
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
            </Box>
          </RowCenter>
          {tabValue === 0 ? (
            <>
              <List loading={loading} page={page} result={result} />
            </>
          ) : (
            <>
              <SoulboundList />
            </>
          )}
        </ContainerWrapper>
      </Box>
    </div>
  )
}
