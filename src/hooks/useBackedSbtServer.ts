import { useEffect, useState, useCallback, useMemo } from 'react'
// import { ChainId } from '../constants/chain'
import {
  createSbt,
  getMemberDaoList,
  commitErrorMsg,
  getSbtDetail,
  getSbtIsClaim,
  getSbtList,
  getSbtClaimList
} from '../utils/fetch/server'
import ReactGA from 'react-ga4'
import { useSbtFactoryContract, useSbtContract } from 'hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useGasPriceInfo } from './useGasPrice'
import { useSbtListPaginationCallback } from 'state/pagination/hooks'
import { useActiveWeb3React } from 'hooks'
import { useUserInfo } from 'state/userInfo/hooks'
import { ChainId } from 'constants/chain'

export enum ClaimWay {
  AnyOne = 'anyone',
  Joined = 'joined',
  WhiteList = 'whitelist'
}

export interface SbtListProp {
  SBTId: number
  daoId: number
  daoLogo: string
  daoName: string
  endTime: number
  fileUrl: string
  itemName: string
  startTime: number
  status: string
  symbol: string
  totalSupply: number
  tokenChainId: number
}

export interface SbtDetailProp {
  // chainId: ChainId
  // daoAddress: string
  daoId: number
  daoLogo: string
  daoName: string
  endTime: number
  fileUrl: string
  introduction: string
  itemName: string
  startTime: number
  status: string
  tokenAddress: string
  tokenChainId: number
  totalSupply: number
  way: string
}

export interface SbtClaimListProp {
  account: string
  accountLogo: string
}

export interface SbtIsClaimProp {
  canClaim: boolean
  isWhite: boolean
  signature: string
}

export function useSbtContractClaimTotal(address?: string, chainId?: ChainId) {
  const contract = useSbtContract(address, chainId)
  const totalRes = useSingleCallResult(contract, 'totalSupply', [], undefined, chainId)
  const capRes = useSingleCallResult(contract, 'cap', [], undefined, chainId)

  const total = useMemo(() => (totalRes.result?.[0] ? Number(totalRes.result?.[0]) : undefined), [totalRes.result])
  const cap = useMemo(() => (capRes.result?.[0] ? Number(capRes.result?.[0]) : undefined), [capRes.result])
  return {
    total,
    cap
  }
}

export function useCreateSbtCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useSbtFactoryContract()
  const gasPriceInfoCallback = useGasPriceInfo()

  const CreateSbtCallback = useCallback(
    async (
      daoId: number | undefined,
      account: string | undefined,
      fileUrl: string,
      itemName: string,
      startTime: number | undefined,
      tokenChainId: number | undefined,
      totalSupply: number | undefined,
      way: string,
      symbol: string,
      endTime: number | undefined,
      introduction?: string,
      accountList?: string[]
    ) => {
      if (!contract) throw new Error('none contract')
      let result: any = {}
      if (
        !daoId ||
        !account ||
        !fileUrl ||
        !introduction ||
        !itemName ||
        !startTime ||
        !tokenChainId ||
        !endTime ||
        !totalSupply ||
        !way
      )
        return

      try {
        const res = await createSbt(
          daoId,
          fileUrl,
          itemName,
          startTime,
          tokenChainId,
          totalSupply,
          way,
          symbol,
          endTime,
          introduction,
          accountList
        )
        if (!account) throw new Error('none account')
        if (!res.data.data) throw new Error(res.data.msg || 'Network error')
        result = res.data.data as any
      } catch (error) {
        console.error('createSBT', error)
        throw error
      }

      const args = [result.SBTId, totalSupply, itemName, symbol, result.tokenURI, result.signature]
      const method = 'createSBT'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)
      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Create SBT`,
            claim: { recipient: `${account}_create_sbt` }
          })
          return {
            hash: response.hash,
            sbtId: result.SBTId
          }
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'useCreateSBTCallback',
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
    [addTransaction, contract, gasPriceInfoCallback]
  )
  return { CreateSbtCallback }
}

export function useMemberDaoList(exceptLevel: string) {
  const [result, setResult] = useState<any[]>()
  useEffect(() => {
    ;(async () => {
      try {
        const res = await getMemberDaoList(exceptLevel)
        const data = res.data.data
        setResult(data)
      } catch (error) {
        console.log(error)
        setResult(undefined)
      }
    })()
  }, [exceptLevel])
  return {
    result
  }
}

export function useSbtClaimList(sbtId: number) {
  const offset = 0
  const limit = 32
  const [result, setResult] = useState<SbtClaimListProp[]>()
  const [total, setTotal] = useState<number>(0)
  useEffect(() => {
    ;(async () => {
      try {
        const res = await getSbtClaimList(offset, limit, sbtId)
        const data = res.data.data
        setResult(data)
        setTotal(res.data.total)
      } catch (error) {
        console.log(error)
        setResult(undefined)
      }
    })()
  }, [offset, limit, sbtId])

  return {
    result,
    total
  }
}

export function useSbtDetail(sbtId: string) {
  const { account } = useActiveWeb3React()
  const userSignature = useUserInfo()
  const contract = useSbtFactoryContract()
  const [loading, setLoading] = useState(true)
  const [contractQueryLoading, setContractQueryLoading] = useState(true)

  const [result, setResult] = useState<SbtDetailProp | null>()
  const whetherClaim = useSingleCallResult(
    contract,
    'minted',
    [account || undefined, Number(sbtId)],
    undefined,
    undefined
  ).result?.[0]
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getSbtDetail(Number(sbtId))
        const data = res.data.data
        setLoading(false)
        setResult(data)
      } catch (error) {
        console.log(error)
        setResult(undefined)
        setLoading(false)
      }
    })()
  }, [sbtId, userSignature])
  const contractQueryIsClaim = useMemo(() => {
    if (whetherClaim === undefined) {
      return ''
    }

    return whetherClaim
  }, [whetherClaim])
  useEffect(() => {
    if (whetherClaim === undefined) return
    setContractQueryLoading(false)
  }, [whetherClaim])
  return {
    result,
    loading,
    contractQueryLoading,
    contractQueryIsClaim
  }
}

export function useSbtClaim() {
  const contract = useSbtFactoryContract()
  const gasPriceInfoCallback = useGasPriceInfo()
  const addTransaction = useTransactionAdder()
  const { account } = useActiveWeb3React()

  const SbtClaimCallback = useCallback(
    async (sbtId: string) => {
      if (!contract) throw new Error('none contract')

      let result: any = {}
      if (!sbtId) return

      try {
        const res = await getSbtIsClaim(parseFloat(sbtId))
        result = res.data.data as any
        if (!result.signature) throw new Error('sbt signature is null')
      } catch (error) {
        console.error('ClaimSBT', error)
        throw error
      }
      const signature = result.signature
      const args = [parseFloat(sbtId), signature]
      const method = 'mintSBT'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)
      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Claim SBT`,
            claim: { recipient: `${account}_claim_sbt_${sbtId}` }
          })
          return {
            hash: response.hash
          }
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'useClaimSBTCallback',
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
    [account, addTransaction, contract, gasPriceInfoCallback]
  )
  return { SbtClaimCallback }
}

