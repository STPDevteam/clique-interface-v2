import { useEffect, useState } from 'react'
// import { currentTimeStamp, getTargetTimeString } from 'utils'
// import { retry } from 'utils/retry'
import { ChainId } from '../constants/chain'
import { getPublicSaleList } from '../utils/fetch/server'
import { ProposalStatus } from './useProposalInfo'

export interface PublicSaleListBaseProp {
  saleId: string | number
  offset: number
  count: number
  about: string
  chainId: ChainId
  creator: string
  endTime: string | number
  limitMax: string
  limitMin: string
  receiveToken: string
  saleAmount: string | number
  salePrice: string | number
  saleToken: string
  saleWay: string
  startTime: number | string
  whiteList: string[]
}

export function usePublicSaleBaseList(saleId?: ChainId) {
  const [status, setStatus] = useState<ProposalStatus>()
  const [currentPage, setCurrentPage] = useState(1)
  const [firstLoadData, setFirstLoadData] = useState(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 4
  const [result, setResult] = useState<PublicSaleListBaseProp[]>([])
  const [timeRefresh, setTimeRefresh] = useState(-1)
  const toTimeRefresh = () => setTimeout(() => setTimeRefresh(Math.random()), 15000)

  useEffect(() => {
    if (firstLoadData) {
      setFirstLoadData(false)
      return
    }
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  useEffect(() => {
    ;(async () => {
      if (!saleId) {
        setResult([])
        setTotal(0)
        return
      }
      setLoading(true)
      try {
        const res = await getPublicSaleList(saleId, (currentPage - 1) * pageSize, pageSize)
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        const list: PublicSaleListBaseProp[] = data.list
        setResult(list)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('getPublicSaleList', error)
      }
    })()
  }, [status, currentPage, saleId])

  useEffect(() => {
    ;(async () => {
      if (!saleId) {
        setResult([])
        setTotal(0)
        return
      }
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const res = await getPublicSaleList(saleId, (currentPage - 1) * pageSize, pageSize)
        const data = res.data.data as any
        if (!data) {
          return
        }
        setTotal(data.total)
        const list: PublicSaleListBaseProp[] = data.list
        setResult(list)
        toTimeRefresh()
      } catch (error) {
        toTimeRefresh()
        console.error('getProposalList', error)
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
      status,
      setStatus
    },
    result
  }
}
