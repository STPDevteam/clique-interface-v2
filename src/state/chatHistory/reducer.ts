import { createReducer } from '@reduxjs/toolkit'
import { IChatHistory, saveChatHistory } from './actions'

export interface IChatHistoryState {
  chatHistoryList: IChatHistory[]
}

export const initialState: IChatHistoryState = {
  chatHistoryList: []
}

export default createReducer(initialState, builder =>
  builder.addCase(saveChatHistory, (state, action) => {
    const { chatItems } = action.payload
    state.chatHistoryList = [...state.chatHistoryList, ...chatItems]
  })
)
