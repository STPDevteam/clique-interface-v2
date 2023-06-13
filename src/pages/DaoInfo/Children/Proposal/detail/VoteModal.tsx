import { Alert, Box, Link, Slider, Stack, styled, Typography, useTheme } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import Modal from 'components/Modal'
import { CurrencyAmount, Token, TokenAmount } from 'constants/token'
import { SignType, useProposalVoteCallback } from 'hooks/useProposalCallback'
import { ProposalOptionProp } from 'hooks/useProposalInfo'
import JSBI from 'jsbi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useVoteModalToggle, useWalletModalToggle } from 'state/application/hooks'
import { govList, VotingTypes } from 'state/buildingGovDao/actions'
import { RowCenter } from '../ProposalItem'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { Dots } from 'theme/components'
import { getAmountForPer } from 'utils/dao'
import { AppState } from 'state'
import { useSelector } from 'react-redux'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useProposalDetailInfoProps } from 'hooks/useBackedProposalServer'

const StyledBody = styled(Box)({
  minHeight: 200,
  padding: '40px 32px'
})

const Text = styled(Typography)(({ theme, color }: { color?: string; theme?: any }) => ({
  fontSize: 13,
  fontWeight: 600,
  color: color || theme.palette.text.secondary
}))

export default function VoteModal({
  proposalInfo,
  voteFor
}: {
  proposalInfo: useProposalDetailInfoProps
  voteFor: number[]
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
      voteFor={voteFor}
    />
  )
}

