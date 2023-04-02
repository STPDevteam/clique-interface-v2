import { TransactionResponse } from '@ethersproject/providers'
import { ChainId } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useMemo } from 'react'
import ReactGA from 'react-ga4'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { commitErrorMsg, toCreatePublicSale, toPurchase } from 'utils/fetch/server'
import { usePublicSaleContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'

export enum SwapStatus {
  SOON = 'soon',
  OPEN = 'normal',
  ENDED = 'ended',
  CANCEL = 'cancel'
}

export interface SalesInfoProp {
  creator: string
  saleToken: string
  saleAmount: string
  receiveToken: string
  pricePer: string
  limitMin: string
  limitMax: string
  startTime: number
  endTime: number
  soldAmount: string
  isCancel: boolean
}

export interface SoldAmountProp {
  amount: string
}

export function usePurchaseCallback() {
  const addTransaction = useTransactionAdder()
  const contract = usePublicSaleContract()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (account: string, buyAmount: string, saleId: number, isEth?: boolean, ethValue?: string) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      let result: any = {}

      try {
        const res = await toPurchase(account, buyAmount, saleId)
        if (!res.data.data) throw new Error(res.data.msg || 'Network error')
        result = res.data.data as any
      } catch (error) {
        console.error('Purchase', error)
        throw error
      }
      const args = [saleId, buyAmount, result.signature]
      const method = 'Purchase'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args, isEth ? ethValue : undefined)
      return contract[method](...args, {
        gasPrice,
        gasLimit,
        // gasLimit: '3500000',
        from: account,
        value: isEth ? ethValue : undefined
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Purchased a swap`,
            claim: { recipient: `${account}_purchase_swap_${saleId}` }
          })
          return response.hash
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
}

export function useGetSalesInfo(saleId: string, saleChainId?: ChainId): SalesInfoProp | undefined {
  const contract = usePublicSaleContract(saleChainId)
  const salesRes = useSingleCallResult(saleChainId ? contract : null, 'sales', [saleId], undefined, saleChainId).result

  return useMemo(() => {
    if (!salesRes) return undefined
    return {
      creator: salesRes.creator,
      saleToken: salesRes.saleToken.toString(),
      saleAmount: salesRes.saleAmount.toString(),
      receiveToken: salesRes.receiveToken,
      pricePer: salesRes.pricePer.toString(),
      limitMin: salesRes.limitMin.toString(),
      limitMax: salesRes.limitMax.toString(),
      startTime: Number(salesRes.startTime.toString()),
      endTime: Number(salesRes.endTime.toString()),
      soldAmount: salesRes.soldAmount.toString(),
      isCancel: salesRes.isCancel
    }
  }, [salesRes])
}

export function useGetSoldAmount(saleId: string, account: string, saleChainId?: ChainId): SoldAmountProp | undefined {
  const contract = usePublicSaleContract(saleChainId)
  const res = useSingleCallResult(
    saleChainId ? contract : null,
    'querySoldAmount',
    [saleId, account || undefined],
    undefined,
    saleChainId
  ).result

  return useMemo(() => {
    if (!res) return undefined
    return {
      amount: res?.[0]
    }
  }, [res])
}

export function useCancelSaleCallback() {
  const contract = usePublicSaleContract()
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (saleId: string) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      const args = [saleId]
      const method = 'Cancel'

      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)
      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Cancel a swap`,
            claim: { recipient: `${account}_claim_balance_${saleId}` }
          })
          return response.hash
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
    [account, addTransaction, contract, gasPriceInfoCallback]
  )
}

export function useCreatePublicSaleCallback() {
  const addTransaction = useTransactionAdder()
  const contract = usePublicSaleContract()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (
      about: string,
      chainId: number,
      account: string | undefined,
      endTime: string | number,
      maxPurchase: string,
      minPurchase: string,
      receiveToken: string,
      salesAmount: string | number,
      salePrice: string | number,
      currentSaleToken: string,
      saleMode,
      startTime: number | string,
      title: string,
      whiteList: string[]
    ) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      let result: any = {}
      try {
        const res = await toCreatePublicSale(
          about,
          chainId,
          account,
          endTime,
          maxPurchase,
          minPurchase,
          receiveToken,
          salesAmount,
          salePrice,
          currentSaleToken,
          saleMode,
          startTime,
          title,
          whiteList
        )
        if (!res.data.data) throw new Error(res.data.msg || 'Network error')

        result = res.data.data as any
      } catch (error) {
        console.error('createPublicSale', error)
        throw error
      }

      const args = [
        result.saleId,
        currentSaleToken,
        salesAmount,
        receiveToken,
        salePrice,
        minPurchase,
        maxPurchase,
        startTime,
        endTime,
        result.signature
      ]
      const method = 'CreateSale'

      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)
      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Create a swap`
          })
          return response.hash
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
}
