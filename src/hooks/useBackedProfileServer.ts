import { ChainId } from 'constants/chain'
import { useCallback, useEffect, useState } from 'react'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import {
  getAccountFollowersList,
  getAccountFollowingList,
  getAccountNFTsByScan,
  getAccountSendRecordList,
  getNftRefresh,
  userFollowAccount,
  // userFollowStatus,
  userProfile
} from '../utils/fetch/server'
import { DaoAdminLevelProp } from './useDaoInfo'

export interface UserProfileDaoProp {
  accountLevel: typeof DaoAdminLevelProp
  chainId: ChainId
  daoAddress: string
  daoLogo: string
  daoName: string
}

export interface UserProfileAdminProps {
  accountLevel: string
  bio: string
  daoId: number
  daoName: string
  daoLogo: string
  handle: string
  activeProposals: number
  totalProposals: number
  isApprove: boolean
  members: number
}

// export interface UserProfileProp {
//   account: string
//   accountLogo: string
//   introduction: string
//   nickname: string
//   github: string
//   discord: string
//   email: string
//   country: string
//   youtube: string
//   opensea: string
//   followers: number
//   following: number
//   twitter: string
//   adminDao: UserProfileAdminProps[]
//   memberDao: UserProfileDaoProp[]
// }

export interface UserProfileProp {
  account: string
  accountLogo: string
  country: string
  discord: string
  email: string
  followNum: number
  funcNum: number
  github: string
  introduction: string
  nickname: string
  opensea: string
  twitter: string
  userId: number
  youtube: string
  isFollow: boolean
  adminDao: UserProfileAdminProps[]
}

export function useUserProfileInfo(account: string | undefined, refresh?: number, isFollowed?: boolean) {
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
        const res = await userProfile(account)
        setLoading(false)
        const data = res.data.data
        // data.memberDao = data.memberDao.map((item: any) => ({ ...item, accountLevel: DaoAdminLevelProp.NORMAL }))
        // data.adminDao = data.adminDao.map((item: any) => ({
        //   ...item,
        //   accountLevel: item.accountLevel === 'A_superAdmin' ? DaoAdminLevelProp.SUPER_ADMIN : DaoAdminLevelProp.ADMIN
        // }))

        setResult(data)
      } catch (error) {
        setResult(undefined)
        setLoading(false)
        console.error('useUserProfileInfo', error)
      }
    })()
  }, [account, refresh, userSignature, isFollowed])

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
  daoId: number
  daoLogo: string
  timestamp: number
  proposalId: number
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
        const res = await getAccountSendRecordList((currentPage - 1) * pageSize, pageSize)
        setLoading(false)
        const data = res.data as any
        console.log(data)
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        setResult(data.data)
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
export interface ScanNFTInfo {
  amount: string
  contract_address: string
  contract_name: string
  description: string
  erc_type: 'erc721' | 'erc1155'
  external_link: string | null
  image_uri: string | null
  mint_timestamp: number
  minter: string
  name: string
  own_timestamp: number
  owner: string
  token_id: string
  token_uri: string
}

export function useAccountNFTsList(
  account: string | undefined,
  searchChainId: number | undefined,
  ercType: 'erc721' | 'erc1155'
) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 100
  const [result, setResult] = useState<ScanNFTInfo[]>([])

  useEffect(() => {
    setCurrentPage(1)
  }, [account, searchChainId, ercType])

  useEffect(() => {
    ;(async () => {
      if (!account || !searchChainId) {
        setResult([])
        setTotal(0)
        return
      }
      setLoading(true)
      try {
        const res = await getAccountNFTsByScan(account, searchChainId, currentPage, pageSize, ercType)
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        setResult(data.content || [])
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('useAccountNFTsList', error)
      }
    })()
  }, [currentPage, account, searchChainId, ercType])

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
  const [isFollowed, setIsFollowed] = useState<boolean>()
  const userSignature = useUserInfo()
  const loginSignature = useLoginSignature()

  // useEffect(() => {
  //   ;(async () => {
  //     if (!account || !followAccount) {
  //       setIsFollowed(false)
  //       return
  //     }
  //     try {
  //       const res = await userFollowStatus(account, followAccount)
  //       const data = res.data.data
  //       setIsFollowed(data)
  //     } catch (error) {
  //       setIsFollowed(false)
  //       console.error('useUserFollowStatus', error)
  //     }
  //   })()
  // }, [account, followAccount])

  const toggleFollow = useCallback(
    async (status: boolean) => {
      if (!account) return
      let signatureStr = userSignature?.signature
      if (!signatureStr) {
        signatureStr = await loginSignature()
      }
      if (!signatureStr || !followAccount) return
      try {
        await userFollowAccount(status, followAccount)
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

export function useAccountFollowersList(userId: number | undefined) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 5
  const [result, setResult] = useState<
    {
      userId: number
      account: string
      accountLogo: string
      // followTime: string
      // followers: string
      nickname: string
      relation: string
    }[]
  >([])

  useEffect(() => {
    setCurrentPage(1)
  }, [userId])

  useEffect(() => {
    ;(async () => {
      if (!userId) {
        setResult([])
        setTotal(0)
        return
      }
      setLoading(true)
      try {
        const res = await getAccountFollowersList(userId, pageSize, (currentPage - 1) * pageSize)
        setLoading(false)
        const data = res as any
        if (!data.data.data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        setResult(data.data.data)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('useAccountFollowersList', error)
      }
    })()
  }, [currentPage, userId])

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

export function useAccountFollowingList(userId: number | undefined) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 5
  const [result, setResult] = useState<
    {
      userId: number
      account: string
      accountLogo: string
      // followTime: string
      // followers: string
      nickname: string
      relation: string
    }[]
  >([])

  useEffect(() => {
    setCurrentPage(1)
  }, [userId])

  useEffect(() => {
    ;(async () => {
      if (!userId) {
        setResult([])
        setTotal(0)
        return
      }
      setLoading(true)
      try {
        const res = await getAccountFollowingList(userId, pageSize, (currentPage - 1) * pageSize)
        setLoading(false)
        const data = res as any
        if (!data.data.data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        setResult(data.data.data)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('useAccountFollowingList', error)
      }
    })()
  }, [currentPage, userId])

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

export function useRefreshNft() {
  return useCallback((contractAddress: string, tokenId: string) => {
    return getNftRefresh(contractAddress, tokenId)
      .then(res => res)
      .catch(err => err)
  }, [])
}

export function useIsDelayTime() {
  const [isDelayTime, setIsDelayTime] = useState<boolean>(true)
  useEffect(() => {
    setTimeout(() => {
      setIsDelayTime(false)
    }, 500)
  }, [])
  return {
    isDelayTime
  }
}
