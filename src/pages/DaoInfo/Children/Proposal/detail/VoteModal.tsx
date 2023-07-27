import { Alert, Box, Link, Stack, styled, Typography, Slider } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import Modal from 'components/Modal'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useVoteModalToggle, useWalletModalToggle } from 'state/application/hooks'
import { govList, VotingTypes } from 'state/buildingGovDao/actions'
import { RowCenter } from '../ProposalItem'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { Dots } from 'theme/components'
import {
  useProposalDetailInfoProps,
  useProposalVoteCallback,
  useUpChainProposalVoteCallback
} from 'hooks/useBackedProposalServer'
import { toast } from 'react-toastify'
// import NumericalInput from 'components/Input/InputNumerical'
import { formatNumberWithCommas } from 'utils'
import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'
import BigNumber from 'bignumber.js'
import Input from 'components/Input'

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
  proposalOptions
}: {
  proposalInfo: useProposalDetailInfoProps
  proposalOptions: number
  refresh: Dispatch<SetStateAction<number>>
}) {
  const { buildingDaoData: daoInfo } = useBuildingDaoDataCallback()

  return !daoInfo.governance[0] || !proposalInfo ? null : (
    <VoteModalFunc
      refresh={refresh}
      myVotes={proposalInfo.yourVotes}
      myAlreadyVotes={proposalInfo.alreadyVoted}
      voteProposalSign={daoInfo.governance[0]}
      proposalInfo={proposalInfo}
      proposalOptions={proposalOptions}
    />
  )
}

function VoteModalFunc({
  refresh,
  proposalInfo,
  myVotes,
  myAlreadyVotes,
  voteProposalSign,
  proposalOptions
}: {
  refresh: Dispatch<SetStateAction<number>>
  proposalInfo: useProposalDetailInfoProps
  voteProposalSign: govList
  myVotes: number
  myAlreadyVotes: number
  proposalOptions: number
}) {
  const voteModalOpen = useModalOpen(ApplicationModal.VOTE)
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const voteModalToggle = useVoteModalToggle()
  const proposalVoteCallback = useProposalVoteCallback()
  const upChainProposalCallBack = useUpChainProposalVoteCallback()
  const { claimSubmitted: isVoting } = useUserHasSubmittedClaim(`${account}_proposalVote`)
  const [injectVotes, setInjectVotes] = useState('')
  const [vote, setVote] = useState<number[]>([])
  const [isTotalVote, setIsTotalVote] = useState<number>(0)
  console.log(voteProposalSign)

  // const handleVotesChange = (e: any) => {
  //   setInjectVotes(e)
  // }

  const perArrCallback = useCallback(
    (index: number, value: number) => {
      const _val = Object.assign({}, vote)
      _val[index] = Number(value)
      setVote(_val)
    },
    [vote]
  )

  const onProposalVoteCallback = useCallback(() => {
    console.log(proposalOptions)
    {
      !proposalInfo.isChain
        ? proposalVoteCallback([
            {
              optionId: proposalOptions,
              votes: proposalInfo.votingType === VotingTypes.SINGLE ? myVotes : Number(injectVotes)
            }
          ])
            .then(res => {
              if (res.data.code !== 200) {
                toast.error(res.data.msg || 'Vote error')
                return
              }
              refresh(Math.random())
              setInjectVotes('')
              voteModalToggle()
              toast.success('Vote success')
            })
            .catch(err => {
              toast.error(err.msg || 'Network error')
            })
        : upChainProposalCallBack(
            [
              {
                optionId: proposalOptions,
                votes: proposalInfo.votingType === VotingTypes.SINGLE ? myVotes : Number(injectVotes)
              }
            ],
            proposalInfo.proposalId,
            proposalInfo.votingType === VotingTypes.SINGLE ? [proposalOptions] : vote,
            proposalInfo.votingType === VotingTypes.SINGLE ? [myVotes] : vote
          )
            .then(res => {
              if (res.data.code !== 200) {
                toast.error(res.data.msg || 'Vote error')
                return
              }
              refresh(Math.random())
              setInjectVotes('')
              voteModalToggle()
              toast.success('Vote success')
            })
            .catch(err => {
              toast.error(err.msg || 'Network error')
            })
    }
  }, [
    injectVotes,
    myVotes,
    proposalInfo.isChain,
    proposalInfo.proposalId,
    proposalInfo.votingType,
    proposalOptions,
    proposalVoteCallback,
    refresh,
    upChainProposalCallBack,
    vote,
    voteModalToggle
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
    if (proposalInfo.alreadyVoted && proposalInfo.votingType === 1) {
      return {
        disabled: true,
        error: 'You have already voted'
      }
    }
    if (Number(injectVotes) === 0 && injectVotes) {
      return {
        disabled: true,
        error: 'Vote amount must greater than 0'
      }
    }
    if (!injectVotes && proposalInfo.votingType === 2) {
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
    if (!myVotes || myVotes <= 0 || myVotes < Number(injectVotes)) {
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
    injectVotes,
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
                  {(myVotes &&
                    formatNumberWithCommas(new BigNumber(myVotes).minus(new BigNumber(myAlreadyVotes)).toString())) ||
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
                    aria-labelledby={'slider ' + index}
                    step={1}
                    value={vote[index] || 0}
                    onChange={(_, newValue) => {
                      const _newValue = newValue as number
                      let used = 0
                      for (const key in vote) {
                        if (Object.prototype.hasOwnProperty.call(vote, key)) {
                          if (index !== Number(key)) used = used + vote[key]
                        }
                      }
                      setIsTotalVote(used)
                      const maxPer = myVotes - used
                      const curPer = maxPer < _newValue ? maxPer : _newValue
                      perArrCallback(index, curPer)
                    }}
                    max={myVotes}
                    sx={{ height: 7 }}
                  />
                  <Input
                    type="number"
                    value={vote[index] ? vote[index].toString() : '0'}
                    maxWidth={90}
                    height={34}
                    max={myVotes}
                    onChange={(e: any) => {
                      if (
                        (e.target.value - 0 <= myVotes - isTotalVote && /^[0-9]\d*$/.test(e.target.value)) ||
                        !e.target.value
                      ) {
                        const valData = e.target.value - 0
                        let used = 0
                        for (const key in vote) {
                          if (Object.prototype.hasOwnProperty.call(vote, key)) {
                            if (index !== Number(key)) used = used + vote[key]
                          }
                        }
                        setIsTotalVote(used)
                        perArrCallback(index, valData)
                        console.log('vote', vote[index], valData)
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
            color="#80829F"
            style={{
              borderColor: '#D4D7E2'
            }}
            noBold
            height={40}
            borderRadius="8px"
            onClick={voteModalToggle}
          >
            Cancel
          </OutlineButton>
          <BlackButton
            width="200px"
            height="40px"
            disabled={voteBtn.disabled || isVoting}
            onClick={voteBtn.handler}
            borderRadius="8px"
          >
            {isVoting ? (
              <>
                Voting
                <Dots />
              </>
            ) : (
              'Confirm'
            )}
          </BlackButton>
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
