import { ChainId } from 'constants/chain'
import { useCallback, useEffect, useState } from 'react'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import {
  getAccountFollowersList,
  getAccountFollowingList,
  getAccountNFTs,
  getAccountSendRecordList,
  userFollowAccount,
  userFollowStatus,
  userProfile
} from '../utils/fetch/server'
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
  email: string
  country: string
  youtube: string
  opensea: string
  followers: number
  following: number
  twitter: string
  adminDao: UserProfileDaoProp[]
  memberDao: UserProfileDaoProp[]
}

export function useUserProfileInfo(account: string | undefined, refresh?: number) {
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<UserProfileProp>()
  const userSignature = useUserInfo()

  useEffect(() => {
    ;(async () => {
      if (!account) {
        return
      }
      setLoading(true)
      try {
        const res = await userProfile(
          account,
          userSignature?.signature && userSignature.account.toLowerCase() === account.toLowerCase()
            ? userSignature.signature
            : ''
        )
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
  }, [account, refresh, userSignature])

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

export interface BVNFTInfo {
  contractAddress: string
  tokenId: string
  amount: number
  quantity: number
  usdAmount: number
  currency: string
  standard: 'erc721' | 'erc1155'
  metadata: {
    imageURL: string
    gatewayImageURL: string
    name: string
    collectionName: string
  }
}

export function useAccountNFTsList(account: string, searchChainId: number) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<BVNFTInfo[]>([])

  useEffect(() => {
    setCurrentPage(1)
  }, [account, searchChainId])

  useEffect(() => {
    ;(async () => {
      if (!account) {
        setResult([])
        setTotal(0)
        return
      }
      setLoading(true)
      try {
        const res = await getAccountNFTs(searchChainId, account, currentPage, pageSize)
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        setResult(data.data || [])
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('useAccountNFTsList', error)
      }
    })()
  }, [currentPage, account, searchChainId])

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

export function useUserFollowStatus(account: string | undefined, followAccount: string | undefined) {
  const [isFollowed, setIsFollowed] = useState<boolean>(false)
  const userSignature = useUserInfo()
  const loginSignature = useLoginSignature()

  useEffect(() => {
    ;(async () => {
      if (!account || !followAccount) {
        setIsFollowed(false)
        return
      }
      try {
        const res = await userFollowStatus(account, followAccount)
        const data = res.data.data
        setIsFollowed(data)
      } catch (error) {
        setIsFollowed(false)
        console.error('useUserFollowStatus', error)
      }
    })()
  }, [account, followAccount])

  const toggleFollow = useCallback(
    async (status: boolean) => {
      if (!account) return
      let signatureStr = userSignature?.signature
      if (!signatureStr) {
        signatureStr = await loginSignature()
      }
      if (!signatureStr || !followAccount) return
      try {
        await userFollowAccount(followAccount, status, account, signatureStr)
        setIsFollowed(status)
      } catch (error) {
        console.log(error)
      }
    },
    [account, followAccount, loginSignature, userSignature?.signature]
  )

  return {
    isFollowed,
    toggleFollow
  }
}

export function useAccountFollowersList(account: string) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 5
  const [result, setResult] = useState<
    {
      account: string
      accountLogo: string
      followTime: string
      followers: string
      nickname: string
      relation: string
    }[]
  >([])

  useEffect(() => {
    setCurrentPage(1)
  }, [account])

  useEffect(() => {
    ;(async () => {
      if (!account) {
        setResult([])
        setTotal(0)
        return
      }
      setLoading(true)
      try {
        const res = await getAccountFollowersList(account, (currentPage - 1) * pageSize, pageSize)
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
        console.error('useAccountFollowersList', error)
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

export function useAccountFollowingList(account: string) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 5
  const [result, setResult] = useState<
    {
      account: string
      accountLogo: string
      followTime: string
      following: string
      nickname: string
      relation: string
    }[]
  >([])

  useEffect(() => {
    setCurrentPage(1)
  }, [account])

  useEffect(() => {
    ;(async () => {
      if (!account) {
        setResult([])
        setTotal(0)
        return
      }
      setLoading(true)
      try {
        const res = await getAccountFollowingList(account, (currentPage - 1) * pageSize, pageSize)
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
        console.error('useAccountFollowingList', error)
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
