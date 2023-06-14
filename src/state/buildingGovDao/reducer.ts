import { createReducer } from '@reduxjs/toolkit'
import {
  updateCreateDaoData,
  removeCreateDaoData,
  CreateDaoDataProp,
  VotingTypes,
  CreateDaoListDataProp,
  updateDaoListData,
  MyJoinDaoDataProp,
  updateMyJoinDaoData
} from './actions'

interface BuildingDaoData {
  createDaoData: CreateDaoDataProp
  myJoinDaoData: MyJoinDaoDataProp
  createDaoListData: CreateDaoListDataProp[]
}

const initialDaoDataState: BuildingDaoData = {
  createDaoData: {
    approve: true,
    bio: '',
    daoCanCreateProposal: true,
    daoName: '',
    handle: '',
    daoLogo: '',
    github: '',
    website: '',
    twitter: '',
    discord: '',
    category: [],
    daoId: 0,
    chainID: 0,
    tokenAddr: '',
    governance: [],
    join: {
      chainId: 0,
      decimals: 0,
      holdAmount: '',
      symbol: '',
      tokenAddress: '',
      tokenLogo: '',
      tokenName: '',
      tokenType: '',
      totalSupply: ''
    },
    proposalThreshold: '',
    createProposalMinimum: '',
    executeMinimum: '',
    votingPeriod: 0,
    votingType: VotingTypes.ANY
  },
  myJoinDaoData: {
    isJoin: false,
    job: ''
  },
  createDaoListData: [
    {
      name: '',
      logo: ''
    }
  ]
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
    .addCase(updateMyJoinDaoData, (state, { payload }) => {
      state.myJoinDaoData = {
        ...state.myJoinDaoData,
        ...payload.myJoinDaoData
      }
    })
    .addCase(updateDaoListData, (state, { payload }) => {
      state.createDaoListData = {
        ...state.createDaoListData,
        ...payload.createDaoListData
      }
    })
)
