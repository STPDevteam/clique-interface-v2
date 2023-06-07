import { createAction } from '@reduxjs/toolkit'

export enum VotingTypes {
  ANY,
  SINGLE,
  MULTI
}
export const VotingTypesName = {
  [VotingTypes.ANY]: 'Any',
  [VotingTypes.SINGLE]: 'Single-voting',
  [VotingTypes.MULTI]: 'Multi-voting'
}

export enum CategoriesTypeProp {
  ALL = 'All',
  Social = 'Social',
  Protocol = 'Protocol',
  NFT = 'NFT',
  Metaverse = 'Metaverse',
  Gaming = 'Gaming',
  // Dapp = 'Dapp',
  Other = 'Other'
}

export interface CreateDaoDataProp {
  bio: string
  daoCanCreateProposal: boolean
  daoName: string
  handle: string
  daoLogo: string
  github: string
  website: string
  twitter: string
  discord: string
  category: string
  daoId: number
  chainID: number
  tokenAddr: string
  governance: [
    {
      chainId: number
      createRequire: string
      decimals: number
      symbol: string
      tokenAddress: string
      tokenLogo: string
      tokenName: string
      tokenType: string
      voteTokenId: number
      weight: number
    }
  ]
  createProposalMinimum: string
  executeMinimum: string
  proposalThreshold: string
  votingPeriod: 0
  votingTypes: VotingTypes.ANY
}

export const updateCreateDaoData = createAction<{ createDaoData: CreateDaoDataProp }>('buildingDao/updateCreateDaoData')
export const removeCreateDaoData = createAction('buildingDao/removeCreateDaoData')
