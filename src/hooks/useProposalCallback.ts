import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useGovernanceDaoContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg, createProposal } from 'utils/fetch/server'

export enum SignType {
  CREATE_PROPOSAL,
  VOTE
}

export function useCreateProposalCallback() {
  return useCallback(
    async (
      content: string,
      daoId: number,
      endTime: number,
      introduction: string,
      options: string[],
      startTime: number,
      title: string,
      voteTokenId: number[],
      voteType: number
    ) => {
      return createProposal(content, daoId, endTime, introduction, options, startTime, title, voteTokenId, voteType)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    },
    []
  )
}

export function useCancelProposalCallback(daoAddress: string) {
  const addTransaction = useTransactionAdder()
  const contract = useGovernanceDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (proposalId: number) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      const args = [proposalId]

      const method = 'cancelProposal'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Cancel proposal',
            claim: { recipient: `${contract.address}_cancelProposal` }
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'useCancelProposalCallback',
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

export function useProposalVoteCallback(daoAddress: string) {
  const addTransaction = useTransactionAdder()
  const contract = useGovernanceDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (
      proposalId: number,
      index: number[],
      amount: string[],
      extra: {
        chainId: number
        tokenAddress: string
        balance: string
        signType: number
      }
    ) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      const args = [index, amount, [extra.chainId, extra.tokenAddress, extra.balance, extra.signType, proposalId]]

      const method = 'vote'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Proposal vote',
            claim: { recipient: `${account}_proposalVote` }
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'useProposalVoteCallback',
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
