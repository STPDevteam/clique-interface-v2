import { Token, TokenAmount } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { ActivityType } from 'pages/DaoInfo/Children/Activity'
import { useEffect, useMemo, useState } from 'react'
import { useActivityListPaginationCallback } from 'state/pagination/hooks'
import { ChainId } from '../constants/chain'
import { getActivityList, getAirdropProof } from '../utils/fetch/server'

export interface ActivityListProp {
  activityId: number
  amount: string
  chainId: ChainId
  creator: string
  daoAddress: string
  endTime: number
  price: string
  startTime: number
  title: string
  tokenAddress: string
  airdropNumber: number
  claimedPercentage: number
  publishTime: number
  types: ActivityType
}

function daoActivityListHandler(data: any) {
  return data.list.map((item: any) => ({
    activityId: item.activityId,
    amount: item.amount,
    chainId: item.chainId,
    creator: item.creator,
    daoAddress: item.daoAddress,
    endTime: item.endTime,
    price: item.price,
    startTime: item.startTime,
    title: item.title,
    tokenAddress: item.tokenAddress,
    airdropNumber: item.airdropNumber,
    claimedPercentage: item.claimedPercentage,
    publishTime: item.publishTime,
    types: item.types === ActivityType.AIRDROP ? ActivityType.AIRDROP : ActivityType.PUBLIC_SALE
  }))
}

export function useDaoActivityList(daoChainId: ChainId, daoAddress: string, activityType?: ActivityType) {
  const [currentPage, setCurrentPage] = useState(1)
  const status = 0

  const [firstLoadData, setFirstLoadData] = useState(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<ActivityListProp[]>([])
  const [timeRefresh, setTimeRefresh] = useState(-1)
  const toTimeRefresh = () => setTimeout(() => setTimeRefresh(Math.random()), 15000)

  useEffect(() => {
    if (firstLoadData) {
      setFirstLoadData(false)
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    ;(async () => {
      if (!daoChainId || !daoAddress) {
        setResult([])
        setTotal(0)
        return
      }
      setLoading(true)
      try {
        const res = await getActivityList(
          daoChainId,
          daoAddress,
          status,
          activityType === ActivityType.PUBLIC_SALE ? 'PublicSale' : activityType || '',
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
        const list: ActivityListProp[] = daoActivityListHandler(data)
        setResult(list)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('getActivityList', error)
      }
    })()
  }, [currentPage, daoAddress, daoChainId, activityType])

  useEffect(() => {
    ;(async () => {
      if (!daoChainId || !daoAddress) {
        setResult([])
        setTotal(0)
        return
      }
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const res = await getActivityList(
          daoChainId,
          daoAddress,
          status,
          activityType === ActivityType.PUBLIC_SALE ? 'PublicSale' : activityType || '',
          (currentPage - 1) * pageSize,
          pageSize
        )
        const data = res.data.data as any
        if (!data) {
          return
        }
        setTotal(data.total)
        const list: ActivityListProp[] = daoActivityListHandler(data)
        setResult(list)
        toTimeRefresh()
      } catch (error) {
        toTimeRefresh()
        console.error('getActivityList', error)
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
    result
  }
}

export function useActivityList() {
  const {
    data: { types, status, currentPage },
    setTypes,
    setStatus,
    setCurrentPage
  } = useActivityListPaginationCallback()

  const [firstLoadData, setFirstLoadData] = useState(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<ActivityListProp[]>([])
  const [timeRefresh, setTimeRefresh] = useState(-1)
  const toTimeRefresh = () => setTimeout(() => setTimeRefresh(Math.random()), 15000)

  useEffect(() => {
    if (firstLoadData) {
      setFirstLoadData(false)
      return
    }
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [types, status])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getActivityList(
          0,
          '',
          status,
          types === ActivityType.PUBLIC_SALE ? 'PublicSale' : types || '',
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
        const list: ActivityListProp[] = daoActivityListHandler(data)
        setResult(list)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('getActivityList', error)
      }
    })()
  }, [currentPage, status, types])

  useEffect(() => {
    ;(async () => {
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const res = await getActivityList(
          0,
          '',
          status,
          types === ActivityType.PUBLIC_SALE ? 'PublicSale' : types || '',
          (currentPage - 1) * pageSize,
          pageSize
        )
        const data = res.data.data as any
        if (!data) {
          return
        }
        setTotal(data.total)
        const list: ActivityListProp[] = daoActivityListHandler(data)
        setResult(list)
        toTimeRefresh()
      } catch (error) {
        toTimeRefresh()
        console.error('getActivityList', error)
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
      types,
      status,
      setStatus,
      setTypes
    },
    result
  }
}

export function useGetAirdropProof(activityId: number, token: Token | undefined) {
  const { account } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<{
    index: number
    proof: string[]
    amount: string
    airdropTotalAmount: string
    airdropNumber: number
    title: string
  }>()

  useEffect(() => {
    ;(async () => {
      if (!account) {
        setResult(undefined)
        return
      }
      setLoading(true)
      try {
        const res = await getAirdropProof(account, activityId)
        setLoading(false)
        const data = res.data.data

        setResult({
          index: data.index,
          proof: data.proof,
          amount: data.amount,
          airdropTotalAmount: data.airdropTotalAmount,
          airdropNumber: data.airdropNumber,
          title: data.title
        })
      } catch (error) {
        setResult(undefined)
        setLoading(false)
        console.error('useGetAirdropProof', error)
      }
    })()
  }, [account, activityId])

  const ret = useMemo(() => {
    if (!token || !result) return undefined
    return {
      index: result.index,
      proof: result.proof,
      amount: new TokenAmount(token, result.amount || '0'),
      airdropTotalAmount: new TokenAmount(token, result.airdropTotalAmount || '0'),
      airdropNumber: result.airdropNumber,
      title: result.title
    }
  }, [result, token])

  return {
    loading,
    result: ret
  }
}
