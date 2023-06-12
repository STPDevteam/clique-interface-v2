import { useEffect, useState } from 'react'
import { ChainId } from '../constants/chain'
import { createSbt, getmemberDaoList } from '../utils/fetch/server'

export function useCreateSbtCallback(
  chainId: ChainId | undefined,
  daoAddress: string,
  endTime: number,
  fileUrl: string,
  introduction: string,
  itemName: string,
  startTime: number,
  tokenChainId: number,
  totalSupply: number,
  way: string,
  whitelist?: string[]
) {
  const [result, setResult] = useState<any>()
  useEffect(() => {
    ;(async () => {
      if (!chainId) return
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
        if (res.data.data) {
          setResult(res.data.data)
        }
      } catch (error) {
        console.log(error)
        setResult(null)
      }
    })()
  }, [
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

  return {
    result
  }
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
  }, [])

  return {
    result
  }
}
