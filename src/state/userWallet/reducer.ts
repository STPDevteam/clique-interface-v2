import { createSlice } from '@reduxjs/toolkit'
import { ConnectionType } from 'connection/types'

interface userWalletState {
  selectedWallet?: ConnectionType
}

const initialState: userWalletState = {
  selectedWallet: undefined
}

const userWalletSlice = createSlice({
  name: 'userWallet',
  initialState,
  reducers: {
    updateSelectedWallet(state, { payload: { wallet } }) {
      state.selectedWallet = wallet
    }
  }
})

export const { updateSelectedWallet } = userWalletSlice.actions
export default userWalletSlice.reducer
