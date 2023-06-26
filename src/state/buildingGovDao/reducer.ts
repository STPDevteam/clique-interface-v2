import { createReducer } from '@reduxjs/toolkit'
import {
  updateCreateDaoData,
  removeCreateDaoData,
  CreateDaoDataProp,
  VotingTypes,
  CreateDaoListDataProp,
  updateDaoListData,
  MyJoinDaoDataProp,
  updateMyJoinDaoData,
  updateSpaceListData
} from './actions'
import { LeftTaskDataProps } from 'hooks/useBackedTaskServer'

interface BuildingDaoData {
  createDaoData: CreateDaoDataProp
  myJoinDaoData: MyJoinDaoDataProp
  createDaoListData: CreateDaoListDataProp[]
  spaceListData: LeftTaskDataProps[]
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
    governance: [],
    proposalThreshold: '',
    createProposalMinimum: '',
    executeMinimum: '',
    votingPeriod: 0,
    votingType: VotingTypes.ANY
  },
  myJoinDaoData: {
    isJoin: false,
    job: '',
    privateSpaces: []
  },
  createDaoListData: [
    {
      daoId: 0,
      daoName: '',
      daoLogo: ''
    }
  ],
  spaceListData: [
    {
      access: '',
      bio: '',
      creator: {
        account: '',
        avatar: '',
        nickname: ''
      },
      daoId: 0,
      lastEditBy: {
        account: '',
        avatar: '',
        nickname: ''
      },
      lastEditTime: 0,
      spacesId: 0,
      title: '',
      types: ''
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
    .addCase(updateSpaceListData, (state, { payload }) => {
      state.spaceListData = {
        ...state.spaceListData,
        ...payload.spaceListData
      }
    })
    .addCase(updateDaoListData, (state, { payload }) => {
      state.createDaoListData = {
        ...state.createDaoListData,
        ...payload.createDaoListData
      }
    })
)
