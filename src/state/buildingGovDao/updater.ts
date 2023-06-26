import { useGetDaoInfo, useIsJoined, useMyJoinedDao } from 'hooks/useBackedDaoServer'
import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import {
  updateCreateDaoData,
  updateDaoListData,
  updateJoinDaoModalStatus,
  updateMyJoinDaoData,
  updateSpaceListData
} from './actions'
import { useGetLeftTaskList } from 'hooks/useBackedTaskServer'

export default function Updater(): null {
  const dispatch = useDispatch()
  const location = useLocation()
  const { daoId: _daoId } = useParams<{ daoId: string }>()
  const daoId = useMemo(() => (location.pathname.includes('/governance/daoInfo') ? Number(_daoId) : 0), [
    _daoId,
    location.pathname
  ])
  const createDaoData = useGetDaoInfo(daoId)
  const { isJoined: myJoinDaoData } = useIsJoined(daoId)
  const { result: spaceListData } = useGetLeftTaskList(daoId)
  const { result: myJoinDaoListData } = useMyJoinedDao()

  useEffect(() => {
    if (createDaoData) {
      dispatch(updateCreateDaoData({ createDaoData }))
    }
  }, [dispatch, createDaoData])

  useEffect(() => {
    if (myJoinDaoData) {
      dispatch(updateMyJoinDaoData({ myJoinDaoData }))
    }
  }, [dispatch, myJoinDaoData])

  useEffect(() => {
    if (myJoinDaoData) {
      dispatch(updateJoinDaoModalStatus({ isShowJoinDaoModal: myJoinDaoData.isJoin }))
    }
  }, [dispatch, myJoinDaoData])

  useEffect(() => {
    if (spaceListData) {
      dispatch(updateSpaceListData({ spaceListData }))
    }
  }, [dispatch, spaceListData])

  useEffect(() => {
    if (myJoinDaoListData) {
      dispatch(updateDaoListData({ createDaoListData: myJoinDaoListData }))
    }
  }, [dispatch, myJoinDaoListData, spaceListData])

  return null
}
