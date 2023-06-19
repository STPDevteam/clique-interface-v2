import { Box, Link, styled, Typography } from '@mui/material'
import Back from 'components/Back'
import ActionButton from 'components/Button/ActionButton'
import DateTimePicker from 'components/DateTimePicker'
import Input from 'components/Input'
// import InputNumerical from 'components/Input/InputNumerical'
import Loading from 'components/Loading'
import ChainSelect from 'components/Select/ChainSelect'
import { ChainId, ChainList } from 'constants/chain'
import { routes } from 'constants/routes'
import { useActiveWeb3React } from 'hooks'
import { DaoAdminLevelProp, DaoInfoProp, useDaoAdminLevel, useDaoInfo } from 'hooks/useDaoInfo'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useTokenByChain } from 'state/wallet/hooks'
import { isAddress } from 'utils'
import { tryParseAmount } from 'utils/parseAmount'
// import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import TokenRow from 'components/Governance/TokenRow'
import { Chain } from 'models/chain'
// import { CurrencyAmount } from 'constants/token'
// import useModal from 'hooks/useModal'
// import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
// import MessageBox from 'components/Modal/TransactionModals/MessageBox'
// import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'

const StyledText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 12,
  fontWeight: 500
}))

const TopWrapper = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '296fr 564fr',
  gap: 24,
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'unset',
    padding: '20px'
  }
}))

export default function CreatePublicSale() {
  const { chainId: daoChainId, address: daoAddress } = useParams<{ chainId: string; address: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const daoInfo = useDaoInfo(daoAddress, curDaoChainId)
  const { account } = useActiveWeb3React()

  const daoAdminLevel = useDaoAdminLevel(daoAddress, curDaoChainId, account || undefined)
  const history = useHistory()
  useEffect(() => {
    if (!account || daoAdminLevel === DaoAdminLevelProp.NORMAL) {
      history.goBack()
    }
  }, [daoAdminLevel, history, account])

  return daoInfo ? <CreatePublicSaleForm daoChainId={curDaoChainId} daoInfo={daoInfo} /> : <Loading />
}

function CreatePublicSaleForm({ daoInfo, daoChainId }: { daoInfo: DaoInfoProp; daoChainId: ChainId }) {
  const history = useHistory()
  const toList = useCallback(() => {
    history.replace(routes._DaoInfo + `/${daoChainId}/${daoInfo.daoAddress}/active_info`)
  }, [daoChainId, daoInfo.daoAddress, history])
  // const { account, chainId, library } = useActiveWeb3React()

  const [saleTokenAddress, setSaleTokenAddress] = useState('')
  const [selectChain, setSelectChain] = useState<Chain | null>(null)
  // const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState<number>()
  const [endTime, setEndTime] = useState<number>()

  const saleTokenInfo = useTokenByChain(
    isAddress(saleTokenAddress) && selectChain ? saleTokenAddress : undefined,
    selectChain?.id || undefined
  )

  const airdropTotalAmount = tryParseAmount('100', saleTokenInfo?.token)
  const [approveState, approveCallback] = useApproveCallback(airdropTotalAmount, daoInfo.daoAddress)

  return (
    <Box>
      <Back sx={{ margin: 0 }} text="All Proposals" event={toList} />
      <Box mt={20}>
        <ContainerWrapper maxWidth={885}>
          <Typography variant="h6">Create public sale</Typography>
          <Box mt={20}>
            <TopWrapper>
              <Box>
                <ChainSelect
                  chainList={ChainList}
                  height={44}
                  selectedChain={selectChain}
                  onChange={e => setSelectChain(e || null)}
                  label="*Network"
                />
                <Box display={'flex'} justifyContent="center">
                  <CurrencyLogo size="86px" style={{ margin: '30px auto' }} />
                </Box>
                {/* <UploadImage disabled sx={{ margin: '30px auto' }} size={86} /> */}
              </Box>
              <Box>
                <Input
                  value={saleTokenAddress}
                  errSet={() => setSaleTokenAddress('')}
                  onChange={e => setSaleTokenAddress(e.target.value || '')}
                  style={{ marginBottom: 50 }}
                  placeholder="0x"
                  type="address"
                  label="*Token Contract Address"
                  rightLabel={<Link underline="none" href={routes.CreatorToken}>{`Create A New Token>`}</Link>}
                />
                <TokenRow totalSupply={saleTokenInfo?.totalSupply} />
              </Box>
            </TopWrapper>

            <StyledText>Start time</StyledText>
            <DateTimePicker
              value={startTime ? new Date(startTime * 1000) : null}
              onValue={timestamp => {
                setStartTime(timestamp)
              }}
            ></DateTimePicker>

            <StyledText>End Time</StyledText>
            <DateTimePicker
              value={endTime ? new Date(endTime * 1000) : null}
              onValue={timestamp => setEndTime(timestamp)}
            ></DateTimePicker>
          </Box>

          {/* {paramsCheck.error ? (
            <Alert severity="error" sx={{ marginTop: 20 }}>
              {paramsCheck.error}
            </Alert>
          ) : (
            <Alert severity="success" sx={{ marginTop: 20 }}>
              You can now create a airdrop
            </Alert>
          )} */}

          <Box display={'flex'} justifyContent="center" mt={50}>
            <ActionButton
              width="252px"
              height="50px"
              // disableAction={paramsCheck.disabled}
              black
              actionText={approveState === ApprovalState.NOT_APPROVED ? 'Approve' : 'Create'}
              onAction={approveState === ApprovalState.NOT_APPROVED ? approveCallback : () => {}}
              pending={approveState === ApprovalState.PENDING}
              pendingText={approveState === ApprovalState.PENDING ? 'Approving' : 'Loading'}
            ></ActionButton>
          </Box>
        </ContainerWrapper>
      </Box>
    </Box>
  )
}
