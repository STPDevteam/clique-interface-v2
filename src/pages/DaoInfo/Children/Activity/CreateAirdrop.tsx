import { Alert, Box, Link, Stack, styled, Typography, useTheme } from '@mui/material'
import Back from 'components/Back'
import DateTimePicker from 'components/DateTimePicker'
import Input from 'components/Input'
import InputNumerical from 'components/Input/InputNumerical'
import Loading from 'components/Loading'
import ChainSelect from 'components/Select/ChainSelect'
import { AIRDROP_ADDRESS, ZERO_ADDRESS } from '../../../../constants'
import { ChainId, ChainList, ChainListMap } from 'constants/chain'
import { routes } from 'constants/routes'
import { useActiveWeb3React } from 'hooks'
import { Chain } from 'models/chain'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useToken, useCurrencyBalance } from 'state/wallet/hooks'
import { isAddress } from 'utils'
import isZero from 'utils/isZero'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import Editor from '../Proposal/Editor'
import { RowCenter } from '../Proposal/ProposalItem'
import InputField from './InputField'
import { Currency } from 'constants/token'
import { useTotalSupply } from 'data/TotalSupply'
import JSBI from 'jsbi'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { tryParseAmount } from 'utils/parseAmount'
import { Dots } from 'theme/components'
import { BlackButton } from 'components/Button/Button'
import { useCreateAirdropONECallback } from 'hooks/useAirdropCallback'
import useBreakpoint from 'hooks/useBreakpoint'
import DaoContainer from 'components/DaoContainer'
import { useBuildingDaoDataCallback, useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
import { CreateDaoDataProp } from 'state/buildingGovDao/actions'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import useModal from 'hooks/useModal'

const createAirdropInputFieldList = [
  'Username For Twitter',
  'Username For Telegram',
  'Discord Username',
  'Email',
  'TXID',
  'Other'
]

const StyledText = styled(Typography)(({ theme, fontWeight }: { fontWeight?: number; theme?: any }) => ({
  color: theme.palette.text.secondary,
  fontSize: 12,
  fontWeight: fontWeight || 500
}))

export default function CreateAirdrop() {
  const { daoId: daoChainId } = useParams<{ daoId: string }>()
  const daoId = Number(daoChainId)
  const { buildingDaoData: daoInfo } = useBuildingDaoDataCallback()
  const { account } = useActiveWeb3React()
  const { myJoinDaoData: daoAdminLevel } = useUpdateDaoDataCallback()
  const history = useHistory()
  useEffect(() => {
    if (!account || daoAdminLevel.job === 'noRole' || daoAdminLevel.job === 'visitor') {
      history.goBack()
    }
  }, [daoAdminLevel, history, account])

  return daoInfo ? <CreateAirdropForm daoChainId={daoId} daoInfo={daoInfo} /> : <Loading />
}

function CreateAirdropForm({ daoInfo, daoChainId }: { daoInfo: CreateDaoDataProp; daoChainId: number }) {
  const history = useHistory()
  const theme = useTheme()
  console.log(daoInfo)
  const { showModal, hideModal } = useModal()
  const toList = useCallback(() => {
    history.replace(routes._DaoInfo + `/${daoChainId}/DAO_Rewards`)
  }, [daoChainId, history])
  const { account, chainId, library } = useActiveWeb3React()
  const [airdropAddress, setAirdropAddress] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [network, setNetwork] = useState<Chain | null>(ChainListMap[daoChainId])
  const [fieldList, setFieldList] = useState<
    {
      checked: boolean
      name: string
      required: boolean
    }[]
  >(createAirdropInputFieldList.map(item => ({ checked: false, required: false, name: item })))
  const [eventStartTime, setEventStartTime] = useState<number>()
  const [eventEndTime, setEventEndTime] = useState<number>()
  const [airdropStartTime, setAirdropStartTime] = useState<number>()
  const [airdropEndTime, setAirdropEndTime] = useState<number>()
  const isSmDown = useBreakpoint('sm')

  const isEth = useMemo(() => isZero(airdropAddress), [airdropAddress])

  const trueAirdropAddress = useMemo(() => {
    return !isEth && isAddress(airdropAddress) ? airdropAddress : ''
  }, [airdropAddress, isEth])
  const _airdropToken = useToken(trueAirdropAddress, network?.id || undefined)
  const airdropTokenSupply = useTotalSupply(_airdropToken || undefined)

  const airdropCurrency = useMemo(() => {
    return network && isZero(airdropAddress) ? Currency.get_ETH_TOKEN(network.id as ChainId) : _airdropToken
  }, [_airdropToken, airdropAddress, network])

  const airdropCurrencyBalance = useCurrencyBalance(
    airdropCurrency ? account || undefined : undefined,
    airdropCurrency || undefined,
    network?.id || undefined
  )

  const validFieldList = useMemo(() => fieldList.filter(item => item.checked), [fieldList])
  const inputValueAmount = tryParseAmount(inputValue, airdropCurrency || undefined)
  const [approveState, approveCallback] = useApproveCallback(
    inputValueAmount,
    network?.id ? AIRDROP_ADDRESS[network.id as ChainId] : undefined,
    isEth
  )

  const createAirdropONECallback = useCreateAirdropONECallback()

  const create = useCallback(() => {
    if (
      !network ||
      !network.id ||
      !inputValueAmount ||
      !eventStartTime ||
      !eventEndTime ||
      !airdropStartTime ||
      !airdropEndTime
    )
      return
    showModal(<TransacitonPendingModal />)
    createAirdropONECallback(
      isEth,
      title,
      description,
      network.id,
      isEth ? ZERO_ADDRESS : trueAirdropAddress,
      inputValueAmount.raw.toString(),
      eventStartTime,
      eventEndTime,
      airdropStartTime,
      airdropEndTime,
      daoChainId,
      validFieldList.map(item => ({ name: item.name, required: item.required }))
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
    airdropEndTime,
    airdropStartTime,
    createAirdropONECallback,
    daoChainId,
    description,
    eventEndTime,
    eventStartTime,
    hideModal,
    history,
    inputValueAmount,
    isEth,
    network,
    showModal,
    title,
    trueAirdropAddress,
    validFieldList
  ])

  const paramsCheck: {
    disabled: boolean
    handler?: () => void
    error?: undefined | string | JSX.Element
  } = useMemo(() => {
    // const currentTime = currentTimeStamp()
    if (!title) {
      return {
        disabled: true,
        error: 'Title required'
      }
    }
    if (!validFieldList.length) {
      return {
        disabled: true,
        error: 'Collect field required'
      }
    }
    if (!network?.id) {
      return {
        disabled: true,
        error: 'Network required'
      }
    }
    if (!airdropCurrency) {
      return {
        disabled: true,
        error: 'DAO Rewards token required'
      }
    }
    if (!airdropCurrencyBalance || airdropCurrencyBalance.equalTo(JSBI.BigInt(0))) {
      return {
        disabled: true,
        error: 'DAO Rewards amount required'
      }
    }
    if (!eventStartTime) {
      return {
        disabled: true,
        error: 'Event start time required'
      }
    }
    // if (eventStartTime < currentTime) {
    //   return {
    //     disabled: true,
    //     error: 'The event start time must be later than the current time'
    //   }
    // }
    if (!eventEndTime) {
      return {
        disabled: true,
        error: 'Event end time required'
      }
    }
    if (eventEndTime <= eventStartTime) {
      return {
        disabled: true,
        error: 'The event end time must be later than the event start time'
      }
    }
    if (!airdropStartTime) {
      return {
        disabled: true,
        error: 'DAO Rewards start time required'
      }
    }
    if (airdropStartTime <= eventEndTime) {
      return {
        disabled: true,
        error: 'The DAO Rewards start time must be later than the event end time'
      }
    }
    if (!airdropEndTime) {
      return {
        disabled: true,
        error: 'DAO Rewards end time required'
      }
    }
    if (airdropEndTime <= airdropStartTime) {
      return {
        disabled: true,
        error: 'The DAO Rewards end time must be later than the DAO Rewards start time'
      }
    }

    if (network.id !== chainId) {
      return {
        disabled: true,
        error: (
          <>
            You need{' '}
            <Link
              sx={{ cursor: 'pointer' }}
              onClick={() => network.id && triggerSwitchChain(library, network.id, account || '')}
            >
              switch
            </Link>{' '}
            to {ChainListMap[network.id].name}
          </>
        )
      }
    }

    if (approveState !== ApprovalState.APPROVED) {
      if (approveState === ApprovalState.PENDING) {
        return {
          disabled: true,
          error: (
            <>
              Approving
              <Dots />
            </>
          )
        }
      } else if (approveState === ApprovalState.NOT_APPROVED) {
        return {
          disabled: true,
          error: (
            <>
              You need to{' '}
              <Link sx={{ cursor: 'pointer' }} onClick={approveCallback}>
                approve
              </Link>{' '}
              the contract to use your token.
            </>
          )
        }
      } else {
        return {
          disabled: true,
          error: (
            <>
              Loading (Unstable network connection, please try again later.)
              <Dots />
            </>
          )
        }
      }
    }

    return {
      disabled: false
    }
  }, [
    title,
    validFieldList.length,
    network?.id,
    airdropCurrency,
    airdropCurrencyBalance,
    eventStartTime,
    eventEndTime,
    airdropStartTime,
    airdropEndTime,
    chainId,
    approveState,
    library,
    account,
    approveCallback
  ])

  return (
    <DaoContainer>
      <Box>
        <Back sx={{ marginLeft: 0 }} text="All DAO Rewards" event={toList} />
        <Box mt={20} pb={40}>
          <ContainerWrapper maxWidth={709}>
            <Typography variant="h6">Create A DAO Rewards Event</Typography>
            <Stack spacing={20} mt={20}>
              <div>
                <StyledText mb={10}>Event Title</StyledText>
                <Input value={title} onChange={e => setTitle(e.target.value || '')} placeholder="Title" />
              </div>
              <div>
                <StyledText mb={10}>Event Description And Rule</StyledText>
                <Editor content={description} setContent={setDescription} />
              </div>

              <Box sx={{ mt: { xs: '65px !important', sm: 0 } }}>
                <StyledText mt={30}>Collect Information For Users</StyledText>
                <RowCenter>
                  <StyledText fontWeight={400} maxWidth="60%">
                    Only Address Of Participating Users Are Collected By Default
                  </StyledText>
                  <StyledText>Required Field</StyledText>
                </RowCenter>
                <InputField fieldList={fieldList} onFieldList={list => setFieldList(list)} />
              </Box>

              <Box>
                <ChainSelect
                  height={40}
                  label="Please Select Network"
                  chainList={ChainList}
                  selectedChain={network}
                  onChange={e => setNetwork(e)}
                ></ChainSelect>
              </Box>

              {isZero(airdropAddress) ? (
                <Input
                  label="DAO Rewards token"
                  value={network ? Currency.get_ETH_TOKEN(network.id as ChainId)?.symbol || '' : ''}
                  readOnly
                  rightLabel={
                    <Link underline="none" sx={{ cursor: 'pointer' }} onClick={() => setAirdropAddress('')}>
                      Use Token
                    </Link>
                  }
                />
              ) : (
                <Input
                  value={airdropAddress}
                  errSet={() => setAirdropAddress('')}
                  onChange={e => setAirdropAddress(e.target.value || '')}
                  placeholder="0x"
                  label="Please Enter The Contract Address"
                  rightLabel={
                    <Link underline="none" sx={{ cursor: 'pointer' }} onClick={() => setAirdropAddress(ZERO_ADDRESS)}>
                      Use Native Token
                    </Link>
                  }
                  type="address"
                />
              )}

              <RowCenter flexWrap={'wrap'}>
                <StyledText>
                  Token Name:{' '}
                  <span style={{ color: theme.palette.text.primary }}>
                    {airdropCurrency?.name || '--'} ({airdropCurrency?.symbol || '--'})
                  </span>
                </StyledText>
                {airdropTokenSupply && (
                  <StyledText>
                    Total Supply:{' '}
                    <span style={{ color: theme.palette.text.primary }}>
                      {airdropTokenSupply.toSignificant(6, { groupSeparator: ',' })}
                    </span>
                  </StyledText>
                )}
              </RowCenter>

              <InputNumerical
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                label="Total Amount For DAO Rewards"
                balance={airdropCurrencyBalance?.toSignificant(6, { groupSeparator: ',' })}
                onMax={() => setInputValue(airdropCurrencyBalance?.toSignificant(6) || '')}
              />

              <Box
                display={'grid'}
                sx={{
                  gridTemplateColumns: { sm: '1fr 1fr 1fr 1fr', xs: '1fr' }
                }}
              >
                <Box>
                  <StyledText>Event Start Time</StyledText>
                  <DateTimePicker
                    inputWidth={isSmDown ? '100%' : undefined}
                    value={eventStartTime ? new Date(eventStartTime * 1000) : null}
                    onValue={timestamp => {
                      setEventStartTime(timestamp)
                    }}
                  ></DateTimePicker>
                </Box>
                <Box>
                  <StyledText>Event End Time</StyledText>
                  <DateTimePicker
                    inputWidth={isSmDown ? '100%' : undefined}
                    disabled={!eventStartTime}
                    minDateTime={eventStartTime ? new Date(eventStartTime * 1000) : undefined}
                    value={eventEndTime ? new Date(eventEndTime * 1000) : null}
                    onValue={timestamp => setEventEndTime(timestamp)}
                  ></DateTimePicker>
                </Box>
                <Box>
                  <StyledText>DAO Rewards Start Time</StyledText>
                  <DateTimePicker
                    inputWidth={isSmDown ? '100%' : undefined}
                    disabled={!eventEndTime}
                    minDateTime={eventEndTime ? new Date(eventEndTime * 1000) : undefined}
                    value={airdropStartTime ? new Date(airdropStartTime * 1000) : null}
                    onValue={timestamp => setAirdropStartTime(timestamp)}
                  ></DateTimePicker>
                </Box>
                <Box>
                  <StyledText>DAO Rewards End Time</StyledText>
                  <DateTimePicker
                    inputWidth={isSmDown ? '100%' : undefined}
                    disabled={!airdropStartTime}
                    minDateTime={airdropStartTime ? new Date(airdropStartTime * 1000) : undefined}
                    value={airdropEndTime ? new Date(airdropEndTime * 1000) : null}
                    onValue={timestamp => setAirdropEndTime(timestamp)}
                  ></DateTimePicker>
                </Box>
              </Box>
            </Stack>

            {paramsCheck.error ? (
              <Alert severity="error" sx={{ marginTop: 20 }}>
                {paramsCheck.error}
              </Alert>
            ) : (
              <Alert severity="success" sx={{ marginTop: 20 }}>
                You can now create a DAO Rewards
              </Alert>
            )}

            <Box display={'flex'} justifyContent="center" mt={40}>
              <BlackButton width="166px" onClick={create} disabled={paramsCheck.disabled}>
                Create
              </BlackButton>
            </Box>
          </ContainerWrapper>
        </Box>
      </Box>
    </DaoContainer>
  )
}
