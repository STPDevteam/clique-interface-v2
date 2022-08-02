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
    daoImage:
      'https://gimg3.baidu.com/search/src=http%3A%2F%2Fpics3.baidu.com%2Ffeed%2Fcaef76094b36acafe7343e441aaf271a00e99c37.jpeg%3Ftoken%3D36593c24e4a9d2d139450a62da898a69&refer=http%3A%2F%2Fwww.baidu.com&app=2021&size=f360,240&n=0&g=0n&q=75&fmt=auto?sec=1658422800&t=a6e76e93e22cbf9aaa154953912f3c7f',
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
