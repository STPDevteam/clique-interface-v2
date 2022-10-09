import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useAirdropContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { airdropDownloadUserCollect, commitErrorMsg, createAirdropOne, saveAirdropAddress } from 'utils/fetch/server'
import { ZERO_ADDRESS } from '../constants'
import { useWeb3Instance } from './useWeb3Instance'
import { currentTimeStamp } from 'utils'
import { CurrencyAmount, Token } from 'constants/token'
import { tryParseAmount } from 'utils/parseAmount'
// import { getMerkleTreeRootHash } from 'utils/merkletreejs'
import JSBI from 'jsbi'

// const makeMerkleTreeList = (arr: { address: string; amountHexRaw: string }[]) => {
//   return arr.map(({ address, amountHexRaw }, index) => {
//     return (
//       '0x' +
//       index.toString(16).padStart(64, '0') +
//       address.replace('0x', '').toLowerCase() +
//       amountHexRaw.padStart(64, '0')
//     )
//   })
// }

export function useAirdropSignature() {
  const web3 = useWeb3Instance()
  const { account } = useActiveWeb3React()

  const sign = useCallback(
    (makeMessage: string) => {
      if (!account || !web3) return
      return web3.eth.personal.sign(makeMessage, account, '')
    },
    [account, web3]
  )
  const makeMessage = useCallback((type: 'airdrop1' | 'airdrop2' | 'airdropDownload') => {
    const timeStamp = currentTimeStamp() + 300
    return JSON.stringify({ expired: timeStamp, type })
  }, [])

  return { sign, makeMessage }
}

export function useCreateAirdropONECallback() {
  const addTransaction = useTransactionAdder()
  const contract = useAirdropContract()
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()
  const airdropSignature = useAirdropSignature()

  return useCallback(
    async (
      isEth: boolean,
      title: string,
      description: string,
      tokenChainId: number,
      tokenAddress: string,
      amount: string,
      startTime: number,
      endTime: number,
      airdropStartTime: number,
      airdropEndTime: number,
      sign: {
        daoChainId: number
        daoAddress: string
      },
      collectInformation: { name: string; required: boolean }[]
    ) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      if (isEth) tokenAddress = ZERO_ADDRESS

      const airdropSignatureStr: {
        message: string
        sign: string
      } = {
        message: '',
        sign: ''
      }
      try {
        airdropSignatureStr.message = airdropSignature.makeMessage('airdrop1')
        const _airdropSignatureRes = await airdropSignature.sign(airdropSignatureStr.message)
        airdropSignatureStr.sign = _airdropSignatureRes || ''
      } catch (error) {
        throw new Error('User cancel signature')
      }

      let result: any = {}
      try {
        const res = await createAirdropOne(
          title,
          description,
          tokenChainId,
          tokenAddress,
          amount,
          startTime,
          endTime,
          airdropStartTime,
          airdropEndTime,
          {
            chainId: sign.daoChainId,
            daoAddress: sign.daoAddress,
            account,
            message: airdropSignatureStr.message,
            signature: airdropSignatureStr.sign
          },
          collectInformation
        )
        if (!res.data.data) {
          throw new Error(res.data.msg)
        }
        result = res.data.data
      } catch (error) {
        const err: any = error
        throw new Error(err)
      }

      const args = [result.airdropId, tokenAddress, amount, airdropStartTime, airdropEndTime, result.signature]

      const method = 'createAirdrop'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args, isEth ? amount : undefined)
      return contract[method](...args, {
        gasPrice,
        gasLimit,
        value: isEth ? amount : undefined,
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
    [account, contract, gasPriceInfoCallback, airdropSignature, addTransaction]
  )
}

export function useClaimAirdropCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useAirdropContract()
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
            claim: { recipient: `${account}_claim_airdrop_${airdropId}` }
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

export function useRecycleAirdropCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useAirdropContract()
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
            claim: { recipient: `${account}_recycle_airdrop_${airdropId}` }
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

export function usePublishAirdropCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useAirdropContract()
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()
  const airdropSignature = useAirdropSignature()

  return useCallback(
    async (
      isEth: boolean,
      airdropId: number,
      amount: string,
      airdropToken: Token,
      needStake: CurrencyAmount,
      airdropList: { address: string; amount: string }[],
      chainId: number,
      daoAddress: string
    ) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      const listRaw = airdropList.map(({ address, amount: _amount }) => {
        const ca = tryParseAmount(_amount, airdropToken) as CurrencyAmount
        return {
          address,
          amountRaw: ca.raw.toString(),
          amountHexRaw: ca.raw.toString(16)
        }
      })
      // const list = makeMerkleTreeList(listRaw)
      // const rootHash = getMerkleTreeRootHash(list)

      let rootHash = ''
      const airdropSignatureStr: {
        message: string
        sign: string
      } = {
        message: '',
        sign: ''
      }
      try {
        airdropSignatureStr.message = airdropSignature.makeMessage('airdrop2')
        const _airdropSignatureRes = await airdropSignature.sign(airdropSignatureStr.message)
        airdropSignatureStr.sign = _airdropSignatureRes || ''
      } catch (error) {
        throw new Error('User cancel signature')
      }

      try {
        const res = await saveAirdropAddress(
          listRaw.map(item => item.address),
          listRaw.map(item => item.amountRaw),
          {
            account,
            chainId,
            daoAddress,
            airdropId,
            message: airdropSignatureStr.message,
            signature: airdropSignatureStr.sign
          }
        )
        const result = res.data
        if (!result.data.root) throw new Error(result?.msg || 'Save failed')
        rootHash = result.data.root
      } catch (error) {
        const err: any = error
        throw new Error(err)
      }

      const args = [airdropId, amount, rootHash]

      const method = 'settleAirdrop'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(
        contract,
        method,
        args,
        isEth && needStake.greaterThan(JSBI.BigInt(0)) ? needStake.raw.toString() : undefined
      )

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        value: isEth && needStake.greaterThan(JSBI.BigInt(0)) ? needStake.raw.toString() : undefined,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Publish a airdrop`,
            claim: { recipient: `publish_airdrop_${airdropId}` }
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.code !== 4001) {
            commitErrorMsg(
              'usePublishAirdropCallback',
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
    [account, contract, gasPriceInfoCallback, airdropSignature, addTransaction]
  )
}

export function useAirdropDownloadCallback() {
  const contract = useAirdropContract()
  const { account } = useActiveWeb3React()
  const airdropSignature = useAirdropSignature()

  return useCallback(
    async (airdropId: number) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      const airdropSignatureStr: {
        message: string
        sign: string
      } = {
        message: '',
        sign: ''
      }
      try {
        airdropSignatureStr.message = airdropSignature.makeMessage('airdropDownload')
        const _airdropSignatureRes = await airdropSignature.sign(airdropSignatureStr.message)
        airdropSignatureStr.sign = _airdropSignatureRes || ''
      } catch (error) {
        return
      }

      try {
        const res = await airdropDownloadUserCollect(
          account,
          airdropId,
          airdropSignatureStr.message,
          airdropSignatureStr.sign
        )
        const result = res.data
        const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent((result as unknown) as string)
        window.open(uri)
      } catch (error) {
        const err: any = error
        throw new Error(err)
      }
    },
    [account, contract, airdropSignature]
  )
}
