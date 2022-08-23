import { Box, Link, styled, Typography, useTheme } from '@mui/material'
import { ChainId } from 'constants/chain'
import { ProposalDetailProp } from 'hooks/useProposalInfo'
import { AdminTagBlock } from 'pages/DaoInfo/ShowAdminTag'
import { getEtherscanLink, shortenAddress } from 'utils'
import { timeStampToFormat } from 'utils/dao'
import { RowCenter } from '../ProposalItem'
import { VoteWrapper } from './Vote'

const LeftText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary
}))

export default function Info({
  proposalInfo,
  daoAddress,
  daoChainId
}: {
  proposalInfo: ProposalDetailProp
  daoChainId: ChainId
  daoAddress: string
}) {
  const theme = useTheme()
  return (
    <VoteWrapper>
      <Typography variant="h6" mb={19} fontWeight={500}>
        Details
      </Typography>
      <Box display={'grid'} gridTemplateColumns="86px 1fr" rowGap={15} alignItems={'center'}>
        <LeftText>Proposer</LeftText>
        <RowCenter>
          <Link underline="none" target={'_blank'} href={getEtherscanLink(daoChainId, proposalInfo.creator, 'address')}>
            <Typography fontSize={13} fontWeight={600} color={theme.palette.primary.light}>
              {shortenAddress(proposalInfo.creator)}
            </Typography>
          </Link>
          <AdminTagBlock daoAddress={daoAddress} chainId={daoChainId} account={proposalInfo.creator} />
        </RowCenter>

        <LeftText>Start Time</LeftText>
        <Typography>{timeStampToFormat(proposalInfo.startTime)}</Typography>

        <LeftText>End Time</LeftText>
        <Typography>{timeStampToFormat(proposalInfo.endTime)}</Typography>

        <LeftText>Snapshot</LeftText>
        <Link underline="none" sx={{ display: 'flex' }}>
          <Typography fontSize={13} fontWeight={600} color={theme.palette.primary.light}>
            1212211
          </Typography>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.25 4.75C5.85218 4.75 5.47064 4.90804 5.18934 5.18934C4.90804 5.47064 4.75 5.85218 4.75 6.25V17.75C4.75 18.1478 4.90804 18.5294 5.18934 18.8107C5.47064 19.092 5.85218 19.25 6.25 19.25H17.75C18.1478 19.25 18.5294 19.092 18.8107 18.8107C19.092 18.5294 19.25 18.1478 19.25 17.75V13.75C19.25 13.4848 19.3554 13.2304 19.5429 13.0429C19.7304 12.8554 19.9848 12.75 20.25 12.75C20.5152 12.75 20.7696 12.8554 20.9571 13.0429C21.1446 13.2304 21.25 13.4848 21.25 13.75V17.75C21.25 18.6783 20.8813 19.5685 20.2249 20.2249C19.5685 20.8813 18.6783 21.25 17.75 21.25H6.25C5.32174 21.25 4.4315 20.8813 3.77513 20.2249C3.11875 19.5685 2.75 18.6783 2.75 17.75V6.25C2.75 5.32174 3.11875 4.4315 3.77513 3.77513C4.4315 3.11875 5.32174 2.75 6.25 2.75H10.25C10.5152 2.75 10.7696 2.85536 10.9571 3.04289C11.1446 3.23043 11.25 3.48478 11.25 3.75C11.25 4.01522 11.1446 4.26957 10.9571 4.45711C10.7696 4.64464 10.5152 4.75 10.25 4.75H6.25ZM12.75 3.75C12.75 3.48478 12.8554 3.23043 13.0429 3.04289C13.2304 2.85536 13.4848 2.75 13.75 2.75H20.25C20.5152 2.75 20.7696 2.85536 20.9571 3.04289C21.1446 3.23043 21.25 3.48478 21.25 3.75V10.25C21.25 10.5152 21.1446 10.7696 20.9571 10.9571C20.7696 11.1446 20.5152 11.25 20.25 11.25C19.9848 11.25 19.7304 11.1446 19.5429 10.9571C19.3554 10.7696 19.25 10.5152 19.25 10.25V6.164L14.457 10.957C14.3648 11.0525 14.2544 11.1287 14.1324 11.1811C14.0104 11.2335 13.8792 11.2611 13.7464 11.2623C13.6136 11.2634 13.4819 11.2381 13.359 11.1878C13.2361 11.1375 13.1245 11.0633 13.0306 10.9694C12.9367 10.8755 12.8625 10.7639 12.8122 10.641C12.7619 10.5181 12.7366 10.3864 12.7377 10.2536C12.7389 10.1208 12.7665 9.9896 12.8189 9.8676C12.8713 9.74559 12.9475 9.63525 13.043 9.543L17.836 4.75H13.75C13.4848 4.75 13.2304 4.64464 13.0429 4.45711C12.8554 4.26957 12.75 4.01522 12.75 3.75Z"
              fill={theme.palette.primary.light}
            />
          </svg>
        </Link>
      </Box>
    </VoteWrapper>
  )
}
