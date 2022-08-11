import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useCreateTokenDataCallback } from 'state/createToken/hooks'
import { useActiveWeb3React } from '.'
import { useDaoFactoryContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg } from 'utils/fetch/server'
import { amountAddDecimals } from 'utils/dao'

export function useCreateTokenCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useDaoFactoryContract()
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()
  const {
    createTokenData: { distribution, basic },
    removeCreateTokenDataCallback
  } = useCreateTokenDataCallback()

  return useCallback(async () => {
    if (!account) throw new Error('none account')
    if (!contract) throw new Error('none contract')

    const args = [
      basic.tokenName.trim(),
      basic.tokenSymbol.trim(),
      basic.tokenPhoto.trim(),
      basic.tokenDecimals,
      amountAddDecimals(basic.tokenSupply, basic.tokenDecimals),
      distribution.map(({ address, tokenNumber, lockDate }) => [
        address,
        amountAddDecimals(tokenNumber, basic.tokenDecimals),
        lockDate
      ])
    ]

    const method = 'createERC20'
    const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

    return contract[method](...args, {
      gasPrice,
      gasLimit,
      from: account
    })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `Create a token`
        })
        removeCreateTokenDataCallback()
        return response.hash
      })
      .catch((err: any) => {
        if (err.code !== 4001) {
          commitErrorMsg(
            'useCreateTokenCallback',
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
  }, [account, contract, basic, distribution, gasPriceInfoCallback, addTransaction, removeCreateTokenDataCallback])
}
