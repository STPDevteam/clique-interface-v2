import { ChainId } from 'constants/chain'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHomeListPaginationCallback } from 'state/pagination/hooks'
import { currentTimeStamp } from 'utils'
import { useActiveWeb3React } from '.'
import {
  daoHandleQuery,
  getDaoAdmins,
  getDaoInfo,
  // getHomeDaoList,
  getDaoList,
  // getHomeOverview,
  getJoinDaoMembersLogs,
  getMyJoinedDao,
  getTokenList,
  switchJoinDao,
  jobsApply,
  Login,
  checkIsJoin,
  getJobsList,
  getApplyList,
  changeAdminRole,
  joinDAO,
  updateDaoGeneral,
  getV3DaoInfo,
  updateGovernance,
  VoteWeightProp,
  addDaoMember,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getSpacesMemberList,
  removeSpacesMember,
  addSpacesMember,
  getUserQuitDao
} from '../utils/fetch/server'
import { useWeb3Instance } from './useWeb3Instance'
import { useUserInfo } from 'state/userInfo/hooks'
import { CreateDaoDataProp } from 'state/buildingGovDao/actions'

export function useMyJoinedDao() {
  const userInfo = useUserInfo()
  const { account } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<
    {
      daoId: number
      daoLogo: string
      daoName: string
    }[]
  >([])

  useEffect(() => {
    ;(async () => {
      if (!account || !userInfo?.loggedToken) {
        setResult([])
        return
      }
      setLoading(true)
      try {
        const res = await getMyJoinedDao()
        setLoading(false)
        const data = res.data as any
        if (!data) {
          setResult([])
          return
        }
        const list = data.data.map((item: any) => ({
          daoId: item.daoId,
          daoLogo: item.daoLogo,
          daoName: item.daoName,
          isSuper: item.role === 'superAdmin' ? true : false
        }))
        setResult([
          ...list.filter((item: { isSuper: boolean }) => item.isSuper),
          ...list.filter((item: { isSuper: boolean }) => !item.isSuper)
        ])
      } catch (error) {
        setResult([])
        setLoading(false)
        console.error('useMyJoinedDao', error)
      }
    })()
  }, [account, userInfo?.loggedToken])

  return {
    loading: loading,
    result
  }
}

// export interface HomeListProp {
//   daoName: string
//   daoLogo: string
//   daoAddress: string
//   chainId: ChainId
//   proposals: number
//   activeProposals: number
//   soonProposals: number
//   members: number
//   verified: boolean
//   joinSwitch: boolean
// }
export interface ListProp {
  daoId: number
  daoName: string
  daoLogo: string
  hanDle: string
  iodBio: string
  memberCount: number
  proposalCount: number
  activityProposalCount: number
  approve: boolean
}

// export function useHomeDaoList() {
//   const {
//     data: { keyword, category, currentPage },
//     setKeyword,
//     setCategory,
//     setCurrentPage
//   } = useHomeListPaginationCallback()

//   const [firstLoadData, setFirstLoadData] = useState(true)
//   const { account } = useActiveWeb3React()
//   const [loading, setLoading] = useState<boolean>(false)
//   const [total, setTotal] = useState<number>(0)
//   const pageSize = 8
//   const [result, setResult] = useState<HomeListProp[]>([])
//   const [timeRefresh, setTimeRefresh] = useState(-1)
//   const toTimeRefresh = () => setTimeout(() => setTimeRefresh(Math.random()), 15000)

//   useEffect(() => {
//     if (firstLoadData) {
//       setFirstLoadData(false)
//       return
//     }
//     setCurrentPage(1)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [keyword, category])

