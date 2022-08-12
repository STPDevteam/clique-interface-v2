import { createAction } from '@reduxjs/toolkit'

export interface CreateTokenDataBasic {
  baseChainId: number | undefined
  tokenSymbol: string
  tokenName: string
  tokenPhoto: string
  tokenSupply: string
  tokenDecimals: number
}

export interface CreateTokenDataDistribution {
  address: string
  tokenNumber: string
  per: number | undefined
  lockDate: number | undefined
}

export const updateCreateTokenDataBasic = createAction<{ createTokenDataBasic: CreateTokenDataBasic }>(
  'createToken/updateCreateTokenDataBasic'
)
export const updateCreateTokenDataDistribution = createAction<{
  createTokenDataDistribution: CreateTokenDataDistribution[]
}>('createToken/updateCreateTokenDataDistribution')

export const removeCreateTokenData = createAction('createToken/removeCreateTokenData')
