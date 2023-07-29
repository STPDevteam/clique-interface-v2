import { useCallback, useEffect, useMemo, useState } from 'react'
import { currentTimeStamp, getTargetTimeString } from 'utils'
import { retry } from 'utils/retry'
import { ChainId } from '../constants/chain'
import {
  addGovToken,
  commitErrorMsg,
  deleteGovToken,
  getProposalDetail,
  getProposalList,
  getProposalSnapshot,
  getProposalVotesList,
  toVote
} from '../utils/fetch/server'
import { ProposalStatus } from './useProposalInfo'
// import { useActiveWeb3React } from 'hooks'
import { govList } from 'state/buildingGovDao/actions'
import { useProposalContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { TransactionResponse } from '@ethersproject/providers'
import ReactGA from 'react-ga4'
import { toast } from 'react-toastify'
import { useUserInfo } from 'state/userInfo/hooks'

export interface ProposalListBaseProp {
  v1V2ChainId: ChainId
  daoAddress: string
  v1V2DaoAddress: string
  v1V2ProposalNum: number
  proposalId: number
  proposalSIP: number
  introduction: string
  votes: number
  title: string
  contentV1: string
  startTime: number
  endTime: number
  proposer: {
    account: string
    avatar: string
    nickname: string
  }
  version: 'v1' | 'v2' | 'v3'
  status: ProposalStatus
  isPass: string
  targetTimeString: string
}

export enum CreateType {
  GASLESS = 'Gasless voting',
  ONCHAIN = 'Onchain voting'
}

export enum VoteStatus {
  PENDING = 'Pending',
  SUCCESS = 'Success'
}

function makeLIstData(data: any): ProposalListBaseProp[] {
  const now = currentTimeStamp()
  return data.map((item: any) => {
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
    if (item.status === 'Cancel') _status = ProposalStatus.CANCEL

    let targetTimeString = ''
    if (_status === ProposalStatus.SOON) {
      targetTimeString = getTargetTimeString(now, startTime)
    } else if (_status === ProposalStatus.OPEN) {
      targetTimeString = getTargetTimeString(now, endTime)
    } else {
      targetTimeString = 'Closed ' + getTargetTimeString(now, endTime)
    }
    if (_status === ProposalStatus.CANCEL) targetTimeString = 'User Cancelled'

    return {
      proposalId: item.proposalId,
      proposalSIP: item.proposalSIP,
      v1V2ChainId: item.v1V2ChainId,
      v1V2ProposalNum: item.v1V2ProposalNum,
      version: item.version,
      title: item.title,
      votes: item.votes,
      v1V2DaoAddress: item.v1V2DaoAddress,
      startTime: startTime,
      endTime: endTime,
      proposer: item.proposer,
      introduction: item.introduction,
      status: _status,
      isPass: item.status,
      targetTimeString
    }
  })
}

export function useProposalBaseList(daoId: number) {
  const [status, setStatus] = useState<string>('')
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
      if (!daoId) {
        setResult([])
        setTotal(0)
        return
      }
      setLoading(true)
      try {
        const res = await getProposalList(daoId, status, (currentPage - 1) * pageSize, pageSize)
        setLoading(false)
        const data = res.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        const list: ProposalListBaseProp[] = makeLIstData(data.data)
        setResult(list)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('getProposalList', error)
      }
    })()
  }, [status, currentPage, daoId])

  useEffect(() => {
    ;(async () => {
      if (!daoId) {
        setResult([])
        setTotal(0)
        return
      }
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const res = await getProposalList(daoId, status, (currentPage - 1) * pageSize, pageSize)
        const data = res.data as any
        if (!data) {
          return
        }
        setTotal(data.total)
        const list: ProposalListBaseProp[] = makeLIstData(data.data)
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

export interface ProposalDetailInfoOptionProps {
  optionContent: string
  optionId: number
  optionIndex: number
  votes: number
}
export interface useProposalDetailInfoProps {
  alreadyVoted: number
  content: string
  endTime: number
  introduction: string
  isChain: boolean
  options: ProposalDetailInfoOptionProps[]
  proposalId: number
  proposalSIP: number
  proposer: {
    account: string
    avatar: string
    daoJobs: string
    nickname: string
  }
  startTime: number
  status: string
  title: string
  useVoteBase: govList[]
  votingType: number
  proposalThreshold: number
  yourVotes: number
}

export interface VoteParamsProp {
  optionId: number
  votes: number
}

export function useProposalVoteCallback() {
  return useCallback(async (voteParams: VoteParamsProp[]) => {
    return toVote(voteParams)
      .then(res => res)
      .catch(err => err)
  }, [])
}

export function useUpChainProposalVoteCallback(callback?: () => void) {
  const { account } = useActiveWeb3React()
  const contract = useProposalContract()
  const gasPriceInfoCallback = useGasPriceInfo()
  const addTransaction = useTransactionAdder()
  const [result, setResult] = useState<any>()
  const upChainProposalCallBack = useCallback(
    async (
      voteParams: VoteParamsProp[],
      proposalId: number,
      optionIds: number[],
      amounts: number[],
      isVoted: boolean
    ) => {
      if (!isVoted) {
        toVote(voteParams)
          .then(res => {
            setResult(res)
          })
          .catch(err => err)
      }
      if (result && result.data.code !== 200 && !isVoted) return toast.error(result.data.msg || 'Vote error')

      callback && callback()

      if (!contract) throw new Error('none contract')
      const args = [proposalId, optionIds, amounts]
      const method = 'voting'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          console.log(`${account}_Chain_proposal${proposalId}`)

          addTransaction(response, {
            summary: `Create on chain proposal`,
            claim: { recipient: `${account}_Chain_proposal${proposalId}` }
          })
          return {
            hash: response.hash
          }
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'upChainProposal',
              JSON.stringify(err?.data?.message || err?.error?.message || err?.message || 'unknown error'),
              method,
              JSON.stringify(args)
            )
            ReactGA.event({
              category: `catch-${method}`,
              action: `${err?.error.message || ''} ${err?.message || ''} ${err?.data?.message || ''}`,
              label: JSON.stringify(args)
            })
          }
          throw err
        })
    },
    [account, addTransaction, callback, contract, gasPriceInfoCallback, result]
  )
  return { upChainProposalCallBack, result }
}

