import { createAction } from '@reduxjs/toolkit'

export interface UserInfo {
  account: string
  // name: string
  // avatarUrl: string
  // twitter: string
  // discord: string
  signature: string
  loggedToken: string
}

export const removeUserInfo = createAction('localUserInfo/removeUserInfo')
export const saveUserInfo = createAction<{ userInfo: UserInfo }>('localUserInfo/saveUserInfo')