export function useSbtQueryIsClaim(sbtId: number) {
  const { account } = useActiveWeb3React()

  const userSignature = useUserInfo()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SbtIsClaimProp>()
  const [updateIsClaim, setUpdateIsClaim] = useState<boolean>(false)
  useEffect(() => {
    if (!userSignature || !account) return
    ;(async () => {
      setLoading(true)
      try {
        const res = await getSbtIsClaim(sbtId)
        if (!res.data.data) return
        setResult(res.data.data)
        setLoading(false)
      } catch (error) {
        console.error('SbtClaim', error)
        setLoading(false)
        throw error
      }
    })()
  }, [account, sbtId, userSignature, updateIsClaim])

  return { loading, result, setUpdateIsClaim }
}

export function useSbtList() {
  const {
    data: { chainId, status, currentPage, category },
    setCategory,
    setStatus,
    setChainId,
    setCurrentPage
  } = useSbtListPaginationCallback()
  const [firstLoadData, setFirstLoadData] = useState(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<SbtListProp[]>([])
  const [timeRefresh, setTimeRefresh] = useState(-1)
  const toTimeRefresh = () => setTimeout(() => setTimeRefresh(Math.random()), 15000)
  // useEffect(() => {
  //   if (firstLoadData) {
  //     setFirstLoadData(false)
  //     return
  //   }
  // setCurrentPage(1)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [chainId, status])

  useEffect(() => {
    ;(async () => {
      if (loading) return
      setLoading(true)
      try {
        const res = await getSbtList((currentPage - 1) * pageSize, pageSize, chainId, status)
        setLoading(false)
        const data = res.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        setResult(data.data)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('getSbtList', error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  useEffect(() => {
    ;(async () => {
      if (firstLoadData) {
        setFirstLoadData(false)
        return
      }
      setCurrentPage(1)
      setLoading(true)
      try {
        const res = await getSbtList(0, pageSize, chainId, status)
        setLoading(false)
        const data = res.data as any
        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        setResult(data.data)
      } catch (error) {
        setResult([])
        setTotal(0)
        setLoading(false)
        console.error('getSbtList', error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, chainId])

  useEffect(() => {
    ;(async () => {
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const res = await getSbtList((currentPage - 1) * pageSize, pageSize, chainId, status)

        const data = res.data as any
        if (!data) {
          return
        }
        setTotal(data.total)
        setResult(data.data)
        toTimeRefresh()
      } catch (error) {
        toTimeRefresh()
        console.error('getSbtList', error)
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
      setStatus,
      setChainId,
      setCategory,
      category,
      status,
      chainId
    },
    result
  }
}
