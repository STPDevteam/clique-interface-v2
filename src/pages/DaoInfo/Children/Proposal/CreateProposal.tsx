import { Alert, Box, Button as MuiButton, ButtonGroup, Link, Stack, styled, Typography } from '@mui/material'
import DateTimePicker from 'components/DateTimePicker'
import Input from 'components/Input'
import { RowCenter } from './ProposalItem'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import OutlineButton from 'components/Button/OutlineButton'
import Button, { BlackButton } from 'components/Button/Button'
import { useHistory, useParams } from 'react-router'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { CreateDaoDataProp, VotingTypes, VotingTypesName } from 'state/buildingGovDao/actions'
import { ChainListMap } from 'constants/chain'
// import Loading from 'components/Loading'
import { StyledDelButton } from 'pages/Creator/CreatorToken/Governance'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useCreateProposalCallback } from 'hooks/useProposalCallback'
import { Token, TokenAmount } from 'constants/token'
import JSBI from 'jsbi'
import Editor from './Editor'
import { routes } from 'constants/routes'
import DaoContainer from 'components/DaoContainer'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { toast } from 'react-toastify'
import { ReactComponent as ProposalIcon } from 'assets/svg/proposal.svg'

const LabelText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 14,
  marginBottom: 6
}))

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  width: 431,
  '& button': {
    height: 36,
    borderWidth: '1px',
    color: theme.palette.text.primary,
    fontWeight: 600,
    '&:hover': {
      borderWidth: '1px'
    },
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    }
  }
}))

export default function CreateProposal() {
  const { daoId: daoId } = useParams<{ daoId: string }>()
  const daoInfo = useSelector((state: AppState) => state.buildingGovernanceDao.createDaoData)

  return daoInfo ? <CreateForm daoId={Number(daoId)} daoInfo={daoInfo} /> : <CreateForm daoId={0} daoInfo={daoInfo} />
}

