import { Alert, Box, Link, styled, Typography } from '@mui/material'
import Back from 'components/Back'
import ActionButton from 'components/Button/ActionButton'
import DateTimePicker from 'components/DateTimePicker'
import Input from 'components/Input'
// import InputNumerical from 'components/Input/InputNumerical'
import Loading from 'components/Loading'
import ChainSelect from 'components/Select/ChainSelect'
import { ChainId, ChainList, ChainListMap } from 'constants/chain'
import { routes } from 'constants/routes'
import { useActiveWeb3React } from 'hooks'
import { DaoAdminLevelProp, DaoInfoProp, useDaoAdminLevel, useDaoInfo } from 'hooks/useDaoInfo'
import JSBI from 'jsbi'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useToken, useTokenBalance } from 'state/wallet/hooks'
import { isAddress } from 'utils'
import { tryParseAmount } from 'utils/parseAmount'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import AirdropTable from './AirdropTable'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import BigNumber from 'bignumber.js'
import { getMerkleTreeRootHash } from 'utils/merkletreejs'
import { CurrencyAmount } from 'constants/token'
import { useCreateAirdropCallback } from 'hooks/useAirdropCallback'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'

const StyledText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 12,
  fontWeight: 500
}))

const makeMerkleTreeList = (arr: { address: string; amountHexRaw: string }[]) => {
  return arr.map(({ address, amountHexRaw }, index) => {
    return '0x' + index.toString(16).padStart(64, '0') + address.replace('0x', '') + amountHexRaw.padStart(64, '0')
  })
}

export default function CreateAirdrop() {
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

  return daoInfo ? <CreateAirdropForm daoChainId={curDaoChainId} daoInfo={daoInfo} /> : <Loading />
}

