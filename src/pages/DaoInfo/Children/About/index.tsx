import {
  Stack,
  styled,
  Typography,
  Link as MuiLink,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { Box } from '@mui/system'
import EmptyData from 'components/EmptyData'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import Loading from 'components/Loading'
import Tooltip from 'components/Tooltip'
import { ChainId, ChainListMap } from 'constants/chain'
import { routes } from 'constants/routes'
import { useBackedDaoAdmins } from 'hooks/useBackedDaoServer'
import useBreakpoint from 'hooks/useBreakpoint'
import { useDaoInfo } from 'hooks/useDaoInfo'
import { AdminTagListBlock } from 'pages/DaoInfo/ShowAdminTag'
import { ShowDaoToken } from 'pages/Governance/DaoItem'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { VotingTypesName } from 'state/buildingGovDao/actions'
import { getEtherscanLink } from 'utils'
import { getVotingNumberByTimestamp } from 'utils/dao'
import Image from 'components/Image'
import avatar from 'assets/images/avatar.png'
import { shortenAddress } from 'utils'

export const StyledItem = styled(Stack)(({ theme }) => ({
  border: `1px solid #D4D7E2`,
  padding: '24px 47px 26px 24px',
  borderRadius: theme.borderRadius.default,
  boxShadow: theme.boxShadow.bs1,
  marginBottom: 30,
  [theme.breakpoints.down('sm')]: {
    padding: '20px'
  }
}))

const Title = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  color: '#B5B7CF'
}))

const StyledTitle = styled(Typography)(({}) => ({
  fontFamily: 'Poppins',
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: '21px',
  color: '#80829F',
  marginBottom: 14
}))
const ContentTitle = styled(Typography)(() => ({
  fontFamily: 'Inter',
  fontWeight: 500,
  fontSize: '13px',
  lineHeight: '16px',
  color: '#B5B7CF'
}))

const StyledText = styled(Typography)(
  ({
    fontSize,
    theme,
    fontWeight,
    color
  }: {
    fontSize?: number
    theme?: any
    fontWeight?: number
    color?: string
  }) => ({
    fontSize: fontSize || 16,
    fontWeight: fontWeight || 600,
    fontFamily: 'Inter',
    lineHeight: '20px',
    color: color || theme.palette.text.primary
  })
)

