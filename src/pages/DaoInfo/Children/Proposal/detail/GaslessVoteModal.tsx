import { Alert, Box, Link, Stack, styled, Typography, Slider } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import Modal from 'components/Modal'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useVoteModalToggle, useWalletModalToggle } from 'state/application/hooks'
import { VotingTypes } from 'state/buildingGovDao/actions'
import { RowCenter } from '../ProposalItem'
import { useActiveWeb3React } from 'hooks'
import { Dots } from 'theme/components'
import { VoteListProp, useProposalDetailInfoProps, useProposalVoteCallback } from 'hooks/useBackedProposalServer'
import { toast } from 'react-toastify'
import { formatNumberWithCommas } from 'utils'
import BigNumber from 'bignumber.js'
import Input from 'components/Input'
import useModal from 'hooks/useModal'
import { ProposalOptionProp } from 'hooks/useProposalInfo'

const StyledBody = styled(Box)({
  minHeight: 200,
  padding: '40px 32px'
})

const TitleStyle = styled(Typography)(() => ({
  fontSize: 14,
  fontWeight: 500,
  color: '#3F5170',
  lineHeight: '16px'
}))

export default function GaslessVoteModal({
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
  const toggleWalletModal = useWalletModalToggle()
  const voteModalToggle = useVoteModalToggle()
  const proposalVoteCallback = useProposalVoteCallback()

  const refreshCallback = useCallback(() => {
    setTimeout(() => {
      setUpDateVoteList(Math.random())
      refresh(Math.random())
    })
  }, [refresh, setUpDateVoteList])

  const [vote, setVote] = useState<number[]>([])
  const [voteList, setVoteList] = useState<{ optionId: number; votes: number }[]>([])
  const [isTotalVote, setIsTotalVote] = useState<number>(0)
  const [singLe, setSingLe] = useState<boolean>(false)
  const { showModal, hideModal } = useModal()
  const [voteLoading, setVoteLoading] = useState<boolean>(false)
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
  }, [vote, voteList, userVoteList])

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
                optionId: proposalOptionId,
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
          refreshCallback()
          hideModal()
          toast.success('Vote success')
          setVoteLoading(false)
        })
        .catch(err => {
          toast.error(err.msg || 'Network error')
          setVoteLoading(false)
        })
    }
  }, [
    hideModal,
    myVotes,
    proposalOptionId,
    proposalVoteCallback,
    refresh,
    refreshCallback,
    singLe,
    voteList,
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
    myVotes,
    onProposalVoteCallback,
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

            {proposalOptions.map((item, index) => (
              <Box sx={{ mt: 15 }} key={item.optionId}>
                <TitleStyle>{item.optionContent}</TitleStyle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                  <Slider
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
        )}

        {voteBtn.error && (
          <Alert sx={{ marginTop: 15 }} severity={'error'}>
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

          <BlackButton
            width="200px"
            height="40px"
            disabled={voteBtn.disabled || voteLoading}
            onClick={() => {
              if (myVotes - isTotalVote > 0 && !singLe) {
                voteModalToggle()
                showModal(<ModifyModal Callback={onProposalVoteCallback} />)
                return
              } else {
                onProposalVoteCallback()
                setVoteLoading(true)
              }
            }}
            borderRadius="8px"
          >
            {voteLoading ? (
              <>
                Voting
                <Dots />
              </>
            ) : (
              'Vote'
            )}
          </BlackButton>
        </RowCenter>
      </StyledBody>
    </Modal>
  )
}

function ModifyModal({ Callback }: { Callback: () => void }) {
  const { hideModal } = useModal()
  const [loading, setLoading] = useState<boolean>(false)
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
            disabled={loading}
            width="200px"
            height="40px"
            borderRadius="8px"
            onClick={() => {
              setLoading(true)
              Callback()
            }}
          >
            {loading ? (
              <>
                Voting
                <Dots />
              </>
            ) : (
              'Continue'
            )}
          </BlackButton>
        </RowCenter>
      </StyledBody>
    </Modal>
  )
}
