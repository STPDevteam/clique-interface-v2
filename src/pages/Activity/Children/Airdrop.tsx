import { Box, Chip, Grid, Link, Stack, styled, Typography, useTheme } from '@mui/material'
import { DaoAvatars } from 'components/Avatars'
import Back from 'components/Back'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import { ChainId, ChainListMap } from 'constants/chain'
import { useParams } from 'react-router'
import { useDaoInfo } from 'hooks/useDaoInfo'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import Copy from 'components/essential/Copy'
import OutlineButton from 'components/Button/OutlineButton'
import { ActivityStatus, useAirdropBaseInfo, useAirdropClaimed } from 'hooks/useActivityInfo'
import { timeStampToFormat } from 'utils/dao'
import { getEtherscanLink, shortenAddress } from 'utils'
import { useGetAirdropProof } from 'hooks/useBackedActivityServer'
import JSBI from 'jsbi'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useMemo } from 'react'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useClaimAirdropCallback, useRecycleAirdropCallback } from 'hooks/useAirdropCallback'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'

const PanelWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: theme.borderRadius.default,
  boxShadow: theme.boxShadow.bs2,
  padding: '32px'
}))

const StyledText1 = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  color: theme.palette.text.secondary
}))

const StyledText2 = styled(StyledText1)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 600,
  color: theme.palette.text.primary
}))

const ActivityStatusShowLabel: {
  [key in ActivityStatus]: {
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined
    label: string
  }
} = {
  [ActivityStatus.SOON]: {
    color: 'warning',
    label: 'Soon'
  },
  [ActivityStatus.OPEN]: {
    color: 'primary',
    label: 'Open'
  },
  [ActivityStatus.CLOSED]: {
    color: 'default',
    label: 'Closed'
  }
}

