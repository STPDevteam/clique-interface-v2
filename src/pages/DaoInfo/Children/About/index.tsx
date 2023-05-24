import { Stack, styled, Typography, Link as MuiLink, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import EmptyData from 'components/EmptyData'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import Loading from 'components/Loading'
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

export const StyledItem = styled(Stack)(({ theme }) => ({
  border: `1px solid #D4D7E2`,
  padding: '30px 38px',
  borderRadius: theme.borderRadius.default,
  boxShadow: theme.boxShadow.bs1,
  marginBottom: 30,
  [theme.breakpoints.down('sm')]: {
    padding: '20px'
  }
}))

const StyledTitle = styled(Typography)(({}) => ({
  color: '#80829F',
  fontSize: 16,
  marginBottom: 20
}))

const StyledText = styled(Typography)(
  ({ fontSize, theme, fontWeight }: { fontSize?: number; theme?: any; fontWeight?: number }) => ({
    fontSize: fontSize || 14,
    fontWeight: fontWeight || 500,
    lineHeight: '16px',
    color: theme.palette.text.secondary
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
      <StyledTitle variant="h5">Token Information</StyledTitle>
      <StyledItem
        direction={isSmDown ? 'column' : 'row'}
        gap={isSmDown ? 20 : 10}
        sx={{
          justifyContent: { sm: 'space-between', xs: 'unset' }
        }}
      >
        <Stack spacing={isSmDown ? 10 : 16}>
          <StyledText>Network</StyledText>
          <StyledText fontWeight={600} fontSize={16} sx={{ color: '#3F5170' }}>
            {daoInfo ? ChainListMap[daoInfo.daoTokenChainId]?.name : '--'}
          </StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 10 : 16}>
          <StyledText>Token</StyledText>
          <StyledText>
            <Stack direction={'row'} alignItems="center">
              <CurrencyLogo currency={daoInfo?.token || undefined} size="22px" style={{ marginRight: '5px' }} />
              <MuiLink
                href={
                  daoInfo ? getEtherscanLink(daoInfo.daoTokenChainId, daoInfo.daoTokenAddress, 'address') : undefined
                }
                underline="hover"
                target="_blank"
              >
                <StyledText fontWeight={600} fontSize={16} sx={{ color: '#3F5170' }}>
                  <ShowDaoToken token={daoInfo?.token} />
                </StyledText>
              </MuiLink>
            </Stack>
          </StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 10 : 16}>
          <StyledText>Price</StyledText>
          <StyledText fontWeight={600} fontSize={16} sx={{ color: '#3F5170' }}>
            --
          </StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 10 : 16}>
          <StyledText>Token Contracts Address</StyledText>
          <StyledText
            fontSize={12}
            sx={{
              color: '#3F5170',
              wordBreak: 'break-all'
            }}
          >
            {daoInfo?.token?.address || '--'}
          </StyledText>
        </Stack>
      </StyledItem>

      <StyledTitle variant="h5">Governance Settings</StyledTitle>
      <StyledItem
        direction={isSmDown ? 'column' : 'row'}
        gap={isSmDown ? 20 : 10}
        sx={{
          justifyContent: { sm: 'space-between', xs: 'unset' }
        }}
      >
        <Stack spacing={isSmDown ? 16 : 10}>
          <StyledText>Min. Holding For Proposal</StyledText>
          <StyledText
            fontWeight={600}
            fontSize={16}
            sx={{ color: '#3F5170' }}
          >{`${daoInfo?.proposalThreshold?.toSignificant(6, {
            groupSeparator: ','
          })} ${daoInfo?.token?.symbol || '-'}`}</StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 16 : 10}>
          <StyledText>Min. Votes For Proposal Execution</StyledText>
          <StyledText fontWeight={600} fontSize={16} sx={{ color: '#3F5170' }}>
            {daoInfo?.votingThreshold?.toSignificant(6, { groupSeparator: ',' })} Votes
          </StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 16 : 10}>
          <StyledText>Default Voting Period</StyledText>
          <StyledText fontWeight={600} fontSize={16} sx={{ color: '#3F5170' }}>
            {votingPeriodDate
              ? `${votingPeriodDate.day} Days, ${votingPeriodDate.hour} Hours, ${votingPeriodDate.minute} Minutes`
              : '--'}
          </StyledText>
        </Stack>
        <Stack spacing={isSmDown ? 16 : 10}>
          <StyledText>Voting Types Allowed</StyledText>
          <StyledText fontWeight={600} fontSize={16} sx={{ color: '#3F5170' }}>
            {daoInfo?.votingType !== undefined ? VotingTypesName[daoInfo.votingType] : '--'}
          </StyledText>
        </Stack>
      </StyledItem>

      <StyledTitle variant="h5">Admin</StyledTitle>
      <Box
        sx={{
          border: `1px solid #D4D7E2`,
          padding: '18px 33px 24px 24px',
          borderRadius: theme.borderRadius.default,
          boxShadow: theme.boxShadow.bs1,
          marginBottom: 30
        }}
      >
        {daoAdminLoading ? (
          <Loading />
        ) : (
          <>
            {daoAdminList?.map(address => (
              <Box
                key={address}
                display={'grid'}
                sx={{
                  borderBottom: '1px solid #fff',
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
                    gap: 10,
                    alignItems: 'center'
                  }}
                  to={routes._Profile + `/${address}`}
                >
                  <Image width={24} src={avatar} />
                  <StyledText
                    fontWeight={600}
                    key={address}
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
