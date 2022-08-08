import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updateCreateDaoData, removeCreateDaoData, CreateDaoDataProp } from './actions'

type CreateDaoDataPropKey = keyof CreateDaoDataProp

export function useBuildingDaoDataCallback() {
  const buildingDaoData = useSelector((state: AppState) => state.buildingGovernanceDao.createDaoData)

  const dispatch = useDispatch<AppDispatch>()
  const updateBuildingDaoData = useCallback(
    (createDaoData: CreateDaoDataProp) => {
      dispatch(updateCreateDaoData({ createDaoData }))
    },
    [dispatch]
  )
  const updateBuildingDaoKeyData = useCallback(
    (key: CreateDaoDataPropKey, value: any) => {
      const _updateData = (Object.assign({ ...buildingDaoData }, { [key]: value }) as unknown) as CreateDaoDataProp
      updateBuildingDaoData(_updateData)
    },
    [buildingDaoData, updateBuildingDaoData]
  )
  const removeBuildingDaoData = useCallback(() => {
    dispatch(removeCreateDaoData())
  }, [dispatch])

  return {
    updateBuildingDaoData,
    removeBuildingDaoData,
    updateBuildingDaoKeyData,
    buildingDaoData
  }
}
