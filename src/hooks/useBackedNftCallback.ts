import { useEffect, useState } from 'react'
// import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import { getRecentNftList, getNftAccountList } from '../utils/fetch/server'
import { useActiveWeb3React } from 'hooks'

export interface RecentNftListProp {
  account: string
  chainId: number
  createTime: string
  id: number
  implementation: string
  salt: number
  tokenContract: string
  tokenId: number
  transactionHash: string
  updateTime: string
}

export function useRecentNftList() {
  const { chainId } = useActiveWeb3React()
  const [result, setResult] = useState<RecentNftListProp[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (!chainId) return
      const res = await getRecentNftList(chainId as number)
      if (res.data.code === 200) {
        setResult(res.data.data)
        setLoading(false)
      } else {
        setResult([])
        setLoading(false)
      }
    })()
  }, [chainId])
  return {
    result,
    loading
  }
}

export function useNftAccountList() {
  const { chainId, account } = useActiveWeb3React()
  const [result, setResult] = useState<any[]>([])
  useEffect(() => {
    ;(async () => {
      if (!chainId || !account) return
      const res = await getNftAccountList(
        chainId as number,
        '0x0',
        '0x2d25602551487c3f3354dd80d76d54383a243358',
        account
      )
      console.log('NftAccountList=>', res)

      if (res.data.code === 200) {
        setResult(res.data.data)
      } else {
        setResult([])
      }
    })()
  }, [chainId, account])
  return {
    result
  }
}
