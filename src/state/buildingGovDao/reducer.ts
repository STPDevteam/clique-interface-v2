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
    category: '',
    daoId: 0,
    chainID: 0,
    tokenAddr: '',
    governance: [],
    proposalThreshold: '',
    createProposalMinimum: '',
    executeMinimum: '',
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
