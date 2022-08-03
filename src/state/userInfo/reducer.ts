import { createReducer } from '@reduxjs/toolkit'
import { isAddress } from 'utils'
import { saveUserInfo, removeUserInfo, UserInfo } from './actions'

export interface UserState {
  [address: string]: UserInfo
}

export const initialState: UserState = {}

export default createReducer(initialState, builder =>
  builder
    .addCase(removeUserInfo, state => {
      for (const curAccount in state) {
        if (Object.prototype.hasOwnProperty.call(state, curAccount)) {
          if (isAddress(curAccount) && state[curAccount]) {
            delete state[curAccount]
          }
        }
      }
    })
    .addCase(saveUserInfo, (state, action) => {
      const { userInfo } = action.payload
      state[userInfo.account] = userInfo
    })
)
