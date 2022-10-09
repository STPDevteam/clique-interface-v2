import { ChainId } from 'constants/chain'
import { useEffect, useState } from 'react'
import { userProfile } from '../utils/fetch/server'
import { DaoAdminLevelProp } from './useDaoInfo'

export interface UserProfileDaoProp {
  accountLevel: DaoAdminLevelProp
  chainId: ChainId
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
  discord: string
  twitter: string
  adminDao: UserProfileDaoProp[]
  memberDao: UserProfileDaoProp[]
}

export function useUserProfileInfo(account: string | undefined, refresh?: number) {
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

        data.memberDao = data.memberDao.map((item: any) => ({ ...item, accountLevel: DaoAdminLevelProp.NORMAL }))
        data.adminDao = data.adminDao.map((item: any) => ({
          ...item,
          accountLevel: item.accountLevel === 'superAdmin' ? DaoAdminLevelProp.SUPER_ADMIN : DaoAdminLevelProp.ADMIN
        }))

        setResult(data)
      } catch (error) {
        setResult(undefined)
        setLoading(false)
        console.error('useUserProfileInfo', error)
      }
    })()
  }, [account, refresh])

  return {
    loading,
    result
  }
}