export default function Airdrop() {
  const theme = useTheme()
  const { address: daoAddress, chainId: daoChainId, id } = useParams<{ address: string; chainId: string; id: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const airdropId = Number(id)
  const { account, chainId, library } = useActiveWeb3React()
  const { hideModal, showModal } = useModal()

  const daoInfo = useDaoInfo(daoAddress, curDaoChainId)
  const airdropInfo = useAirdropBaseInfo(daoAddress, curDaoChainId, airdropId)
  const { result: airdropProof } = useGetAirdropProof(airdropId, airdropInfo?.airdropToken)
  const isClaimed = useAirdropClaimed(daoAddress, curDaoChainId, airdropId)
  const claimAirdropCallback = useClaimAirdropCallback(daoAddress)
  const recycleAirdropCallback = useRecycleAirdropCallback(daoAddress)
  const { claimSubmitted: isClaiming } = useUserHasSubmittedClaim(`claim_airdrop_${airdropId}`)
  const { claimSubmitted: isRecycling } = useUserHasSubmittedClaim(`recycle_airdrop_${airdropId}`)

  const claimAirdrop = useCallback(() => {
    if (!airdropProof) return
    showModal(<TransacitonPendingModal />)

    claimAirdropCallback(airdropId, airdropProof.index, airdropProof.amount.raw.toString(), airdropProof.proof)
      .then(hash => {
        hideModal()
        showModal(<TransactiontionSubmittedModal hash={hash} />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [airdropId, airdropProof, claimAirdropCallback, hideModal, showModal])

  const recycleAirdrop = useCallback(() => {
    if (!airdropProof) return
    showModal(<TransacitonPendingModal />)

    recycleAirdropCallback(airdropId)
      .then(hash => {
        hideModal()
        showModal(<TransactiontionSubmittedModal hash={hash} />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [airdropId, airdropProof, hideModal, recycleAirdropCallback, showModal])

  const claimBtn: { disabled: boolean; handler?: () => void; text?: string } = useMemo(() => {
    if (!airdropInfo || isClaimed === undefined) return { disabled: true }
    if (airdropInfo.status !== ActivityStatus.OPEN) {
      return { disabled: true }
    }
    if (isClaimed) {
      return {
        disabled: true,
        text: 'Claimed'
      }
    }
    if (isClaiming) {
      return {
        disabled: true,
        text: 'Claiming'
      }
    }
    if (curDaoChainId !== chainId)
      return {
        disabled: false,
        handler: () => triggerSwitchChain(library, curDaoChainId, account || '')
      }
    return {
      disabled: false,
      handler: claimAirdrop
    }
  }, [account, airdropInfo, chainId, claimAirdrop, curDaoChainId, isClaimed, isClaiming, library])

  const recycleBtn: { disabled: boolean; handler?: () => void; text?: string } = useMemo(() => {
    if (!airdropInfo || isClaimed === undefined) return { disabled: true }
    if (airdropInfo.status !== ActivityStatus.CLOSED) {
      return { disabled: true }
    }
    if (isRecycling) {
      return {
        disabled: true,
        text: 'Recycling'
      }
    }
    if (curDaoChainId !== chainId)
      return {
        disabled: false,
        handler: () => triggerSwitchChain(library, curDaoChainId, account || '')
      }
    return {
      disabled: false,
      handler: recycleAirdrop
    }
  }, [account, airdropInfo, chainId, curDaoChainId, isClaimed, isRecycling, library, recycleAirdrop])

  return (
    <Box padding="30px 20px">
      <ContainerWrapper maxWidth={1150}>
        <Stack spacing={40}>
          <Back sx={{ margin: 0 }} />
          <Box>
            <Grid container spacing={40}>
              <Grid item md={7} lg={8} xs={12}>
                <Stack spacing={16}>
                  <Box display={'grid'} alignItems="center" gridTemplateColumns="100px 1fr" columnGap={'24px'}>
                    <DaoAvatars size={100} src={daoInfo?.daoLogo} />
                    <Box>
                      <Typography variant="h5" fontSize={24}>
                        {daoInfo?.name || '--'}
                      </Typography>
                      <RowCenter>
                        <Typography fontSize={20} fontWeight={400}>
                          {daoInfo?.token ? `${daoInfo.token.name}(${daoInfo.token?.symbol})` : '--'}
                        </Typography>
                        <Typography
                          mt={-5}
                          fontSize={14}
                          fontWeight={600}
                          color={theme.palette.text.secondary}
                          textAlign={'right'}
                        >
                          Close at <br />
                          {airdropInfo?.endTime ? timeStampToFormat(airdropInfo.endTime) : '--'}
                        </Typography>
                      </RowCenter>
                    </Box>
                  </Box>
                  <RowCenter>
                    <StyledText1>Status:</StyledText1>
                    <Chip
                      color={airdropInfo ? ActivityStatusShowLabel[airdropInfo.status].color : undefined}
                      label={airdropInfo ? ActivityStatusShowLabel[airdropInfo.status].label : ''}
                    />
                  </RowCenter>
                  <RowCenter>
                    <StyledText1>Blockchain:</StyledText1>
                    <StyledText2>{ChainListMap[curDaoChainId]?.name || '--'}</StyledText2>
                  </RowCenter>
                  <RowCenter>
                    <StyledText1>Airdrop token:</StyledText1>
                    <Stack direction={'row'} alignItems="center">
                      <CurrencyLogo currency={undefined} size="22px" style={{ marginRight: '5px' }} />
                      <StyledText2 noWrap>
                        {airdropInfo?.airdropToken
                          ? `${airdropInfo.airdropToken.name}(${airdropInfo.airdropToken?.symbol})`
                          : '--'}
                      </StyledText2>
                    </Stack>
                  </RowCenter>
                  <RowCenter>
                    <StyledText1>Airdrop token contract Address:</StyledText1>
                    <Box display={'flex'}>
                      <Link
                        underline="hover"
                        target="_blank"
                        href={getEtherscanLink(curDaoChainId, airdropInfo?.tokenAddress || '', 'token')}
                        fontSize={13}
                      >
                        {airdropInfo?.tokenAddress ? shortenAddress(airdropInfo.tokenAddress) : '--'}
                      </Link>
                      <Copy toCopy={airdropInfo?.tokenAddress || ''} margin="0 0 0 5px" />
                    </Box>
                  </RowCenter>
                  <RowCenter>
                    <StyledText1>Creator:</StyledText1>
                    <Link
                      underline="hover"
                      target="_blank"
                      href={getEtherscanLink(curDaoChainId, airdropInfo?.creator || '', 'address')}
                      fontSize={13}
                    >
                      {airdropInfo?.creator ? shortenAddress(airdropInfo.creator) : '--'}
                    </Link>
                  </RowCenter>

                  <Typography variant="h5">Description</Typography>
                  <StyledText2>{airdropProof?.title}</StyledText2>
                  <StyledText2>{daoInfo?.description}</StyledText2>
                </Stack>
              </Grid>
              <Grid item md={5} lg={4} xs={12}>
                <PanelWrapper>
                  <Stack spacing={16}>
                    <RowCenter>
                      <StyledText1>Airdrop time</StyledText1>
                      <StyledText2>{airdropInfo ? timeStampToFormat(airdropInfo.startTime) : '--'}</StyledText2>
                    </RowCenter>
                    <RowCenter>
                      <StyledText1>Total airdrop:</StyledText1>
                      <StyledText2>
                        {airdropProof?.airdropTotalAmount.toSignificant(6, { groupSeparator: ',' }) || '-'}{' '}
                        {airdropInfo?.airdropToken.symbol}
                      </StyledText2>
                    </RowCenter>
                    <RowCenter>
                      <StyledText1>Total addresses:</StyledText1>
                      <StyledText2>{airdropProof?.airdropNumber || '-'}</StyledText2>
                    </RowCenter>

                    {airdropProof && (
                      <>
                        {airdropProof.amount.greaterThan(JSBI.BigInt(0)) ? (
                          <Box>
                            <StyledText1>Claimable tokens</StyledText1>
                            <RowCenter>
                              <StyledText2>
                                {airdropProof?.amount.toSignificant(6, { groupSeparator: ',' })}{' '}
                                {airdropInfo?.airdropToken.symbol}
                              </StyledText2>
                              <OutlineButton
                                style={{ borderWidth: 1 }}
                                fontWeight={500}
                                fontSize={12}
                                width={125}
                                height={24}
                                disabled={claimBtn.disabled}
                                onClick={claimBtn.handler}
                              >
                                {claimBtn.text || 'Claim'}
                              </OutlineButton>
                            </RowCenter>
                          </Box>
                        ) : (
                          <Typography textAlign={'center'} fontSize={12} color={theme.palette.error.main}>
                            You are not on the whitelist
                          </Typography>
                        )}
                        {airdropInfo?.remainderAmount.greaterThan(JSBI.BigInt(0)) &&
                          airdropInfo.status === ActivityStatus.CLOSED &&
                          airdropInfo.creator === account && (
                            <Box>
                              <StyledText1>Recycle airdrop</StyledText1>
                              <RowCenter>
                                <StyledText2>
                                  {airdropInfo?.remainderAmount.toSignificant(6, { groupSeparator: ',' })}{' '}
                                  {airdropInfo?.airdropToken.symbol}
                                </StyledText2>
                                <OutlineButton
                                  style={{ borderWidth: 1 }}
                                  fontWeight={500}
                                  fontSize={12}
                                  width={125}
                                  height={24}
                                  disabled={recycleBtn.disabled}
                                  onClick={recycleBtn.handler}
                                >
                                  {recycleBtn.text || 'Recycle'}
                                </OutlineButton>
                              </RowCenter>
                            </Box>
                          )}
                      </>
                    )}
                  </Stack>
                </PanelWrapper>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </ContainerWrapper>
    </Box>
  )
}
