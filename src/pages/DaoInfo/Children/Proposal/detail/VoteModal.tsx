import { Alert, Box, Link, Stack, styled, Typography, Slider } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import Modal from 'components/Modal'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useVoteModalToggle, useWalletModalToggle } from 'state/application/hooks'
import { VotingTypes } from 'state/buildingGovDao/actions'
import { RowCenter } from '../ProposalItem'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { Dots } from 'theme/components'
import {
  useProposalDetailInfoProps,
  useProposalVoteCallback,
  useProposalVoteList,
  useUpChainProposalVoteCallback
} from 'hooks/useBackedProposalServer'
import { toast } from 'react-toastify'
// import NumericalInput from 'components/Input/InputNumerical'
import { formatNumberWithCommas } from 'utils'
import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'
import BigNumber from 'bignumber.js'
import Input from 'components/Input'
import useModal from 'hooks/useModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'

const StyledBody = styled(Box)({
  minHeight: 200,
  padding: '40px 32px'
})

// const Text = styled(Typography)(({ color }: { color?: string }) => ({
//   fontSize: 14,
//   fontWeight: 600,
//   color: color || '#3F5170'
// }))
const TitleStyle = styled(Typography)(() => ({
  fontSize: 14,
  fontWeight: 500,
  color: '#3F5170',
  lineHeight: '16px'
}))

export default function VoteModal({
  refresh,
  proposalInfo,
  proposalOptions,
  setUpDateVoteList
}: {
  proposalInfo: useProposalDetailInfoProps
  proposalOptions: number
  refresh: Dispatch<SetStateAction<number>>
  setUpDateVoteList: Dispatch<SetStateAction<number>>
}) {
  const { buildingDaoData: daoInfo } = useBuildingDaoDataCallback()

  return !daoInfo.governance[0] || !proposalInfo ? null : (
    <VoteModalFunc
      refresh={refresh}
      setUpDateVoteList={setUpDateVoteList}
      myVotes={proposalInfo.yourVotes}
      myAlreadyVotes={proposalInfo.alreadyVoted}
      // voteProposalSign={daoInfo.governance[0]}
      proposalInfo={proposalInfo}
      proposalOptions={proposalOptions}
    />
  )
}

