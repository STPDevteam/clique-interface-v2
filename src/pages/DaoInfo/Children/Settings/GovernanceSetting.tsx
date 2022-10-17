import { Alert, Box, Link } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import DateTimeSet from 'components/Governance/DateTimeSet'
import VotingTypesSelect from 'components/Governance/VotingTypesSelect'
import InputNumerical from 'components/Input/InputNumerical'
import { ChainId, ChainListMap } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { DaoInfoProp } from 'hooks/useDaoInfo'
import { useAdminSetGovernanceCallback } from 'hooks/useGovernanceDaoCallback'
import { useCallback, useMemo, useState } from 'react'
import { VotingTypes } from 'state/buildingGovDao/actions'
import { amountAddDecimals, toFormatGroup } from 'utils/dao'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { StyledItem } from '../About'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { Dots } from 'theme/components'

export default function GovernanceSetting({
  daoInfo,
  daoChainId
}: {
  daoInfo: DaoInfoProp | undefined
  daoChainId: ChainId
}) {
  return daoInfo?.proposalThreshold && daoInfo?.votingThreshold ? (
    <Update
      votingThreshold={daoInfo.votingThreshold.toSignificant()}
      proposalThreshold={daoInfo.proposalThreshold.toSignificant()}
      votingPeriod={daoInfo.votingPeriod}
      votingType={daoInfo.votingType}
      daoChainId={daoChainId}
      daoAddress={daoInfo.daoAddress}
      decimals={daoInfo.token?.decimals || 18}
    />
  ) : null
}

function Update({
  proposalThreshold,
  votingThreshold,
  votingPeriod,
  votingType,
  daoChainId,
  daoAddress,
  decimals
}: {
  proposalThreshold: string
  votingThreshold: string
  votingPeriod: number
  votingType: VotingTypes
  daoChainId: ChainId
  daoAddress: string
  decimals: number
}) {
  const [createProposalMinimum, setCreateProposalMinimum] = useState(proposalThreshold)
  const [executeMinimum, setExecuteMinimum] = useState(votingThreshold)
  const [defaultVotingPeriod, setDefaultVotingPeriod] = useState(votingPeriod)
  const [defaultVotingTypes, setDefaultVotingTypes] = useState(votingType)
  const { chainId, account, library } = useActiveWeb3React()

  const { claimSubmitted: isSaving } = useUserHasSubmittedClaim(`${daoAddress}_UpdateGovernanceSetting`)
  const adminSetGovernanceCallback = useAdminSetGovernanceCallback(daoAddress)

  const { showModal, hideModal } = useModal()
  const onAdminSetGovernanceCallback = useCallback(() => {
    showModal(<TransacitonPendingModal />)
    adminSetGovernanceCallback(
      amountAddDecimals(createProposalMinimum, decimals),
      amountAddDecimals(executeMinimum, decimals),
      defaultVotingPeriod,
      defaultVotingTypes
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
  }, [
    decimals,
    adminSetGovernanceCallback,
    createProposalMinimum,
    defaultVotingPeriod,
    defaultVotingTypes,
    executeMinimum,
    hideModal,
    showModal
  ])

  const saveBtn: {
    disabled: boolean
    handler?: () => void
    error?: undefined | string | JSX.Element
  } = useMemo(() => {
    if (
      createProposalMinimum === proposalThreshold &&
      executeMinimum === votingThreshold &&
      defaultVotingPeriod === votingPeriod &&
      defaultVotingTypes === votingType
    ) {
      return {
        disabled: true
      }
    }
    if (!createProposalMinimum) {
      return {
        disabled: true,
        error: 'Minimum tokens needed to create proposal required'
      }
    }
    if (!executeMinimum) {
      return {
        disabled: true,
        error: 'Minimum votes needed for proposal to execute required'
      }
    }
    if (defaultVotingTypes === undefined) {
      return {
        disabled: true,
        error: 'Voting types required'
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
              onClick={() => daoChainId && triggerSwitchChain(library, daoChainId, account || '')}
            >
              switch
            </Link>{' '}
            to {ChainListMap[daoChainId].name}
          </>
        )
      }
    }
    return {
      disabled: false,
      handler: onAdminSetGovernanceCallback
    }
  }, [
    account,
    onAdminSetGovernanceCallback,
    chainId,
    createProposalMinimum,
    daoChainId,
    defaultVotingPeriod,
    defaultVotingTypes,
    executeMinimum,
    library,
    proposalThreshold,
    votingPeriod,
    votingThreshold,
    votingType
  ])

  return (
    <Box>
      <StyledItem>
        <Box display={'grid'} gap="16px">
          <InputNumerical
            noDecimals
            showFormatWrapper={() => (createProposalMinimum ? toFormatGroup(createProposalMinimum) : '')}
            value={createProposalMinimum}
            onChange={e => setCreateProposalMinimum(e.target.value || '')}
            label="*Minimum Tokens Needed To Create Proposal"
            placeholder="100,000"
          />
          <InputNumerical
            noDecimals
            showFormatWrapper={() => (executeMinimum ? toFormatGroup(executeMinimum) : '')}
            value={executeMinimum}
            onChange={e => setExecuteMinimum(e.target.value || '')}
            label="*Minimum Votes Needed For Proposal To Execute"
            placeholder="100,000"
          />
          <DateTimeSet value={defaultVotingPeriod} onUpdate={num => setDefaultVotingPeriod(num)} />
          <VotingTypesSelect
            width={296}
            value={defaultVotingTypes}
            onChange={e => setDefaultVotingTypes(e.target.value)}
          />
        </Box>
      </StyledItem>
      {saveBtn.error && <Alert severity="error">{saveBtn.error}</Alert>}
      <Box mt={50} display="flex" justifyContent={'center'}>
        <BlackButton width="166px" disabled={saveBtn.disabled || isSaving} onClick={saveBtn.handler}>
          {isSaving ? (
            <>
              Saving
              <Dots />
            </>
          ) : (
            'Save'
          )}
        </BlackButton>
      </Box>
    </Box>
  )
}