export default function About() {
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const isSmDown = useBreakpoint('sm')
  const theme = useTheme()
  const daoInfo = useDaoInfo(daoAddress, curDaoChainId)
  const { result: daoAdminList, loading: daoAdminLoading } = useBackedDaoAdmins(daoAddress, curDaoChainId)
  const votingPeriodDate = useMemo(
    () => (daoInfo?.votingPeriod ? getVotingNumberByTimestamp(daoInfo.votingPeriod) : undefined),
    [daoInfo?.votingPeriod]
  )

  return (
    <div>
      <Title sx={{ mb: 18 }}>Governance</Title>
      <BasicTable />
      <StyledItem
        direction={isSmDown ? 'column' : 'row'}
        gap={isSmDown ? 20 : 10}
        sx={{
          mt: 20,
          justifyContent: { sm: 'space-between', xs: 'unset' }
        }}
      >
        <Stack spacing={isSmDown ? 16 : 10}>
          <ContentTitle sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            Threshold
            <Tooltip value={'Minimum Votes Needed For Proposal To Execute '} />
          </ContentTitle>
          <StyledText>{daoInfo?.votingThreshold?.toSignificant(6, { groupSeparator: ',' })} Votes</StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 16 : 10}>
          <ContentTitle>Voting Period</ContentTitle>
          <StyledText>
            {votingPeriodDate
              ? `${votingPeriodDate.day} Days, ${votingPeriodDate.hour} Hours, ${votingPeriodDate.minute} Minutes`
              : '--'}
          </StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 16 : 10}>
          <ContentTitle>Voting Types</ContentTitle>
          <StyledText>{daoInfo?.votingType !== undefined ? VotingTypesName[daoInfo.votingType] : '--'}</StyledText>
        </Stack>
      </StyledItem>

      <StyledTitle variant="h5">Token info</StyledTitle>
      <StyledItem
        direction={isSmDown ? 'column' : 'row'}
        gap={isSmDown ? 20 : 10}
        sx={{
          justifyContent: { sm: 'space-between', xs: 'unset' }
        }}
      >
        <Stack spacing={isSmDown ? 10 : 12}>
          <ContentTitle>Network</ContentTitle>
          <StyledText>{daoInfo ? ChainListMap[daoInfo.daoTokenChainId]?.name : '--'}</StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 10 : 12}>
          <ContentTitle>Token</ContentTitle>
          <StyledText>
            <Stack direction={'row'} alignItems="center">
              <CurrencyLogo currency={daoInfo?.token || undefined} size="24px" style={{ marginRight: '5px' }} />
              <MuiLink
                href={
                  daoInfo ? getEtherscanLink(daoInfo.daoTokenChainId, daoInfo.daoTokenAddress, 'address') : undefined
                }
                underline="hover"
                target="_blank"
              >
                <StyledText>
                  <ShowDaoToken token={daoInfo?.token} />
                </StyledText>
              </MuiLink>
            </Stack>
          </StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 10 : 12}>
          <ContentTitle>Price</ContentTitle>
          <StyledText>--</StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 10 : 12}>
          <ContentTitle>Token Contracts Address</ContentTitle>
          <StyledText
            fontSize={12}
            sx={{
              wordBreak: 'break-all'
            }}
          >
            {daoInfo?.token?.address || '--'}
          </StyledText>
        </Stack>
      </StyledItem>

      <StyledTitle variant="h5">Governance settings</StyledTitle>
      <StyledItem
        direction={isSmDown ? 'column' : 'row'}
        gap={isSmDown ? 20 : 10}
        sx={{
          justifyContent: { sm: 'space-between', xs: 'unset' }
        }}
      >
        <Stack spacing={isSmDown ? 16 : 10}>
          <ContentTitle>Min. holding for proposal</ContentTitle>
          <StyledText>{`${daoInfo?.proposalThreshold?.toSignificant(6, {
            groupSeparator: ','
          })} ${daoInfo?.token?.symbol || '-'}`}</StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 16 : 10}>
          <ContentTitle>Min. votes for proposal execution</ContentTitle>
          <StyledText>{daoInfo?.votingThreshold?.toSignificant(6, { groupSeparator: ',' })} Votes</StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 16 : 10}>
          <ContentTitle>Default voting period</ContentTitle>
          <StyledText>
            {votingPeriodDate
              ? `${votingPeriodDate.day} Days, ${votingPeriodDate.hour} Hours, ${votingPeriodDate.minute} Minutes`
              : '--'}
          </StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 16 : 10}>
          <ContentTitle>Voting types allowed</ContentTitle>
          <StyledText>{daoInfo?.votingType !== undefined ? VotingTypesName[daoInfo.votingType] : '--'}</StyledText>
        </Stack>
      </StyledItem>

      <StyledTitle variant="h5">Member</StyledTitle>
      <Box
        sx={{
          border: `1px solid #D4D7E2`,
          borderRadius: theme.borderRadius.default,
          boxShadow: theme.boxShadow.bs1,
          marginBottom: 30
        }}
      >
        {daoAdminLoading ? (
          <Loading />
        ) : (
          <>
            {daoAdminList?.map((address, index) => (
              <Box
                key={address}
                display={'grid'}
                sx={{
                  padding: '18px 33px 18px 24px',
                  borderTop: index > 0 ? '1px solid #D4D7E2' : '',
                  gridTemplateColumns: { sm: '1fr 1fr', xs: '1fr 80px' }
                }}
                alignItems={'center'}
                gap="10px 20px"
              >
                <Link
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'center'
                  }}
                  to={routes._Profile + `/${address}`}
                >
                  <Image width={24} src={avatar} />
                  <StyledText
                    key={address}
                    fontSize={14}
                    color="#80829F"
                    sx={{
                      wordBreak: 'break-all'
                    }}
                  >
                    {address}
                  </StyledText>
                </Link>
                <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'row' }}>
                  <AdminTagListBlock chainId={curDaoChainId} daoAddress={daoAddress} account={address} />
                </div>
              </Box>
            ))}
          </>
        )}
        {!daoAdminLoading && !daoAdminList?.length && <EmptyData />}
      </Box>
    </div>
  )
}

const TableContentTitle = styled(TableCell)(() => ({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '13px',
  lineHeight: ' 16px',
  color: '#B5B7CF',
  padding: '7px 0'
}))
const TableContentText = styled(TableCell)(() => ({
  height: 60,
  padding: 0,
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: ' 20px',
  color: '#3F5170'
}))

function BasicTable() {
  const rows = [
    {
      token: 'Loot (LOOT)',
      network: 'Ethereum',
      address: '0xF2da7b9CDb35Dc7c8e875DE0241b02376825CF86',
      requir: '111',
      weight: '1STP=1 Votes'
    },
    {
      token: 'Loot (LOOT)',
      network: 'Ethereum',
      address: '0xF2da7b9CDb35Dc7c8e875DE0241b02376825CF86',
      requir: '111',
      weight: '1STP=1 Votes'
    }
  ]
  return (
    <TableContainer sx={{ border: '1px solid #D4D7E2', borderRadius: '8px' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableContentTitle sx={{ pl: 30 }}>Token</TableContentTitle>
            <TableContentTitle>Network</TableContentTitle>
            <TableContentTitle>Token contract address</TableContentTitle>
            <TableContentTitle>Requirement</TableContentTitle>
            <TableContentTitle>Voting weight</TableContentTitle>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.token} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableContentText sx={{ pl: 30, display: 'flex', alignItems: 'center', gap: 12 }}>
                <CurrencyLogo size="32px" />
                {row.token}
              </TableContentText>
              <TableContentText>{row.network}</TableContentText>
              <TableContentText>{shortenAddress(row.address, 3)}</TableContentText>
              <TableContentText>{row.requir}</TableContentText>
              <TableContentText>{row.weight}</TableContentText>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
