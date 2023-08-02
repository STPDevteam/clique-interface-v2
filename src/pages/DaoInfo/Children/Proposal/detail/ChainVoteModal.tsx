import { Box, styled, Typography, Slider, MenuItem } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import Modal from 'components/Modal'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useVoteModalToggle } from 'state/application/hooks'
import { VotingTypes } from 'state/buildingGovDao/actions'
import { RowCenter } from '../ProposalItem'
import { useUserVoteHasSubmitted } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import {
  VoteListProp,
  VoteParamsProp,
  VoteSpeed,
  VoteStatus,
  useProposalDetailInfoProps,
  useProposalVoteCallback,
  useUpChainProposalVoteCallback
} from 'hooks/useBackedProposalServer'
// import { formatNumberWithCommas } from 'utils'
// import BigNumber from 'bignumber.js'
import Input from 'components/Input'
import useModal from 'hooks/useModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { ProposalOptionProp } from 'hooks/useProposalInfo'
import { ReactComponent as SuccessIcon } from 'assets/svg/success_icon.svg'
import { ChainList } from 'constants/chain'
import Select from 'components/Select/Select'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { Dots } from 'theme/components'

const StyledBody = styled(Box)({
  minHeight: 200,
  padding: '30px 32px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
})

const TitleStyle = styled(Typography)(() => ({
  fontSize: 14,
  fontWeight: 500,
  color: '#3F5170',
  lineHeight: '16px'
}))

const VoteContentStyle = styled(Box)(() => ({
  width: '100%',
  backgroundColor: '#F8FBFF',
  borderRadius: '8px',
  marginTop: 10,
  padding: 14
}))