//   useEffect(() => {
//     ;(async () => {
//       setLoading(true)
//       try {
//         const res = await getHomeDaoList(
//           {
//             account: account || '',
//             category,
//             keyword
//           },
//           (currentPage - 1) * pageSize,
//           pageSize
//         )
//         setLoading(false)
//         const data = res.data.data as any
//         if (!data) {
//           setResult([])
//           setTotal(0)
//           return
//         }
//         setTotal(data.total)
//         const list: HomeListProp[] = data.list.map((item: any) => ({
//           daoName: item.daoName,
//           daoLogo: item.daoLogo,
//           daoAddress: item.daoAddress,
//           chainId: item.chainId,
//           proposals: item.totalProposals,
//           activeProposals: item.activeProposals,
//           soonProposals: item.soonProposals,
//           members: item.members,
//           verified: item.approve,
//           joinSwitch: item.joinSwitch
//         }))
//         setResult(list)
//       } catch (error) {
//         setResult([])
//         setTotal(0)
//         setLoading(false)
//         console.error('useHomeDao', error)
//       }
//     })()
//   }, [account, category, currentPage, keyword])

//   useEffect(() => {
//     ;(async () => {
//       if (timeRefresh === -1) {
//         toTimeRefresh()
//         return
//       }
//       try {
//         const res = await getHomeDaoList(
//           {
//             account: account || '',
//             category,
//             keyword
//           },
//           (currentPage - 1) * pageSize,
//           pageSize
//         )
//         const data = res.data.data as any
//         if (!data) {
//           return
//         }
//         setTotal(data.total)
//         const list: HomeListProp[] = data.list.map((item: any) => ({
//           daoName: item.daoName,
//           daoLogo: item.daoLogo,
//           daoAddress: item.daoAddress,
//           chainId: item.chainId,
//           proposals: item.totalProposals,
//           activeProposals: item.activeProposals,
//           soonProposals: item.soonProposals,
//           members: item.members,
//           verified: item.approve,
//           joinSwitch: item.joinSwitch
//         }))
//         setResult(list)
//         toTimeRefresh()
//       } catch (error) {
//         toTimeRefresh()
//         console.error('useHomeDao', error)
//       }
//     })()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [timeRefresh])

//   return {
//     loading: loading,
//     page: {
//       setCurrentPage,
//       currentPage,
//       total,
//       totalPage: Math.ceil(total / pageSize),
//       pageSize
//     },
//     search: {
//       keyword,
//       setKeyword,
//       category,
//       setCategory
//     },
//     result
//   }
// }

