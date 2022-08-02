import { createReducer } from '@reduxjs/toolkit'
import { saveUserInfo, removeUserInfo, UserInfo } from './actions'

export interface UserState {
  [address: string]: UserInfo
}

export const initialState: UserState = {}

export default createReducer(initialState, builder =>
  builder
    .addCase(removeUserInfo, (state, action) => {
      const { address } = action.payload
      if (state[address]) delete state[address]
    })
    .addCase(saveUserInfo, (state, action) => {
      const { userInfo } = action.payload
      state[userInfo.account] = userInfo
    })
)
