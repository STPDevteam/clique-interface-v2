import { createReducer } from '@reduxjs/toolkit'
import { saveUserInfo, removeUserInfo, UserInfo } from './actions'

export interface UserState {
  addressInfo: UserInfo | null
}
const data =
  localStorage.getItem('localUserInfo') === 'undefined' ? null : JSON.parse(localStorage.getItem('localUserInfo') ?? '')
export const initialState: UserState = {
  addressInfo: data
}

export default createReducer(initialState, builder =>
  builder
    .addCase(removeUserInfo, state => {
      state.addressInfo = null
      localStorage.setItem('localUserInfo', JSON.stringify({}))
    })
    .addCase(saveUserInfo, (state, action) => {
      const { userInfo } = action.payload
      state.addressInfo = userInfo
      localStorage.setItem('localUserInfo', JSON.stringify(userInfo))
    })
)
