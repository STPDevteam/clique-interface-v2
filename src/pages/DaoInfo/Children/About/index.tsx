import {
  Stack,
  styled,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box
} from '@mui/material'
import EmptyData from 'components/EmptyData'
import Image from 'components/Image'
import Tooltip from 'components/Tooltip'
import useBreakpoint from 'hooks/useBreakpoint'
import { useMemo, useState } from 'react'
import { VotingTypesName, govList } from 'state/buildingGovDao/actions'
import { getVotingNumberByTimestamp } from 'utils/dao'
import { getEtherscanLink, shortenAddress } from 'utils'
import defaultLogo from 'assets/images/create-token-ball.png'
import AboutIcon from 'assets/images/about_icon.png'

import { ChainListMap } from 'constants/chain'
import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'
import { useParams } from 'react-router-dom'
import { useGetDaoInfo } from 'hooks/useBackedDaoServer'
import Copy from 'components/essential/Copy'
import { ExternalLink } from 'theme/components'
import Header from 'pages/AboutSetting/AboutHeader'
import DaoContainer from 'components/DaoContainer'

export const StyledItem = styled(Stack)(({ theme }) => ({
  border: `1px solid #D4D7E2`,
  padding: '24px 47px 26px 24px',
  borderRadius: theme.borderRadius.default,
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

// const StyledTitle = styled(Typography)(({}) => ({
//   fontFamily: 'Poppins',
//   fontWeight: 600,
//   fontSize: '14px',
//   lineHeight: '21px',
//   color: '#80829F',
//   marginBottom: 14
// }))
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
  const isSmDown = useBreakpoint('sm')
  const { daoId: daoId } = useParams<{ daoId: string }>()
  const { buildingDaoData: daoInfo } = useBuildingDaoDataCallback()
  const [rand] = useState(Math.random())
  const createDaoData = useGetDaoInfo(Number(daoId), rand)
  const votingPeriodDate = useMemo(
    () => (daoInfo?.votingPeriod ? getVotingNumberByTimestamp(daoInfo.votingPeriod) : undefined),
    [daoInfo?.votingPeriod]
  )

  return (
    <DaoContainer>
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Image src={AboutIcon} width={38} />
          <Typography fontSize={30} lineHeight={'20px'} color={'#3f5170'} fontWeight={600}>
            About
          </Typography>
        </Box>

        <Header />
        <div>
          <Title sx={{ mb: 18 }}>Governance</Title>
          {createDaoData && <BasicTable list={createDaoData.governance} />}
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
              <StyledText>{daoInfo?.proposalThreshold} Votes</StyledText>
            </Stack>
            <Stack spacing={isSmDown ? 16 : 10}>
              <ContentTitle>Voting Period</ContentTitle>
              <StyledText>
                {votingPeriodDate
                  ? `${votingPeriodDate.day} Days, ${votingPeriodDate.hour} Hours, ${votingPeriodDate.minute} Minutes`
                  : 'Customization'}
              </StyledText>
            </Stack>
            <Stack spacing={isSmDown ? 16 : 10}>
              <ContentTitle>Voting Types</ContentTitle>
              <StyledText>{daoInfo?.votingType !== undefined ? VotingTypesName[daoInfo.votingType] : '--'}</StyledText>
            </Stack>
          </StyledItem>
          {/* <StyledTitle variant="h5">Token info</StyledTitle>
      <StyledItem
        direction={isSmDown ? 'column' : 'row'}
        gap={isSmDown ? 20 : 10}
        sx={{
          justifyContent: { sm: 'space-between', xs: 'unset' }
        }}
      >
        <Stack spacing={isSmDown ? 10 : 12}>
          <ContentTitle>Network</ContentTitle>
          <StyledText>{daoInfo ? ChainListMap[daoInfo.governance[0]?.chainId ?? 0]?.name : '--'}</StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 10 : 12}>
          <ContentTitle>Token</ContentTitle>
          <StyledText>
            <Stack direction={'row'} alignItems="center">
              <CurrencyLogo currency={undefined} size="24px" style={{ marginRight: '5px' }} />
              <MuiLink
                href={
                  daoInfo ? getEtherscanLink(ChainId.GOERLI, daoInfo.governance[0]?.tokenAddress, 'address') : undefined
                }
                underline="hover"
                target="_blank"
              >
                <StyledText>
                  <ShowDaoToken token={undefined} />
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
            {daoInfo?.governance[0]?.tokenAddress || '--'}
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
          <StyledText>{`${daoInfo?.proposalThreshold} ${daoInfo?.governance[0]?.symbol || '-'}`}</StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 16 : 10}>
          <ContentTitle>Min. votes for proposal execution</ContentTitle>
          <StyledText>{daoInfo?.proposalThreshold} Votes</StyledText>
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
          // boxShadow: theme.boxShadow.bs1,
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
      </Box> */}
        </div>
      </Box>
    </DaoContainer>
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

function BasicTable({ list }: { list: govList[] }) {
  return (
    <>
      {list.length === 0 ? (
        <EmptyData />
      ) : (
        <TableContainer sx={{ border: '1px solid #D4D7E2', borderRadius: '8px' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableContentTitle sx={{ pl: 30 }}>Token</TableContentTitle>
                <TableContentTitle>Network</TableContentTitle>
                <TableContentTitle>Token contract address</TableContentTitle>
                <TableContentTitle>Requirement</TableContentTitle>
                {/* <TableContentTitle>Voting weight</TableContentTitle> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((row, index) => (
                <TableRow key={row?.symbol + index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableContentText sx={{ pl: 30, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Image src={row.tokenLogo || defaultLogo} width={32} height={32} style={{ borderRadius: '50%' }} />
                    {row.tokenName}({row.symbol})
                  </TableContentText>
                  <TableContentText>{ChainListMap[row.chainId].name || 'Ethereum'}</TableContentText>
                  <TableContentText>
                    <Box
                      display={'flex'}
                      flexDirection={'row'}
                      sx={{
                        cursor: 'pointer'
                      }}
                    >
                      <ExternalLink href={getEtherscanLink(row.chainId ? row.chainId : 1, row.tokenAddress, 'address')}>
                        {shortenAddress(row?.tokenAddress, 3)}
                      </ExternalLink>
                      <Copy margin="0 0 0 10px" toCopy={row?.tokenAddress} />
                    </Box>
                  </TableContentText>
                  <TableContentText>{row?.createRequire}</TableContentText>
                  {/* <TableContentText>{row?.weight}</TableContentText> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}