const ToggleButtonGroupStyle = styled(Box)(() => ({
  height: '46px',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: '8px',
  whiteSpace: 'nowrap',
  '& p': {
    color: '#83A2D0',
    height: 20,
    width: 20,
    fontSize: 13,
    lineHeight: '20px',
    fontWeight: '600 !important',
    borderRadius: '50%',
    backgroundColor: '#E3EEFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  '& .active': {
    background: '#E3EEFF !important',
    fontWeight: '600 !important',
    borderRadius: '8px !important',
    color: '#0049C6 !important',
    '& p': {
      color: '#fff',
      height: 20,
      width: 20,
      fontSize: 13,
      lineHeight: '20px',
      fontWeight: '600 !important',
      borderRadius: '50%',
      backgroundColor: '#0049C6',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
}))

const CustomToggleButton = styled(Box)(() => ({
  justifyContent: 'center',
  alignItems: 'center',
  textTransform: 'none',
  padding: '0',
  fontFamily: 'Inter',
  fontWeight: 500,
  fontSize: '13px',
  lineHeight: '18px',
  width: '200px',
  color: '#83A2D0',
  borderRadius: '6px',
  border: 'none',
  display: 'flex',
  gap: 10
}))

export default function ChainVoteModal({
  refresh,
  setUpDateVoteList,
  myVotes,
  myAlreadyVotes,
  proposalOptions,
  proposalInfo,
  // voteProposalSign,
  proposalOptionId,
  userVoteList
}: {
  refresh: Dispatch<SetStateAction<number>>
  setUpDateVoteList: Dispatch<SetStateAction<number>>
  // voteProposalSign: govList
  myVotes: number
  myAlreadyVotes: number
  proposalOptions: ProposalOptionProp[]
  proposalInfo: useProposalDetailInfoProps
  proposalOptionId: number
  userVoteList?: VoteListProp[]
}) {
  const voteModalOpen = useModalOpen(ApplicationModal.VOTE)
  const { account } = useActiveWeb3React()
  const voteModalToggle = useVoteModalToggle()

  const refreshCallback = useCallback(() => {
    setTimeout(() => {
      setUpDateVoteList(Math.random())
      refresh(Math.random())
    })
  }, [refresh, setUpDateVoteList])

  const proposalVoteCallback = useProposalVoteCallback()
  const { upChainProposalCallBack } = useUpChainProposalVoteCallback()

  const isVoted = useMemo(() => {
    if (userVoteList?.length) return true
    return false
  }, [userVoteList])

  const isUpChainVoteSuccess = useUserVoteHasSubmitted(`${account}_Chain_Proposal${proposalInfo.proposalId}`)

  const [vote, setVote] = useState<number[]>([])
  const [voteList, setVoteList] = useState<{ optionId: number; votes: number }[]>([])
  const [isTotalVote, setIsTotalVote] = useState<number>(0)
  const [singLe, setSingLe] = useState<boolean>(false)
  const [voteId, setVoteId] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { showModal, hideModal } = useModal()
  const [speed, setSpeed] = useState<number | string>(0)

  const perArrCallback = useCallback(
    (index: number, value: number) => {
      const _val = Object.assign({}, vote)
      _val[index] = Number(value)
      setVote(_val)
    },
    [vote]
  )

  useEffect(() => {
    setSpeed(isVoted ? 1 : 0)
  }, [isVoted])

  useEffect(() => {
    let val = 0
    for (const key in vote) {
      if (Object.prototype.hasOwnProperty.call(vote, key)) {
        val = val + vote[key]
      }
    }
    setIsTotalVote(val)

    setVoteId(() => {
      return voteList
        .filter(item => item.votes !== 0)
        .map(item => {
          return item.optionId
        })
    })
  }, [vote, voteList, userVoteList])

  useEffect(() => {
    if (proposalInfo.votingType === VotingTypes.SINGLE) {
      setSingLe(true)
      setVoteId([proposalOptionId])
    }
  }, [proposalInfo.votingType, proposalOptionId])

  const upChainProposalVoteCallback = useCallback(() => {
    const optionIds = isVoted ? (userVoteList?.map(v => v.optionId) as number[]) : voteId

    const amounts = singLe
      ? [myVotes]
      : isVoted
      ? (userVoteList?.map(v => v.votes) as number[])
      : voteList.map(v => v.votes).filter(v => v !== 0)
    {
      showModal(<TransacitonPendingModal />)

      upChainProposalCallBack(proposalInfo.proposalId, optionIds, amounts)
        .then(res => {
          hideModal()
          showModal(
            <TransactionSubmittedModal
              hideFunc={() => {
                console.log('next=>')
              }}
              hash={res.hash}
            />
          )

          refresh(Math.random())
        })
        .catch(err => {
          console.log(err)
          showModal(
            <MessageBox type="error">
              {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
            </MessageBox>
          )
          console.error(err)
        })
    }
  }, [
    hideModal,
    isVoted,
    myVotes,
    proposalInfo.proposalId,
    refresh,
    showModal,
    singLe,
    upChainProposalCallBack,
    userVoteList,
    voteId,
    voteList
  ])

  const voteBtn: {
    disabled: boolean
    error?: undefined | string | JSX.Element
  } = useMemo(() => {
    if (proposalInfo.status !== 'Active') {
      return {
        disabled: true,
        error: 'Proposal voting is not opened'
      }
    }

    if (proposalInfo.alreadyVoted && userVoteList?.find(v => v.status === VoteStatus.PENDING)) {
      return {
        disabled: false,
        error: 'You have already voted, Please confirm the on-chain transaction.'
      }
    }

    if (!isTotalVote && !isVoted && proposalInfo.votingType !== 1) {
      return {
        disabled: true,
        error: 'Please enter your votes'
      }
    }

    if (singLe && !voteId.length) {
      return {
        disabled: true,
        error: 'Please select vote option'
      }
    }

    if (myVotes - isTotalVote > 0 && proposalInfo.votingType !== 1) {
      return {
        disabled: false,
        error: 'There is still unused votes'
      }
    }

    if (!myVotes || myVotes <= 0) {
      return {
        disabled: true,
        error: 'Insufficient votes'
      }
    }
    return {
      disabled: false
    }
  }, [
    isTotalVote,
    isVoted,
    myVotes,
    proposalInfo.alreadyVoted,
    proposalInfo.status,
    proposalInfo.votingType,
    singLe,
    userVoteList,
    voteId.length
  ])
  return (
    <Modal maxWidth="480px" closeIcon width="100%" customIsOpen={voteModalOpen} customOnDismiss={voteModalToggle}>
      <StyledBody height={singLe ? 'auto' : '540px'}>
        <Box>
          <Typography fontWeight={500} variant="h6">
            Vote
          </Typography>
          <Box sx={{ height: 62, borderRadius: '8px', backgroundColor: '#F8FBFF', padding: 8 }}>
            <ToggleButtonGroupStyle>
              <CustomToggleButton className={speed === VoteSpeed.SpeedOne ? 'active' : ''}>
                <Box sx={{ display: 'flex', gap: 10 }}>
                  {speed !== 1 ? <Typography>1</Typography> : <SuccessIcon />} Cast your vote
                </Box>
              </CustomToggleButton>
              <CustomToggleButton className={speed === VoteSpeed.SpeedTwo ? 'active' : ''}>
                <Box sx={{ display: 'flex', gap: 10 }}>
                  <Typography>2</Typography> Sign On-chain
                </Box>
              </CustomToggleButton>
            </ToggleButtonGroupStyle>
          </Box>

          {speed === VoteSpeed.SpeedOne && !singLe && (
            <MultiVoteSpeedOne
              setVoteList={setVoteList}
              perArrCallback={perArrCallback}
              voteList={voteList}
              myAlreadyVotes={myAlreadyVotes}
              proposalOptions={proposalOptions}
              myVotes={myVotes}
              isVoted={isVoted}
              vote={vote}
            />
          )}
          {speed === VoteSpeed.SpeedTwo && !singLe && (
            <MultiVoteSpeedTwo myVotes={myVotes} myAlreadyVotes={myAlreadyVotes} />
          )}
          {speed === VoteSpeed.SpeedOne && singLe && (
            <SingleVoteSpeedOne
              setVoteId={setVoteId}
              voteId={voteId}
              myVotes={myVotes}
              myAlreadyVotes={myAlreadyVotes}
              proposalOptions={proposalOptions}
            />
          )}
          {speed === VoteSpeed.SpeedTwo && singLe && (
            <SingleVoteSpeedTwo myVotes={myVotes} myAlreadyVotes={myAlreadyVotes} />
          )}
        </Box>
        <Box>
          {voteBtn.error && speed === VoteSpeed.SpeedOne && (
            // <Alert sx={{ mt: 10, height: 30 }} severity={voteBtn.disabled ? 'error' : 'warning'}>
            <Typography
              sx={{
                font: '500 12px/30px "Inter"',
                color: voteBtn.disabled ? '#5d3535' : '#9F8644',
                borderRadius: '8px',
                background: voteBtn.disabled ? 'rgb(252, 242, 242)' : 'rgba(255, 186, 10, 0.18)',
                height: 30,
                paddingLeft: 15,
                mt: 10
              }}
            >
              {voteBtn.error}
            </Typography>
          )}

          {isUpChainVoteSuccess && userVoteList?.find(v => v.status === VoteStatus.PENDING) && (
            <Typography
              sx={{
                font: '500 12px/30px "Inter"',
                color: '#9F8644',
                borderRadius: '8px',
                background: 'rgba(255, 186, 10, 0.18)',
                height: 30,
                paddingLeft: 15,
                mt: 10
              }}
            >
              You seem to have already voted on the other chain
            </Typography>
          )}

          <RowCenter mt={6}>
            <OutlineButton
              width={200}
              color="#0049C6"
              style={{
                borderColor: '#0049C6'
              }}
              noBold
              height={40}
              borderRadius="8px"
              onClick={voteModalToggle}
            >
              Cancel
            </OutlineButton>

            {speed === VoteSpeed.SpeedOne ? (
              <BlackButton
                width="200px"
                height="40px"
                disabled={voteBtn.disabled || loading || (singLe && !voteId.length)}
                onClick={() => {
                  setLoading(true)
                  proposalVoteCallback(
                    singLe
                      ? [
                          {
                            optionId: voteId[0],
                            votes: myVotes
                          }
                        ]
                      : voteList.filter(v => v.votes !== 0)
                  )
                    .then(res => {
                      if (res.data.code === 200) {
                        setSpeed(1)
                        refreshCallback()
                        setLoading(false)
                      }
                    })
                    .catch(err => {
                      refreshCallback()
                      setLoading(false)
                      showModal(
                        <MessageBox type="error">
                          {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
                        </MessageBox>
                      )
                    })
                }}
                borderRadius="8px"
                style={{ fontWeight: 700 }}
              >
                {loading ? (
                  <>
                    Submitting
                    <Dots />
                  </>
                ) : (
                  'Submit'
                )}
              </BlackButton>
            ) : (
              <BlackButton
                width="200px"
                height="40px"
                disabled={voteBtn.disabled}
                onClick={() => {
                  voteModalToggle()
                  upChainProposalVoteCallback()
                }}
                borderRadius="8px"
                style={{ fontWeight: 700 }}
              >
                Sign
              </BlackButton>
            )}
          </RowCenter>
        </Box>
      </StyledBody>
    </Modal>
  )
}

function MultiVoteSpeedOne({
  setVoteList,
  perArrCallback,
  voteList,
  myAlreadyVotes,
  proposalOptions,
  myVotes,
  isVoted,
  vote
}: {
  setVoteList: Dispatch<SetStateAction<VoteParamsProp[]>>
  perArrCallback: (index: number, value: number) => void
  voteList: VoteParamsProp[]
  myAlreadyVotes: number
  proposalOptions: ProposalOptionProp[]
  myVotes: number
  isVoted: boolean
  vote: number[]
}) {
  console.log(myAlreadyVotes)
  return (
    <>
      <VoteContentStyle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography fontWeight={500} fontSize={14} lineHeight={'18px'}>
            Your total votes
          </Typography>
          <Typography lineHeight={'18px'} color={'#0049C6'} fontSize={13} fontWeight={600}>
            {myVotes || '--'}
            {/* {(myVotes &&
              formatNumberWithCommas(new BigNumber(myVotes).minus(new BigNumber(myAlreadyVotes)).toString())) ||
              '--'} */}
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            mt: 10,
            paddingTop: 6,
            paddingLeft: 15,
            fontSize: 12,
            lineHeight: '16px',
            height: 44,
            backgroundColor: '#E3EEFF',
            borderRadius: '8px'
          }}
        >
          There is only one opportunity to vote and unused votes cannot be re-voted!
        </Typography>
      </VoteContentStyle>

      {proposalOptions.map((item, index) => (
        <Box sx={{ mt: 15 }} key={item.optionId}>
          <TitleStyle noWrap sx={{ maxWidth: 300 }}>
            {item.optionContent}
          </TitleStyle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <Slider
              disabled={isVoted}
              step={1}
              value={item.userVote.votes || vote[index] || 0}
              onChange={(_, newValue) => {
                const _newValue = newValue as number
                let used = 0
                for (const key in vote) {
                  if (Object.prototype.hasOwnProperty.call(vote, key)) {
                    if (index !== Number(key)) used = used + vote[key]
                  }
                }
                const maxPer = myVotes - used
                const curPer = maxPer < _newValue ? maxPer : _newValue
                setVoteList(() => {
                  const newArr = voteList
                  newArr[index] = { votes: maxPer < _newValue ? maxPer : _newValue, optionId: item.optionId }
                  return newArr
                })
                perArrCallback(index, curPer)
              }}
              max={myVotes}
              sx={{ height: 7 }}
            />
            <Input
              type="number"
              disabled={isVoted}
              value={item.userVote.votes?.toString() || (vote[index] ? vote[index].toString() : '0')}
              maxWidth={90}
              height={34}
              max={myVotes}
              onChange={(e: any) => {
                if (/^[0-9]\d*$/.test(e.target.value) || !e.target.value) {
                  const valData = e.target.value - 0
                  let used = 0
                  for (const key in vote) {
                    if (Object.prototype.hasOwnProperty.call(vote, key)) {
                      if (index !== Number(key)) used = used + vote[key]
                    }
                  }
                  const maxPer = myVotes - used
                  const curPer = maxPer < valData ? maxPer : valData

                  perArrCallback(index, curPer)
                  setVoteList(() => {
                    const newArr = voteList
                    newArr[index] = { votes: curPer, optionId: item.optionId }
                    return newArr
                  })
                }
              }}
            />
          </Box>
        </Box>
      ))}
    </>
  )
}

function MultiVoteSpeedTwo({ myVotes, myAlreadyVotes }: { myVotes: number; myAlreadyVotes: number }) {
  const { library, account, chainId } = useActiveWeb3React()
  console.log(myAlreadyVotes)

  return (
    <>
      <VoteContentStyle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography fontWeight={500} fontSize={14} lineHeight={'18px'}>
            Your votes
          </Typography>
          <Typography lineHeight={'18px'} color={'#0049C6'} fontSize={13} fontWeight={600}>
            {/* {(myVotes &&
              formatNumberWithCommas(new BigNumber(myVotes).minus(new BigNumber(myAlreadyVotes)).toString())) ||
              '--'} */}
            {myVotes || '--'}
          </Typography>
        </Box>
      </VoteContentStyle>
      <Box sx={{ mt: 12, display: 'grid', flexDirection: 'column', gap: 10 }}>
        <Select
          placeholder="Select chain"
          noBold
          label="Choose a network to sign"
          value={chainId || undefined}
          onChange={e => {
            account && triggerSwitchChain(library, e.target.value, account)
          }}
        >
          {ChainList.map(item => (
            <MenuItem
              key={item.id}
              sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
              value={item.id}
            >
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Typography mt={12} fontWeight={500} fontSize={14} lineHeight={'20px'} color={'#80829F'}>
        The vote will take effect after successful synchronization on the chain.
      </Typography>
    </>
  )
}

function SingleVoteSpeedOne({
  setVoteId,
  voteId,
  myVotes,
  myAlreadyVotes,
  proposalOptions
}: {
  setVoteId: Dispatch<SetStateAction<number[]>>
  voteId: number[]
  myVotes: number
  myAlreadyVotes: number
  proposalOptions: ProposalOptionProp[]
}) {
  console.log(myAlreadyVotes)
  return (
    <>
      <VoteContentStyle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography fontWeight={500} fontSize={14} lineHeight={'18px'}>
            Your total votes
          </Typography>
          <Typography lineHeight={'18px'} color={'#0049C6'} fontSize={13} fontWeight={600}>
            {/* {(myVotes &&
              formatNumberWithCommas(new BigNumber(myVotes).minus(new BigNumber(myAlreadyVotes)).toString())) ||
              '--'} */}
            {myVotes || '--'}
          </Typography>
        </Box>
      </VoteContentStyle>
      <Box sx={{ mt: 12, mb: 50, display: 'grid', flexDirection: 'column', gap: 10 }}>
        <Select
          placeholder="Select vote"
          noBold
          label="Voting for"
          value={voteId[0] || ''}
          onChange={e => {
            const arr = []
            arr.push(e.target.value)
            setVoteId(arr)
            console.log(arr)
          }}
        >
          {proposalOptions.map(item => (
            <MenuItem
              key={item.optionId}
              sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170', maxWidth: 342, overflow: 'hidden' }}
              value={item.optionId}
            >
              {item.optionContent.length > 30 ? item.optionContent.slice(0, 30) + '...' : item.optionContent}
            </MenuItem>
          ))}
        </Select>

        <Typography fontWeight={500} fontSize={14} lineHeight={'20px'} color={'#80829F'}>
          Voting information cannot be changed after submission
        </Typography>
      </Box>
    </>
  )
}

function SingleVoteSpeedTwo({ myVotes, myAlreadyVotes }: { myVotes: number; myAlreadyVotes: number }) {
  const { library, account, chainId } = useActiveWeb3React()
  console.log(myAlreadyVotes)
  return (
    <>
      <VoteContentStyle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography fontWeight={500} fontSize={14} lineHeight={'18px'}>
            Your votes
          </Typography>
          <Typography lineHeight={'18px'} color={'#0049C6'} fontSize={13} fontWeight={600}>
            {/* {(myVotes &&
              formatNumberWithCommas(new BigNumber(myVotes).minus(new BigNumber(myAlreadyVotes)).toString())) ||
              '--'} */}
            {myVotes || '--'}
          </Typography>
        </Box>
      </VoteContentStyle>
      <Box sx={{ mt: 12, display: 'grid', flexDirection: 'column', gap: 10 }}>
        <Select
          placeholder="Select chain"
          noBold
          label="Choose a network to sign"
          value={chainId || undefined}
          onChange={e => {
            account && triggerSwitchChain(library, e.target.value, account)
          }}
        >
          {ChainList.map(item => (
            <MenuItem
              key={item.id}
              sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
              value={item.id}
            >
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Typography mt={12} mb={30} fontWeight={500} fontSize={14} lineHeight={'20px'} color={'#80829F'}>
        The vote will take effect after successful synchronization on the chain.
      </Typography>
    </>
  )
}
