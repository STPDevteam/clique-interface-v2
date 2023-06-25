import { useGetDaoInfo, useIsJoined } from 'hooks/useBackedDaoServer'
import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { updateCreateDaoData, updateMyJoinDaoData } from './actions'

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

  return null
}
