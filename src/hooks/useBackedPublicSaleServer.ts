import { useEffect, useState } from 'react'
// import { currentTimeStamp, getTargetTimeString } from 'utils'
// import { retry } from 'utils/retry'
import { ChainId } from '../constants/chain'
import { getPublicSaleList, getTransactionList } from '../utils/fetch/server'
import { ProposalStatus } from './useProposalInfo'

export interface PublicSaleListBaseProp {
  about: string
  chainId: ChainId
  creator: string
  endTime: string | number
  limitMax: string
  limitMin: string
  originalDiscount: string
  receiveToken: string
  receiveTokenImg: string
  saleAmount: string | number
  saleToken: string
  saleTokenImg: string
  salePrice: string | number
  saleId: string
  startTime: number | string
  status: string
}

export interface transactionListProp {
  buyTokenName: string
  buyAmount: string
  buyer: string
  payAmount: string
  payTokenName: string
  saleId: string
  time: string
}

export function usePublicSaleTransactionList(saleId: string) {
  const [status, setStatus] = useState<ProposalStatus>()
  const [currentPage, setCurrentPage] = useState(1)
  const [firstLoadData, setFirstLoadData] = useState(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 4
  const [result, setResult] = useState<transactionListProp[]>([])
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
      try {
        setLoading(true)
        const res = await getTransactionList(saleId, (currentPage - 1) * pageSize, pageSize)
        setLoading(false)
        const data = res.data.data as any
        console.log(data)

        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        const list: transactionListProp[] = data.list
        setResult(list)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('getTransactionList', error)
      }
    })()
  }, [status, currentPage, saleId])

  useEffect(() => {
    ;(async () => {
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const res = await getTransactionList(saleId, (currentPage - 1) * pageSize, pageSize)
        const data = res.data.data as any
        if (!data) {
          return
        }
        setTotal(data.total)
        const list: transactionListProp[] = data.list
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
    ListLoading: loading,
    listPage: {
      setCurrentPage,
      currentPage,
      total,
      totalPage: Math.ceil(total / pageSize),
      pageSize
    },
    lestSearch: {
      status,
      setStatus
    },
    listRes: result
  }
}

export function usePublicSaleBaseList(saleId?: string) {
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
      try {
        setLoading(true)
        const res = await getPublicSaleList(saleId, (currentPage - 1) * pageSize, pageSize)
        setLoading(false)
        const data = res.data.data as any
        console.log(data)

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