function VoteModalFunc({
  refresh,
  setUpDateVoteList,
  proposalInfo,
  myVotes,
  myAlreadyVotes,
  // voteProposalSign,
  proposalOptions
}: {
  refresh: Dispatch<SetStateAction<number>>
  setUpDateVoteList: Dispatch<SetStateAction<number>>
  proposalInfo: useProposalDetailInfoProps
  // voteProposalSign: govList
  myVotes: number
  myAlreadyVotes: number
  proposalOptions: number
}) {
  const voteModalOpen = useModalOpen(ApplicationModal.VOTE)
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const voteModalToggle = useVoteModalToggle()
  const voteApplicationModal = useModalOpen(ApplicationModal.VOTE)
  const proposalVoteCallback = useProposalVoteCallback()

  const { result: userVote, setUpDateVoteList: setCurUpDateVoteList } = useProposalVoteList(
    proposalInfo.proposalId,
    account
  )
  const refreshCallback = useCallback(() => {
    setTimeout(() => {
      setUpDateVoteList(Math.random())
      refresh(Math.random())
      setCurUpDateVoteList(Math.random())
    })
  }, [refresh, setCurUpDateVoteList, setUpDateVoteList])

  const { upChainProposalCallBack } = useUpChainProposalVoteCallback(refreshCallback)

  useEffect(() => {
    if (voteApplicationModal) {
      setCurUpDateVoteList(Math.random())
    }
  }, [setCurUpDateVoteList, voteApplicationModal, voteModalToggle])

  const isVoted = useMemo(() => {
    if (userVote?.length) return true
    return false
  }, [userVote])

  const isUpChain = useMemo(() => {
    return proposalInfo.isChain
  }, [proposalInfo.isChain])

  const { claimSubmitted: isVoting } = useUserHasSubmittedClaim(`${account}_Chain_Proposal${proposalInfo.proposalId}`)
  const { claimedSubmitSuccess: isVoteSuccess } = useUserHasSubmittedClaim(
    `${account}_Chain_Proposal${proposalInfo.proposalId}`
  )
  const [vote, setVote] = useState<number[]>([])
  const [voteId, setVoteId] = useState<number[]>([])
  const [voteList, setVoteList] = useState<{ optionId: number; votes: number }[]>([])
  const [isTotalVote, setIsTotalVote] = useState<number>(0)
  const [singLe, setSingLe] = useState<boolean>(false)
  const { showModal, hideModal } = useModal()

  // console.log(voteProposalSign)

  const perArrCallback = useCallback(
    (index: number, value: number) => {
      const _val = Object.assign({}, vote)
      _val[index] = Number(value)
      setVote(_val)
    },
    [vote]
  )

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
  }, [vote, voteList, userVote])

  useEffect(() => {
    if (proposalInfo.votingType === VotingTypes.SINGLE) {
      setSingLe(true)
    }
  }, [proposalInfo.votingType])

  const onProposalVoteCallback = useCallback(() => {
    {
      proposalVoteCallback(
        singLe
          ? [
              {
                optionId: proposalOptions,
                votes: myVotes
              }
            ]
          : voteList.filter(v => v.votes !== 0)
      )
        .then(res => {
          if (res.data.code !== 200) {
            toast.error(res.data.msg || 'Vote error')
            return
          }
          refresh(Math.random())
          voteModalToggle()
          toast.success('Vote success')
        })
        .catch(err => {
          toast.error(err.msg || 'Network error')
        })
    }
  }, [myVotes, proposalOptions, proposalVoteCallback, refresh, singLe, voteList, voteModalToggle])

  const upChainProposalVoteCallback = useCallback(() => {
    {
      showModal(<TransacitonPendingModal />)

      upChainProposalCallBack(
        singLe
          ? [
              {
                optionId: proposalOptions,
                votes: myVotes
              }
            ]
          : isVoted
          ? (userVote?.map(v => ({ proposalId: v.optionId, votes: v.votes })).filter(Boolean) as any)
          : voteList.filter(v => v.votes !== 0),
        proposalInfo.proposalId,
        singLe ? [proposalOptions] : isVoted ? (userVote?.map(v => v.optionId) as number[]) : voteId,
        singLe
          ? [myVotes]
          : isVoted
          ? (userVote?.map(v => v.votes) as number[])
          : voteList.map(v => v.votes).filter(v => v !== 0),
        isVoted
      )
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
    proposalOptions,
    refresh,
    showModal,
    singLe,
    upChainProposalCallBack,
    userVote,
    voteId,
    voteList
  ])

  const voteBtn: {
    disabled: boolean
    handler?: () => void
    error?: undefined | string | JSX.Element
  } = useMemo(() => {
    if (proposalInfo.status !== 'Active') {
      return {
        disabled: true,
        error: 'Proposal voting is not opened'
      }
    }
    if (proposalInfo.alreadyVoted && proposalInfo.votingType === 1 && isVoted) {
      return {
        disabled: true,
        error: 'You have already voted, Please confirm the on-chain transaction.'
      }
    }

    if (proposalInfo.alreadyVoted && proposalInfo.votingType === 1) {
      return {
        disabled: true,
        error: 'You have already voted'
      }
    }

    if (isVoted && proposalInfo.votingType === 2) {
      return {
        disabled: true,
        error: 'You have already voted, Please confirm the on-chain transaction.'
      }
    }
    if (!isTotalVote && proposalInfo.votingType === 2) {
      return {
        disabled: true,
        error: 'Please enter your votes'
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
    if (!myVotes || myVotes <= 0) {
      return {
        disabled: true,
        error: 'Insufficient votes'
      }
    }
    return {
      disabled: false,
      handler: onProposalVoteCallback
    }
  }, [
    account,
    isTotalVote,
    isVoted,
    myVotes,
    onProposalVoteCallback,
    proposalInfo.alreadyVoted,
    proposalInfo.status,
    proposalInfo.votingType,
    toggleWalletModal
  ])
  return (
    <Modal maxWidth="480px" closeIcon width="100%" customIsOpen={voteModalOpen} customOnDismiss={voteModalToggle}>
      <StyledBody>
        {proposalInfo.votingType === VotingTypes.SINGLE ? (
          <>
            <Typography fontWeight={500} variant="h6">
              Cast your vote
            </Typography>
            <Stack spacing={19} mt={19}>
              <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <Typography fontWeight={500} fontSize={14}>
                  Your votes
                </Typography>
                <Typography color={'#3F5170'} fontSize={20} fontWeight={700} mt={8}>
                  {isVoted
                    ? formatNumberWithCommas((userVote?.length && userVote[0].votes.toString()) || 0)
                    : (myVotes &&
                        formatNumberWithCommas(
                          new BigNumber(myVotes).minus(new BigNumber(myAlreadyVotes)).toString()
                        )) ||
                      '--'}
                </Typography>
              </Box>
            </Stack>
          </>
        ) : (
          <>
            <Typography fontWeight={500} variant="h6">
              Edit
            </Typography>

            <Box sx={{ width: '100%', height: 100, backgroundColor: '#F8FBFF', mt: 8, padding: 14 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight={500} fontSize={14} lineHeight={'18px'}>
                  Your votes
                </Typography>
                <Typography lineHeight={'18px'} color={'#0049C6'} fontSize={13} fontWeight={600}>
                  {(myVotes &&
                    formatNumberWithCommas(new BigNumber(myVotes).minus(new BigNumber(myAlreadyVotes)).toString())) ||
                    '--'}
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
            </Box>

            {proposalInfo.options.map((item, index) => (
              <Box sx={{ mt: 15 }} key={item.optionId}>
                <TitleStyle>{item.optionContent}</TitleStyle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                  <Slider
                    disabled={isVoted}
                    step={1}
                    value={userVote?.find(v => v.optionId === item.optionId)?.votes || vote[index] || 0}
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
                    value={
                      userVote?.find(v => v.optionId === item.optionId)?.votes?.toString() ||
                      (vote[index] ? vote[index].toString() : '0')
                    }
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
        )}

        {voteBtn.error && (
          <Alert sx={{ marginTop: 15 }} severity="error">
            {voteBtn.error}
          </Alert>
        )}
        <RowCenter mt={19}>
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

          {isUpChain ? (
            <BlackButton
              width="200px"
              height="40px"
              disabled={isVoting || isVoteSuccess || (!singLe && !isTotalVote)}
              onClick={() => {
                voteModalToggle()
                if (myVotes - isTotalVote > 0 && !singLe && !isVoted) {
                  showModal(<ModifyModal upChainCallback={upChainProposalVoteCallback} />)
                  return
                } else {
                  upChainProposalVoteCallback()
                }
              }}
              borderRadius="8px"
            >
              {isVoting ? (
                <>
                  Voting
                  <Dots />
                </>
              ) : (
                'Vote'
              )}
            </BlackButton>
          ) : (
            <BlackButton
              width="200px"
              height="40px"
              disabled={voteBtn.disabled}
              onClick={voteBtn.handler}
              borderRadius="8px"
            >
              {isVoting ? (
                <>
                  Voting
                  <Dots />
                </>
              ) : (
                'Vote'
              )}
            </BlackButton>
          )}
        </RowCenter>
      </StyledBody>
    </Modal>
  )
}

// function MultiVote({
//   totalVotes,
//   myAlreadyVotes,
//   voteProposalSign,
//   FatherVotes,
//   setFatherVotes
// }: {
//   totalVotes: number | undefined
//   myAlreadyVotes: number
//   voteProposalSign: govList
//   FatherVotes: string
//   setFatherVotes: Dispatch<SetStateAction<string>>
// }) {
//   const theme = useTheme()
//   console.log(voteProposalSign)

//   return (
//     <Stack spacing={19} mt={19}>
//       <RowCenter>
//         <Text>Your votes</Text>
//         <Box display={'grid'} flexDirection={'row'} alignItems={'center'} gridTemplateColumns={'auto 10px auto'}>
//           <NumericalInput
//             placeholder="0"
//             style={{ marginRight: 10, width: 173 }}
//             value={FatherVotes}
//             onChange={e => {
//               if (totalVotes && myAlreadyVotes && Number(e.target.value) > totalVotes - myAlreadyVotes) return
//               setFatherVotes(/^[1-9]\d*$/.test(e.target.value) || !e.target.value ? e.target.value : FatherVotes)
//             }}
//           />
//           <Typography> / </Typography>
//           <Typography color={theme.palette.text.primary}>
//             {(totalVotes &&
//               formatNumberWithCommas(new BigNumber(totalVotes).minus(new BigNumber(myAlreadyVotes)).toString())) ||
//               '--'}
//           </Typography>
//         </Box>
//       </RowCenter>
//     </Stack>
//   )
// }

function ModifyModal({ upChainCallback }: { upChainCallback: () => void }) {
  const { hideModal } = useModal()
  const voteModalToggle = useVoteModalToggle()
  return (
    <Modal maxWidth="480px" closeIcon width="100%">
      <StyledBody sx={{ paddingTop: 55, paddingBottom: 30 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
              lineHeight: '20px',
              color: '#3F5170',
              width: 350
            }}
          >
            You have <b style={{ fontWeight: 600 }}>EXTRA VOTES</b>, unused votes will not be able to be voted again, do
            you want to continue?
          </Typography>
        </Box>
        <RowCenter mt={30}>
          <OutlineButton
            width={200}
            color="#0049C6"
            style={{
              borderColor: '#0049C6'
            }}
            noBold
            height={40}
            borderRadius="8px"
            onClick={() => {
              hideModal()
              voteModalToggle()
            }}
          >
            Modify votes
          </OutlineButton>
          <BlackButton
            width="200px"
            height="40px"
            borderRadius="8px"
            onClick={() => {
              hideModal()
              upChainCallback()
            }}
          >
            Continue
          </BlackButton>
        </RowCenter>
      </StyledBody>
    </Modal>
  )
}
