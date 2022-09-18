import { createReducer } from '@reduxjs/toolkit'
import { CategoriesTypeProp } from 'state/buildingGovDao/actions'
import {
  updateHomeListPagination,
  HomeListPaginationProp,
  ActivityListPaginationProp,
  updateActivityListPagination,
  updateNotificationListPagination,
  NotificationListPaginationProp
} from './actions'

export interface SysPagination {
  homeListPagination: HomeListPaginationProp
  activityListPagination: ActivityListPaginationProp
  notificationListPagination: NotificationListPaginationProp
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
  },
  notificationListPagination: {
    unReadCount: 0,
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
    .addCase(updateNotificationListPagination, (state, action) => {
      state.notificationListPagination = action.payload.notificationListPagination
    })
)
