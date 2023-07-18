import { createAction } from '@reduxjs/toolkit'
import { ActivityStatus } from 'hooks/useActivityInfo'
import { ActivityType } from 'pages/DaoInfo/Children/Activity'

export interface HomeListPaginationProp {
  keyword: string
  category: string
  currentPage: number
}

export interface ActivityListPaginationProp {
  types: ActivityType | undefined
  status: ActivityStatus | undefined | string
  currentPage: number
}

export interface NotificationListPaginationProp {
  unReadCount: number
  currentPage: number
}

export const updateHomeListPagination = createAction<{ homeListPagination: HomeListPaginationProp }>(
  'pagination/updateHomeListPagination'
)

export const updateActivityListPagination = createAction<{ activityListPagination: ActivityListPaginationProp }>(
  'pagination/updateActivityListPagination'
)

export const updateNotificationListPagination = createAction<{
  notificationListPagination: NotificationListPaginationProp
}>('pagination/updateNotificationListPagination')
