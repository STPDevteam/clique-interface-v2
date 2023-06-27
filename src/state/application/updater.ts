import { useCallback, useEffect, useMemo, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import useDebounce from '../../hooks/useDebounce'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { setCurAddress, updateBlockNumber } from './actions'
import { useDispatch } from 'react-redux'
import { SUPPORT_NETWORK_CHAIN_IDS } from 'constants/chain'
import { getOtherNetworkLibrary } from 'connectors/MultiNetworkConnector'
import { useUpdateNotificationUnReadCount } from 'hooks/useBackedNotificationServer'
import { useUserLocation } from './hooks'
import { useLogin } from 'hooks/useBackedDaoServer'
import { useWeb3Instance } from 'hooks/useWeb3Instance'
import { saveUserInfo } from 'state/userInfo/actions'
import { useGlobalUpdateMyJoinList } from 'state/buildingGovDao/hooks'

export default function Updater(): null {
  // add NotificationUnRead
  useUpdateNotificationUnReadCount()
  const web3 = useWeb3Instance()
  const login = useLogin()
  const { library, chainId, account } = useActiveWeb3React()
  const dispatch = useDispatch()
  const windowVisible = useIsWindowVisible()

  useGlobalUpdateMyJoinList()

  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null
  })

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState(state => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== 'number') return { chainId, blockNumber }
          return { chainId, blockNumber: Math.max(blockNumber, state.blockNumber) }
        }
        return state
      })
    },
    [chainId, setState]
  )

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined

    setState({ chainId, blockNumber: null })

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch(error => console.error(`Failed to get block number for chainId: ${chainId}`, error))

    library.on('block', blockNumberCallback)
    return () => {
      library.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible])

  const debouncedState = useDebounce(state, 100)
  const userLocation = useUserLocation()

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  const providers = useMemo(
    () => SUPPORT_NETWORK_CHAIN_IDS.map(v => getOtherNetworkLibrary(v, userLocation?.country)),
    [userLocation?.country]
  )
  const [timeInt, setTimeInt] = useState(0)
  useEffect(() => {
    setTimeout(() => setTimeInt(timeInt + 1), 60000)
    providers.map((provider, index) =>
      provider
        ?.getBlockNumber()
        .then(bn => dispatch(updateBlockNumber({ chainId: SUPPORT_NETWORK_CHAIN_IDS[index], blockNumber: bn })))
    )
  }, [providers, timeInt, dispatch])

  useEffect(() => {
    ;(async () => {
      if (!account || !web3 || !web3.eth.personal.sign) return
      dispatch(setCurAddress(account))
    })()
  }, [account, dispatch, login, web3])

  useEffect(() => {
    ;(async () => {
      if (windowVisible) {
        const data = localStorage.getItem('localUserInfo')
        if (data !== 'undefined' && data) {
          console.log('before', JSON.parse(data), windowVisible)
          dispatch(saveUserInfo({ userInfo: JSON.parse(data) }))
        }
      }
    })()
  }, [dispatch, windowVisible])

  return null
}
