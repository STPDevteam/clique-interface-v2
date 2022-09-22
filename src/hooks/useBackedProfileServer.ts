import { useEffect, useState } from 'react'
import { userProfile } from '../utils/fetch/server'

export interface UserProfileDaoProp {
  accountLevel: string
  chainId: number
  daoAddress: string
  daoLogo: string
  daoName: string
}

export interface UserProfileProp {
  account: string
  accountLogo: string
  introduction: string
  nickname: string
  github: string
  twitter: string
  adminDao: UserProfileDaoProp[]
  memberDao: UserProfileDaoProp[]
}

export function useUserProfileInfo(account: string | undefined) {
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<UserProfileProp>()

  useEffect(() => {
    ;(async () => {
      if (!account) {
        return
      }
      setLoading(true)
      try {
        const res = await userProfile(account)
        setLoading(false)
        const data = res.data.data

        setResult(data)
      } catch (error) {
        setResult(undefined)
        setLoading(false)
        console.error('useUserProfileInfo', error)
      }
    })()
  }, [account])

  return {
    loading,
    result
  }
}