function VoteModalFunc({
  proposalInfo,
  voteFor,
  myVotes,
  voteProposalSign
}: {
  proposalInfo: useProposalDetailInfoProps
  voteFor: number[]
  voteProposalSign: govList
  myVotes: TokenAmount | CurrencyAmount
}) {
  const theme = useTheme()
  const voteModalOpen = useModalOpen(ApplicationModal.VOTE)
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const voteModalToggle = useVoteModalToggle()
  const proposalVoteCallback = useProposalVoteCallback('')
  // const { claimSubmitted: isVoting } = useUserHasSubmittedClaim(
  //   `${daoAddress}_${account}_proposalVote_${proposalInfo.proposalId}`
  // )
  // lock account
  const { claimSubmitted: isVoting } = useUserHasSubmittedClaim(`${account}_proposalVote`)

  const [chooseOption, setChooseOption] = useState<{ [x in number]: CurrencyAmount | TokenAmount | undefined }>({})
  useEffect(() => {
    const _val: {
      [x: number]: CurrencyAmount | TokenAmount | undefined
    } = {}
    for (const index of voteFor) {
      _val[index] = proposalInfo.votingType === VotingTypes.SINGLE ? myVotes : chooseOption[index]
    }
    setChooseOption(_val)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myVotes, proposalInfo.votingType, voteFor])

  const chooseOptionCallback = useCallback(
    (index: number, amount: TokenAmount) => {
      const _val = Object.assign({}, chooseOption)
      _val[index] = amount
      setChooseOption(_val)
    },
    [chooseOption]
  )

  const validChooseOptions = useMemo(() => {
    const ret = Object.assign({}, chooseOption)
    for (const key in chooseOption) {
      if (Object.prototype.hasOwnProperty.call(chooseOption, key)) {
        const val = chooseOption[key]
        if (!val || !val.greaterThan(JSBI.BigInt(0))) {
          delete ret[key]
        }
      }
    }
    return ret
  }, [chooseOption])

  const { showModal, hideModal } = useModal()
  const onProposalVoteCallback = useCallback(() => {
    if (!voteProposalSign) return
    showModal(<TransacitonPendingModal />)
    proposalVoteCallback(
      proposalInfo.proposalId,
      Object.keys(validChooseOptions).map(item => Number(item)),
      Object.values(validChooseOptions).map(item => item?.raw.toString() || '0'),
      {
        chainId: voteProposalSign.chainId,
        tokenAddress: voteProposalSign.tokenAddress,
        balance: '100',
        signType: SignType.VOTE
      }
    )
      .then(hash => {
        hideModal()
        showModal(<TransactiontionSubmittedModal hash={hash} />)
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
  }, [hideModal, proposalInfo.proposalId, proposalVoteCallback, showModal, validChooseOptions, voteProposalSign])

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

    if (!Object.keys(validChooseOptions).length) {
      return {
        disabled: true,
        error: 'Slide the bar to input the tokens you want to vote'
      }
    }

    return {
      disabled: false,
      handler: onProposalVoteCallback
    }
  }, [
    account,
    myVotes,
    onProposalVoteCallback,
    proposalInfo.alreadyVoted,
    proposalInfo.status,
    toggleWalletModal,
    validChooseOptions
  ])

  return (
    <Modal maxWidth="380px" closeIcon width="100%" customIsOpen={voteModalOpen} customOnDismiss={voteModalToggle}>
      <StyledBody>
        <Typography fontWeight={500} variant="h6">
          Votes
        </Typography>
        {proposalInfo.votingType === VotingTypes.SINGLE ? (
          <Stack spacing={19} mt={19}>
            <RowCenter>
              <Text>Your votes</Text>
              <Text color={theme.palette.text.primary}>
                {myVotes?.toSignificant(6, { groupSeparator: ',' }) || '--'}
              </Text>
            </RowCenter>
            <div>
              <Text>Voting for</Text>
              <Box
                sx={{
                  backgroundColor: theme.bgColor.bg4,
                  borderRadius: '8px',
                  padding: '10px 15px'
                }}
              >
                <Text color={theme.palette.text.primary}>{proposalInfo.options[voteFor[0]]?.optionContent}</Text>
              </Box>
            </div>
          </Stack>
        ) : (
          <MultiVote
            totalVotes={myVotes}
            options={proposalInfo.options}
            chooseOption={chooseOption}
            voteProposalSign={voteProposalSign}
            chooseOptionCallback={chooseOptionCallback}
          />
        )}

        {voteBtn.error && (
          <Alert sx={{ marginTop: 15 }} severity="error">
            {voteBtn.error}
          </Alert>
        )}

        <RowCenter mt={19}>
          <OutlineButton width={122} height={40} borderRadius="8px" onClick={voteModalToggle}>
            Back
          </OutlineButton>
          <BlackButton
            width="122px"
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
  options,
  chooseOption,
  voteProposalSign,
  chooseOptionCallback
}: {
  totalVotes: CurrencyAmount | TokenAmount | undefined
  options: ProposalOptionProp[]
  chooseOption: { [x in number]: CurrencyAmount | TokenAmount | undefined }
  voteProposalSign: govList
  chooseOptionCallback: (index: number, amount: TokenAmount) => void
}) {
  const theme = useTheme()
  const totalPer = 100
  const [perArr, setPerArr] = useState<{ [x in number]: number }>({})
  const { account } = useActiveWeb3React()

  const optionIds = useMemo(() => Object.keys(chooseOption).map(i => Number(i)), [chooseOption])
  const token = new Token(voteProposalSign.chainId, voteProposalSign.tokenAddress, voteProposalSign.decimals)

  const perArrCallback = useCallback(
    (index: number, value: number) => {
      const _val = Object.assign({}, perArr)
      _val[index] = Number(value)
      setPerArr(_val)
    },
    [perArr]
  )

  useEffect(() => {
    const _p: { [x in number]: number } = {}
    if (!optionIds) return
    for (const id of optionIds) {
      _p[id] = 0
    }
    setPerArr(_p)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <Stack spacing={19} mt={19}>
      <RowCenter>
        <Text>Your total votes</Text>
        <Text color={theme.palette.text.primary}>{totalVotes?.toSignificant(6, { groupSeparator: ',' }) || '--'}</Text>
      </RowCenter>
      <div>
        <Text mb={15}>Voting for</Text>
        <div>
          {options.map((item, index) =>
            optionIds.includes(index) ? (
              <Box key={index}>
                <Text>{item.optionContent}</Text>
                <Box display={'grid'} gridTemplateColumns="1.6fr 1fr" justifyItems={'end'} alignItems="center">
                  <Slider
                    value={Number(perArr[index])}
                    onChange={(_, newValue) => {
                      const _newValue = newValue as number
                      let used = 0
                      for (const key in perArr) {
                        if (Object.prototype.hasOwnProperty.call(perArr, key)) {
                          if (index !== Number(key)) used = used + perArr[key]
                        }
                      }
                      const maxPer = totalPer - used
                      const curPer = maxPer < _newValue ? maxPer : _newValue

                      perArrCallback(index, curPer)
                      chooseOptionCallback(
                        index,
                        new TokenAmount(token, getAmountForPer(totalVotes?.raw.toString() || 0, curPer))
                      )
                    }}
                    sx={{ height: 7 }}
                  />
                  <Text color={theme.palette.text.primary}>
                    {chooseOption[index]?.toSignificant(6, { groupSeparator: ',' }) || '0'}
                  </Text>
                </Box>
              </Box>
            ) : null
          )}
        </div>
      </div>
    </Stack>
  )
}
