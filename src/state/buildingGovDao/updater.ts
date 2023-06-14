import { useGetDaoInfo, useIsJoined } from 'hooks/useBackedDaoServer'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { removeCreateDaoData, updateCreateDaoData, updateMyJoinDaoData } from './actions'

export default function Updater(): null {
  const dispatch = useDispatch()
  const location = useLocation()
  const { daoId: daoId } = useParams<{ daoId: string }>()
  const createDaoData = useGetDaoInfo(Number(daoId || null))
  const hasSecondaryRoute = location.pathname.split('/').length > 2
  const { isJoined: myJoinDaoData } = useIsJoined(Number(daoId))
  console.log(createDaoData, daoId, myJoinDaoData)

  useEffect(() => {
    if (hasSecondaryRoute) {
      const routeChunk = location.pathname.split('/').slice(1, 3)
      if (routeChunk[0] === 'governance' && routeChunk[1] === 'daoInfo') {
        if (daoId && createDaoData) {
          console.log('run update function')
          dispatch(updateCreateDaoData({ createDaoData }))
        }
      }
    }
  }, [daoId, dispatch, location.pathname, createDaoData, hasSecondaryRoute])

  useEffect(() => {
    if (hasSecondaryRoute) {
      const routeChunk = location.pathname.split('/').slice(1, 3)
      if (routeChunk[0] === 'governance' && routeChunk[1] === 'daoInfo') {
        if (daoId && myJoinDaoData) {
          console.log('run update function')
          dispatch(updateMyJoinDaoData({ myJoinDaoData }))
        }
      }
    }
  }, [daoId, dispatch, location.pathname, createDaoData, hasSecondaryRoute, myJoinDaoData])

  useEffect(() => {
    if (hasSecondaryRoute) {
      const routeChunk = location.pathname.split('/').slice(1, 3)
      if (routeChunk[0] === 'governance' && routeChunk[1] === 'daoInfo') {
        return () => {
          console.log('run remove function')
          dispatch(removeCreateDaoData())
        }
      }
    }
    return
  })

  return null
}
