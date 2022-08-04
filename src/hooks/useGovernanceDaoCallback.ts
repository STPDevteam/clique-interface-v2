import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'
import { useActiveWeb3React } from '.'
import { useDaoFactoryContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg } from 'utils/fetch/server'
import { useToken } from 'state/wallet/hooks'
import { TokenAmount } from 'constants/token'

export function useCreateDaoCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useDaoFactoryContract()
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()
  const { buildingDaoData: data, removeBuildingDaoData } = useBuildingDaoDataCallback()
  const token = useToken(data.tokenAddress, data.baseChainId)

  return useCallback(async () => {
    if (!account) throw new Error('none account')
    if (!contract) throw new Error('none contract')
    if (!token) throw new Error('none token')

    const args = [
      [
        data.daoName.trim(),
        data.daoHandle.trim(),
        data.category.trim(),
        data.description.trim(),
        data.twitterLink.trim(),
        data.githubLink.trim(),
        data.discordLink.trim(),
        data.daoImage.trim()
      ],
      [data.baseChainId, data.tokenAddress],
      [
        new TokenAmount(token, data.createProposalMinimum).raw.toString(),
        new TokenAmount(token, data.executeMinimum).raw.toString(),
        data.defaultVotingPeriod,
        data.votingTypes
      ]
    ]

    const method = 'createDAO'
    const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

    return contract[method](...args, {
      gasPrice,
      gasLimit,
      from: account
    })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `Create Governance Dao`
        })
        removeBuildingDaoData()
        return response.hash
      })
      .catch((err: any) => {
        if (err.code !== 4001) {
          commitErrorMsg(
            'useCreateDaoCallback',
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
  }, [account, contract, token, data, gasPriceInfoCallback, addTransaction, removeBuildingDaoData])
}
