import { createReducer } from '@reduxjs/toolkit'
import { CategoriesTypeProp } from 'state/buildingGovDao/actions'
import { updateHomeListPagination, HomeListPaginationProp } from './actions'

export interface SysPagination {
  homeListPagination: HomeListPaginationProp
}

export const initialState: SysPagination = {
  homeListPagination: {
    keyword: '',
    category: CategoriesTypeProp.Social,
    currentPage: 1
  }
}

export default createReducer(initialState, builder =>
  builder.addCase(updateHomeListPagination, (state, action) => {
    state.homeListPagination = action.payload.homeListPagination
  })
)
