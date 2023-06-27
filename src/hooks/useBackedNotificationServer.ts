import { ChainId } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNotificationListPaginationCallback } from 'state/pagination/hooks'
import { getNotificationListInfo, getNotificationUnreadTotal, notificationToRead } from '../utils/fetch/server'

export type NotificationTypes =
  | 'Airdrop'
  | 'PublicSaleCreated'
  | 'PublicSalePurchased'
  | 'PublicSaleCanceled'
  | 'NewProposal'
  | 'ReserveToken'

export interface NotificationInfoProp {
  activityId?: number
  activityName?: string
  chainId?: ChainId
  daoAddress?: string
  daoLogo?: string
  daoName?: string
  proposalId?: number
  proposalName?: string
  tokenLogo?: string
  tokenAddress?: string
  creator?: string
  buyer?: string
}

export interface NotificationProp {
  account: string
  alreadyRead: boolean
  notificationId: number
  notificationTime: number
  types: NotificationTypes
  info: NotificationInfoProp
}

export function useNotificationListInfo() {
  const {
    data: { currentPage },
    setUnReadCount,
    setCurrentPage
  } = useNotificationListPaginationCallback()
  const { account } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<NotificationProp[]>([])

  useEffect(() => {
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  useEffect(() => {
    ;(async () => {
      if (!account) {
        setResult([])
        setUnReadCount(0)
        return
      }
      setLoading(true)
      try {
        const res = await getNotificationListInfo(account, (currentPage - 1) * pageSize, pageSize)
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          return
        }
        setTotal(data.total)
        setUnReadCount(data.unreadTotal)
        setResult(data.list)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('useNotificationListInfo', error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, currentPage])

  return useMemo(
    () => ({
      loading,
      page: {
        setCurrentPage,
        currentPage,
        total,
        totalPage: Math.ceil(total / pageSize),
        pageSize
      },
      result
    }),
    [loading, setCurrentPage, currentPage, total, result]
  )
}

export function useUpdateNotificationUnReadCount() {
  const { setUnReadCount } = useNotificationListPaginationCallback()
  const { account } = useActiveWeb3React()

  useEffect(() => {
    ;(async () => {
      if (!account) {
        setUnReadCount(0)
        return
      }
      try {
        const res = await getNotificationUnreadTotal()
        const data = res.data.data as any
        if (!data) {
          return
        }
        setUnReadCount(data.unreadTotal)
      } catch (error) {
        console.error('useUpdateNotificationUnReadCount', error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])
}

export function useNotificationToRead() {
  const { account } = useActiveWeb3React()

  const toBackedReadOnce = useCallback(
    async (notificationId: number) => {
      if (!account) return
      return notificationToRead(notificationId, false)
    },
    [account]
  )

  const toBackedReadAll = useCallback(async () => {
    if (!account) return
    return notificationToRead(0, true)
  }, [account])

  return {
    toBackedReadOnce,
    toBackedReadAll
  }
}