function CreateAirdropForm({ daoInfo, daoChainId }: { daoInfo: DaoInfoProp; daoChainId: ChainId }) {
  const history = useHistory()
  const { hideModal, showModal } = useModal()
  const toList = useCallback(() => {
    history.replace(routes._DaoInfo + `/${daoChainId}/${daoInfo.daoAddress}/active_info`)
  }, [daoChainId, daoInfo.daoAddress, history])
  const { account, chainId, library } = useActiveWeb3React()

  const [airdropAddress, setAirdropAddress] = useState('')
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState<number>()
  const [endTime, setEndTime] = useState<number>()

  const trueAirdropAddress = useMemo(() => {
    return isAddress(airdropAddress) ? airdropAddress : ''
  }, [airdropAddress])
  const airdropToken = useToken(trueAirdropAddress, daoChainId)
  const airdropTokenBalance = useTokenBalance(account || undefined, airdropToken || undefined)

  const [airdropList, setAirdropList] = useState<{ address: string; amount: string }[]>([])
  const _totalInputAmount = useMemo(() => {
    let _count = new BigNumber(0)
    for (const item of airdropList) {
      _count = _count.plus(item.amount)
    }
    return _count.toString()
  }, [airdropList])
  const airdropTotalAmount = tryParseAmount(_totalInputAmount, airdropToken || undefined)

  const [approveState, approveCallback] = useApproveCallback(airdropTotalAmount, daoInfo.daoAddress)
  const createAirdropCallback = useCreateAirdropCallback(daoInfo.daoAddress)

  const paramsCheck: {
    disabled: boolean
    handler?: () => void
    error?: undefined | string | JSX.Element
  } = useMemo(() => {
    if (!airdropToken) {
      return {
        disabled: true,
        error: 'Airdrop token required'
      }
    }
    if (!title) {
      return {
        disabled: true,
        error: 'Title required'
      }
    }
    if (!startTime) {
      return {
        disabled: true,
        error: 'Start time required'
      }
    }
    if (!endTime) {
      return {
        disabled: true,
        error: 'End time required'
      }
    }
    if (endTime <= startTime) {
      return {
        disabled: true,
        error: 'The start time must be earlier than the end time'
      }
    }
    if (!airdropTotalAmount || airdropTotalAmount.equalTo(JSBI.BigInt(0))) {
      return {
        disabled: true,
        error: 'Airdrop amount required'
      }
    }
    if (!airdropTokenBalance || airdropTokenBalance.lessThan(airdropTotalAmount)) {
      return {
        disabled: true,
        error: 'Airdrop insufficient balance'
      }
    }

    if (daoChainId !== chainId) {
      return {
        disabled: true,
        error: (
          <>
            You need{' '}
            <Link
              sx={{ cursor: 'pointer' }}
              onClick={() => daoChainId && triggerSwitchChain(library, daoChainId, account || '')}
            >
              switch
            </Link>{' '}
            to {ChainListMap[daoChainId].name}
          </>
        )
      }
    }

    return {
      disabled: false
    }
  }, [
    account,
    airdropToken,
    airdropTokenBalance,
    airdropTotalAmount,
    chainId,
    daoChainId,
    endTime,
    library,
    startTime,
    title
  ])

  const create = useCallback(() => {
    if (!airdropList.length || !airdropToken || !startTime || !endTime || !airdropTotalAmount) return
    const listRaw = airdropList.map(({ address, amount }) => {
      const ca = tryParseAmount(amount, airdropToken) as CurrencyAmount
      return {
        address,
        amountRaw: ca.raw.toString(),
        amountHexRaw: ca.raw.toString(16)
      }
    })
    const list = makeMerkleTreeList(listRaw)
    const rootHash = getMerkleTreeRootHash(list)
    showModal(<TransacitonPendingModal />)

    createAirdropCallback(
      title,
      trueAirdropAddress,
      airdropTotalAmount.raw.toString(),
      rootHash,
      startTime,
      endTime,
      listRaw
    )
      .then(hash => {
        hideModal()
        showModal(<TransactiontionSubmittedModal hash={hash} hideFunc={() => history.goBack()} />)
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
  }, [
    airdropList,
    airdropToken,
    airdropTotalAmount,
    createAirdropCallback,
    endTime,
    hideModal,
    history,
    showModal,
    startTime,
    title,
    trueAirdropAddress
  ])

  return (
    <Box>
      <Back sx={{ margin: 0 }} text="All Proposals" event={toList} />
      <Box mt={20}>
        <ContainerWrapper maxWidth={709}>
          <Typography variant="h6">Create a airdrop event</Typography>
          <Box display={'grid'} mt={20} gridTemplateColumns="128px 1fr" gap={'16px 20px'} alignItems="center">
            <StyledText>Network</StyledText>
            <ChainSelect disabled chainList={ChainList} selectedChain={ChainListMap[daoChainId]}></ChainSelect>

            <StyledText>Title</StyledText>
            <Input value={title} onChange={e => setTitle(e.target.value || '')} placeholder="title" />

            <StyledText pt={15}>Input token address</StyledText>
            <Input
              value={airdropAddress}
              errSet={() => setAirdropAddress('')}
              onChange={e => setAirdropAddress(e.target.value || '')}
              placeholder="0x"
              rightLabel={
                'Available balance: ' + (airdropTokenBalance?.toSignificant(6, { groupSeparator: ',' }) || '--')
              }
              type="address"
            />

            {/* <StyledText pt={15}>
              Airdrop amount <br />
              (in tokens)
            </StyledText> */}
            {/* <InputNumerical
              placeholder="1,000"
              showFormatWrapper={() => (amount ? toFormatGroup(amount) : '')}
              balance={airdropTokenBalance?.toSignificant(6, { groupSeparator: ',' })}
              value={amount}
              onChange={e => setAmount(e.target.value)}
            /> */}

            <StyledText>Start time</StyledText>
            <DateTimePicker
              value={startTime ? new Date(startTime * 1000) : null}
              onValue={timestamp => {
                setStartTime(timestamp)
              }}
            ></DateTimePicker>

            <StyledText>End time</StyledText>
            <DateTimePicker
              value={endTime ? new Date(endTime * 1000) : null}
              onValue={timestamp => setEndTime(timestamp)}
            ></DateTimePicker>
          </Box>

          <AirdropTable
            airdropList={airdropList}
            setAirdropList={(val: { address: string; amount: string }[]) => setAirdropList(val)}
            totalInputAmount={_totalInputAmount}
          />

          {paramsCheck.error ? (
            <Alert severity="error" sx={{ marginTop: 20 }}>
              {paramsCheck.error}
            </Alert>
          ) : (
            <Alert severity="success" sx={{ marginTop: 20 }}>
              You can now create a airdrop
            </Alert>
          )}

          <Box display={'flex'} justifyContent="center" mt={50}>
            <ActionButton
              width="252px"
              height="50px"
              disableAction={paramsCheck.disabled}
              black
              actionText={approveState === ApprovalState.NOT_APPROVED ? 'Approve' : 'Create'}
              onAction={approveState === ApprovalState.NOT_APPROVED ? approveCallback : create}
              pending={approveState === ApprovalState.PENDING}
              pendingText={approveState === ApprovalState.PENDING ? 'Approving' : 'Loading'}
            ></ActionButton>
          </Box>
        </ContainerWrapper>
      </Box>
    </Box>
  )
}
