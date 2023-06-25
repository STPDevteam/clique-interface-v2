import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import {
  updateCreateDaoData,
  removeCreateDaoData,
  CreateDaoDataProp,
  MyJoinDaoDataProp,
  updateMyJoinDaoData,
  CreateDaoListDataProp,
  updateDaoListData
} from './actions'
import { checkIsJoin, getV3DaoInfo } from 'utils/fetch/server'
import { useParams } from 'react-router-dom'

type CreateDaoDataPropKey = keyof CreateDaoDataProp
type MyJoinDaoDataPropKey = keyof MyJoinDaoDataProp

export function useMyDaoDataCallback() {
  const myJoinDaoData = useSelector((state: AppState) => state.buildingGovernanceDao.myJoinDaoData)

  const dispatch = useDispatch<AppDispatch>()
  const updateJoinDaoDataCb = useCallback(
    (myJoinDaoData: MyJoinDaoDataProp) => {
      //api returns here
      dispatch(updateMyJoinDaoData({ myJoinDaoData }))
    },
    [dispatch]
  )
  const updateJoinDaoKeyDataCb = useCallback(
    (key: MyJoinDaoDataPropKey, value: any) => {
      const _updateData = (Object.assign({ ...myJoinDaoData }, { [key]: value }) as unknown) as MyJoinDaoDataProp
      updateJoinDaoDataCb(_updateData)
    },
    [myJoinDaoData, updateJoinDaoDataCb]
  )

  return {
    updateJoinDaoDataCb,
    updateJoinDaoKeyDataCb,
    myJoinDaoData
  }
}

export function useMyDaoListDataCallback() {
  const dispatch = useDispatch<AppDispatch>()
  const updateJoinDaoListDataCb = useCallback(
    (createDaoListData: CreateDaoListDataProp[]) => {
      dispatch(updateDaoListData({ createDaoListData }))
    },
    [dispatch]
  )

  return {
    updateJoinDaoListDataCb
  }
}

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

export function useUpdateDaoDataCallback() {
  const dispatch = useDispatch()
  const { daoId: _daoId } = useParams<{ daoId: string }>()
  const daoId = useMemo(() => Number(_daoId), [_daoId])

  const updateDaoBaseData = useCallback(async () => {
    if (!daoId) return
    const res = await getV3DaoInfo(daoId)
    const createDaoData = res.data.data as CreateDaoDataProp
    dispatch(updateCreateDaoData({ createDaoData }))
  }, [daoId, dispatch])

  const updateDaoMyJoinData = useCallback(async () => {
    if (!daoId) return
    const res = await checkIsJoin(daoId)
    const myJoinDaoData = res.data.data as MyJoinDaoDataProp
    dispatch(updateMyJoinDaoData({ myJoinDaoData }))
  }, [daoId, dispatch])

  return useMemo(
    () => ({
      updateDaoBaseData,
      updateDaoMyJoinData
    }),
    [updateDaoBaseData, updateDaoMyJoinData]
  )
}
