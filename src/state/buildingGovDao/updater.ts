import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
// import { CreateDaoDataProp, updateCreateDaoData } from './actions'

export default function Updater(): null {
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {}, [dispatch, location.pathname])

  return null
}