export function useDeleteGovToken() {
  return useCallback(async (voteTokenId: number) => {
    return deleteGovToken(voteTokenId)
      .then(res => res)
      .catch(err => err)
  }, [])
}

export function useAddGovToken() {
  return useCallback(
    async (
      chainId: number,
      createRequire: string,
      daoId: number,
      decimals: number,
      symbol: string,
      tokenAddress: string,
      tokenLogo: string,
      tokenName: string,
      tokenType: string,
      totalSupply: string,
      votesWeight: number
    ) => {
      return addGovToken(
        chainId,
        createRequire,
        daoId,
        decimals,
        symbol,
        tokenAddress,
        tokenLogo,
        tokenName,
        tokenType,
        totalSupply,
        votesWeight
      )
        .then(res => res)
        .catch(err => err)
    },
    []
  )
}

export function useProposalDetailsInfo(proposalId: number, refresh: number) {
  const userSignature = useUserInfo()
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<useProposalDetailInfoProps>()

  useEffect(() => {
    ;(async () => {
      if (!proposalId) {
        setResult(undefined)
        return
      }
      setLoading(true)
      try {
        const res = await getProposalDetail(proposalId)
        setLoading(false)
        const data = res.data.data as any
        setResult(data)
      } catch (error) {
        setResult(undefined)
        setLoading(false)
        console.error('useGetProposalDetail', error)
      }
    })()
  }, [proposalId, refresh, userSignature])

  const ret = useMemo(() => {
    if (!result) return undefined
    return result
  }, [result])

  return {
    loading,
    result: ret
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

export function useProposalVoteList(proposalId: number, status?: string, getAll?: boolean) {
  const { account } = useActiveWeb3React()
  const userSignature = useUserInfo()

  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 10
  const [result, setResult] = useState<
    { optionContent: string; voter: string; votes: number; status: string; optionId: number }[]
  >([])
  const [upDate, setUpDateVoteList] = useState<number>(0)

  useEffect(() => {
    ;(async () => {
      if (!proposalId) return
      setLoading(true)
      try {
        const res = await getProposalVotesList(
          proposalId,
          (currentPage - 1) * pageSize,
          pageSize,
          status || undefined,
          getAll ? undefined : account
        )
        setLoading(false)
        const data = res.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        const list = data.data.map((item: any) => ({
          optionContent: item.optionContent,
          voter: item.voter,
          votes: item.votes,
          status: item.status,
          optionId: item.optionId
        }))
        setResult(list)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('useProposalVoteList', error)
      }
    })()
  }, [account, currentPage, getAll, proposalId, status, upDate, userSignature])

  return {
    loading: loading,
    setUpDateVoteList,
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
