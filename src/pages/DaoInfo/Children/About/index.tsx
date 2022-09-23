import { Stack, styled, Typography } from '@mui/material'
import { Box } from '@mui/system'
import EmptyData from 'components/EmptyData'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import Loading from 'components/Loading'
import { ChainId, ChainListMap } from 'constants/chain'
import { useBackedDaoAdmins } from 'hooks/useBackedDaoServer'
import { useDaoInfo } from 'hooks/useDaoInfo'
import { AdminTagListBlock } from 'pages/DaoInfo/ShowAdminTag'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { VotingTypesName } from 'state/buildingGovDao/actions'
import { getVotingNumberByTimestamp } from 'utils/dao'

export const StyledItem = styled(Stack)(({ theme }) => ({
  border: `1px solid ${theme.bgColor.bg2}`,
  padding: '30px 38px',
  borderRadius: theme.borderRadius.default,
  boxShadow: theme.boxShadow.bs1,
  marginBottom: 30
}))

const StyledTitle = styled(Typography)(({}) => ({
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

  const daoInfo = useDaoInfo(daoAddress, curDaoChainId)
  const { result: daoAdminList, loading: daoAdminLoading } = useBackedDaoAdmins(daoAddress, curDaoChainId)
  const votingPeriodDate = useMemo(
    () => (daoInfo?.votingPeriod ? getVotingNumberByTimestamp(daoInfo.votingPeriod) : undefined),
    [daoInfo?.votingPeriod]
  )

  return (
    <div>
      <StyledTitle variant="h5">Token info</StyledTitle>
      <StyledItem direction={'row'} justifyContent="space-between">
        <Stack spacing={16}>
          <StyledText>Network</StyledText>
          <StyledText fontWeight={600} fontSize={16}>
            {ChainListMap[curDaoChainId]?.name || '--'}
          </StyledText>
        </Stack>
        <Stack spacing={16}>
          <StyledText>Token</StyledText>
          <StyledText>
            <Stack direction={'row'} alignItems="center">
              <CurrencyLogo currency={daoInfo?.token || undefined} size="22px" style={{ marginRight: '5px' }} />
              <StyledText fontWeight={600} fontSize={16}>
                {daoInfo?.token ? `${daoInfo?.token.name} (${daoInfo?.token.symbol})` : '--'}
              </StyledText>
            </Stack>
          </StyledText>
        </Stack>
        <Stack spacing={16}>
          <StyledText>Price</StyledText>
          <StyledText fontWeight={600} fontSize={16}>
            --
          </StyledText>
        </Stack>
        <Stack spacing={16}>
          <StyledText>Token Contracts Address</StyledText>
          <StyledText fontSize={12}>{daoInfo?.token?.address || '--'}</StyledText>
        </Stack>
      </StyledItem>

      <StyledTitle variant="h5">Governance settings</StyledTitle>
      <StyledItem direction={'row'} justifyContent="space-between">
        <Stack spacing={16}>
          <StyledText>Min. holding for proposal</StyledText>
          <StyledText fontWeight={600} fontSize={16}>{`${daoInfo?.proposalThreshold?.toSignificant(6, {
            groupSeparator: ','
          })} ${daoInfo?.token?.symbol || '-'}`}</StyledText>
        </Stack>
        <Stack spacing={16}>
          <StyledText>Min. votes for proposal execution</StyledText>
          <StyledText fontWeight={600} fontSize={16}>
            {daoInfo?.votingThreshold?.toSignificant(6, { groupSeparator: ',' })} Votes
          </StyledText>
        </Stack>
        <Stack spacing={16}>
          <StyledText>Default voting period</StyledText>
          <StyledText fontWeight={600} fontSize={16}>
            {votingPeriodDate
              ? `${votingPeriodDate.day} Days, ${votingPeriodDate.hour} Hours, ${votingPeriodDate.minute} Minutes`
              : '--'}
          </StyledText>
        </Stack>
        <Stack spacing={16}>
          <StyledText>Voting types allowed</StyledText>
          <StyledText fontWeight={600} fontSize={16}>
            {daoInfo?.votingType !== undefined ? VotingTypesName[daoInfo.votingType] : '--'}
          </StyledText>
        </Stack>
      </StyledItem>

      <StyledTitle variant="h5">Admin</StyledTitle>
      <StyledItem>
        {daoAdminLoading ? (
          <Loading />
        ) : (
          <Box display={'grid'} gridTemplateColumns="1fr 1fr" alignItems={'center'} gap="10px 20px">
            {daoAdminList?.map(address => (
              <>
                <StyledText fontWeight={600} key={address}>
                  {address}
                </StyledText>
                <div>
                  <AdminTagListBlock chainId={curDaoChainId} daoAddress={daoAddress} account={address} />
                </div>
              </>
            ))}
          </Box>
        )}
        {!daoAdminLoading && !daoAdminList?.length && <EmptyData />}
      </StyledItem>
    </div>
  )
}
