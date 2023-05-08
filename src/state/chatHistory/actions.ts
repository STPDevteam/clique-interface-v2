import { createAction } from '@reduxjs/toolkit'

export interface IChatHistory {
  content: string
  role: 'user' | 'assistant'
}

export const saveChatHistory = createAction<{ chatItems: IChatHistory[] }>('chatHistory/saveChatHistory')
