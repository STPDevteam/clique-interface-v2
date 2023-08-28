import { useEffect, useState } from 'react'
// import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import {
  getRecentNftList,
  getNftAccountList,
  getMyCreateNftAccountList,
  getNftAccountInfo
} from '../utils/fetch/server'
import { useActiveWeb3React } from 'hooks'
import { ScanNFTInfo } from './useBackedProfileServer'

export interface RecentNftListProp {
  account: string
  chainId: number
  createTime: string
  id: number
  implementation: string
  salt: number
  tokenContract: string
  tokenId: string
  transactionHash: string
  updateTime: string
}

export interface MyCreateNftListProp {
  id: number
  createTime: string
  updateTime: string
  account: string
  creator: string
  implementation: string
  chainId: number
  tokenContract: string
  tokenId: string
  salt: number
  transactionHash: string
}
export interface NftInfoProp {
  amounts_total: number
  owners_total: number
  logo_url: string
  contract_address: string
  description: string
  erc_type: 'erc721' | 'erc1155'
  price_symbol: string
  name: string
  owner: string
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

export function useMyCreateNftAccountList(account: string) {
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 100
  const [result, setResult] = useState<MyCreateNftListProp[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (!account) return
      const res = await getMyCreateNftAccountList(account, (currentPage - 1) * pageSize, pageSize)

      if (res.data.code === 200) {
        setResult(res.data.data)
        setTotal(res.data.total)
        setLoading(false)
      } else {
        setResult([])
        setLoading(false)
      }
    })()
  }, [account, currentPage])
  return {
    page: {
      setCurrentPage,
      currentPage,
      total,
      totalPage: Math.ceil(total / pageSize),
      pageSize
    },
    result,
    loading
  }
}

export function useNftAccountList() {
  const { chainId, account } = useActiveWeb3React()
  const [result, setResult] = useState<ScanNFTInfo[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (!chainId || !account) return
      const res = await getNftAccountList(
        chainId as number,
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x2d25602551487c3f3354dd80d76d54383a243358',
        account
      )
      console.log('NftAccountList=>', res)

      if (res.data.code === 200) {
        setResult(res.data.data)
        setLoading(false)
      } else {
        setResult([])
        setLoading(false)
      }
    })()
  }, [chainId, account])
  return {
    result,
    loading
  }
}

export function useNftAccountInfo(contract_address: string, chainId: number) {
  const [result, setResult] = useState<NftInfoProp>()
  useEffect(() => {
    ;(async () => {
      try {
        const res = await getNftAccountInfo(contract_address, chainId)
        if (res.data.code === 200) {
          setResult(res.data.data)
        } else {
          setResult(undefined)
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [contract_address, chainId])
  return {
    result
  }
}
