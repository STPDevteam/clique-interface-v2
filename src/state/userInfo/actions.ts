import { createAction } from '@reduxjs/toolkit'

export interface UserInfo {
  account: string
  signature: string
  loggedToken: string
}

export const removeUserInfo = createAction('localUserInfo/removeUserInfo')
export const saveUserInfo = createAction<{ userInfo: UserInfo }>('localUserInfo/saveUserInfo')
