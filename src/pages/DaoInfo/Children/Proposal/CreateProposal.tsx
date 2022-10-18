import { Alert, Box, Button as MuiButton, ButtonGroup, Link, Stack, styled, Typography } from '@mui/material'
import Back from 'components/Back'
import DateTimePicker from 'components/DateTimePicker'
import Input from 'components/Input'
import { RowCenter } from './ProposalItem'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import OutlineButton from 'components/Button/OutlineButton'
import Button, { BlackButton } from 'components/Button/Button'
import { useHistory, useParams } from 'react-router'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { VotingTypes, VotingTypesName } from 'state/buildingGovDao/actions'
import { DaoInfoProp, useDaoInfo } from 'hooks/useDaoInfo'
import { ChainId, ChainListMap } from 'constants/chain'
import Loading from 'components/Loading'
import { StyledDelButton } from 'pages/Creator/CreatorToken/Governance'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useCreateProposalCallback } from 'hooks/useProposalCallback'
import { useProposalSign } from 'hooks/useProposalInfo'
import { TokenAmount } from 'constants/token'
import JSBI from 'jsbi'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import Editor from './Editor'
import { routes } from 'constants/routes'
import { currentTimeStamp } from 'utils'

const LabelText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 12
}))

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  '& button': {
    borderWidth: '2px',
    color: theme.palette.text.primary,
    fontWeight: 600,
    '&:hover': {
      borderWidth: '2px'
    },
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    }
  }
}))

