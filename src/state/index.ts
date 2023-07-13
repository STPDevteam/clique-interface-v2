import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import application from './application/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import transactions from './transactions/reducer'
import multicall from './multicall/reducer'
import buildingGovernanceDao from './buildingGovDao/reducer'
import pagination from './pagination/reducer'
import chatHistory from './chatHistory/reducer'
import createTokenData from './createToken/reducer'
import localUserInfo from './userInfo/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'createTokenData']

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    multicall,
    pagination,
    localUserInfo,
    buildingGovernanceDao,
    chatHistory,
    createTokenData
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
