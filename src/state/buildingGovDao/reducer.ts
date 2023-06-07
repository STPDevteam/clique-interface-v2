import { createReducer } from '@reduxjs/toolkit'
import { updateCreateDaoData, removeCreateDaoData, CreateDaoDataProp, VotingTypes } from './actions'

interface BuildingDaoData {
  createDaoData: CreateDaoDataProp
}

const initialDaoDataState: BuildingDaoData = {
  createDaoData: {
    bio: '',
    daoCanCreateProposal: true,
    daoName: '',
    handle: '',
    daoLogo: '',
    github: '',
    website: '',
    twitter: '',
    discord: '',
    category: [''],
    daoId: 0,
    governance: [
      {
        chainId: 0,
        createRequire: '',
        decimals: 0,
        symbol: '',
        tokenAddress: '',
        tokenLogo: '',
        tokenName: '',
        tokenType: '',
        voteTokenId: 0,
        weight: 0
      }
    ],
    proposalThreshold: '',
    votingPeriod: 0,
    votingTypes: VotingTypes.ANY
  }
}

export default createReducer(initialDaoDataState, builder =>
  builder
    .addCase(removeCreateDaoData, state => {
      state.createDaoData = initialDaoDataState.createDaoData
    })
    .addCase(updateCreateDaoData, (state, { payload }) => {
      state.createDaoData = {
        ...state.createDaoData,
        ...payload.createDaoData
      }
    })
)