export default function CreateProposal() {
  const { chainId: daoChainId, address: daoAddress } = useParams<{ chainId: string; address: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const daoInfo = useDaoInfo(daoAddress, curDaoChainId)

  return daoInfo ? <CreateForm daoChainId={curDaoChainId} daoInfo={daoInfo} /> : <Loading />
}

function CreateForm({ daoInfo, daoChainId }: { daoInfo: DaoInfoProp; daoChainId: ChainId }) {
  const history = useHistory()
  const { showModal, hideModal } = useModal()
  const { chainId, account, library } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [startTime, setStartTime] = useState<number>()
  const [endTime, setEndTime] = useState<number>()
  const [voteType, setVoteType] = useState<VotingTypes>(
    daoInfo.votingType !== VotingTypes.MULTI ? VotingTypes.SINGLE : VotingTypes.MULTI
  )
  const [voteOption, setVoteOption] = useState<string[]>(['Approve', 'Disapprove', ''])
  const createProposalCallback = useCreateProposalCallback(daoInfo.daoAddress)
  const createProposalSign = useProposalSign(daoInfo.daoAddress, daoChainId)

  const myBalance = useMemo(() => {
    if (!daoInfo.token || !createProposalSign) {
      return undefined
    }
    return new TokenAmount(daoInfo.token, JSBI.BigInt(createProposalSign?.balance || '0'))
  }, [createProposalSign, daoInfo.token])

  const toList = useCallback(() => {
    history.replace(routes._DaoInfo + `/${daoChainId}/${daoInfo.daoAddress}`)
  }, [daoChainId, daoInfo.daoAddress, history])

  const onCreateProposal = useCallback(() => {
    if (
      !createProposalSign ||
      account?.toLowerCase() !== createProposalSign.account?.toLowerCase() ||
      !startTime ||
      !endTime
    )
      return
    showModal(<TransacitonPendingModal />)
    createProposalCallback(
      title,
      introduction,
      content,
      startTime,
      endTime,
      voteType,
      voteOption.filter(i => i),
      {
        chainId: createProposalSign.tokenChainId,
        balance: createProposalSign.balance,
        tokenAddress: createProposalSign.tokenAddress,
        signType: 0
      },
      createProposalSign.signature
    )
      .then(hash => {
        hideModal()
        showModal(<TransactionSubmittedModal hideFunc={toList} hash={hash} />)
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
    createProposalSign,
    account,
    introduction,
    startTime,
    endTime,
    showModal,
    createProposalCallback,
    title,
    content,
    voteType,
    voteOption,
    hideModal,
    toList
  ])

  const paramsCheck: {
    disabled: boolean
    handler?: () => void
    error?: undefined | string | JSX.Element
  } = useMemo(() => {
    const currentTime = currentTimeStamp()
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
    if (startTime < currentTime) {
      return {
        disabled: true,
        error: 'The start time must be later than the current time'
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
    if (!voteType) {
      return {
        disabled: true,
        error: 'Voting type required'
      }
    }
    if (voteOption.filter(i => i).length < 2) {
      return {
        disabled: true,
        error: 'Voting options minimum is two'
      }
    }
    if (!account) {
      return {
        disabled: true,
        error: (
          <>
            You need to{' '}
            <Link sx={{ cursor: 'pointer' }} onClick={toggleWalletModal}>
              connect
            </Link>{' '}
            your wallet
          </>
        )
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
              onClick={() => daoChainId && triggerSwitchChain(library, daoChainId, account)}
            >
              switch
            </Link>{' '}
            to {ChainListMap[daoChainId].name}
          </>
        )
      }
    }
    if (!myBalance || !daoInfo.proposalThreshold || myBalance.lessThan(daoInfo.proposalThreshold)) {
      return {
        disabled: true,
        error: 'Insufficient balance'
      }
    }
    return {
      disabled: false
    }
  }, [
    account,
    chainId,
    daoChainId,
    daoInfo.proposalThreshold,
    endTime,
    library,
    myBalance,
    startTime,
    title,
    toggleWalletModal,
    voteOption,
    voteType
  ])

  return (
    <Box>
      <Back sx={{ margin: 0 }} text="All Proposals" event={toList} />
      <Typography variant="h6" mt={28}>
        Create Proposal
      </Typography>
      <Box display="grid" mt={20} gridTemplateColumns={{ md: '1fr 1fr', xs: 'unset' }} gap="66px">
        <Stack spacing={20}>
          <Input value={title} placeholder="Title" onChange={e => setTitle(e.target.value)} label="Title" />
          <Input
            value={introduction}
            onChange={e => setIntroduction(e.target.value)}
            label="Introduction"
            placeholder="Introduction"
          />
          <div>
            <LabelText>Description</LabelText>
            <Editor content={content} setContent={setContent} />
          </div>
        </Stack>
        <Box>
          <Stack paddingTop="30px" spacing={'20px'}>
            <Box display={'grid'} gridTemplateColumns="70px 1fr" alignItems={'center'} gap="12px 24px">
              <LabelText>Start Time</LabelText>
              <DateTimePicker
                value={startTime ? new Date(startTime * 1000) : null}
                onValue={timestamp => {
                  setStartTime(timestamp)
                  if (!daoInfo.isCustomVotes) {
                    setEndTime(timestamp ? timestamp + daoInfo.votingPeriod : undefined)
                  }
                }}
              ></DateTimePicker>
              <LabelText>End Time</LabelText>
              <DateTimePicker
                disabled={!daoInfo.isCustomVotes}
                minDateTime={startTime ? new Date(startTime * 1000) : undefined}
                value={endTime ? new Date(endTime * 1000) : null}
                onValue={timestamp => setEndTime(timestamp)}
              ></DateTimePicker>
            </Box>

            <Box>
              <LabelText mb={6}>Voting Type</LabelText>

              {daoInfo.votingType === VotingTypes.ANY ? (
                <StyledButtonGroup variant="outlined">
                  <MuiButton
                    className={voteType === VotingTypes.SINGLE ? 'active' : ''}
                    onClick={() => setVoteType(VotingTypes.SINGLE)}
                  >
                    Single-voting
                  </MuiButton>
                  <MuiButton
                    className={voteType === VotingTypes.MULTI ? 'active' : ''}
                    onClick={() => setVoteType(VotingTypes.MULTI)}
                  >
                    Multi-voting
                  </MuiButton>
                </StyledButtonGroup>
              ) : (
                <Button height="36px">{VotingTypesName[daoInfo.votingType]}</Button>
              )}
            </Box>

            <VotingOptions option={voteOption} setOption={setVoteOption} />

            <Box>
              <RowCenter>
                <LabelText>Minimum Tokens Needed To Create Proposal</LabelText>
                <LabelText>
                  {daoInfo.proposalThreshold?.toSignificant(6, { groupSeparator: ',' }) || '--'} {daoInfo.token?.symbol}
                </LabelText>
              </RowCenter>
              <RowCenter>
                <LabelText>Balance</LabelText>
                <LabelText>
                  {myBalance?.toSignificant(6, { groupSeparator: ',' }) || '--'} {daoInfo.token?.symbol}
                </LabelText>
              </RowCenter>
            </Box>
          </Stack>

          {paramsCheck.error ? (
            <Alert severity="error" sx={{ marginTop: 20 }}>
              {paramsCheck.error}
            </Alert>
          ) : (
            <Alert severity="success" sx={{ marginTop: 20 }}>
              You can now create a proposal
            </Alert>
          )}

          <Stack spacing={60} direction="row" mt={50}>
            <OutlineButton onClick={history.goBack}>Cancel</OutlineButton>
            <BlackButton disabled={paramsCheck.disabled} onClick={onCreateProposal}>
              Create
            </BlackButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

function VotingOptions({ option, setOption }: { option: string[]; setOption: Dispatch<SetStateAction<string[]>> }) {
  const updateVoteOption = useCallback(
    (index: number, value: string) => {
      const options = [...option]
      options[index] = value
      setOption(options)
    },
    [option, setOption]
  )
  const removeVoteOption = useCallback(
    (index: number) => {
      if (index < 2) return
      const _new = [...option]
      _new.splice(index, 1)
      setOption(_new)
    },
    [option, setOption]
  )
  const addVoteOption = useCallback(() => {
    if (option.length >= 10) return
    setOption([...option, ''])
  }, [option, setOption])

  return (
    <div>
      <RowCenter>
        <LabelText>Voting Options</LabelText>
        <LabelText
          display={'flex'}
          alignItems="center"
          onClick={addVoteOption}
          sx={{ cursor: 'pointer', color: theme => theme.palette.primary.main }}
        >
          <AddCircleOutlineIcon sx={{ width: 16 }} />
          Add A Option
        </LabelText>
      </RowCenter>
      <Stack spacing={8} mt={16}>
        <Input value={option[0]} onChange={e => updateVoteOption(0, e.target.value)} placeholder="Approve" />
        <Input value={option[1]} onChange={e => updateVoteOption(1, e.target.value)} placeholder="Disapprove" />
        {option.map(
          (_, index) =>
            index > 1 && (
              <Box display={'grid'} gap="24px" gridTemplateColumns={'1fr 54px'} key={index}>
                <Input
                  value={option[index]}
                  onChange={e => updateVoteOption(index, e.target.value)}
                  placeholder="Option"
                />
                <StyledDelButton onClick={() => removeVoteOption(index)} />
              </Box>
            )
        )}
      </Stack>
    </div>
  )
}