export function useHomeDaoList() {
  const {
    data: { keyword, category, currentPage },
    setKeyword,
    setCategory,
    setCurrentPage
  } = useHomeListPaginationCallback()

  const [firstLoadData, setFirstLoadData] = useState(true)
  const { account } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<ListProp[]>([])
  const [timeRefresh, setTimeRefresh] = useState(-1)
  const toTimeRefresh = () => setTimeout(() => setTimeRefresh(Math.random()), 15000)

  useEffect(() => {
    if (firstLoadData) {
      setFirstLoadData(false)
      return
    }
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, category])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getDaoList(
          {
            categoryId: category,
            keyword
          },
          (currentPage - 1) * pageSize,
          pageSize
        )

        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(res?.data.total)
        const homeDaoList: ListProp[] = data.map((item: any) => ({
          daoId: item.daoId,
          daoName: item.daoName,
          daoLogo: item.daoLogo,
          hanDle: item.handle,
          iodBio: item.bio,
          memberCount: item.memberCount,
          proposalCount: item.proposalCount,
          activityProposalCount: item.activityProposalCount,
          approve: item.approve
        }))

        setResult(homeDaoList)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('useHomeDao', error)
      }
    })()
  }, [account, category, currentPage, keyword])

  useEffect(() => {
    ;(async () => {
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const res = await getDaoList(
          {
            categoryId: category,
            keyword
          },
          (currentPage - 1) * pageSize,
          pageSize
        )

        const data = res.data.data as any
        if (!data) {
          return
        }
        setTotal(res?.data.total)
        const homeDaoList: ListProp[] = data.map((item: any) => ({
          daoId: item.daoId,
          daoName: item.daoName,
          daoLogo: item.daoLogo,
          hanDle: item.handle,
          iodBio: item.bio,
          memberCount: item.memberCount,
          proposalCount: item.proposalCount,
          activityProposalCount: item.activityProposalCount,
          approve: item.approve
        }))
        setResult(homeDaoList)
        toTimeRefresh()
      } catch (error) {
        toTimeRefresh()
        console.error('useHomeDao', error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRefresh])

  return {
    loading: loading,
    page: {
      setCurrentPage,
      currentPage,
      total,
      totalPage: Math.ceil(total / pageSize),
      pageSize
    },
    search: {
      keyword,
      setKeyword,
      category,
      setCategory
    },
    result
  }
}

export function useIsJoined(daoId: number) {
  const [loading, setLoading] = useState(false)
  const [isJoined, setIsJoined] = useState<{ isJoin: boolean; job: string; privateSpaces: [] }>()
  const userInfo = useUserInfo()

  useEffect(() => {
    ;(async () => {
      if (!userInfo?.loggedToken) {
        setIsJoined({ isJoin: false, job: '', privateSpaces: [] })
        return
      }
      setLoading(true)
      try {
        const res = await checkIsJoin(daoId)
        if (res.data.code === 200) {
          setLoading(false)
          setIsJoined(res.data.data)
          return
        }
        throw new Error()
      } catch (error) {
        setLoading(false)
        setIsJoined({ isJoin: false, job: '', privateSpaces: [] })
      }
    })()
  }, [daoId, userInfo?.loggedToken])

  return {
    loading,
    isJoined
  }
}

export function useApplyMember() {
  return useCallback(async (jobPublishId: number, message: string) => {
    return jobsApply(jobPublishId, message)
      .then(res => res)
      .catch(err => console.log(err))
  }, [])
}

export function useJoinDAO() {
  return useCallback(async (chainId: number, daoAddress: string) => {
    return joinDAO(chainId, daoAddress)
      .then(res => res)
      .catch(err => console.log(err))
  }, [])
}

export function useChangeAdminRole() {
  return useCallback(async (changeAccount: string, changeToLevel: number, daoId: number) => {
    return changeAdminRole(changeAccount, changeToLevel, daoId)
      .then(res => res)
      .catch(err => err)
  }, [])
}

export function useLogin() {
  // const { account } = useActiveWeb3React()
  // const [loading, setLoading] = useState(false)
  const [loginToken, setLoginToken] = useState('')
  const login = useCallback(async (account: string, message: string, signature: string) => {
    if (!account) {
      return
    }
    // setLoading(true)
    try {
      const res = await Login(account, message, signature)
      if (res.data.data) {
        setLoginToken(res.data.data)
        // setLoading(false)
        return res.data.data
      }
    } catch (error) {
      // setLoading(false)
    }
  }, [])
  return {
    login,
    loginToken
  }
}

export interface JobsApplyListProp {
  account: string
  applyId: number
  applyRole: string
  applyTime: number
  avatar: string
  chainId: number
  daoAddress: string
  message: string
  nickname: string
}

export function useJobsApplyList(daoId: number, rand: number) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<JobsApplyListProp[]>([])

  useEffect(() => {
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoId])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getApplyList((currentPage - 1) * pageSize, pageSize, daoId)
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        const list: JobsApplyListProp[] = data.map((item: any) => ({
          account: item.account,
          applyId: item.applyId,
          applyRole: item.applyRole,
          applyTime: item.applyTime,
          avatar: item.avatar,
          chainId: item.chainId,
          daoAddress: item.daoAddress,
          message: item.message,
          nickname: item.nickname
        }))
        setResult(list)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('useJobsApplyList', error)
      }
    })()
  }, [currentPage, daoId, rand])

  return useMemo(
    () => ({
      loading,
      page: {
        setCurrentPage,
        currentPage,
        total,
        totalPage: Math.ceil(total / pageSize),
        pageSize
      },
      result
    }),
    [currentPage, loading, total, result]
  )
}

