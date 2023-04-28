import { ChainId } from 'constants/chain'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHomeListPaginationCallback } from 'state/pagination/hooks'
import { currentTimeStamp } from 'utils'
import { useActiveWeb3React } from '.'
import {
  daoHandleQuery,
  getDaoAdmins,
  getDaoInfo,
  getHomeDaoList,
  getHomeOverview,
  getJoinDaoMembersLogs,
  getMyJoinedDao,
  getTokenList,
  switchJoinDao,
  jobsApply,
  Login,
  checkIsJoin,
  getJobsList,
  getApplyList
} from '../utils/fetch/server'
import { useWeb3Instance } from './useWeb3Instance'
import { useUserInfo } from 'state/userInfo/hooks'

export function useMyJoinedDao() {
  const { account } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<
    {
      chainId: ChainId
      daoName: string
      daoAddress: string
    }[]
  >([])

  useEffect(() => {
    ;(async () => {
      if (!account) {
        setResult([])
        return
      }
      setLoading(true)
      try {
        const res = await getMyJoinedDao(account)
        setLoading(false)
        const data = res.data.data
        if (!data) {
          setResult([])
          return
        }

        const list = data.map((item: any) => ({
          chainId: item.chainId,
          daoName: item.daoName,
          daoAddress: item.daoAddress,
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
  }, [account])

  return {
    loading: loading,
    result
  }
}

export interface HomeListProp {
  daoName: string
  daoLogo: string
  daoAddress: string
  chainId: ChainId
  proposals: number
  activeProposals: number
  soonProposals: number
  members: number
  verified: boolean
  joinSwitch: boolean
}

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
  const [result, setResult] = useState<HomeListProp[]>([])
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
        const res = await getHomeDaoList(
          {
            account: account || '',
            category,
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
        setTotal(data.total)
        const list: HomeListProp[] = data.list.map((item: any) => ({
          daoName: item.daoName,
          daoLogo: item.daoLogo,
          daoAddress: item.daoAddress,
          chainId: item.chainId,
          proposals: item.totalProposals,
          activeProposals: item.activeProposals,
          soonProposals: item.soonProposals,
          members: item.members,
          verified: item.approve,
          joinSwitch: item.joinSwitch
        }))
        setResult(list)
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
        const res = await getHomeDaoList(
          {
            account: account || '',
            category,
            keyword
          },
          (currentPage - 1) * pageSize,
          pageSize
        )
        const data = res.data.data as any
        if (!data) {
          return
        }
        setTotal(data.total)
        const list: HomeListProp[] = data.list.map((item: any) => ({
          daoName: item.daoName,
          daoLogo: item.daoLogo,
          daoAddress: item.daoAddress,
          chainId: item.chainId,
          proposals: item.totalProposals,
          activeProposals: item.activeProposals,
          soonProposals: item.soonProposals,
          members: item.members,
          verified: item.approve,
          joinSwitch: item.joinSwitch
        }))
        setResult(list)
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

export function useIsJoined(chainId: ChainId, daoAddress: string) {
  const [loading, setLoading] = useState(false)
  const [isJoined, setIsJoined] = useState<string>()
  const userInfo = useUserInfo()

  useEffect(() => {
    ;(async () => {
      if (!userInfo?.loggedToken) {
        setIsJoined('')
        return
      }
      setLoading(true)
      try {
        const res = await checkIsJoin(chainId, daoAddress)
        if (res.data.code === 200) {
          setLoading(false)
          setIsJoined(res.data.data)
          return
        }
        throw new Error()
      } catch (error) {
        setLoading(false)
        setIsJoined('')
      }
    })()
  }, [chainId, daoAddress, userInfo])

  return {
    loading,
    isJoined
  }
}

export function useApplyMember() {
  const [loading, setLoading] = useState(false)
  const { account } = useActiveWeb3React()

  const joinApply = useCallback(
    async (role: string, chainId: ChainId, daoAddress: string, message: string) => {
      if (!account) {
        return
      }
      setLoading(true)
      try {
        const res = await jobsApply(role, chainId, daoAddress, message)
        if (res.data.data) {
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    },
    [account]
  )

  return {
    loading,
    joinApply
  }
}

export function useLogin() {
  // const { account } = useActiveWeb3React()
  // const [loading, setLoading] = useState(false)
  const [loginToken, setLoginToken] = useState('')
  const login = useCallback(async (account: string, signature: string) => {
    if (!account) {
      return
    }
    // setLoading(true)
    try {
      const res = await Login(account, signature)
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

export function useJobsApplyList(daoAddress: string, chainId: number) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<
    {
      account: string
      applyId: number
      applyRole: string
      applyTime: number
      avatar: string
      chainId: number
      daoAddress: string
      message: string
      nickname: string
    }[]
  >([])

  useEffect(() => {
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoAddress, chainId])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getApplyList((currentPage - 1) * pageSize, pageSize, chainId, daoAddress)
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        const list: {
          account: string
          applyId: number
          applyRole: string
          applyTime: number
          avatar: string
          chainId: number
          daoAddress: string
          message: string
          nickname: string
        }[] = data.map((item: any) => ({
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

export interface JobsListProps {
  account: string
  avatar: string
  chainId: ChainId
  daoAddress: string
  discord: string
  jobId: number
  jobs: string
  nickname: string
  opensea: string
  twitter: string
  youtobe: string
}

export function useJobsList(exceptLevel: string, daoAddress: string, chainId: number) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<JobsListProps[]>([])

  useEffect(() => {
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoAddress, chainId])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getJobsList(exceptLevel, (currentPage - 1) * pageSize, pageSize, chainId, daoAddress)
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        const list: JobsListProps[] = data.map((item: JobsListProps) => ({
          account: item.account,
          avatar: item.avatar,
          chainId: item.chainId,
          daoAddress: item.daoAddress,
          discord: item.discord,
          jobId: item.jobId,
          jobs: item.jobs,
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
  }, [chainId, currentPage, daoAddress, exceptLevel])

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
        const res = await getDaoInfo(account || undefined, daoAddress, chainId)
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

export function useDaoHandleQuery(handle: string) {
  const [available, setAvailable] = useState<boolean>()

  const queryHandleCallback = useCallback(
    async (account: string | undefined, chainId: number | undefined) => {
      if (!handle.trim() || !account || !chainId) {
        setAvailable(undefined)
        return
      }
      try {
        const res = await daoHandleQuery(handle.trim(), account, chainId)
        const data = res.data.data

        setAvailable(data.success || false)
      } catch (error) {
        setAvailable(undefined)
        console.error('useDaoHandleQuery', error)
      }
    },
    [handle]
  )

  return { available, queryHandleCallback }
}

export interface HomeOverviewProp {
  totalProposal: number
  totalApproveDao: number
  totalDao: number
  totalAccount: number
}

export function useHomeOverview(): HomeOverviewProp | undefined {
  const [overview, setOverview] = useState<any>()

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getHomeOverview()
        const data = res.data.data as any
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
