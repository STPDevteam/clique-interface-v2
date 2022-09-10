import { ActivityStatus } from 'hooks/useActivityInfo'
import { ActivityType } from 'pages/DaoInfo/Children/Activity'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import {
  updateHomeListPagination,
  HomeListPaginationProp,
  ActivityListPaginationProp,
  updateActivityListPagination
} from './actions'

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
    data
  }
}
