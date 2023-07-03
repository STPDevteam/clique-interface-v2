import { Alert, Box, Link, Stack, styled, Typography, useTheme } from '@mui/material'
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
import { useProposalDetailInfoProps, useProposalVoteCallback } from 'hooks/useBackedProposalServer'
import { toast } from 'react-toastify'
import NumericalInput from 'components/Input/InputNumerical'
import { formatNumberWithCommas } from 'utils'
import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'
import BigNumber from 'bignumber.js'

const StyledBody = styled(Box)({
  minHeight: 200,
  padding: '40px 32px'
})

const Text = styled(Typography)(({ color }: { color?: string }) => ({
  fontSize: 14,
  fontWeight: 600,
  color: color || '#3F5170'
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

  const { claimSubmitted: isVoting } = useUserHasSubmittedClaim(`${account}_proposalVote`)
  const [injectVotes, setInjectVotes] = useState('')
  const handleVotesChange = (e: any) => {
    setInjectVotes(e)
  }

  const onProposalVoteCallback = useCallback(() => {
    proposalVoteCallback([
      {
        optionId: proposalOptions,
        votes: proposalInfo.votingType === VotingTypes.SINGLE ? myVotes : Number(injectVotes)
      }
    ])
      .then(res => {
        if (res.data.code !== 200) {
          toast.error('vote error')
          return
        }
        refresh(Math.random())
        setInjectVotes('')
        voteModalToggle()
        toast.success('Vote success')
      })
      .catch(err => {
        toast.error(err.msg || 'network error')
      })
  }, [injectVotes, myVotes, proposalInfo.votingType, proposalOptions, proposalVoteCallback, refresh, voteModalToggle])

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
        <Typography fontWeight={500} variant="h6">
          Cast your Vote
        </Typography>
        {proposalInfo.votingType === VotingTypes.SINGLE ? (
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
        ) : (
          <MultiVote
            totalVotes={myVotes}
            myAlreadyVotes={myAlreadyVotes}
            voteProposalSign={voteProposalSign}
            FatherVotes={injectVotes}
            setFatherVotes={handleVotesChange}
          />
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

function MultiVote({
  totalVotes,
  myAlreadyVotes,
  voteProposalSign,
  FatherVotes,
  setFatherVotes
}: {
  totalVotes: number | undefined
  myAlreadyVotes: number | undefined
  voteProposalSign: govList
  FatherVotes: string
  setFatherVotes: Dispatch<SetStateAction<string>>
}) {
  const theme = useTheme()
  console.log(voteProposalSign)

  return (
    <Stack spacing={19} mt={19}>
      <RowCenter>
        <Text>Your votes</Text>
        <Box display={'grid'} flexDirection={'row'} alignItems={'center'} gridTemplateColumns={'auto 10px auto'}>
          <NumericalInput
            placeholder="0"
            style={{ marginRight: 10, width: 173 }}
            value={FatherVotes}
            onChange={e => {
              if (totalVotes && myAlreadyVotes && Number(e.target.value) > totalVotes - myAlreadyVotes) return
              setFatherVotes(e.target.value)
            }}
          />
          <Typography> / </Typography>
          <Typography color={theme.palette.text.primary}>
            {(totalVotes &&
              myAlreadyVotes &&
              formatNumberWithCommas(new BigNumber(totalVotes).minus(new BigNumber(myAlreadyVotes)).toString())) ||
              '--'}
          </Typography>
        </Box>
      </RowCenter>
    </Stack>
  )
}