export interface JobsListProps {
  account: string
  avatar: string
  daoId: number
  discord: string
  jobId: number
  jobsLevel: number
  nickname: string
  opensea: string
  twitter: string
  youtobe: string
}

export function useJobsList(daoId: number) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<JobsListProps[]>([])
  const [timeRefresh, setTimeRefresh] = useState(-1)
  const toTimeRefresh = () => setTimeout(() => setTimeRefresh(Math.random()), 15000)

  useEffect(() => {
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoId])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getJobsList(daoId, (currentPage - 1) * pageSize, pageSize)
        setLoading(false)
        const data = res.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        const list: JobsListProps[] = data.data.map((item: JobsListProps) => ({
          account: item.account,
          avatar: item.avatar,
          daoId: item.daoId,
          discord: item.discord,
          jobId: item.jobId,
          jobsLevel: item.jobsLevel,
          nickname: item.nickname,
          opensea: item.opensea,
          twitter: item.twitter,
          youtobe: item.youtobe
        }))
        setResult(list)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('useJobsList', error)
      }
    })()
  }, [currentPage, daoId])

  useEffect(() => {
    ;(async () => {
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const res = await getJobsList(daoId, (currentPage - 1) * pageSize, pageSize)
        const data = res.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        const list: JobsListProps[] = data.data.map((item: any) => ({
          account: item.account,
          avatar: item.avatar,
          daoId: item.daoId,
          discord: item.discord,
          jobId: item.jobId,
          jobsLevel: item.jobsLevel,
          nickname: item.nickname,
          opensea: item.opensea,
          twitter: item.twitter,
          youtobe: item.youtobe
        }))
        setResult(list)
        toTimeRefresh()
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        toTimeRefresh()
        console.error('useJobsList', error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRefresh])

  return useMemo(
    () => ({
      loading,
      page: {
        setCurrentPage,
        currentPage,
        total,
        totalPage: Math.ceil(total / pageSize),
        pageSize
      },
      result
    }),
    [currentPage, loading, total, result]
  )
}

export function useMemberJoinDao(defaultJoined: boolean, defaultMembers: number) {
  const [isJoined, setIsJoined] = useState(defaultJoined)
  const [curMembers, setCurMembers] = useState(defaultMembers)
  const [loading, setLoading] = useState(false)
  const { account } = useActiveWeb3React()
  const web3 = useWeb3Instance()

  useEffect(() => {
    setIsJoined(defaultJoined)
  }, [defaultJoined])

  useEffect(() => {
    setCurMembers(defaultMembers)
  }, [defaultMembers])

  const switchJoin = useCallback(
    async (join: boolean, chainId: ChainId, daoAddress: string) => {
      if (!account || !web3) {
        return
      }
      setLoading(true)
      try {
        const expireTimestamp = currentTimeStamp() + 30
        const message = `${chainId},${daoAddress},${join ? 'join' : 'quit'},${expireTimestamp}`
        const signature = await web3.eth.personal.sign(message, account, '')

        const res = await switchJoinDao(account, chainId, daoAddress, join, signature, expireTimestamp)
        if (res.data.data) {
          setIsJoined(join)
          setCurMembers(join ? curMembers + 1 : curMembers - 1)
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
      }
    },
    [account, curMembers, web3]
  )

  return {
    loading,
    isJoined,
    curMembers,
    switchJoin
  }
}

export function useBackedDaoInfo(daoAddress: string, chainId: ChainId) {
  const { account } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<{
    joinSwitch: boolean
    verified: boolean
    members: number
  }>()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getDaoInfo(chainId)
        setLoading(false)
        const data = res.data.data

        setResult({
          joinSwitch: data.joinSwitch,
          verified: data.approve,
          members: data.members
        })
      } catch (error) {
        setResult(undefined)
        setLoading(false)
        console.error('useBackedDaoInfo', error)
      }
    })()
  }, [account, chainId, daoAddress])

  return {
    loading,
    result
  }
}

