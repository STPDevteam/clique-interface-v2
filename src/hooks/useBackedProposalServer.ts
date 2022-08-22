import { useEffect, useState } from 'react'
import { ChainId } from '../constants/chain'
import { getProposalList } from '../utils/fetch/server'
import { ProposalStatus } from './useProposalInfo'

export interface ProposalListBaseProp {
  daoChainId: ChainId
  daoAddress: string
  proposalId: number
}

export function useProposalBaseList(daoChainId: ChainId, daoAddress: string) {
  const [status, setStatus] = useState<ProposalStatus>()
  const [currentPage, setCurrentPage] = useState(1)

  const [firstLoadData, setFirstLoadData] = useState(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 4
  const [result, setResult] = useState<ProposalListBaseProp[]>([])
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
      if (!daoChainId || !daoAddress) {
        setResult([])
        return
      }
      setLoading(true)
      try {
        const res = await getProposalList(daoChainId, daoAddress, status, (currentPage - 1) * pageSize, pageSize)
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        const list: ProposalListBaseProp[] = data.list.map((item: any) => ({
          proposalId: item.proposalId,
          daoChainId,
          daoAddress
        }))
        setResult(list)
      } catch (error) {
        setResult([])
        setLoading(false)
        console.error('getProposalList', error)
      }
    })()
  }, [status, currentPage, daoAddress, daoChainId])

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
        const res = await getProposalList(daoChainId, daoAddress, status, (currentPage - 1) * pageSize, pageSize)
        const data = res.data.data as any
        if (!data) {
          return
        }
        setTotal(data.total)
        const list: ProposalListBaseProp[] = data.list.map((item: any) => ({
          proposalId: item.proposalId,
          daoChainId,
          daoAddress
        }))
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
