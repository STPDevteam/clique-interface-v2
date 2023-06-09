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

type govList = Array<{
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
}>

export interface CreateDaoDataProp {
  approve: boolean
  bio: string
  daoCanCreateProposal: boolean
  daoName: string
  handle: string
  daoLogo: string
  github: string
  website: string
  twitter: string
  discord: string
  category: string[]
  daoId: number
  chainID: number
  tokenAddr: string
  governance: govList
  join: {
    chainId: number | undefined
    decimals: number | undefined
    holdAmount: string | undefined
    symbol: string | undefined
    tokenAddress: string | undefined
    tokenLogo: string | undefined
    tokenName: string | undefined
    tokenType: string
    totalSupply: string | undefined
  }
  createProposalMinimum: string
  executeMinimum: string
  proposalThreshold: string
  votingPeriod: 0
  votingTypes: VotingTypes.ANY
}

export const updateCreateDaoData = createAction<{ createDaoData: CreateDaoDataProp }>('buildingDao/updateCreateDaoData')
export const removeCreateDaoData = createAction('buildingDao/removeCreateDaoData')
