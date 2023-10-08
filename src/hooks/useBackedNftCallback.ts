import { useCallback, useEffect, useMemo, useState } from 'react'
// import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import {
  getRecentNftList,
  getNftAccountList,
  getMyCreateNftAccountList,
  getNftAccountInfo
} from '../utils/fetch/server'
import { useActiveWeb3React } from 'hooks'
import { ScanNFTInfo } from './useBackedProfileServer'
import { TokenboundClient } from '@tokenbound/sdk'
import { Currency } from 'constants/token/currency'
import isZero from 'utils/isZero'

// import { useTransactionAdder } from 'state/transactions/hooks'

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
  opensea_floor_price: number
  large_image_url: string
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

export function useNftAccountInfo(contract_address: string | undefined, chainId: number | undefined) {
  const [result, setResult] = useState<NftInfoProp>()
  useEffect(() => {
    ;(async () => {
      if (!contract_address || !chainId) return
      try {
        const res = await getNftAccountInfo(contract_address, chainId)
        if (res.data.code === 200) {
          setResult(res.data.data)
        } else {
          setResult(undefined)
        }
      } catch (error) {
        setResult(undefined)
        console.log(error)
      }
    })()
  }, [contract_address, chainId])
  return {
    result
  }
}

export function useNft6551Detail(nftAccount: string | undefined, chainId: string | undefined) {
  const [loading, setLoading] = useState<boolean>()
  const { library } = useActiveWeb3React()
  const [tokenId, setTokenId] = useState<string>()
  const [result, setResult] = useState<NftInfoProp>()
  const tokenboundClient = useMemo(
    () =>
      library && chainId ? new TokenboundClient({ signer: library.getSigner(), chainId: Number(chainId) }) : undefined,
    [chainId, library]
  )

  useEffect(() => {
    ;(async () => {
      if (!chainId || !nftAccount) return

      setLoading(true)
      const Nft = await tokenboundClient?.getNFT({
        accountAddress: nftAccount as `0x${string}`
      })
      setTokenId(Nft?.tokenId)
      try {
        const res = await getNftAccountInfo(Nft?.tokenContract as string, Number(chainId))
        if (res.data.code === 200) {
          setResult(res.data.data)
          setLoading(false)
        } else {
          setResult(undefined)
          setLoading(false)
        }
      } catch (error) {
        setResult(undefined)
        console.log(error)
      }
    })()
  }, [chainId, nftAccount, tokenboundClient])
  return {
    result,
    tokenId,
    loading
  }
}

export function useTransferNFT() {
  const [loading, setLoading] = useState<boolean>()
  const { chainId, library } = useActiveWeb3React()
  // const addTransaction = useTransactionAdder()

  // const navigate = useNavigate()

  const tokenboundClient = useMemo(
    () => (library && chainId ? new TokenboundClient({ signer: library.getSigner(), chainId }) : undefined),
    [chainId, library]
  )
  const transferNftCallback = useCallback(
    async (account: string, tokenContract: string, tokenId: string, recipientAddress: string) => {
      if (!library) return
      setLoading(true)
      const params = {
        account: account as `0x${string}`,
        tokenType: 'ERC721',
        tokenContract: tokenContract as `0x${string}`,
        tokenId,
        recipientAddress: recipientAddress as `0x${string}`
      }
      console.log('params=>', params)

      try {
        const res = await tokenboundClient?.transferNFT({
          account: account as `0x${string}`,
          tokenType: 'ERC721',
          tokenContract: tokenContract as `0x${string}`,
          tokenId,
          recipientAddress: recipientAddress as `0x${string}`
        })

        // addTransaction(res, {
        //   summary: 'NFT Account Transfer',
        //   claim: { recipient: `${res}_transfer_Nft_Account` }
        // })

        return res
      } catch (error) {
        throw error
      }
    },
    [library, tokenboundClient]
  )

  return {
    transferNftCallback,
    loading
  }
}

export function useSendAssetsCallback(chainId: number | undefined) {
  // const [loading, setLoading] = useState<boolean>()
  const { library } = useActiveWeb3React()

  // const addTransaction = useTransactionAdder()
  // const navigate = useNavigate()

  const tokenboundClient = useMemo(
    () => (library && chainId ? new TokenboundClient({ signer: library.getSigner(), chainId }) : undefined),
    [chainId, library]
  )

  const SendAssetsCallback = useCallback(
    async (account: string, receiveAccount: string, amount: number, network: Currency) => {
      const params = {
        account,
        amount,
        recipientAddress: receiveAccount,
        erc20tokenAddress: network.address,
        erc20tokenDecimals: network.decimals
      }
      console.log('params=>', params)
      if (isZero(network.address)) {
        const res = await tokenboundClient?.transferETH({
          account: account as `0x${string}`,
          amount,
          recipientAddress: receiveAccount as `0x${string}`
        })
        return res
      } else {
        const res = await tokenboundClient?.transferERC20({
          account: account as `0x${string}`,
          amount,
          recipientAddress: receiveAccount as `0x${string}`,
          erc20tokenAddress: network.address as `0x${string}`,
          erc20tokenDecimals: network.decimals
        })
        return res
      }
    },
    [tokenboundClient]
  )

  return {
    SendAssetsCallback
  }
}
