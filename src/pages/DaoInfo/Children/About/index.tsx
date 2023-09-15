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
import { useMemo } from 'react'
import { VotingTypesName, govList } from 'state/buildingGovDao/actions'
import { getVotingNumberByTimestamp } from 'utils/dao'
import { formatNumberWithCommas, getEtherscanLink, shortenAddress } from 'utils'
import defaultLogo from 'assets/images/create-token-ball.png'
import AboutIcon from 'assets/images/about_icon.png'
import { ChainListMap } from 'constants/chain'
import { useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
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
  color: '#8D8EA5'
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
  color: '#8D8EA5'
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
  const { createDaoData: daoInfo } = useUpdateDaoDataCallback()
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
          {daoInfo && <BasicTable list={daoInfo.governance} />}
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
                <Tooltip placement="top-start" value={'Minimum Votes Needed For Proposal To Execute '} />
              </ContentTitle>
              <StyledText>{formatNumberWithCommas(daoInfo?.proposalThreshold)} Votes</StyledText>
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
  color: '#8D8EA5',
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
                  <TableContentText>{ChainListMap[row.chainId]?.name || 'Ethereum'}</TableContentText>
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
                  <TableContentText>{formatNumberWithCommas(row?.createRequire)}</TableContentText>
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
