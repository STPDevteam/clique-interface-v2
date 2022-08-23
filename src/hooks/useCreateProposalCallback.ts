import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useGovernanceDaoContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg, saveProposalContent } from 'utils/fetch/server'

export enum SignType {
  CREATE_PROPOSAL,
  VOTE
}

export function useCreateProposalCallback(daoAddress: string) {
  const addTransaction = useTransactionAdder()
  const contract = useGovernanceDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (
      title: string,
      introduction: string,
      content: string,
      startTime: number,
      endTime: number,
      votingType: number,
      options: string[],
      extra: {
        chainId: number
        tokenAddress: string
        balance: string
        signType: number
      },
      signature: string
    ) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      let contentTag = ''
      if (content.trim()) {
        try {
          const contentRes = await saveProposalContent(content.trim())
          contentTag = contentRes.data.data.uuid
        } catch (error) {
          throw new Error('Upload failed, please try again.')
        }
      }

      const args = [
        title,
        introduction,
        contentTag,
        startTime,
        endTime,
        votingType,
        options,
        [extra.chainId, extra.tokenAddress, extra.balance, extra.signType],
        signature
      ]

      const method = 'createProposal'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Create a proposal`
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'useCreateProposalCallback',
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
