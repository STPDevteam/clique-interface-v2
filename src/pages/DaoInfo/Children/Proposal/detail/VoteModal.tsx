import { Dispatch, SetStateAction } from 'react'
import { VoteListProp, useProposalDetailInfoProps } from 'hooks/useBackedProposalServer'
import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'
import { ProposalOptionProp } from 'hooks/useProposalInfo'
import GaslessVoteModal from './GaslessVoteModal'
import ChainVoteModal from './ChainVoteModal'

export default function VoteModal({
  refresh,
  proposalInfo,
  proposalOptions,
  proposalOptionId,
  setUpDateVoteList,
  proposalVoteList
}: {
  proposalInfo: useProposalDetailInfoProps
  proposalOptions: ProposalOptionProp[]
  proposalOptionId: number
  refresh: Dispatch<SetStateAction<number>>
  setUpDateVoteList: Dispatch<SetStateAction<number>>
  proposalVoteList: VoteListProp[]
}) {
  const { buildingDaoData: daoInfo } = useBuildingDaoDataCallback()

  return !daoInfo.governance[0] || !proposalInfo ? null : proposalInfo.isChain ? (
    <ChainVoteModal
      refresh={refresh}
      setUpDateVoteList={setUpDateVoteList}
      myVotes={proposalInfo.yourVotes}
      myAlreadyVotes={proposalInfo.alreadyVoted}
      // voteProposalSign={daoInfo.governance[0]}
      proposalOptions={proposalOptions}
      proposalInfo={proposalInfo}
      proposalOptionId={proposalOptionId}
      userVoteList={proposalVoteList}
    />
  ) : (
    <GaslessVoteModal
      refresh={refresh}
      setUpDateVoteList={setUpDateVoteList}
      myVotes={proposalInfo.yourVotes}
      myAlreadyVotes={proposalInfo.alreadyVoted}
      // voteProposalSign={daoInfo.governance[0]}
      proposalOptions={proposalOptions}
      proposalInfo={proposalInfo}
      proposalOptionId={proposalOptionId}
      userVoteList={proposalVoteList}
    />
  )
}
