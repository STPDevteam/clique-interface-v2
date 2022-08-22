import { createReducer } from '@reduxjs/toolkit'
import { updateCreateDaoData, removeCreateDaoData, CreateDaoDataProp, VotingTypes } from './actions'

interface BuildingDaoData {
  createDaoData: CreateDaoDataProp
}

const initialDaoDataState: BuildingDaoData = {
  createDaoData: {
    daoName: '',
    daoHandle: '',
    description: '',
    daoImage: '',
    githubLink: '',
    websiteLink: '',
    twitterLink: '',
    discordLink: '',
    category: '',
    baseChainId: undefined,
    tokenAddress: '',
    createProposalMinimum: '',
    executeMinimum: '',
    defaultVotingPeriod: 86400 * 3,
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
