import { createAction } from '@reduxjs/toolkit'

export type PopupContent = {
  txn: {
    hash: string
    success: boolean
    summary?: string
  }
}

export enum ApplicationModal {
  WALLET,
  SETTINGS,
  MENU,
  VOTE,
  SIGN_LOGIN
}

export interface UserIPLocation {
  ip: string
  hostname: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  timezone: string
}

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
export const addPopup = createAction<{ key?: string; removeAfterMs?: number | null; content: PopupContent }>(
  'application/addPopup'
)
export const removePopup = createAction<{ key: string }>('application/removePopup')

export const setUserLocation = createAction<UserIPLocation | null>('application/setUserLocation')

export const setCurAddress = createAction<string>('application/setCurAddress')