export function useBackedDaoAdmins(daoAddress: string, chainId: ChainId, appendAccounts?: string[]) {
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<string[]>()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getDaoAdmins(daoAddress, chainId)
        setLoading(false)
        const data = res.data.data

        setResult(data.map((item: any) => item.account))
      } catch (error) {
        setResult(undefined)
        setLoading(false)
        console.error('useBackedDaoAdmins', error)
      }
    })()
  }, [chainId, daoAddress])

  return useMemo(() => {
    if (!result) {
      return {
        loading,
        result
      }
    }
    const list = appendAccounts ? [...result, ...appendAccounts] : result
    return {
      loading,
      result: list
    }
  }, [appendAccounts, loading, result])
}

export function useTokenList(account: string, chainId: number | string) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 10
  const [result, setResult] = useState<
    {
      chainId: ChainId
      tokenAddress: string
    }[]
  >([])

  useEffect(() => {
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getTokenList(chainId || '', account || '', (currentPage - 1) * pageSize, pageSize)
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        const list: {
          chainId: ChainId
          tokenAddress: string
        }[] = data.list.map((item: any) => ({
          chainId: item.chainId,
          tokenAddress: item.tokenAddress
        }))
        setResult(list)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('useTokenList', error)
      }
    })()
  }, [account, chainId, currentPage])

  return useMemo(
    () => ({
      loading,
      page: {
        setCurrentPage,
        currentPage,
        total,
        totalPage: Math.ceil(total / pageSize),
        pageSize
      },
      result
    }),
    [currentPage, loading, total, result]
  )
}

export function useDaoHandleQuery() {
  return useCallback(async (handle: string) => {
    return daoHandleQuery(handle.trim())
  }, [])
}

export interface HomeOverviewProp {
  totalProposal: string
  totalApproveDao: string
  totalDao: string
  totalAccount: string
}

export function useHomeOverview(): HomeOverviewProp | undefined {
  const [overview, setOverview] = useState<any>()

  useEffect(() => {
    ;(async () => {
      try {
        // const res = await getHomeOverview()
        // const data = res.data.data as any
        const data = { totalDao: 99, totalAccount: 999, totalProposal: 9999 }

        if (!data) {
          setOverview(undefined)
          return
        }
        setOverview(data)
      } catch (error) {
        setOverview(undefined)
        console.error('useHomeOverview', error)
      }
    })()
  }, [])

  return overview
}

export interface DaoMembersLogsProps {
  account: string
  accountLogo: string
  chainId: string
  daoAddress: string
  message: string
  operate: 'join' | 'quit'
  signature: string
  timestamp: number
}

export function useJoinDaoMembersLogs(chainId: number, daoAddress: string) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 4
  const [result, setResult] = useState<DaoMembersLogsProps[]>([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getJoinDaoMembersLogs(chainId, daoAddress, (currentPage - 1) * pageSize, pageSize)
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
        console.error('useJoinDaoMembersLogs', error)
      }
    })()
  }, [chainId, currentPage, daoAddress])

  return useMemo(
    () => ({
      loading,
      page: {
        setCurrentPage,
        currentPage,
        total,
        totalPage: Math.ceil(total / pageSize),
        pageSize
      },
      result
    }),
    [currentPage, loading, total, result]
  )
}

export function useUpdateDaoGeneral() {
  return useCallback(
    (
      bio: string,
      category: string[],
      daoId: number,
      daoLogo: string,
      daoName: string,
      discord: string,
      github: string,
      join:
        | {
            chainId: number
            decimals: number
            holdAmount: string
            symbol: string
            tokenAddress: string
            tokenLogo: string
            tokenName: string
            tokenType: string
            totalSupply: string
          }
        | undefined,
      twitter: string,
      website: string
    ) => {
      return updateDaoGeneral(bio, category, daoId, daoLogo, daoName, discord, github, join, twitter, website)
        .then(res => res)
        .catch(err => console.log(err))
    },
    []
  )
}

