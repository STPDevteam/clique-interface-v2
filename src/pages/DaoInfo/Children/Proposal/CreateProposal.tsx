import { Alert, Box, Button as MuiButton, ButtonGroup, Stack, styled, Typography, useTheme } from '@mui/material'
import DateTimePicker from 'components/DateTimePicker'
import Input from 'components/Input'
// import { RowCenter } from './ProposalItem'
import { LoadingButton } from '@mui/lab'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import OutlineButton from 'components/Button/OutlineButton'
import Button from 'components/Button/Button'
import { useParams } from 'react-router'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { CreateDaoDataProp, VotingTypes, VotingTypesName } from 'state/buildingGovDao/actions'
// import Loading from 'components/Loading'
import { StyledDelButton } from 'pages/Creator/CreatorToken/Governance'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { useCreateProposalCallback } from 'hooks/useProposalCallback'
import { CreateType } from 'hooks/useBackedProposalServer'
import { Token } from 'constants/token'
import { useCurrencyBalance } from 'state/wallet/hooks'
import Editor from './Editor'
import { routes } from 'constants/routes'
import DaoContainer from 'components/DaoContainer'
import { toast } from 'react-toastify'
import { ReactComponent as ProposalIcon } from 'assets/svg/proposal.svg'
import { ReactComponent as TimeIcon } from 'assets/svg/time_icon.svg'
import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'
import { useUserInfo } from 'state/userInfo/hooks'
import { IS_TEST_NET } from 'constants/chain'
import { useNavigate } from 'react-router-dom'
import useBreakpoint from 'hooks/useBreakpoint'
// import { ChainListMap } from 'constants/chain'
// import { triggerSwitchChain } from 'utils/triggerSwitchChain'

const LabelText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 14,
  marginBottom: 6,
  [theme.breakpoints.down('sm')]: {
    marginBottom: 0
  }
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
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}))

const DateSelectStyle = styled(Box)(({ theme }) => ({
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
  },
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100vw - 32px)'
  }
}))

export default function CreateProposal() {
  const { daoId: daoId } = useParams<{ daoId: string }>()
  const { buildingDaoData: daoInfo } = useBuildingDaoDataCallback()
  return daoInfo ? (
    <CreateForm daoId={Number(daoId)} daoInfo={daoInfo} />
  ) : (
    <CreateForm daoId={Number(daoId)} daoInfo={daoInfo} />
  )
}

