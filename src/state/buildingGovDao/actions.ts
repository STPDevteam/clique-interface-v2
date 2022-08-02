import { createAction } from '@reduxjs/toolkit'

export enum VotingTypes {
  ANY,
  SINGLE,
  MULTI
}

export enum CategoriesTypeProp {
  Social = 'Social',
  Protocol = 'Protocol',
  NFT = 'NFT',
  Metaverse = 'Metaverse',
  Gaming = 'Gaming',
  Dapp = 'Dapp',
  Other = 'Other'
}

export interface CreateDaoDataProp {
  daoName: string
  daoHandle: string
  description: string
  daoImage: string
  githubLink: string
  websiteLink: string
  twitterLink: string
  discordLink: string
  baseChainId: number | undefined
  tokenAddress: string
  createProposalMinimum: string
  executeMinimum: string
  defaultVotingPeriod: number
  votingTypes: VotingTypes | undefined
  category: string
}

export const updateCreateDaoData = createAction<{ createDaoData: CreateDaoDataProp }>('buildingDao/updateCreateDaoData')
export const removeCreateDaoData = createAction('buildingDao/removeCreateDaoData')
