import { useDispatch, useSelector } from 'react-redux'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { useMemo } from 'react'
import store, { AppState } from '../index'
import { saveUserInfo, UserInfo } from './actions'
import { useCallback } from 'react'
import { useActiveWeb3React } from 'hooks'
import { signMessage } from '../../constants'
import { useWeb3Instance } from 'hooks/useWeb3Instance'
import { useLogin } from 'hooks/useBackedDaoServer'

export function getCurrentUserInfoSync(account?: string): UserInfo | undefined {
  const allUserInfo = store.getState().localUserInfo
  if (!allUserInfo || !account) return undefined
  return allUserInfo.account?.[account]
}

export function clearAllSignStoreSync() {
  store.dispatch({
    type: 'userInfo/removeUserInfo'
  })
}

export function useUserInfo(): UserInfo | undefined {
  const allUserInfo = useSelector((state: AppState) => state.localUserInfo)
  const { account } = useWeb3ReactCore()

  return useMemo(() => {
    if (!account) {
      return undefined
    }
    return allUserInfo.account?.[account]
  }, [account, allUserInfo])
}

export function useLoginSignature() {
  const login = useLogin()
  const web3 = useWeb3Instance()
  const { account } = useActiveWeb3React()
  const address = store.getState().application.curAddress
  const _account = store.getState().localUserInfo.account?.[address]?.account
  const _signature = store.getState().localUserInfo.account?.[address]?.signature
  const dispatch = useDispatch()

  return useCallback(async () => {
    if (!account || !web3) return

    if (_account) {
      const res = await login.login(_account, _signature)
      dispatch(saveUserInfo({ userInfo: { account: _account, signature: _signature, loggedToken: res } }))
      return
    } else {
      return web3.eth.personal.sign(signMessage, account, '').then(async signStr => {
        const res = await login.login(account, signStr)
        dispatch(saveUserInfo({ userInfo: { account, signature: signStr, loggedToken: res } }))
        return signStr
      })
    }
  }, [account, web3, _account, login, _signature, dispatch])
}