function CreateForm({ daoId, daoInfo }: { daoId: number; daoInfo: CreateDaoDataProp }) {
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')
  const navigate = useNavigate()
  const userSignature = useUserInfo()
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const [loading, setLoading] = useState(false)
  const [voteOption, setVoteOption] = useState(['Approve', 'Disapprove', ''])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStarttime] = useState<number>()
  const [endTime, setEndtime] = useState<number>()
  const [startValidate, setStartValidate] = useState(false)
  const [isUpChain, setIsUpChain] = useState<boolean>(false)
  const [voteType, setVoteType] = useState<VotingTypes>(
    daoInfo.votingType === VotingTypes.ANY
      ? VotingTypes.SINGLE
      : daoInfo.votingType === VotingTypes.MULTI
      ? VotingTypes.MULTI
      : VotingTypes.SINGLE
  )
  const createProposalCallback = useCreateProposalCallback()
  console.log('period', daoInfo.votingPeriod)

  const createToken = useMemo(() => {
    if (!daoInfo.governance[0] || !daoInfo.governance[0].createRequire) {
      return undefined
    }
    const _token = new Token(
      daoInfo.governance[0].chainId,
      daoInfo.governance[0].tokenAddress,
      daoInfo.governance[0].decimals,
      daoInfo.governance[0].symbol
    )
    return _token
  }, [daoInfo.governance])
  const myBalance = useCurrencyBalance(account || undefined, createToken)

  const errors: {
    text: string
    name: string
  } = useMemo(() => {
    if (!userSignature) {
      return {
        text: 'Please Connect wallet first',
        name: ''
      }
    }

    if (!title.trim()) {
      return {
        text: 'Title required',
        name: 'title'
      }
    }
    if (title.length > 100) {
      return {
        text: 'Title Length exceeds the limit',
        name: 'title'
      }
    }
    if (!description) {
      return {
        text: 'Description required',
        name: 'description'
      }
    }
    if (voteOption.filter(i => i).length < 2) {
      return {
        name: 'option',
        text: 'Voting options minimum is two'
      }
    }
    if (!startTime) {
      return {
        text: 'Start time required',
        name: 'time'
      }
    }
    if (!endTime) {
      return {
        text: 'End time required',
        name: 'time'
      }
    }
    if (startTime >= endTime) {
      return {
        text: 'The start time must be earlier than the end time',
        name: 'time'
      }
    }
    if (!myBalance || !daoInfo.governance[0].createRequire || myBalance.lessThan(daoInfo.governance[0].createRequire)) {
      return {
        text: 'Insufficient balance',
        name: 'balance'
      }
    }
    return {
      text: '',
      name: ''
    }
  }, [daoInfo.governance, description, endTime, myBalance, startTime, title, userSignature, voteOption])

  const toList = useCallback(() => {
    navigate(routes._DaoInfo + `/${daoId}/proposal`, { replace: true })
  }, [daoId, navigate])

  const handleSubmit = useCallback(() => {
    setStartValidate(true)
    if (!daoId || !endTime || !startTime || errors.text) return
    setLoading(true)
    createProposalCallback(
      description,
      daoId,
      endTime,
      '',
      isUpChain,
      voteOption.filter((i: any) => i),
      startTime,
      title,
      [daoInfo.governance[0].voteTokenId],
      voteType
    )
      .then(res => {
        setLoading(false)
        setStartValidate(false)
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'Network error')
          return
        }
        toast.success('Create proposal success')
        toList()
      })
      .catch((err: any) => {
        toast.error('Network error')
        setLoading(false)
        console.log(err)
        setStartValidate(false)
      })
  }, [
    createProposalCallback,
    daoId,
    daoInfo.governance,
    description,
    endTime,
    errors.text,
    isUpChain,
    startTime,
    title,
    toList,
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
        <Stack spacing={isSmDown ? 10 : 20} mt={isSmDown ? 20 : 40}>
          <Input
            value={title}
            placeholder="Title"
            height={isSmDown ? 36 : 40}
            onChange={val => {
              setTitle(val.target.value)
            }}
            maxLength={100}
            endAdornment={
              <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2" fontSize={14}>
                {title.length}/100
              </Typography>
            }
            label="Title"
            style={{ borderColor: startValidate && errors.text && errors.name === 'title' ? '#E46767' : '#D4D7E2' }}
          />
          {startValidate && errors.text && errors.name === 'title' && (
            <Typography color={'#E46767'} fontSize={14} fontWeight={500} sx={{ marginTop: '10px !important' }}>
              {errors.text}
            </Typography>
          )}
          {/* <Input
            value={introduction}
            onChange={e => setIntroduction(e.target.value)}
            label="Introduction"
            placeholder="Introduction"
          /> */}
          <div>
            <LabelText>Description</LabelText>
            <Editor content={description} setContent={setDescription} />
            {startValidate && errors.text && errors.name === 'description' && (
              <Typography color={'#E46767'} fontSize={14} fontWeight={500} sx={{ marginTop: '50px !important' }}>
                {errors.text}
              </Typography>
            )}
          </div>
        </Stack>
        <Box mt={isSmDown ? 80 : 62}>
          {/* <Box sx={{ mb: 20 }}>
            <LabelText>Voting Token</LabelText>
            <CheckBoxs list={daoInfo.governance} />
          </Box> */}
          <Stack spacing={isSmDown ? 10 : 20}>
            <Stack
              flexDirection={isSmDown ? 'column' : 'row'}
              gridTemplateColumns={isSmDown ? 'auto' : '150px 1fr'}
              alignItems={isSmDown ? 'start' : 'center'}
              spacing={isSmDown ? 6 : 0}
            >
              <LabelText mb={6} width={150} textAlign={'left'}>
                Voting Mode
              </LabelText>
              <StyledButtonGroup variant="outlined">
                <MuiButton className={!isUpChain ? 'active' : ''} onClick={() => setIsUpChain(false)}>
                  {CreateType.GASLESS}
                </MuiButton>
                <MuiButton className={isUpChain ? 'active' : ''} onClick={() => setIsUpChain(true)}>
                  {CreateType.ONCHAIN}
                </MuiButton>
              </StyledButtonGroup>
            </Stack>
            <Stack
              flexDirection={isSmDown ? 'column' : 'row'}
              gridTemplateColumns={isSmDown ? 'auto' : '150px 1fr'}
              alignItems={isSmDown ? 'start' : 'center'}
              spacing={isSmDown ? 6 : 0}
            >
              <LabelText mb={6} textAlign={'left'} width={'150px'}>
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
                <Button style={{ maxWidth: '794px' }} height="36px">
                  {VotingTypesName[daoInfo.votingType]}
                </Button>
              )}
            </Stack>
            <VotingOptions option={voteOption} setOption={setVoteOption} />
            <Box
              display={'grid'}
              gridTemplateColumns="150px 1fr"
              alignItems={'center'}
              sx={{
                [theme.breakpoints.down('sm')]: {
                  gridTemplateColumns: 'auto',
                  gap: 10
                }
              }}
            >
              <Typography variant="body1" lineHeight={'16px'} color={'#80829F'}>
                Voting Period
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  [theme.breakpoints.down('sm')]: {
                    display: 'grid',
                    gap: 10
                  }
                }}
              >
                <DateSelectStyle>
                  <LabelText className="timelabel">
                    <TimeIcon />
                    Start Time
                  </LabelText>
                  <DateTimePicker
                    label=" "
                    minDateTime={(Date.now() + 5 * 60 * 1000) as any}
                    value={startTime ? new Date(startTime * 1000) : null}
                    onValue={timestamp => {
                      if (!timestamp) return
                      if (timestamp && Number(timestamp) < Math.round(Date.now() / 1000) + 5 * 60) {
                        setStarttime(Math.round(Date.now() / 1000) + 5 * 60)
                      } else {
                        setStarttime(startTime ? timestamp : timestamp + 5 * 60)
                      }
                      if (daoInfo.votingPeriod) {
                        setEndtime((startTime ? timestamp : timestamp + 5 * 60) + daoInfo.votingPeriod)
                      }
                      if (daoInfo.votingPeriod === 0) {
                        setEndtime((startTime ? timestamp : timestamp) + 86400 * 3 + 300)
                      }
                    }}
                  ></DateTimePicker>
                </DateSelectStyle>
                {!isSmDown && (
                  <Box
                    sx={{
                      width: 0,
                      height: 10,
                      border: '1px solid #D4D7E2',
                      transform: 'rotate(90deg)'
                    }}
                  />
                )}
                <DateSelectStyle>
                  <LabelText className="timelabel">
                    <TimeIcon />
                    End Time
                  </LabelText>
                  <DateTimePicker
                    label=" "
                    disabled={daoInfo.votingPeriod !== 0 || !startTime}
                    minDateTime={
                      startTime
                        ? daoInfo.votingPeriod === 0
                          ? IS_TEST_NET
                            ? new Date(startTime * 1000)
                            : new Date(startTime * 1000 + 86400000 * 3)
                          : new Date(startTime * 1000)
                        : undefined
                    }
                    value={endTime ? new Date(endTime * 1000) : null}
                    onValue={timestamp => {
                      if (!timestamp) return
                      if (timestamp && Number(timestamp) < (startTime || 0)) {
                        setEndtime(startTime)
                        return
                      }
                      setEndtime(endTime ? timestamp : timestamp + 5 * 60)
                    }}
                  ></DateTimePicker>
                </DateSelectStyle>
              </Box>
            </Box>
          </Stack>
          {/* {errors.text && (errors.name === 'balance' || errors.name === 'time') && ( */}
          {errors.text && (
            <Alert style={{ marginTop: isSmDown ? 20 : 30 }} severity="error">
              {errors.text}
            </Alert>
          )}
          <Stack direction="row" mt={20} mb={20} justifyContent={'space-between'}>
            <OutlineButton
              noBold
              color="#0049C6"
              width={isSmDown ? 150 : 200}
              height={isSmDown ? 36 : 40}
              onClick={() => {
                window.history.back()
              }}
            >
              Back
            </OutlineButton>
            {!account ? (
              <Button
                width={isSmDown ? '150px' : '200px'}
                height={isSmDown ? '36px' : '40px'}
                onClick={toggleWalletModal}
              >
                Connect wallet
              </Button>
            ) : (
              <LoadingButton
                loading={loading}
                loadingPosition="center"
                startIcon={<></>}
                variant="contained"
                color="primary"
                sx={{ width: isSmDown ? 150 : 200, height: isSmDown ? 36 : 40, textAlign: 'center' }}
                onClick={handleSubmit}
              >
                Publish
              </LoadingButton>
            )}
          </Stack>
        </Box>
      </Box>
    </DaoContainer>
  )
}

