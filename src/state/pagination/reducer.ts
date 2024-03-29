import { createReducer } from '@reduxjs/toolkit'
import { CategoriesTypeProp } from 'state/buildingGovDao/actions'
import {
  updateHomeListPagination,
  HomeListPaginationProp,
  ActivityListPaginationProp,
  updateActivityListPagination,
  updateNotificationListPagination,
  NotificationListPaginationProp,
  updateSbtListPagination,
  SbtListPaginationProp,
  updateProfilePagination,
  ProfilePaginationProp
} from './actions'

export interface SysPagination {
  homeListPagination: HomeListPaginationProp
  activityListPagination: ActivityListPaginationProp
  notificationListPagination: NotificationListPaginationProp
  sbtListPagination: SbtListPaginationProp
  profilePagination: ProfilePaginationProp
}

export const initialState: SysPagination = {
  homeListPagination: {
    keyword: '',
    category: CategoriesTypeProp.ALL,
    currentPage: 1
  },
  activityListPagination: {
    chainId: undefined,
    types: undefined,
    status: '',
    currentPage: 1
  },
  notificationListPagination: {
    unReadCount: 0,
    currentPage: 1
  },
  sbtListPagination: {
    chainId: undefined,
    status: '',
    currentPage: 1,
    category: 0
  },
  profilePagination: {
    nftTabIndex: 0
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
    .addCase(updateSbtListPagination, (state, action) => {
      state.sbtListPagination = action.payload.sbtListPagination
    })
    .addCase(updateProfilePagination, (state, action) => {
      state.profilePagination = action.payload.profilePagination
    })
)
