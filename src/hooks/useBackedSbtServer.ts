import { useEffect, useState, useCallback } from 'react'
import { ChainId } from '../constants/chain'
import {
  createSbt,
  getmemberDaoList,
  commitErrorMsg,
  getSbtDetail,
  getSbtClaim,
  getSbtList,
  getSbtClaimList
} from '../utils/fetch/server'
import ReactGA from 'react-ga4'
import { useCreateSbtContract } from 'hooks/useContract'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useGasPriceInfo } from './useGasPrice'

export function useCreateSbtCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useCreateSbtContract()
  const gasPriceInfoCallback = useGasPriceInfo()

  const CreateSbtCallback = useCallback(
    async (
      chainId: ChainId | undefined,
      account: string | undefined,
      daoAddress: string,
      fileUrl: string,
      itemName: string,
      startTime: number | undefined,
      tokenChainId: number | undefined,
      totalSupply: number | undefined,
      way: string,
      symbol: string,
      endTime: number | undefined,
      introduction?: string,
      accountlist?: string[]
    ) => {
      if (!contract) throw new Error('none contract')
      let result: any = {}
      if (
        !chainId ||
        !account ||
        !daoAddress ||
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
          chainId,
          daoAddress,
          fileUrl,
          itemName,
          startTime,
          tokenChainId,
          totalSupply,
          way,
          symbol,
          endTime,
          introduction,
          accountlist
        )
        if (!account) throw new Error('none account')
        if (!res.data.data) throw new Error(res.data.msg || 'Network error')
        result = res.data.data as any
      } catch (error) {
        console.error('Purchase', error)
        throw error
      }

      const args = [result.SBTId, itemName, symbol, result.tokenURI, result.signature]
      const method = 'createSBT'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)
      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Purchased a swap`,
            claim: { recipient: `${account}_purchase_swap_${result.SBTId}` }
          })
          return {
            hash: response.hash,
            sbtId: result.SBTId
          }
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'useCreatePublicSaleCallback',
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
  const [result, setResult] = useState<any>()
  useEffect(() => {
    ;(async () => {
      try {
        const res = await getmemberDaoList(exceptLevel)
        if (res.data.data) {
          setResult(res.data.data)
        }
      } catch (error) {
        console.log(error)
        setResult(null)
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
  const [result, setResult] = useState<any>()
  useEffect(() => {
    ;(async () => {
      try {
        const res = await getSbtClaimList(offset, limit, sbtId)
        if (res.data.data) {
          setResult(res.data.data)
        }
      } catch (error) {
        console.log(error)
        setResult(null)
      }
    })()
  }, [offset, limit, sbtId])

  return {
    result
  }
}

export function useSbtList(chainId?: ChainId, status?: string) {
  const offset = 0
  const limit = 8
  const [result, setResult] = useState<any>()
  useEffect(() => {
    ;(async () => {
      try {
        const res = await getSbtList(offset, limit, chainId, status)
        if (res.data.data) {
          setResult(res.data.data)
        }
      } catch (error) {
        console.log(error)
        setResult(null)
      }
    })()
  }, [offset, limit, chainId, status])

  return {
    result
  }
}

export function useSbtDetail(sbtId: string) {
  const [result, setResult] = useState<any>()
  useEffect(() => {
    ;(async () => {
      try {
        const res = await getSbtDetail(parseFloat(sbtId))
        if (res.data.data) {
          setResult(res.data.data)
        }
      } catch (error) {
        console.log(error)
        setResult(null)
      }
    })()
  }, [sbtId])

  return {
    result
  }
}

export function useSbtClaim() {
  const contract = useCreateSbtContract()
  const gasPriceInfoCallback = useGasPriceInfo()
  const addTransaction = useTransactionAdder()

  const SbtClaimCallback = useCallback(
    async (sbtId: string, account: string | undefined) => {
      if (!contract) throw new Error('none contract')

      let result: any = {}
      if (!sbtId) return

      try {
        const res = await getSbtClaim(parseFloat(sbtId))
        result = res.data.data as any
      } catch (error) {
        console.error('Purchase', error)
        throw error
      }
      const signature = '0x' + result.signature
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
            summary: `Purchased a swap`,
            claim: { recipient: `${account}_purchase_swap_${result.SBTId}` }
          })
          return {
            hash: response.hash
          }
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'useCreatePublicSaleCallback',
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
  return { SbtClaimCallback }
}

export function useSbtWhetherClaim() {
  const contract = useCreateSbtContract()
  const gasPriceInfoCallback = useGasPriceInfo()

  const SbtWhetherClaimCallback = useCallback(
    async (sbtId: string, account: string | undefined) => {
      if (!contract) throw new Error('none contract')
      if (!sbtId) return

      const args = [account, sbtId]
      const method = 'minted'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)
      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          return response
        })
        .catch((err: any) => {
          return err
        })
    },
    [contract, gasPriceInfoCallback]
  )
  return { SbtWhetherClaimCallback }
}
