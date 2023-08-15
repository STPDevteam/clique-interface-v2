import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import {
  updateCreateDaoData,
  removeCreateDaoData,
  CreateDaoDataProp,
  MyJoinDaoDataProp,
  updateMyJoinDaoData,
  CreateDaoListDataProp,
  updateDaoListData,
  updateSpaceListData,
  updateJoinDaoModalStatus
} from './actions'
import { checkIsJoin, getMyJoinedDao, getV3DaoInfo, leftSpacesList } from 'utils/fetch/server'
import { useParams } from 'react-router-dom'
import { LeftTaskDataProps } from 'hooks/useBackedTaskServer'
import { useMyJoinedDao } from 'hooks/useBackedDaoServer'

type CreateDaoDataPropKey = keyof CreateDaoDataProp

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
      const _updateData = Object.assign({ ...buildingDaoData }, { [key]: value }) as unknown as CreateDaoDataProp
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
  const spaceListData = useSelector((state: AppState) => state.buildingGovernanceDao.spaceListData)
  const isOpen = useSelector((state: AppState) => state.buildingGovernanceDao.isShowJoinDaoModal)
  const isShake = useSelector((state: AppState) => state.buildingGovernanceDao.isShakeJoinDaoModal)
  const myJoinDaoData = useSelector((state: AppState) => state.buildingGovernanceDao.myJoinDaoData)
  const createDaoData = useSelector((state: AppState) => state.buildingGovernanceDao.createDaoData)
  const createDaoListData = useSelector((state: AppState) => state.buildingGovernanceDao.createDaoListData)

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

  const updateJoinDaoDataStatus = useCallback(async () => {
    if (!daoId) return
    const res = await checkIsJoin(daoId)
    const myJoinDaoData = res.data.data as MyJoinDaoDataProp
    dispatch(updateJoinDaoModalStatus({ isShowJoinDaoModal: myJoinDaoData.isJoin }))
  }, [daoId, dispatch])

  const updateMyJoinedDaoListData = useCallback(async () => {
    const res = await getMyJoinedDao()
    const createDaoListData = res.data.data as CreateDaoListDataProp[]
    dispatch(updateDaoListData({ createDaoListData }))
  }, [dispatch])

  const updateWrokspaceListData = useCallback(async () => {
    if (!daoId) return
    const res = await leftSpacesList(daoId, 0, 50)
    const spaceListData = res.data.data as LeftTaskDataProps[]
    dispatch(updateSpaceListData({ spaceListData }))
  }, [daoId, dispatch])

  return useMemo(
    () => ({
      updateDaoBaseData,
      updateDaoMyJoinData,
      updateWrokspaceListData,
      updateMyJoinedDaoListData,
      updateJoinDaoDataStatus,
      isOpen,
      isShake,
      createDaoData,
      spaceListData,
      myJoinDaoData,
      createDaoListData
    }),
    [
      updateDaoBaseData,
      updateDaoMyJoinData,
      updateWrokspaceListData,
      updateMyJoinedDaoListData,
      updateJoinDaoDataStatus,
      isOpen,
      isShake,
      createDaoData,
      spaceListData,
      myJoinDaoData,
      createDaoListData
    ]
  )
}

export function useGlobalUpdateMyJoinList() {
  const dispatch = useDispatch()
  const { result: myJoinDaoListData } = useMyJoinedDao()

  useEffect(() => {
    if (myJoinDaoListData) {
      dispatch(updateDaoListData({ createDaoListData: myJoinDaoListData }))
    }
  }, [dispatch, myJoinDaoListData])
}
