import { useEffect, useState, useCallback } from 'react'
import { ChainId } from '../constants/chain'
import { createSbt, getmemberDaoList } from '../utils/fetch/server'
import { useCreateSbtContract } from 'hooks/useContract'
import { TransactionResponse } from '@ethersproject/providers'

export function useCreateSbtCallback(
  chainId: ChainId | undefined,
  daoAddress: string,
  endTime: number | undefined,
  fileUrl: string,
  introduction: string,
  itemName: string,
  startTime: number | undefined,
  tokenChainId: number | undefined,
  totalSupply: number | undefined,
  way: string,
  symbol: string,
  whitelist?: string[]
) {
  const contract = useCreateSbtContract()
  return useCallback(async () => {
    if (!contract) throw new Error('none contract')
    let result: any = {}
    if (
      !chainId ||
      !daoAddress ||
      !fileUrl ||
      !introduction ||
      !itemName ||
      !endTime ||
      !startTime ||
      !tokenChainId ||
      !totalSupply ||
      !way
    )
      return

    try {
      const res = await createSbt(
        chainId,
        daoAddress,
        endTime,
        fileUrl,
        introduction,
        itemName,
        startTime,
        tokenChainId,
        totalSupply,
        way,
        whitelist
      )
      if (res.data) {
        result = res.data.data
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
      return null
    }

    const args = [result.id, itemName, symbol, fileUrl, result.signature]
    const method = 'createSBT'
    console.log(args)
    return contract[method](...args).then((res: TransactionResponse) => {
      console.log('contract=>', res)
    })
  }, [
    contract,
    symbol,
    chainId,
    daoAddress,
    endTime,
    fileUrl,
    introduction,
    itemName,
    startTime,
    tokenChainId,
    totalSupply,
    way,
    whitelist
  ])
}

export function useMemberDaoList(exceptLevel: string) {
  const [result, setResult] = useState<any>()
  useEffect(() => {
    ;(async () => {
      try {
        const res = await getmemberDaoList(exceptLevel)
        if (res.data.data) {
          setResult(res.data.data)
        }
      } catch (error) {
        console.log(error)
        setResult(null)
      }
    })()
  }, [exceptLevel])

  return {
    result
  }
}
