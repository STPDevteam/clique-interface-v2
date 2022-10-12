import { ChainId } from 'constants/chain'
import { useEffect, useState } from 'react'
import { getAccountSendRecordList, userProfile } from '../utils/fetch/server'
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

export enum AccountBackedSendRecordTypesProp {
  EvCreateDao = 'CreateDao',
  EvCreateProposal = 'CreateProposal',
  EvVote = 'Vote',
  EvCancelProposal = 'CancelProposal',
  EvAdmin = 'Admin',
  EvOwnershipTransferred = 'OwnershipTransferred',
  EvCreateERC20 = 'CreateERC20',
  EvCreateAirdrop = 'CreateAirdrop',
  EvSettleAirdrop = 'SettleAirdrop',
  EvClaimed = 'Claimed',
  EvClaimReserve = 'ClaimReserve'
}

export interface AccountSendRecordProp {
  activityId: number
  address: string
  avatar: string
  chainId: ChainId
  creator: string
  time: number
  daoName: string
  titles: string
  types: AccountBackedSendRecordTypesProp
}

export function useAccountSendRecordList(account: string) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 5
  const [result, setResult] = useState<AccountSendRecordProp[]>([])

  useEffect(() => {
    ;(async () => {
      if (!account) {
        setResult([])
        setTotal(0)
        return
      }
      setLoading(true)
      try {
        const res = await getAccountSendRecordList(account, (currentPage - 1) * pageSize, pageSize)
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        setResult(data.list)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('useAccountSendRecordList', error)
      }
    })()
  }, [currentPage, account])

  return {
    loading: loading,
    page: {
      setCurrentPage,
      currentPage,
      total,
      totalPage: Math.ceil(total / pageSize),
      pageSize
    },
    result
  }
}
