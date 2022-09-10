import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useGovernanceDaoContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg, saveAirdropAddress } from 'utils/fetch/server'

export function useCreateAirdropCallback(daoAddress: string) {
  const addTransaction = useTransactionAdder()
  const contract = useGovernanceDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (
      title: string,
      tokenAddress: string,
      amount: string,
      merkleRoot: string,
      startTime: number,
      endTime: number,
      addressAndAmount: {
        address: string
        amountRaw: string
      }[]
    ) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      let airdropId = 0
      try {
        const res = await saveAirdropAddress(
          addressAndAmount.map(item => item.address),
          addressAndAmount.map(item => item.amountRaw),
          title
        )
        airdropId = res.data.data.airdropIdId
      } catch (error) {
        throw new Error('Save failed, please try again.')
      }

      const args = [airdropId, tokenAddress, amount, merkleRoot, startTime, endTime]

      const method = 'createAirdrop'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Create a airdrop`
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'useCreateAirdropCallback',
              JSON.stringify(err?.data?.message || err?.error?.message || err?.message || 'unknown error'),
              method,
              JSON.stringify(args)
            )
            ReactGA.event({
              category: `catch-${method}`,
              action: `${err?.error?.message || ''} ${err?.message || ''} ${err?.data?.message || ''}`,
              label: JSON.stringify(args)
            })
          }
          throw err
        })
    },
    [account, contract, gasPriceInfoCallback, addTransaction]
  )
}

export function useClaimAirdropCallback(daoAddress: string) {
  const addTransaction = useTransactionAdder()
  const contract = useGovernanceDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (airdropId: number, index: number, amountRaw: string, merkleProof: string[]) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      const args = [airdropId, index, account, amountRaw, merkleProof]

      const method = 'claimAirdrop'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Claim a airdrop`,
            claim: { recipient: `claim_airdrop_${airdropId}` }
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'useClaimAirdropCallback',
              JSON.stringify(err?.data?.message || err?.error?.message || err?.message || 'unknown error'),
              method,
              JSON.stringify(args)
            )
            ReactGA.event({
              category: `catch-${method}`,
              action: `${err?.error?.message || ''} ${err?.message || ''} ${err?.data?.message || ''}`,
              label: JSON.stringify(args)
            })
          }
          throw err
        })
    },
    [account, contract, gasPriceInfoCallback, addTransaction]
  )
}

export function useRecycleAirdropCallback(daoAddress: string) {
  const addTransaction = useTransactionAdder()
  const contract = useGovernanceDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (airdropId: number) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      const args = [airdropId]

      const method = 'recycleAirdrop'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Recycle a airdrop`,
            claim: { recipient: `recycle_airdrop_${airdropId}` }
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'useRecycleAirdropCallback',
              JSON.stringify(err?.data?.message || err?.error?.message || err?.message || 'unknown error'),
              method,
              JSON.stringify(args)
            )
            ReactGA.event({
              category: `catch-${method}`,
              action: `${err?.error?.message || ''} ${err?.message || ''} ${err?.data?.message || ''}`,
              label: JSON.stringify(args)
            })
          }
          throw err
        })
    },
    [account, contract, gasPriceInfoCallback, addTransaction]
  )
}
