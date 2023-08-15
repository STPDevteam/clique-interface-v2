import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useDaoFactoryContract, useGovernanceDaoContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg } from 'utils/fetch/server'

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
          if (err.code !== 4001 && err.code !== 'ACTION_REJECTED') {
            commitErrorMsg(
              'useSetDaoAdminCallback',
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
          if (err.code !== 4001 && err.code !== 'ACTION_REJECTED') {
            commitErrorMsg(
              'useSuperAdminTransferOwnershipCallback',
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

export function useAdminSetGovernanceCallback(daoAddress?: string) {
  const addTransaction = useTransactionAdder()
  const contract = useGovernanceDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (proposalThreshold: string, votingThreshold: string, votingPeriod: number, votingType: number) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      const args = [[proposalThreshold, votingThreshold, votingPeriod, votingType]]

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
          if (err.code !== 4001 && err.code !== 'ACTION_REJECTED') {
            commitErrorMsg(
              'useAdminSetGovernanceCallback',
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

export function useAdminSetInfoCallback(daoAddress?: string) {
  const addTransaction = useTransactionAdder()
  const contract = useGovernanceDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (
      daoName: string,
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
          if (err.code !== 4001 && err.code !== 'ACTION_REJECTED') {
            commitErrorMsg(
              'useAdminSetInfoCallback',
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

export function useUpgradeDaoCallback(daoAddress: string) {
  const addTransaction = useTransactionAdder()
  const contract = useDaoFactoryContract()
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(async () => {
    if (!account) throw new Error('none account')
    if (!contract) throw new Error('none contract')

    const args = [daoAddress]

    const method = 'upgradeProxy'
    const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

    return contract[method](...args, {
      gasPrice,
      gasLimit,
      from: account
    })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Upgrade',
          claim: { recipient: `${daoAddress}_upgrade` }
        })
        return response.hash
      })
      .catch((err: any) => {
        if (err.code !== 4001 && err.code !== 'ACTION_REJECTED') {
          commitErrorMsg(
            'useUpgradeDaoCallback',
            JSON.stringify(err?.reason || err?.data?.message || err?.error?.message || err?.message || 'unknown error'),
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
  }, [account, contract, daoAddress, gasPriceInfoCallback, addTransaction])
}
