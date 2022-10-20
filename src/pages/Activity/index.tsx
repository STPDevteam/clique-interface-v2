import { Box, Link, MenuItem, Typography } from '@mui/material'
import BannerWrapper from 'components/BannerWrapper'
import Select from 'components/Select/Select'
import { ActivityStatus } from 'hooks/useActivityInfo'
import { useActivityList } from 'hooks/useBackedActivityServer'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
// import { ActivityType } from 'pages/DaoInfo/Children/Activity'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import List from './List'
import BannerImg from 'assets/images/activity_banner.jpg'

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

// const typeItemList = [
//   { value: undefined, label: 'All types' },
//   // { value: ActivityType.PUBLIC_SALE, label: ActivityType.PUBLIC_SALE },
//   { value: ActivityType.AIRDROP, label: ActivityType.AIRDROP }
// ]

const statusItemList = [
  { value: undefined, label: 'All' },
  { value: ActivityStatus.SOON, label: ActivityStatus.SOON },
  { value: ActivityStatus.OPEN, label: ActivityStatus.OPEN },
  { value: ActivityStatus.ENDED, label: ActivityStatus.ENDED },
  { value: ActivityStatus.AIRDROP, label: 'DAO Reward' },
  { value: ActivityStatus.CLOSED, label: ActivityStatus.CLOSED }
]

export default function Activity() {
  const { search, loading, result, page } = useActivityList()

  return (
    <div>
      <BannerWrapper imgSrc={BannerImg}>
        <Typography color="#fff" fontSize={22} fontWeight={700}>
          {`Community rewards are live!`}
          <Link
            sx={{ color: 'inherit', textDecoration: 'none' }}
            target="_blank"
            href="https://stp-dao.gitbook.io/verse-network/clique/daodrop"
          >{` Click to know how it works. `}</Link>
        </Typography>
      </BannerWrapper>
      <Box padding="40px 20px">
        <ContainerWrapper maxWidth={1150}>
          <RowCenter>
            <RowCenter>
              <Typography variant="h5" mr={24}>
                DAO Reward
              </Typography>
              {/* <Select
              placeholder=""
              width={235}
              height={48}
              value={search.types}
              onChange={e => search.setTypes(e.target.value)}
            >
              {typeItemList.map((item, index) => (
                <MenuItem
                  key={index}
                  sx={{ fontWeight: 500 }}
                  value={item.value}
                  selected={search.types && search.types === item.value}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Select> */}
            </RowCenter>
            {/* <StyledButtonGroup variant="outlined">
            {statusItemList.map(item => (
              <MuiButton
                key={item.label}
                className={search.status === item.value ? 'active' : ''}
                onClick={() => search.setStatus(item.value)}
              >
                {item.label}
              </MuiButton>
            ))}
          </StyledButtonGroup> */}
            <Select
              placeholder=""
              width={235}
              height={48}
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
          </RowCenter>
          <List loading={loading} page={page} result={result} />
        </ContainerWrapper>
      </Box>
    </div>
  )
}
