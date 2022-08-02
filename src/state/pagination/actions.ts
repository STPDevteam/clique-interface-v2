import { createAction } from '@reduxjs/toolkit'

export interface HomeListPaginationProp {
  keyword: string
  category: string
  currentPage: number
}

export const updateHomeListPagination = createAction<{ homeListPagination: HomeListPaginationProp }>(
  'pagination/updateHomeListPagination'
)