const InputBoxstyle = styled(Box)(({ theme }) => ({
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
    flex: 1,
    height: 36,
    border: 'none',
    background: 'transparent !important'
  },
  [theme.breakpoints.down('sm')]: {
    height: '36px',
    '& .headetitle': {
      height: '36px'
    }
  }
}))

function VotingOptions({ option, setOption }: { option: string[]; setOption: Dispatch<SetStateAction<string[]>> }) {
  // const isSmDown = useBreakpoint('sm')
  const theme = useTheme()
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
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '150px 1fr',
          [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: 'auto'
          }
        }}
      >
        <LabelText sx={{ margin: 0, height: 40, display: 'flex', alignItems: 'center' }}>Voting Options</LabelText>
        <Box sx={{ display: 'grid', gap: 14, flexDirection: 'column' }} component="form">
          <InputBoxstyle>
            <Typography variant="body1" className="headetitle">
              Options 1
            </Typography>
            <Input
              className="inputStyle"
              value={option[0]}
              onChange={e => {
                updateVoteOption(0, e.target.value)
              }}
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
              onChange={e => {
                updateVoteOption(1, e.target.value)
              }}
              placeholder="Disapprove"
            />
            <StyledDelButton sx={{ mr: 5, height: 30, width: 40, borderRadius: '4px' }} />
          </InputBoxstyle>
          {option.map(
            (_, index) =>
              index > 1 && (
                <InputBoxstyle key={index}>
                  <Typography variant="body1" className="headetitle">
                    Options {index + 1}
                  </Typography>
                  <Input
                    className="inputStyle"
                    value={option[index]}
                    onChange={e => {
                      updateVoteOption(index, e.target.value)
                    }}
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
            {option.length < 10 && (
              <LabelText
                onClick={addVoteOption}
                sx={{ display: 'flex', gap: 8, cursor: 'pointer', color: '#97B7EF', fontSize: 14 }}
              >
                <AddCircleOutlineIcon sx={{ width: 16 }} />
                Add Option
              </LabelText>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  )
}

// const CreadStyle = styled(Box)(({}) => ({
//   boxSizing: 'border-box',
//   width: 227,
//   height: 86,
//   borderRadius: '8px',
//   display: 'grid',
//   gridTemplateColumns: '58px 1fr'
// }))

// function CheckBoxs({ list }: { list: govList[] }) {
//   const [checkedValues, setCheckedValues] = useState<number[]>([])

//   const handleCheckboxChange = (event: any, id: number) => {
//     const isChecked = event.target.checked
//     if (isChecked) {
//       setCheckedValues([...checkedValues, id])
//     } else {
//       setCheckedValues(checkedValues.filter(value => value !== id))
//     }
//   }

//   return (
//     <>
//       <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
//         {list.map((item: govList, index: number) => (
//           <CreadStyle
//             sx={{
//               background: !checkedValues.includes(item.voteTokenId) ? '#FAFAFA' : '#F8FBFF',
//               border: !checkedValues.includes(item.voteTokenId) ? ' 1px solid #D4D7E2' : '1px solid #97B7EF'
//             }}
//             key={index}
//           >
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//               <Checkbox
//                 sx={{ borderRadius: '50%', color: '#D9D9D9' }}
//                 checked={checkedValues.includes(item.voteTokenId)}
//                 onChange={event => handleCheckboxChange(event, item.voteTokenId)}
//               />
//             </Box>
//             <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//               <Typography variant="body1" lineHeight="16px">
//                 `${item.tokenName}(${item.symbol})`
//               </Typography>
//               <Typography marginTop={14} variant="body1" lineHeight="16px" color={'#80829F'}>
//                 1{item.symbol} = 1 Votes
//               </Typography>
//             </Box>
//           </CreadStyle>
//         ))}
//       </Box>
//     </>
//   )
// }
