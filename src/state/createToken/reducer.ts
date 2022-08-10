import { createReducer } from '@reduxjs/toolkit'
import {
  updateCreateTokenDataBasic,
  updateCreateTokenDataDistribution,
  removeCreateTokenData,
  CreateTokenDataDistribution,
  CreateTokenDataBasic
} from './actions'

export interface CreateTokenData {
  basic: CreateTokenDataBasic
  distribution: CreateTokenDataDistribution[]
}

const initialCreateTokenDataState: CreateTokenData = {
  basic: {
    baseChainId: undefined,
    tokenSymbol: '',
    tokenName: '',
    tokenPhoto: '',
    tokenSupply: '',
    tokenDecimals: 18
  },
  distribution: [
    {
      address: '',
      tokenNumber: '',
      per: undefined,
      lockDate: undefined
    }
  ]
}

export default createReducer(initialCreateTokenDataState, builder =>
  builder
    .addCase(removeCreateTokenData, state => {
      state.basic = initialCreateTokenDataState.basic
      state.distribution = initialCreateTokenDataState.distribution
    })
    .addCase(updateCreateTokenDataBasic, (state, { payload }) => {
      state.basic = {
        ...state.basic,
        ...payload.createTokenDataBasic
      }
    })
    .addCase(updateCreateTokenDataDistribution, (state, { payload }) => {
      state.distribution = payload.createTokenDataDistribution
    })
)
