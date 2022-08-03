import { useDispatch, useSelector } from 'react-redux'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { useMemo } from 'react'
import store, { AppState } from '../index'
import { saveUserInfo, UserInfo } from './actions'
import { useCallback } from 'react'
import { useActiveWeb3React } from 'hooks'
import { signMessage } from '../../constants'
import { useWeb3Instance } from 'hooks/useWeb3Instance'

export function getCurrentUserInfoSync(account?: string): UserInfo | undefined {
  const allUserInfo = store.getState().userInfo
  if (!allUserInfo || !account) return undefined
  return allUserInfo[account]
}

export function clearAllSignStoreSync() {
  store.dispatch({
    type: 'userInfo/removeUserInfo'
  })
}

export function useUserInfo(): UserInfo | undefined {
  const allUserInfo = useSelector((state: AppState) => state.userInfo)
  const { account } = useWeb3ReactCore()

  return useMemo(() => {
    if (!account) {
      return undefined
    }
    return allUserInfo[account]
  }, [account, allUserInfo])
}

export function useLoginSignature() {
  const web3 = useWeb3Instance()
  const { account } = useActiveWeb3React()
  const dispatch = useDispatch()

  return useCallback(() => {
    if (!account || !web3) return
    return web3.eth.personal.sign(signMessage, account, '').then(signStr => {
      dispatch(saveUserInfo({ userInfo: { account, signature: signStr } }))
      return signStr
    })
  }, [account, web3, dispatch])
}
