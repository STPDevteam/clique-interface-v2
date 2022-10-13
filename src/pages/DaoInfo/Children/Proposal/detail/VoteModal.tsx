import { Alert, Box, Link, Slider, Stack, styled, Typography, useTheme } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import Modal from 'components/Modal'
import { ChainId, ChainListMap } from 'constants/chain'
import { TokenAmount } from 'constants/token'
import { useDaoInfo } from 'hooks/useDaoInfo'
import { SignType, useProposalVoteCallback } from 'hooks/useProposalCallback'
import {
  ProposalDetailProp,
  ProposalOptionProp,
  ProposalSignProp,
  ProposalStatus,
  useProposalSign
} from 'hooks/useProposalInfo'
import JSBI from 'jsbi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useVoteModalToggle, useWalletModalToggle } from 'state/application/hooks'
import { VotingTypes } from 'state/buildingGovDao/actions'
import { RowCenter } from '../ProposalItem'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { Dots } from 'theme/components'
import { getAmountForPer } from 'utils/dao'

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
  daoChainId,
  daoAddress,
  voteFor
}: {
  proposalInfo: ProposalDetailProp
  daoChainId: ChainId
  daoAddress: string
  voteFor: number[]
}) {
  const daoInfo = useDaoInfo(daoAddress, daoChainId)
  const voteProposalSign = useProposalSign(daoAddress, daoChainId, SignType.VOTE, proposalInfo.proposalId)

  const myVotes = useMemo(() => {
    if (!daoInfo?.token || !voteProposalSign) {
      return undefined
    }
    return new TokenAmount(daoInfo.token, JSBI.BigInt(voteProposalSign?.balance || '0'))
  }, [voteProposalSign, daoInfo?.token])

  return !voteProposalSign || myVotes === undefined ? null : (
    <VoteModalFunc
      myVotes={myVotes}
      voteProposalSign={voteProposalSign}
      proposalInfo={proposalInfo}
      daoChainId={daoChainId}
      daoAddress={daoAddress}
      voteFor={voteFor}
    />
  )
}

function VoteModalFunc({
  proposalInfo,
  daoChainId,
  daoAddress,
  voteFor,
  myVotes,
  voteProposalSign
}: {
  proposalInfo: ProposalDetailProp
  daoChainId: ChainId
  daoAddress: string
  voteFor: number[]
  voteProposalSign: ProposalSignProp
  myVotes: TokenAmount
}) {
  const theme = useTheme()
  const voteModalOpen = useModalOpen(ApplicationModal.VOTE)
  const { account, library, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const voteModalToggle = useVoteModalToggle()
  const proposalVoteCallback = useProposalVoteCallback(daoAddress)
  const { claimSubmitted: isVoting } = useUserHasSubmittedClaim(
    `${daoAddress}_${account}_proposalVote_${proposalInfo.proposalId}`
  )

  const [chooseOption, setChooseOption] = useState<{ [x in number]: TokenAmount | undefined }>({})
  useEffect(() => {
    const _val: {
      [x: number]: TokenAmount | undefined
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
        chainId: voteProposalSign.tokenChainId,
        tokenAddress: voteProposalSign.tokenAddress,
        balance: voteProposalSign.balance,
        signType: SignType.VOTE
      },
      voteProposalSign.signature
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
    if (proposalInfo.status !== ProposalStatus.OPEN) {
      return {
        disabled: true,
        error: 'Proposal voting is not opened'
      }
    }
    if (proposalInfo.myVoteInfo?.length) {
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
    if (!myVotes || !myVotes.greaterThan(JSBI.BigInt(0))) {
      return {
        disabled: true,
        error: 'Insufficient votes'
      }
    }

    if (!Object.keys(validChooseOptions).length) {
      return {
        disabled: true,
        error: 'You must choose a option'
      }
    }

    return {
      disabled: false,
      handler: onProposalVoteCallback
    }
  }, [
    account,
    chainId,
    daoChainId,
    library,
    myVotes,
    onProposalVoteCallback,
    proposalInfo.myVoteInfo?.length,
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
                <Text color={theme.palette.text.primary}>{proposalInfo.proposalOptions[voteFor[0]]?.name}</Text>
              </Box>
            </div>
          </Stack>
        ) : (
          <MultiVote
            totalVotes={myVotes}
            options={proposalInfo.proposalOptions}
            chooseOption={chooseOption}
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
  chooseOptionCallback
}: {
  totalVotes: TokenAmount | undefined
  options: ProposalOptionProp[]
  chooseOption: { [x in number]: TokenAmount | undefined }
  chooseOptionCallback: (index: number, amount: TokenAmount) => void
}) {
  const theme = useTheme()
  const totalPer = 100
  const [perArr, setPerArr] = useState<{ [x in number]: number }>({})
  const { account } = useActiveWeb3React()

  const optionIds = useMemo(() => Object.keys(chooseOption).map(i => Number(i)), [chooseOption])
  const token = useMemo(() => options?.[0]?.amount.token, [options])

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
                <Text>{item.name}</Text>
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
