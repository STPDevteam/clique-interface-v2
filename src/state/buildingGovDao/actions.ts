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
  daoHandle: string
  daoLogo: string
  github: string
  website: string
  twitter: string
  discord: string
  // category: '',
  daoId: number
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
  proposalThreshold: ''
  // createProposalMinimum: '',
  // executeMinimum: '',
  votingPeriod: 0
  votingTypes: VotingTypes.ANY
}

export const updateCreateDaoData = createAction<{ createDaoData: CreateDaoDataProp }>('buildingDao/updateCreateDaoData')
export const removeCreateDaoData = createAction('buildingDao/removeCreateDaoData')
