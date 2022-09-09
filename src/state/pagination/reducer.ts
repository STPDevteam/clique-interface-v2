import { createReducer } from '@reduxjs/toolkit'
import { CategoriesTypeProp } from 'state/buildingGovDao/actions'
import {
  updateHomeListPagination,
  HomeListPaginationProp,
  ActivityListPaginationProp,
  updateActivityListPagination
} from './actions'

export interface SysPagination {
  homeListPagination: HomeListPaginationProp
  activityListPagination: ActivityListPaginationProp
}

export const initialState: SysPagination = {
  homeListPagination: {
    keyword: '',
    category: CategoriesTypeProp.ALL,
    currentPage: 1
  },
  activityListPagination: {
    types: undefined,
    status: undefined,
    currentPage: 1
  }
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateHomeListPagination, (state, action) => {
      state.homeListPagination = action.payload.homeListPagination
    })
    .addCase(updateActivityListPagination, (state, action) => {
      state.activityListPagination = action.payload.activityListPagination
    })
)
