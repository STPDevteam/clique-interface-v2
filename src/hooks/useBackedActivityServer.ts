import { Token, TokenAmount } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { ActivityType } from 'pages/DaoInfo/Children/Activity'
import { useEffect, useMemo, useState } from 'react'
import { useActivityListPaginationCallback } from 'state/pagination/hooks'
import { currentTimeStamp } from 'utils'
import { ChainId } from '../constants/chain'
import { getActivityList, getAirdropDescData, getAirdropProof, getAirdropAccountList } from '../utils/fetch/server'
import { ActivityStatus } from './useActivityInfo'

export interface ActivityListProp {
  activityId: number
  amount: string
  chainId: ChainId
  tokenChainId: ChainId
  creator: string
  daoAddress: string
  eventStartTime: number
  eventEndTime: number
  airdropStartTime: number
  airdropEndTime: number
  price: string
  title: string
  tokenAddress: string
  airdropNumber: number
  claimedPercentage: number
  publishTime: number
  types: ActivityType
  status: ActivityStatus
}

function daoActivityListHandler(data: any) {
  return data.list.map((item: any) => {
    const eventStartTime = item.startTime
    const eventEndTime = item.endTime
    const airdropStartTime = item.airdropStartTime
    const airdropEndTime = item.airdropEndTime
    const curTime = currentTimeStamp()
    const status =
      eventStartTime > curTime
        ? ActivityStatus.SOON
        : eventStartTime <= curTime && curTime <= eventEndTime
        ? ActivityStatus.OPEN
        : airdropStartTime > curTime
        ? ActivityStatus.ENDED
        : airdropStartTime <= curTime && curTime <= airdropEndTime
        ? ActivityStatus.AIRDROP
        : ActivityStatus.CLOSED
    return {
      activityId: item.activityId,
      amount: item.stakingAmount,
      chainId: item.chainId,
      tokenChainId: item.tokenChainId,
      creator: item.creator,
      daoAddress: item.daoAddress,
      eventStartTime,
      eventEndTime,
      airdropStartTime,
      airdropEndTime,
      price: item.price,
      title: item.title,
      tokenAddress: item.tokenAddress,
      airdropNumber: item.airdropNumber,
      claimedPercentage: item.claimedPercentage,
      publishTime: item.publishTime,
      status,
      types: item.types === ActivityType.AIRDROP ? ActivityType.AIRDROP : ActivityType.PUBLIC_SALE
    }
  })
}

export function useDaoActivityList(daoChainId: ChainId, daoAddress: string, activityType?: ActivityType) {
  const [currentPage, setCurrentPage] = useState(1)
  const status = ''

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

export function useGetAirdropProof(activityId: number | undefined, token: Token | undefined) {
  const { account } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<{
    index: number
    proof: string[]
    amount: string
  }>()

  useEffect(() => {
    ;(async () => {
      if (!account || !activityId) {
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
          amount: data.amount
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
      amount: new TokenAmount(token, result.amount || '0')
    }
  }, [result, token])

  return {
    loading,
    result: ret
  }
}

export interface AirdropDescDataProp {
  addressNum: number
  airdropEndTime: number
  airdropStartTime: number
  tokenChainId: number
  tokenAddress: string
  creator: string
  title: string
  description: string
  eventEndTime: number
  eventStartTime: number
  collectCount: number
  collect: { name: string; required: boolean }[]
  status: ActivityStatus
}

export function useGetAirdropDescData(activityId: number) {
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<AirdropDescDataProp>()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getAirdropDescData(activityId)
        setLoading(false)
        const data = res.data.data
        if (!data) return

        const eventStartTime = data.startTime
        const eventEndTime = data.endTime
        const airdropStartTime = data.airdropStartTime
        const airdropEndTime = data.airdropEndTime
        const curTime = currentTimeStamp()
        const status =
          eventStartTime > curTime
            ? ActivityStatus.SOON
            : eventStartTime <= curTime && curTime <= eventEndTime
            ? ActivityStatus.OPEN
            : airdropStartTime > curTime
            ? ActivityStatus.ENDED
            : airdropStartTime <= curTime && curTime <= airdropEndTime
            ? ActivityStatus.AIRDROP
            : ActivityStatus.CLOSED

        setResult({
          addressNum: data.addressNum,
          airdropEndTime,
          airdropStartTime,
          tokenChainId: data.tokenChainId,
          tokenAddress: data.tokenAddress,
          creator: data.creator,
          title: data.title,
          description: data.description,
          eventEndTime,
          eventStartTime,
          collectCount: data.collectCount,
          collect: data.collect,
          status
        })
      } catch (error) {
        setResult(undefined)
        setLoading(false)
        console.error('useGetAirdropDescData', error)
      }
    })()
  }, [activityId])

  return {
    loading,
    result
  }
}

export function useAirdropAccountListById(activityId: number, token: Token) {
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<{ address: string; amount: TokenAmount }[]>()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getAirdropAccountList(activityId)
        setLoading(false)
        const data = res.data.data
        if (!data) {
          setResult([])
          return
        }

        setResult(
          data.map((item: any) => ({
            address: item.address,
            amount: new TokenAmount(token, item.amount)
          }))
        )
      } catch (error) {
        setResult(undefined)
        setLoading(false)
        console.error('useAirdropAccountListById', error)
      }
    })()
  }, [activityId, token])

  return {
    loading,
    result
  }
}
