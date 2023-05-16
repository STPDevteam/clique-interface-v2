import { createReducer } from '@reduxjs/toolkit'
import { isAddress } from 'utils'
import { saveUserInfo, removeUserInfo, UserInfo } from './actions'

export interface UserState {
  account: {
    [address: string]: UserInfo
  }
}

export const initialState: UserState = { account: {} }

export default createReducer(initialState, builder =>
  builder
    .addCase(removeUserInfo, state => {
      for (const curAccount in state.account) {
        if (isAddress(curAccount) && state.account && state.account[curAccount]) {
          delete state.account[curAccount]
        }
      }
    })
    .addCase(saveUserInfo, (state, action) => {
      const { userInfo } = action.payload
      state.account[userInfo.account] = userInfo
    })
)
