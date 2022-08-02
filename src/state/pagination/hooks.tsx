import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updateHomeListPagination, HomeListPaginationProp } from './actions'

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
