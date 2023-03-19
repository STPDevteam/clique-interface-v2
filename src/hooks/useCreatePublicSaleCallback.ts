import { TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from 'hooks'
import { useCallback } from 'react'
import ReactGA from 'react-ga4'
import { useTransactionAdder } from 'state/transactions/hooks'
import { commitErrorMsg, toCreatePublicSale } from 'utils/fetch/server'
import { usePublicSaleContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'

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
      const method = 'CancelSale'
      console.log('hhhh', ...args)

      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)
      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Cancel a public sale`
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
          whiteList
        )
        if (!res.data.data) throw new Error(res.data.msg || 'Network error')

        result = res.data.data as any
      } catch (error) {
        console.error('createPublicSale', error)
        throw error
      }
      console.log(result)

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
      console.log('hhhh', ...args)

      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)
      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Create a public sale`
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
