import { ChainId } from 'constants/chain'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  applyReview,
  getJobsList,
  getSpaceId,
  createTask,
  getTaskList,
  updateTask,
  getProposalList,
  removeTask,
  getMembersCount
} from '../utils/fetch/server'
import { ProposalStatus } from './useProposalInfo'
import { currentTimeStamp, getTargetTimeString } from 'utils'

export interface SpaceInfoProp {
  access: string
  avatarCreator: string
  avatarLastEditBy: string
  chainId: number
  creator: string
  daoAddress: string
  lastEditBy: string
  lastEditTime: number
  nicknameCreator: string
  nicknameLastEditBy: string
  teamSpacesId: number
  title: string
  url: string
}

export function useGetMembersInfo(daoAddress: string, chainId: ChainId) {
  const [result, setResult] = useState<any>()

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getMembersCount(daoAddress, chainId)
        if (res.data.data) {
          setResult(res.data.data)
        }
      } catch (error) {
        console.log(error)
        setResult(null)
      }
    })()
  }, [chainId, daoAddress])

  return {
    result
  }
}

export function useSpacesInfo(chainId: ChainId, daoAddress: string) {
  const [result, setResult] = useState<SpaceInfoProp | null>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getSpaceId(chainId, daoAddress)
        if (res.data.data) {
          setLoading(false)
          setResult(res.data.data[0])
        }
      } catch (error) {
        console.log(error)
        setResult(null)
        setLoading(false)
      }
    })()
  }, [chainId, daoAddress])

  return {
    loading,
    result
  }
}

export function useRemoveTask() {
  return useCallback((spacesId: number, taskId: number[]) => {
    return removeTask(spacesId, taskId)
      .then(res => res)
      .catch(err => console.log(err))
  }, [])
}

export function useCreateTask() {
  return useCallback(
    (
      assignAccount: string,
      content: string,
      deadline: number | undefined,
      priority: string,
      proposalId: number,
      reward: string,
      spacesId: number,
      status: string,
      taskName: string
    ) => {
      return createTask(assignAccount, content, deadline, priority, proposalId, reward, spacesId, status, taskName)
        .then(res => res)
        .catch(err => console.log(err))
    },
    []
  )
}

export function useUpdateTask() {
  return useCallback(
    (
      assignAccount: string,
      content: string,
      deadline: number,
      priority: string,
      proposalId: number,
      reward: string,
      spacesId: number,
      status: string,
      taskId: number,
      taskName: string,
      weight: number
    ) => {
      return updateTask(
        assignAccount,
        content,
        deadline,
        priority,
        proposalId,
        reward,
        spacesId,
        status,
        taskId,
        taskName,
        weight
      )
        .then(res => res)
        .catch(err => console.log(err))
    },
    []
  )
}

export function useReviewApply() {
  return useCallback((chainId: ChainId, daoAddress: string, isPass: boolean, jobsApplyId: number) => {
    return applyReview(chainId, daoAddress, isPass, jobsApplyId)
      .then(res => res)
      .catch(err => console.log(err))
  }, [])
}

export interface ITaskItem {
  id?: number
  assignAccount: string
  assignAvatar: string
  assignNickname: string
  deadline: number
  priority: string
  proposalId: number
  reward: string
  spacesId: number
  status: string
  taskId: number
  taskName: string
  weight: number
}
export function useGetTaskList(
  spacesId: number | undefined,
  status: string | undefined,
  priority: string | undefined,
  refresh?: number
) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<ITaskItem[]>([])

  useEffect(() => {
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getTaskList((currentPage - 1) * pageSize, pageSize, spacesId, status, priority)
        setLoading(false)
        const data = res.data.data as any

        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        const list: ITaskItem[] = data.map((item: any) => ({
          assignAccount: item.assignAccount,
          assignAvatar: item.assignAvatar,
          assignNickname: item.assignNickname,
          deadline: item.deadline,
          priority: item.priority,
          proposalId: item.proposalId,
          reward: item.reward,
          spacesId: item.spacesId,
          status: item.status,
          taskId: item.taskId,
          taskName: item.taskName,
          weight: item.weight
        }))
        setResult(list)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('useGetTaskList', error)
      }
    })()
  }, [currentPage, priority, spacesId, status, refresh])

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

export interface ProposalListBaseProp {
  daoChainId: ChainId
  daoAddress: string
  daoAddressV1: string
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
      daoAddressV1: item.daoAddressV1,
      contentV1: item.contentV1.replace(/^\[markdown\]/, ''),
      startTime: item.startTime,
      endTime: item.endTime,
      proposer: item.proposer,
      status: _status,
      targetTimeString
    }
  })
}

export function useTaskProposalList(daoChainId: ChainId, daoAddress: string) {
  const [status, setStatus] = useState<ProposalStatus>()
  const [currentPage, setCurrentPage] = useState(1)
  const [firstLoadData, setFirstLoadData] = useState(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 20
  const [result, setResult] = useState<ProposalListBaseProp[]>([])

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

      try {
        const res = await getProposalList(daoChainId, daoAddress, status, (currentPage - 1) * pageSize, pageSize)
        const data = res.data.data as any
        if (!data) {
          return
        }
        setTotal(data.total)
        const list: ProposalListBaseProp[] = makeLIstData(daoChainId, data.list)
        setResult(list)
      } catch (error) {
        console.error('getProposalList', error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

export function useJobsList(exceptLevel: string, daoAddress: string, chainId: number) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<
    {
      account: string
      avatar: string
      chainId: ChainId
      daoAddress: string
      discord: string
      jobId: number
      nickname: string
      opensea: string
      twitter: string
      youtobe: string
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
        const res = await getJobsList(exceptLevel, (currentPage - 1) * pageSize, pageSize, chainId, daoAddress)

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
          avatar: string
          chainId: ChainId
          daoAddress: string
          discord: string
          jobId: number
          nickname: string
          opensea: string
          twitter: string
          youtobe: string
        }[] = data.map((item: any) => ({
          account: item.account,
          avatar: item.avatar,
          chainId: item.chainId,
          daoAddress: item.daoAddress,
          discord: item.discord,
          jobId: item.jobId,
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
