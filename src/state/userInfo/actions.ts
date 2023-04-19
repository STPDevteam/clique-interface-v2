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

export const removeUserInfo = createAction('userInfo/removeUserInfo')
export const saveUserInfo = createAction<{ userInfo: UserInfo }>('userInfo/saveUserInfo')