function CreateForm({ daoId, daoInfo }: { daoId: number; daoInfo: CreateDaoDataProp }) {
  const history = useHistory()
  const createProposalSign = '0'
  const { chainId, account, library } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  // const [introduction, setIntroduction] = useState('')
  const [startTime, setStartTime] = useState<number>()
  const [endTime, setEndTime] = useState<number>()
  const [voteType, setVoteType] = useState<VotingTypes>(
    daoInfo.votingTypes === VotingTypes.ANY
      ? VotingTypes.SINGLE
      : daoInfo.votingTypes === VotingTypes.MULTI
      ? VotingTypes.MULTI
      : VotingTypes.SINGLE
  )
  const [voteOption, setVoteOption] = useState<string[]>(['Approve', 'Disapprove', ''])
  const createProposalCallback = useCreateProposalCallback()
  console.log(daoInfo)

  const myBalance = useMemo(() => {
    if (!daoInfo.tokenAddr || !createProposalSign) {
      return undefined
    }
    const _token = new Token(
      daoInfo.governance[0].chainId,
      daoInfo.governance[0].tokenAddress,
      daoInfo.governance[0].decimals,
      daoInfo.governance[0].symbol
    )
    return new TokenAmount(_token, JSBI.BigInt(createProposalSign || '0'))
  }, [daoInfo.governance, daoInfo.tokenAddr])

  const toList = useCallback(() => {
    history.replace(routes._DaoInfo + `/${daoId}/proposal`)
  }, [daoId, history])

  const onCreateProposal = useCallback(() => {
    if (!startTime || !endTime) return
    createProposalCallback(
      content,
      daoId,
      endTime,
      '',
      voteOption.filter(i => i),
      startTime,
      title,
      [0],
      voteType
    )
      .then(res => {
        console.log(res)
        toast.success('create proposal success')
        toList()
      })
      .catch((err: any) => {
        toast.error('network error')
        console.log(err)
      })
  }, [startTime, endTime, createProposalCallback, content, daoId, voteOption, title, voteType, toList])

  const paramsCheck: {
    disabled: boolean
    handler?: () => void
    error?: undefined | string | JSX.Element
  } = useMemo(() => {
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
    if (daoInfo.chainID !== chainId) {
      return {
        disabled: true,
        error: (
          <>
            You need{' '}
            <Link
              sx={{ cursor: 'pointer' }}
              onClick={() => daoInfo.chainID && triggerSwitchChain(library, daoInfo.chainID, account)}
            >
              switch
            </Link>{' '}
            to {ChainListMap[daoInfo.chainID].name}
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
    daoInfo.chainID,
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
    <DaoContainer>
      <Box>
        <Stack
          sx={{
            'svg path': {
              fill: 'rgba(0, 73, 198, 1)'
            }
          }}
          direction={'row'}
          alignItems={'center'}
        >
          <ProposalIcon />
          <Typography
            sx={{
              ml: '6px',
              fontWeight: '600',
              fontSize: '30px',
              lineHeight: '20px'
            }}
          >
            Create Proposal
          </Typography>
        </Stack>
        <Stack spacing={20} mt={40}>
          <Input value={title} placeholder="Title" onChange={e => setTitle(e.target.value)} label="Title" />
          {/* <Input
              value={introduction}
              onChange={e => setIntroduction(e.target.value)}
              label="Introduction"
              placeholder="Introduction"
            /> */}
          <div>
            <LabelText>Description</LabelText>
            <Editor content={content} setContent={setContent} />
          </div>
        </Stack>
        <Box mt={70}>
          <Stack spacing={'20px'}>
            <Stack flexDirection={'row'} gridTemplateColumns={'137px 1fr'} alignItems={'center'}>
              <LabelText mb={6} width={137} textAlign={'left'}>
                Voting Type
              </LabelText>
              {daoInfo.votingTypes === VotingTypes.ANY ? (
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
                <Button height="36px">{VotingTypesName[daoInfo.votingTypes]}</Button>
              )}
            </Stack>
            <VotingOptions option={voteOption} setOption={setVoteOption} />
            <Box display={'grid'} gridTemplateColumns="78px 1fr" alignItems={'center'} gap="12px 24px">
              <LabelText>Start Time</LabelText>
              <DateTimePicker
                value={startTime ? new Date(startTime * 1000) : null}
                onValue={timestamp => {
                  setStartTime(timestamp)
                  if (!daoInfo.votingPeriod) {
                    setEndTime(timestamp ? timestamp + daoInfo.votingPeriod : undefined)
                  }
                }}
              ></DateTimePicker>
              <LabelText>End Time</LabelText>
              <DateTimePicker
                disabled={!daoInfo.votingPeriod}
                minDateTime={startTime ? new Date(startTime * 1000) : undefined}
                value={endTime ? new Date(endTime * 1000) : null}
                onValue={timestamp => setEndTime(timestamp)}
              ></DateTimePicker>
            </Box>
            <Box>
              <RowCenter>
                <LabelText>Minimum Tokens Needed To Create Proposal</LabelText>
                <LabelText>
                  {/* {daoInfo.proposalThreshold?.toSignificant(6, { groupSeparator: ',' }) || '--'}{' '} */}
                  {/* {daoInfo.token?.symbol} */}
                </LabelText>
              </RowCenter>
              <RowCenter>
                <LabelText>Balance</LabelText>
                <LabelText>
                  {/* {myBalance?.toSignificant(6, { groupSeparator: ',' }) || '--'} {daoInfo.token?.symbol} */}
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
          <Stack direction="row" mt={50} mb={20} justifyContent={'space-between'}>
            <OutlineButton noBold color="#0049C6" width="200px" height="40px" onClick={history.goBack}>
              Back
            </OutlineButton>
            <BlackButton width="200px" height="40px" disabled={paramsCheck.disabled} onClick={onCreateProposal}>
              Publish
            </BlackButton>
          </Stack>
        </Box>
      </Box>
    </DaoContainer>
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
