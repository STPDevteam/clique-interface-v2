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
import { ActivityStatus } from 'hooks/useActivityInfo'
import { getEtherscanLink } from 'utils'
import InputNumerical from 'components/Input/InputNumerical'
import { BlackButton } from 'components/Button/Button'
// import { useActiveWeb3React } from 'hooks'
// import { useCallback, useMemo } from 'react'
// import { triggerSwitchChain } from 'utils/triggerSwitchChain'
// import { useClaimAirdropCallback, useRecycleAirdropCallback } from 'hooks/useAirdropCallback'
// import useModal from 'hooks/useModal'
// import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
// import MessageBox from 'components/Modal/TransactionModals/MessageBox'
// import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
// import { useUserHasSubmittedClaim } from 'state/transactions/hooks'

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
    label: ActivityStatus.SOON
  },
  [ActivityStatus.OPEN]: {
    color: 'primary',
    label: ActivityStatus.OPEN
  },
  [ActivityStatus.ENDED]: {
    color: 'warning',
    label: ActivityStatus.ENDED
  },
  [ActivityStatus.AIRDROP]: {
    color: 'primary',
    label: ActivityStatus.AIRDROP
  },
  [ActivityStatus.CLOSED]: {
    color: 'default',
    label: ActivityStatus.CLOSED
  }
}

export default function PublicSale() {
  const theme = useTheme()
  const { address: daoAddress, chainId: daoChainId, id } = useParams<{ address: string; chainId: string; id: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const publicSaleId = Number(id)
  console.log('🚀 ~ file: PublicSale.tsx ~ line 70 ~ PublicSale ~ publicSaleId', publicSaleId)

  const daoInfo = useDaoInfo(daoAddress, curDaoChainId)

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
                          {'--'}
                        </Typography>
                      </RowCenter>
                    </Box>
                  </Box>
                  <RowCenter>
                    <StyledText1>Status:</StyledText1>
                    <Chip
                      color={ActivityStatusShowLabel[ActivityStatus.OPEN].color}
                      label={ActivityStatusShowLabel[ActivityStatus.OPEN].label}
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
                      <StyledText2 noWrap>--</StyledText2>
                    </Stack>
                  </RowCenter>
                  <RowCenter>
                    <StyledText1>Token Address:</StyledText1>
                    <Box display={'flex'}>
                      <Link
                        underline="hover"
                        target="_blank"
                        href={getEtherscanLink(curDaoChainId, '', 'token')}
                        fontSize={13}
                      >
                        token
                      </Link>
                      <Copy toCopy={''} margin="0 0 0 5px" />
                    </Box>
                  </RowCenter>
                  <RowCenter>
                    <StyledText1>Token Supply:</StyledText1>
                    <StyledText2 noWrap>--</StyledText2>
                  </RowCenter>

                  <Typography variant="h5">About</Typography>
                  <StyledText1>About</StyledText1>
                  <StyledText1>
                    Description Proposes to repeal the working group rules passed in EP4 and replace those rules with
                    the working group rules specified in this proposal. Abstract This is a proposal to repeal the
                    working group rules passed in EP4 and replace those rules with working group rules specified in this
                    proposal for the Second Term of 2022 and all Terms thereafter. The working group rules specified in
                    this proposal add more details about Steward responsibilities and the management of working group
                    funds, as well as introducing the requirement of each working group to appoint a lead steward. The
                    specification below also introduces a rule to appoint a new DAO Secretary, responsible for managing
                    working relationships and communications across working groups as well as performing administrative
                    duties for the DAO.
                  </StyledText1>
                </Stack>
              </Grid>
              <Grid item md={5} lg={4} xs={12}>
                <PanelWrapper>
                  <Stack spacing={16}>
                    <RowCenter>
                      <StyledText1>Begin time</StyledText1>
                      <StyledText2>--</StyledText2>
                    </RowCenter>
                    <RowCenter>
                      <StyledText1>Funding target:</StyledText1>
                      <StyledText2>--</StyledText2>
                    </RowCenter>
                    <RowCenter>
                      <StyledText1>Rate</StyledText1>
                      <StyledText2>{'1 DCC = 1 STPT'}</StyledText2>
                    </RowCenter>
                    <RowCenter>
                      <StyledText1>Pledged</StyledText1>
                      <StyledText2>20,000 DCC</StyledText2>
                    </RowCenter>
                    <InputNumerical label="Pledge amount" value={''} placeholder="10,000" endAdornment={<>DCC</>} />
                    <InputNumerical
                      label="Pay"
                      value={''}
                      balance="20,000"
                      placeholder="10,000"
                      endAdornment={<>STPT</>}
                    />
                    <StyledText1>
                      *You should do your own research and understand the risk before committing your funds.
                    </StyledText1>
                    <Box display={'flex'} justifyContent="center">
                      <BlackButton width="200px" height="44px">
                        Pay
                      </BlackButton>
                    </Box>
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
