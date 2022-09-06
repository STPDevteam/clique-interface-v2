import { Box, Grid, Link, Stack, styled, Typography, useTheme } from '@mui/material'
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

export default function Airdrop() {
  const theme = useTheme()
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId

  const daoInfo = useDaoInfo(daoAddress, curDaoChainId)
  return (
    <Box padding="30px 20px">
      <ContainerWrapper maxWidth={1150}>
        <Stack spacing={40}>
          <Back sx={{ margin: 0 }} />
          <Box>
            <Grid container spacing={40}>
              <Grid item md={8}>
                <Stack spacing={16}>
                  <Box display={'grid'} alignItems="center" gridTemplateColumns="100px 1fr" columnGap={'24px'}>
                    <DaoAvatars size={100} />
                    <Box>
                      <Typography variant="h5" fontSize={24}>
                        {daoInfo?.name}
                      </Typography>
                      <RowCenter>
                        <Typography fontSize={20} fontWeight={400}>
                          {daoInfo?.token?.symbol}
                        </Typography>
                        <Typography
                          mt={-5}
                          fontSize={14}
                          fontWeight={600}
                          color={theme.palette.text.secondary}
                          textAlign={'right'}
                        >
                          Close at <br />
                          2021-11-29 11:10:58
                        </Typography>
                      </RowCenter>
                    </Box>
                  </Box>
                  <RowCenter>
                    <StyledText1>Blockchain:</StyledText1>
                    <StyledText2>{ChainListMap[5]?.name || '--'}</StyledText2>
                  </RowCenter>
                  <RowCenter>
                    <StyledText1>Airdrop token:</StyledText1>
                    <Stack direction={'row'} alignItems="center">
                      <CurrencyLogo currency={undefined} size="22px" style={{ marginRight: '5px' }} />
                      <StyledText2 noWrap>name(name)</StyledText2>
                    </Stack>
                  </RowCenter>
                  <RowCenter>
                    <StyledText1>Airdrop token contract Address:</StyledText1>
                    <Link underline="none" display={'flex'} fontSize={13}>
                      0xb5d8...33F511
                      <Copy toCopy={''} margin="0 0 0 5px" />
                    </Link>
                  </RowCenter>
                  <RowCenter>
                    <StyledText1>Airdrop token supply:</StyledText1>
                    <StyledText2>100,000,000</StyledText2>
                  </RowCenter>

                  <Typography variant="h5">Description</Typography>
                  <StyledText2>
                    The STP protocol is open to anyone, and project configurations can vary widely. There are risks
                    associated with interacting with all projects on
                  </StyledText2>
                  <StyledText2>{daoInfo?.description}</StyledText2>
                </Stack>
              </Grid>
              <Grid item md={4}>
                <PanelWrapper>
                  <Stack spacing={16}>
                    <RowCenter>
                      <StyledText1>Airdrop time</StyledText1>
                      <StyledText2>2022-05-13 15:36:03</StyledText2>
                    </RowCenter>
                    <RowCenter>
                      <StyledText1>Total airdrop:</StyledText1>
                      <StyledText2>200,000 BTC</StyledText2>
                    </RowCenter>
                    <RowCenter>
                      <StyledText1>Total addresses:</StyledText1>
                      <StyledText2>30</StyledText2>
                    </RowCenter>

                    <Typography textAlign={'center'} fontSize={12} color={theme.palette.error.main}>
                      You are not on the whitelist
                    </Typography>

                    <Box>
                      <StyledText1>Claimable tokens</StyledText1>
                      <RowCenter>
                        <StyledText2>4,000 BTC:</StyledText2>
                        <OutlineButton
                          style={{ borderWidth: 1 }}
                          fontWeight={500}
                          fontSize={12}
                          width={125}
                          height={24}
                          disabled
                        >
                          Claim
                        </OutlineButton>
                      </RowCenter>
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

// <Typography color={theme.palette.text.secondary} fontSize={16} sx={{ wordBreak: 'break-all' }}>
//   {daoBaseInfo?.description}
// </Typography>
