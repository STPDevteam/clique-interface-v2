import { Alert, Box, Button as MuiButton, ButtonGroup, Link, Stack, styled, Typography, Checkbox } from '@mui/material'
import DateTimePicker from 'components/DateTimePicker'
import Input from 'components/Input'
// import { RowCenter } from './ProposalItem'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import OutlineButton from 'components/Button/OutlineButton'
import Button, { BlackButton } from 'components/Button/Button'
import { useHistory, useParams } from 'react-router'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { CreateDaoDataProp, VotingTypes, VotingTypesName, govList } from 'state/buildingGovDao/actions'
// import Loading from 'components/Loading'
import { StyledDelButton } from 'pages/Creator/CreatorToken/Governance'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
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
import { ReactComponent as TimeIcon } from 'assets/svg/time_icon.svg'

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

const DateSelectStyle = styled(Box)(() => ({
  width: 365,
  height: 40,
  display: 'grid',
  alignItems: 'center',
  gridTemplateColumns: '150px 1fr',
  border: '1px solid #D4D7E2',
  borderRadius: '8px',
  '& .MuiInputBase-input': {
    padding: 0,
    height: 40,
    background: 'transparent'
  },
  '& .timelabel': {
    paddingLeft: 14,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    lineHeight: '20px',
    borderRight: '1px solid #D4D7E2',
    gap: 8
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
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  // const [introduction, setIntroduction] = useState('')
  const [startTime, setStartTime] = useState<number>()
  const [endTime, setEndTime] = useState<number>()
  const [voteType, setVoteType] = useState<VotingTypes>(
    daoInfo.votingType === VotingTypes.ANY
      ? VotingTypes.SINGLE
      : daoInfo.votingType === VotingTypes.MULTI
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
    daoInfo.proposalThreshold,
    endTime,
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
          <Box sx={{ mb: 20 }}>
            <LabelText>Voting Token</LabelText>
            <CheckBoxs list={daoInfo.governance} />
          </Box>
          <Stack spacing={'20px'}>
            <Stack flexDirection={'row'} gridTemplateColumns={'150px 1fr'} alignItems={'center'}>
              <LabelText mb={6} width={150} textAlign={'left'}>
                Voting Type
              </LabelText>
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
            </Stack>
            <VotingOptions option={voteOption} setOption={setVoteOption} />
            <Box display={'grid'} gridTemplateColumns="150px 1fr" alignItems={'center'}>
              <Typography variant="body1" lineHeight={'16px'} color={'#80829F'}>
                Voting period
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <DateSelectStyle>
                  <LabelText className="timelabel">
                    <TimeIcon />
                    Start Time
                  </LabelText>
                  <DateTimePicker
                    label=" "
                    value={startTime ? new Date(startTime * 1000) : null}
                    onValue={timestamp => {
                      setStartTime(timestamp)
                      if (!daoInfo.votingPeriod) {
                        setEndTime(timestamp ? timestamp + daoInfo.votingPeriod : undefined)
                      }
                    }}
                  ></DateTimePicker>
                </DateSelectStyle>
                <Box
                  sx={{
                    width: 0,
                    height: 10,
                    border: '1px solid #D4D7E2',
                    transform: 'rotate(90deg)'
                  }}
                />
                <DateSelectStyle>
                  <LabelText className="timelabel">
                    <TimeIcon />
                    End Time
                  </LabelText>
                  <DateTimePicker
                    label=" "
                    disabled={daoInfo.votingPeriod !== 0}
                    minDateTime={startTime ? new Date(startTime * 1000) : undefined}
                    value={endTime ? new Date(endTime * 1000) : null}
                    onValue={timestamp => setEndTime(timestamp)}
                  ></DateTimePicker>
                </DateSelectStyle>
              </Box>
            </Box>
            <Box>
              {/* <RowCenter> */}
              {/* <LabelText>Minimum Tokens Needed To Create Proposal</LabelText> */}
              {/* <LabelText> */}
              {/* {daoInfo.proposalThreshold?.toSignificant(6, { groupSeparator: ',' }) || '--'}{' '} */}
              {/* {daoInfo.token?.symbol} */}
              {/* </LabelText> */}
              {/* </RowCenter> */}
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

  const InputBoxstyle = styled(Box)(() => ({
    boxSizing: 'border-box',
    height: 40,
    background: ' #FFFFFF',
    border: '1px solid #D4D7E2',
    borderRadius: ' 8px',
    display: 'flex',
    alignItems: 'center',
    '& .headetitle': {
      width: '114px',
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#97B7EF',
      borderRadius: '8px',
      color: '#fff'
    },
    '& .inputStyle': {
      height: 36,
      border: 'none',
      background: 'transparent !important'
    }
  }))

  return (
    <div>
      <Box sx={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
        <LabelText sx={{ margin: 0, height: 40, display: 'flex', alignItems: 'center' }}>Voting Options</LabelText>
        <Box sx={{ display: 'grid', gap: 14, flexDirection: 'column' }}>
          <InputBoxstyle>
            <Typography variant="body1" className="headetitle">
              Options 1
            </Typography>
            <Input
              className="inputStyle"
              value={option[0]}
              onChange={e => updateVoteOption(0, e.target.value)}
              placeholder="Approve"
            />
            <StyledDelButton sx={{ mr: 5, height: 30, width: 40, borderRadius: '4px' }} />
          </InputBoxstyle>
          <InputBoxstyle>
            <Typography variant="body1" className="headetitle">
              Options 2
            </Typography>
            <Input
              className="inputStyle"
              value={option[1]}
              onChange={e => updateVoteOption(1, e.target.value)}
              placeholder="Disapprove"
            />
            <StyledDelButton sx={{ mr: 5, height: 30, width: 40, borderRadius: '4px' }} />
          </InputBoxstyle>
          {option.map(
            (_, index) =>
              index > 1 && (
                <InputBoxstyle>
                  <Typography variant="body1" className="headetitle">
                    Options {index + 1}
                  </Typography>
                  <Input
                    className="inputStyle"
                    value={option[index]}
                    onChange={e => updateVoteOption(index, e.target.value)}
                    placeholder="Option"
                  />
                  <StyledDelButton
                    sx={{ mr: 5, height: 30, width: 40, borderRadius: '4px' }}
                    onClick={() => removeVoteOption(index)}
                  />
                </InputBoxstyle>
              )
          )}
          <Box>
            <LabelText
              onClick={addVoteOption}
              sx={{ display: 'flex', gap: 8, cursor: 'pointer', color: '#97B7EF', fontSize: 14 }}
            >
              <AddCircleOutlineIcon sx={{ width: 16 }} />
              Add Option
            </LabelText>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

const CreadStyle = styled(Box)(({}) => ({
  boxSizing: 'border-box',
  width: 227,
  height: 86,
  borderRadius: '8px',
  display: 'grid',
  gridTemplateColumns: '58px 1fr'
}))

function CheckBoxs({ list }: { list: govList[] }) {
  const [checkedValues, setCheckedValues] = useState<number[]>([])

  const handleCheckboxChange = (event: any, id: number) => {
    const isChecked = event.target.checked
    if (isChecked) {
      setCheckedValues([...checkedValues, id])
    } else {
      setCheckedValues(checkedValues.filter(value => value !== id))
    }
  }

  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
        {list.map((item: govList, index: number) => (
          <CreadStyle
            sx={{
              background: !checkedValues.includes(item.voteTokenId) ? '#FAFAFA' : '#F8FBFF',
              border: !checkedValues.includes(item.voteTokenId) ? ' 1px solid #D4D7E2' : '1px solid #97B7EF'
            }}
            key={index}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Checkbox
                sx={{ borderRadius: '50%', color: '#D9D9D9' }}
                checked={checkedValues.includes(item.voteTokenId)}
                onChange={event => handleCheckboxChange(event, item.voteTokenId)}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="body1" lineHeight="16px">
                `${item.tokenName}(${item.symbol})`
              </Typography>
              <Typography marginTop={14} variant="body1" lineHeight="16px" color={'#80829F'}>
                1{item.symbol} = {item.weight}Votes
              </Typography>
            </Box>
          </CreadStyle>
        ))}
      </Box>
    </>
  )
}