export function useUpdateGovernance() {
  return useCallback(
    (daoId: number, proposalThreshold: number, votingPeriod: number, votingType: number, weight: VoteWeightProp[]) => {
      return updateGovernance(daoId, proposalThreshold, votingPeriod, votingType, weight)
        .then(res => res)
        .catch(err => err)
    },
    []
  )
}

export interface DaoInfoProps {
  bio: string
  daoCanCreateProposal: true
  daoId: number
  daoLogo: string
  daoName: string
  discord: string
  github: string
  governance: [
    {
      chainId: number
      createRequire: string
      decimals: number
      symbol: string
      tokenAddress: string
      tokenLogo: string
      tokenName: string
      tokenType: string
      voteTokenId: number
      weight: number
    }
  ]
  proposalThreshold: 'string'
  twitter: 'string'
  votingPeriod: 0
  votingType: 0
  website: 'string'
}

export function useGetDaoInfo(daoId: number) {
  const [result, setResult] = useState<CreateDaoDataProp>()
  useEffect(() => {
    ;(async () => {
      try {
        if (!daoId) return
        const res = await getV3DaoInfo(daoId)
        const data = res.data.data as CreateDaoDataProp
        console.log('1011', data)

        if (!data) {
          setResult(undefined)
          return
        }
        setResult(data)
      } catch (error) {
        setResult(undefined)
        console.error('useGetDaoInfo', error)
      }
    })()
  }, [daoId])
  return result
}

export function useAddDaoMember() {
  return useCallback((account: string, spacesId: number) => {
    return addDaoMember(account, spacesId)
      .then(res => res)
      .catch(err => err)
  }, [])
}

export function useAddTeamspace() {
  return useCallback((access: string, bio: string, daoId: number, title: string) => {
    return addWorkspace(access, bio, daoId, title)
      .then(res => res)
      .catch(err => err)
  }, [])
}

export function useUpdateTeamspace() {
  return useCallback((access: string, bio: string, spacesId: number, title: string) => {
    return updateWorkspace(access, bio, spacesId, title)
      .then(res => res)
      .catch(err => err)
  }, [])
}

export function useDeleteTeamspace() {
  return useCallback((spacesId: number) => {
    return deleteWorkspace(spacesId)
      .then(res => res)
      .catch(err => err)
  }, [])
}

export interface SpacesMemberProp {
  account: string
  accountLogo: string
  id: number
  nickName: string
  spacesId: number
}

export function useGetSpacesMemberList(spacesId: number, refresh?: number) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<SpacesMemberProp[]>([])

  useEffect(() => {
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spacesId])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getSpacesMemberList(spacesId, (currentPage - 1) * pageSize, pageSize)
        setLoading(false)
        const data = res.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        const list: SpacesMemberProp[] = data.data
        setResult(list)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('useGetSpacesMemberList', error)
      }
    })()
  }, [currentPage, refresh, spacesId])

  return useMemo(
    () => ({
      loading,
      page: {
        setCurrentPage,
        currentPage,
        total,
        totalPage: Math.ceil(total / pageSize),
        pageSize
      },
      result
    }),
    [currentPage, loading, total, result]
  )
}

export function useRemoveSpacesMember() {
  return useCallback((id: number) => {
    return removeSpacesMember(id)
      .then(res => res)
      .catch(err => err)
  }, [])
}

export function useAddSpacesMember() {
  return useCallback((account: string, spacesId: number) => {
    return addSpacesMember(account, spacesId)
      .then(res => res)
      .catch(err => err)
  }, [])
}

export function useGetUserQuitDao() {
  return useCallback((daoId: number) => {
    return getUserQuitDao(daoId)
      .then(res => res)
      .catch(err => err)
  }, [])
}
