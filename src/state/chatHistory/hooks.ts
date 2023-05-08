import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../index'
import { IChatHistory, saveChatHistory } from './actions'
import { useCallback } from 'react'

export function useChatHistoryList(): IChatHistory[] {
  return useSelector((state: AppState) => state.chatHistory.chatHistoryList)
}

export function useChatContextList(): string[] {
  const list = useChatHistoryList()
  return list
    .filter(item => item.role === 'user')
    .slice(0, 4) // max 4
    .map(i => i.content)
}

export function useAddChatOne() {
  const dispatch = useDispatch()

  return useCallback(
    (send: string, receive: string) => {
      dispatch(
        saveChatHistory({
          chatItems: [
            {
              content: send,
              role: 'user'
            },
            {
              content: receive,
              role: 'assistant'
            }
          ]
        })
      )
    },
    [dispatch]
  )
}
