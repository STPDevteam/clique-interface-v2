import { useEffect, useState } from 'react'
import { currentTimeStamp, getTargetTimeString } from 'utils'
import { retry } from 'utils/retry'
import { ChainId } from '../constants/chain'
import { getProposalList, getProposalSnapshot, getProposalVotesList } from '../utils/fetch/server'
import { ProposalStatus } from './useProposalInfo'

export interface ProposalListBaseProp {
  daoChainId: ChainId
  daoAddress: string
  proposalId: number
  title: string
  contentV1: string
  startTime: number
  endTime: number
  proposer: string
  version: 'v1' | 'v2'
  status: ProposalStatus
  targetTimeString: string
}

function makeLIstData(daoChainId: ChainId, list: any): ProposalListBaseProp[] {
  const now = currentTimeStamp()
  return list.map((item: any) => {
    const startTime = item.startTime
    const endTime = item.endTime

    let _status: ProposalStatus = ProposalStatus.CLOSED
    if (now >= item.startTime && now <= item.endTime) {
      _status = ProposalStatus.OPEN
    } else if (now < item.startTime) {
      _status = ProposalStatus.SOON
    } else {
      _status = ProposalStatus.CLOSED
    }

    let targetTimeString = ''
    if (_status === ProposalStatus.SOON) {
      targetTimeString = getTargetTimeString(now, startTime)
    } else if (_status === ProposalStatus.OPEN) {
      targetTimeString = getTargetTimeString(now, endTime)
    } else {
      targetTimeString = 'Closed ' + getTargetTimeString(now, endTime)
    }

    return {
      proposalId: item.proposalId,
      daoChainId,
      version: item.version,
      title: item.title,
      daoAddress: item.daoAddress,
      contentV1: item.contentV1.replace(/^\[markdown\]/, ''),
      startTime: item.startTime,
      endTime: item.endTime,
      proposer: item.proposer,
      status: _status,
      targetTimeString
    }
  })
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
        setTotal(0)
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
        const list: ProposalListBaseProp[] = makeLIstData(daoChainId, data.list)
        setResult(list)
      } catch (error) {
        setResult([])
        setTotal(0)
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
        const list: ProposalListBaseProp[] = makeLIstData(daoChainId, data.list)
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

export function useProposalSnapshot(chainId: ChainId, daoAddress: string, proposalId: number) {
  const [snapshot, setSnapshot] = useState<number | string>()
  useEffect(() => {
    ;(async () => {
      const { promise } = retry(() => getProposalSnapshot(chainId, daoAddress, proposalId), {
        n: 100,
        minWait: 1000,
        maxWait: 2500
      })
      try {
        const returnData = await promise
        setSnapshot(returnData.data.data.snapshot)
      } catch (error) {
        setSnapshot(undefined)
      }
    })()
  }, [chainId, daoAddress, proposalId])

  return snapshot
}

export function useProposalVoteList(daoChainId: ChainId, daoAddress: string, proposalId: number) {
  const [currentPage, setCurrentPage] = useState(1)

  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 10
  const [result, setResult] = useState<{ optionIndex: number; voter: string; amount: string }[]>([])

  useEffect(() => {
    ;(async () => {
      if (!daoChainId || !daoAddress) {
        setResult([])
        setTotal(0)
        return
      }
      setLoading(true)
      try {
        const res = await getProposalVotesList(
          daoChainId,
          daoAddress,
          proposalId,
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
        const list = data.list.map((item: any) => ({
          optionIndex: item.optionIndex,
          voter: item.voter,
          amount: item.amount
        }))
        setResult(list)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('useProposalVoteList', error)
      }
    })()
  }, [currentPage, daoAddress, daoChainId, proposalId])

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
