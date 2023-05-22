import { createReducer } from '@reduxjs/toolkit'
import { saveUserInfo, removeUserInfo, UserInfo } from './actions'

export interface UserState {
  addressInfo: UserInfo | null
}

export const initialState: UserState = { addressInfo: null }

export default createReducer(initialState, builder =>
  builder
    .addCase(removeUserInfo, state => {
      state.addressInfo = null
    })
    .addCase(saveUserInfo, (state, action) => {
      const { userInfo } = action.payload
      state.addressInfo = userInfo
    })
)
