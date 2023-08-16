import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useGovernanceDaoContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { cancelProposal, commitErrorMsg, createProposal } from 'utils/fetch/server'

export enum SignType {
  CREATE_PROPOSAL,
  VOTE
}

export function useCancelProposalCallback() {
  return useCallback(async (proposalId: number | undefined) => {
    return await cancelProposal(proposalId)
  }, [])
}

export function useCreateProposalCallback() {
  return useCallback(
    async (
      content: string,
      daoId: number,
      endTime: number,
      introduction: string,
      isChain: boolean,
      options: string[],
      startTime: number,
      title: string,
      voteTokenId: number[],
      voteType: number
    ) => {
      return await createProposal(
        content,
        daoId,
        endTime,
        introduction,
        isChain,
        options,
        startTime,
        title,
        voteTokenId,
        voteType
      )
    },
    []
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
          if (err.code !== 4001 && err.code !== 'ACTION_REJECTED') {
            commitErrorMsg(
              'useProposalVoteCallback',
              JSON.stringify(
                err?.reason || err?.data?.message || err?.error?.message || err?.message || 'unknown error'
              ),
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
