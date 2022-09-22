import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'
import { useActiveWeb3React } from '.'
import { useDaoFactoryContract, useGovernanceDaoContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg, daoHandleMakeSign } from 'utils/fetch/server'
import { useToken } from 'state/wallet/hooks'
import { amountAddDecimals } from 'utils/dao'

export function useCreateDaoCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useDaoFactoryContract()
  const { account, chainId } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()
  const { buildingDaoData: data, removeBuildingDaoData } = useBuildingDaoDataCallback()
  const token = useToken(data.tokenAddress, data.baseChainId)

  return useCallback(async () => {
    if (!account) throw new Error('none account')
    if (!contract) throw new Error('none contract')
    if (!token) throw new Error('none token')
    if (!chainId) throw new Error('none chainId')

    let daoHandleSign: any = {}
    try {
      const daoHandleSignRes = await daoHandleMakeSign(data.daoHandle.trim(), account, chainId)
      if (!daoHandleSignRes.data.data?.signature) {
        throw new Error('Handle is used, please change the DAO Handle on Clique.')
      }
      daoHandleSign = daoHandleSignRes.data.data
    } catch (error) {
      throw new Error('Handle is used, please change the DAO Handle on Clique.')
    }

    const args = [
      [
        data.daoName.trim(),
        data.daoHandle.trim(),
        data.category.trim(),
        data.description.trim(),
        data.twitterLink.trim(),
        data.githubLink.trim(),
        data.discordLink.trim(),
        data.daoImage.trim(),
        data.websiteLink.trim()
      ],
      [data.baseChainId, data.tokenAddress],
      [
        amountAddDecimals(data.createProposalMinimum),
        amountAddDecimals(data.executeMinimum),
        data.defaultVotingPeriod,
        data.votingTypes
      ],
      daoHandleSign.lockBlockNum,
      daoHandleSign.signature
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
  }, [account, contract, token, chainId, data, gasPriceInfoCallback, addTransaction, removeBuildingDaoData])
}

export function useSetDaoAdminCallback(daoAddress: string) {
  const addTransaction = useTransactionAdder()
  const contract = useGovernanceDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (address: string, isAdd: boolean) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      const args = [address, isAdd]

      const method = 'setAdmin'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: isAdd ? 'Set DAO admin' : 'Remove DAO admin',
            claim: { recipient: `${contract.address}_setAdmin_${address}` }
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'useSetDaoAdminCallback',
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

export function useSuperAdminTransferOwnershipCallback(daoAddress: string) {
  const addTransaction = useTransactionAdder()
  const contract = useGovernanceDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (address: string) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      const args = [address]

      const method = 'transferOwnership'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Transfer super admin',
            claim: { recipient: `${contract.address}_transferOwnership` }
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'useSuperAdminTransferOwnershipCallback',
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

export function useAdminSetGovernanceCallback(daoAddress?: string) {
  const addTransaction = useTransactionAdder()
  const contract = useGovernanceDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (proposalThreshold: string, votingQuorum: string, votingPeriod: number, votingType: number) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      const args = [[proposalThreshold, votingQuorum, votingPeriod, votingType]]

      const method = 'setGovernance'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Update governance setting',
            claim: { recipient: `${contract.address}_UpdateGovernanceSetting` }
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'useAdminSetGovernanceCallback',
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

export function useAdminSetInfoCallback(daoAddress?: string) {
  const addTransaction = useTransactionAdder()
  const contract = useGovernanceDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (
      daoName: string,
      daoHandle: string,
      category: string,
      description: string,
      twitterLink: string,
      githubLink: string,
      discordLink: string,
      daoImage: string,
      website: string
    ) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      const args = [
        [
          daoName.trim(),
          daoHandle.trim(),
          category.trim(),
          description.trim(),
          twitterLink.trim(),
          githubLink.trim(),
          discordLink.trim(),
          daoImage.trim(),
          website.trim()
        ]
      ]

      const method = 'setInfo'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Update general setting',
            claim: { recipient: `${contract.address}_UpdateGeneralSetting` }
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'useAdminSetInfoCallback',
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
