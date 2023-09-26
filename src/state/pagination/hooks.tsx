import { ActivityStatus } from 'hooks/useActivityInfo'
import { ActivityType } from 'pages/DaoInfo/Children/Activity'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import {
  updateHomeListPagination,
  HomeListPaginationProp,
  ActivityListPaginationProp,
  updateActivityListPagination,
  NotificationListPaginationProp,
  updateNotificationListPagination,
  SbtListPaginationProp,
  updateSbtListPagination,
  updateProfilePagination,
  ProfilePaginationProp
} from './actions'
import { ChainId } from 'constants/chain'

export function useHomeListPaginationCallback() {
  const data = useSelector((state: AppState) => state.pagination.homeListPagination)

  const dispatch = useDispatch<AppDispatch>()
  const updateHomeListPaginationCallback = useCallback(
    (homeListPagination: HomeListPaginationProp) => {
      dispatch(updateHomeListPagination({ homeListPagination }))
    },
    [dispatch]
  )
  const setCurrentPage = useCallback(
    (currentPage: number) => {
      updateHomeListPaginationCallback({ ...data, currentPage })
    },
    [data, updateHomeListPaginationCallback]
  )
  const setKeyword = useCallback(
    (keyword: string) => {
      updateHomeListPaginationCallback({ ...data, keyword })
    },
    [data, updateHomeListPaginationCallback]
  )
  const setCategory = useCallback(
    (category: string) => {
      updateHomeListPaginationCallback({ ...data, category })
    },
    [data, updateHomeListPaginationCallback]
  )

  return {
    updateHomeListPaginationCallback,
    setCurrentPage,
    setKeyword,
    setCategory,
    data
  }
}

export function useActivityListPaginationCallback() {
  const data = useSelector((state: AppState) => state.pagination.activityListPagination)

  const dispatch = useDispatch<AppDispatch>()
  const updateActivityListPaginationCallback = useCallback(
    (activityListPagination: ActivityListPaginationProp) => {
      dispatch(updateActivityListPagination({ activityListPagination }))
    },
    [dispatch]
  )
  const setChainId = useCallback(
    (chainId: ChainId | undefined) => {
      updateActivityListPaginationCallback({ ...data, chainId })
    },
    [data, updateActivityListPaginationCallback]
  )
  const setCurrentPage = useCallback(
    (currentPage: number) => {
      updateActivityListPaginationCallback({ ...data, currentPage })
    },
    [data, updateActivityListPaginationCallback]
  )
  const setTypes = useCallback(
    (types: ActivityType | undefined) => {
      updateActivityListPaginationCallback({ ...data, types })
    },
    [data, updateActivityListPaginationCallback]
  )
  const setStatus = useCallback(
    (status: ActivityStatus | undefined) => {
      updateActivityListPaginationCallback({ ...data, status })
    },
    [data, updateActivityListPaginationCallback]
  )

  return {
    updateActivityListPaginationCallback,
    setCurrentPage,
    setTypes,
    setStatus,
    setChainId,
    data
  }
}

export function useNotificationListPaginationCallback() {
  const data = useSelector((state: AppState) => state.pagination.notificationListPagination)

  const dispatch = useDispatch<AppDispatch>()
  const updateNotificationListPaginationCallback = useCallback(
    (notificationListPagination: NotificationListPaginationProp) => {
      dispatch(updateNotificationListPagination({ notificationListPagination }))
    },
    [dispatch]
  )
  const setCurrentPage = useCallback(
    (currentPage: number) => {
      updateNotificationListPaginationCallback({ ...data, currentPage })
    },
    [data, updateNotificationListPaginationCallback]
  )
  const setUnReadCount = useCallback(
    (unReadCount: number) => {
      updateNotificationListPaginationCallback({ ...data, unReadCount })
    },
    [data, updateNotificationListPaginationCallback]
  )
  const setReadAll = useCallback(() => {
    updateNotificationListPaginationCallback({ ...data, unReadCount: 0 })
  }, [data, updateNotificationListPaginationCallback])
  const setReadOnce = useCallback(() => {
    updateNotificationListPaginationCallback({ ...data, unReadCount: data.unReadCount >= 1 ? data.unReadCount - 1 : 0 })
  }, [data, updateNotificationListPaginationCallback])

  return {
    updateNotificationListPaginationCallback,
    setCurrentPage,
    setUnReadCount,
    setReadAll,
    setReadOnce,
    data
  }
}

export function useSbtListPaginationCallback() {
  const data = useSelector((state: AppState) => state.pagination.sbtListPagination)

  const dispatch = useDispatch<AppDispatch>()
  const updateSbtListPaginationCallback = useCallback(
    (sbtListPagination: SbtListPaginationProp) => {
      dispatch(updateSbtListPagination({ sbtListPagination }))
    },
    [dispatch]
  )
  const setChainId = useCallback(
    (chainId: ChainId | undefined) => {
      updateSbtListPaginationCallback({ ...data, chainId })
    },
    [data, updateSbtListPaginationCallback]
  )

  const setCurrentPage = useCallback(
    (currentPage: number) => {
      updateSbtListPaginationCallback({ ...data, currentPage })
    },
    [data, updateSbtListPaginationCallback]
  )
  const setStatus = useCallback(
    (status: ActivityStatus | undefined) => {
      updateSbtListPaginationCallback({ ...data, status })
    },
    [data, updateSbtListPaginationCallback]
  )
  const setCategory = useCallback(
    (category: number) => {
      updateSbtListPaginationCallback({ ...data, category })
    },
    [data, updateSbtListPaginationCallback]
  )

  return {
    updateSbtListPaginationCallback,
    setCurrentPage,
    setStatus,
    setChainId,
    setCategory,
    data
  }
}

export function useProfilePaginationCallback() {
  const data = useSelector((state: AppState) => state.pagination.profilePagination)

  const dispatch = useDispatch<AppDispatch>()
  const updateProfilePaginationCallback = useCallback(
    (profilePagination: ProfilePaginationProp) => {
      dispatch(updateProfilePagination({ profilePagination }))
    },
    [dispatch]
  )
  const setNftTabIndex = useCallback(
    (nftTabIndex: number) => {
      updateProfilePaginationCallback({ ...data, nftTabIndex })
    },
    [data, updateProfilePaginationCallback]
  )

  return {
    updateProfilePaginationCallback,
    setNftTabIndex,
    data
  }
}
