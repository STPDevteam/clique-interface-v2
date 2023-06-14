import { Alert, Box, Link, Stack, styled, Typography, useTheme } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import Modal from 'components/Modal'
import { CurrencyAmount, Token, TokenAmount } from 'constants/token'
import JSBI from 'jsbi'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useVoteModalToggle, useWalletModalToggle } from 'state/application/hooks'
import { govList, VotingTypes } from 'state/buildingGovDao/actions'
import { RowCenter } from '../ProposalItem'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { Dots } from 'theme/components'
import { AppState } from 'state'
import { useSelector } from 'react-redux'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useProposalDetailInfoProps, useProposalVoteCallback } from 'hooks/useBackedProposalServer'
import { toast } from 'react-toastify'
import NumericalInput from 'components/Input/InputNumerical'

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
  proposalInfo,
  proposalOptions
}: {
  proposalInfo: useProposalDetailInfoProps
  proposalOptions: number
}) {
  const daoInfo = useSelector((state: AppState) => state.buildingGovernanceDao.createDaoData)
  const { account } = useActiveWeb3React()

  const myVotesToken = useMemo(() => {
    if (!daoInfo?.governance[0] || !daoInfo.governance[0].createRequire) {
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
  const myVotes = useCurrencyBalance(account || undefined, myVotesToken)

  return !daoInfo.governance[0].createRequire || myVotes === undefined ? null : (
    <VoteModalFunc
      myVotes={myVotes}
      voteProposalSign={daoInfo.governance[0]}
      proposalInfo={proposalInfo}
      proposalOptions={proposalOptions}
    />
  )
}

function VoteModalFunc({
  proposalInfo,
  myVotes,
  voteProposalSign,
  proposalOptions
}: {
  proposalInfo: useProposalDetailInfoProps
  voteProposalSign: govList
  myVotes: TokenAmount | CurrencyAmount
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
        votes: proposalInfo.votingType === VotingTypes.SINGLE ? Number(myVotes.toSignificant()) : Number(injectVotes)
      }
    ])
      .then(res => {
        if (res.data !== 200) {
          toast.error('vote error')
          return
        }
        toast.success('Vote success')
      })
      .catch(err => {
        toast.error(err.msg || 'network error')
      })
  }, [injectVotes, myVotes, proposalInfo.votingType, proposalOptions, proposalVoteCallback])

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
    if (proposalInfo.alreadyVoted) {
      return {
        disabled: true,
        error: 'You have already voted'
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
    if (!myVotes || !myVotes.greaterThan(JSBI.BigInt(0))) {
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
                {myVotes?.toSignificant(6, { groupSeparator: ',' }) || '--'}
              </Typography>
            </Box>
          </Stack>
        ) : (
          <MultiVote
            totalVotes={myVotes}
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
  voteProposalSign,
  FatherVotes,
  setFatherVotes
}: {
  totalVotes: CurrencyAmount | TokenAmount | undefined
  voteProposalSign: govList
  FatherVotes: string
  setFatherVotes: Dispatch<SetStateAction<string>>
}) {
  const theme = useTheme()
  const token = new Token(voteProposalSign.chainId, voteProposalSign.tokenAddress, voteProposalSign.decimals)
  console.log('🚀 ~ file: VoteModal.tsx:240 ~ token:', token)

  return (
    <Stack spacing={19} mt={19}>
      <RowCenter>
        <Text>Your votes</Text>
        <Box display={'grid'} flexDirection={'row'} alignItems={'center'} gridTemplateColumns={'auto 10px auto'}>
          <NumericalInput
            style={{ marginRight: 10, width: 173 }}
            value={FatherVotes}
            onChange={e => setFatherVotes(e.target.value)}
          />
          <Typography> / </Typography>
          <Typography color={theme.palette.text.primary}>
            {totalVotes?.toSignificant(6, { groupSeparator: ',' }) || '--'}
          </Typography>
        </Box>
      </RowCenter>
    </Stack>
  )
}
