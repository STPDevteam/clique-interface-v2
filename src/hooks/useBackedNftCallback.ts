import { useCallback, useEffect, useMemo, useState } from 'react'
// import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import {
  getRecentNftList,
  getNftAccountList,
  getMyCreateNftAccountList,
  getNftAccountInfo,
  commitErrorMsg
} from '../utils/fetch/server'
import { useActiveWeb3React } from 'hooks'
import { ScanNFTInfo } from './useBackedProfileServer'
import { TokenboundClient } from '@tokenbound/sdk'
// import { Currency } from 'constants/token/currency'
import isZero from 'utils/isZero'
import { Axios } from 'utils/axios'
import { NFT_REGISTRY_ADDRESS, NFT_IMPLEMENTATION_ADDRESS, serverAwnsUrl } from '../constants'
import { ChainId, SUPPORTED_NETWORKS } from 'constants/chain'
import { isAddress } from 'utils'
import { useERC721Contract, useNft6551Contract } from 'hooks/useContract'
import { useGasPriceInfo } from './useGasPrice'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import ReactGA from 'react-ga4'
import { useSingleCallResult } from 'state/multicall/hooks'
import BigNumber from 'bignumber.js'

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
export interface AssetsTokenProp {
  amount: number
  chain: string
  decimals: number
  id: string
  logo_url: string
  name: string
  symbol: string
  price: number
}

interface TokenHistoryTypeProp {
  amount: number
  to_addr: string
  token_id: string
}

interface TokenHistoryTxProp {
  from_addr: string
  message: string | number
  name: string
  params: []
  selector: string
  status: number
  to_addr: string
  value: number
}

export interface TokenHistoryListProp {
  cate_id: string
  cex_id: string | number
  chain: string
  id: string
  is_scam: boolean
  other_addr: string
  project_id: string | number
  time_at: number
  token_approve: string | number
  receives: TokenHistoryTypeProp[] | undefined
  sends: TokenHistoryTypeProp[] | undefined
  tx: TokenHistoryTxProp | undefined
}

export interface TokenHistoryProp {
  history_list: TokenHistoryListProp[]
  token_dict: {
    [key: string]: {
      logo_url: string
      id: string
      name: string
    }
  }
}

export function useRecentNftList() {
  const { chainId } = useActiveWeb3React()
  const [result, setResult] = useState<RecentNftListProp[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (!chainId) return
      try {
        const res = await getRecentNftList(chainId as number)
        setResult(res.data.data)
        setLoading(false)
      } catch (error) {
        setResult([])
        setLoading(false)
        console.log('error=>', error)
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
      try {
        const res = await getMyCreateNftAccountList(account, (currentPage - 1) * pageSize, pageSize)
        setResult(res.data.data)
        setTotal(res.data.total)
        setLoading(false)
      } catch (error) {
        setResult([])
        setLoading(false)
        console.log('error=>', error)
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
      try {
        const res = await getNftAccountList(
          chainId as number,
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          NFT_IMPLEMENTATION_ADDRESS[chainId as ChainId],
          account
        )
        setResult(res.data.data)
        setLoading(false)
      } catch (error) {
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
  const contract = useNft6551Contract(nftAccount, Number(chainId))
  const nft6551Res = useSingleCallResult(contract, 'token', [], undefined, Number(chainId))
  const [loading, setLoading] = useState<boolean>()
  const [result, setResult] = useState<NftInfoProp>()

  const tokenId = useMemo(() => {
    if (nft6551Res) {
      return nft6551Res?.result?.tokenId.toString()
    }
    return
  }, [nft6551Res])

  const tokenContract = useMemo(() => {
    if (nft6551Res) {
      return nft6551Res?.result?.tokenContract.toString()
    }
    return
  }, [nft6551Res])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (!chainId || !tokenContract) return
      try {
        const res = await getNftAccountInfo(tokenContract, Number(chainId))
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
  }, [chainId, tokenContract])
  return {
    result,
    tokenId,
    loading
  }
}

export function useSendNFT6551Callback() {
  const [loading, setLoading] = useState<boolean>()
  const { chainId, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const tokenboundClient = useMemo(
    () =>
      library && chainId
        ? new TokenboundClient({
            signer: library.getSigner(),
            chainId,
            implementationAddress: NFT_IMPLEMENTATION_ADDRESS[chainId as ChainId] as `0x${string}`,
            registryAddress: NFT_REGISTRY_ADDRESS[chainId as ChainId] as `0x${string}`
          })
        : undefined,
    [chainId, library]
  )
  const sendNftCallback = useCallback(
    async (account: string, tokenContract: string, tokenId: string, recipientAddress: string) => {
      setLoading(true)
      if (!library) return
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

        addTransaction({ hash: res } as unknown as TransactionResponse, {
          summary: 'Send Nft Assets',
          claim: { recipient: `${res}_send_nft_assets` }
        })

        return res
      } catch (error) {
        throw error
      }
    },
    [library, addTransaction, tokenboundClient]
  )

  return {
    sendNftCallback,
    loading
  }
}

export function useSendAssetsCallback(chainId: number | undefined) {
  const { library } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()

  const tokenboundClient = useMemo(
    () =>
      library && chainId
        ? new TokenboundClient({
            signer: library.getSigner(),
            chainId,
            implementationAddress: NFT_IMPLEMENTATION_ADDRESS[chainId as ChainId] as `0x${string}`,
            registryAddress: NFT_REGISTRY_ADDRESS[chainId as ChainId] as `0x${string}`
          })
        : undefined,
    [chainId, library]
  )

  const SendAssetsCallback = useCallback(
    async (account: string, receiveAccount: string, amount: number, network: AssetsTokenProp) => {
      const params = {
        account,
        amount,
        recipientAddress: receiveAccount,
        erc20tokenAddress: network.id,
        erc20tokenDecimals: network.decimals
      }
      console.log('params=>', params)
      if (isZero(network.id) || !isAddress(network.id)) {
        const res = await tokenboundClient?.transferETH({
          account: account as `0x${string}`,
          amount,
          recipientAddress: receiveAccount as `0x${string}`
        })
        addTransaction({ hash: res } as unknown as TransactionResponse, {
          summary: 'Send Token Assets',
          claim: { recipient: `${res}_send_token_assets` }
        })
        return res
      } else {
        const res = await tokenboundClient?.transferERC20({
          account: account as `0x${string}`,
          amount,
          recipientAddress: receiveAccount as `0x${string}`,
          erc20tokenAddress: network.id as `0x${string}`,
          erc20tokenDecimals: network.decimals
        })
        addTransaction({ hash: res } as unknown as TransactionResponse, {
          summary: 'Send Token Assets',
          claim: { recipient: `${res}_send_token_assets` }
        })
        return res
      }
    },
    [addTransaction, tokenboundClient]
  )

  return {
    SendAssetsCallback
  }
}

export function useAssetsTokenCallback(chainId: number | undefined, nftAccount: string | undefined) {
  const [result, setResult] = useState<AssetsTokenProp[]>([])

  const [loading, setLoading] = useState<boolean>(false)
  const chain = useMemo(() => {
    if (!chainId) return

    return SUPPORTED_NETWORKS[chainId as ChainId]?.nativeCurrency.symbol.toLocaleLowerCase()
  }, [chainId])
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (!chain || !nftAccount) return
      try {
        const res = await Axios.get(serverAwnsUrl + '/rpc/token/list', { chain, account: nftAccount })
        if (!res.data.data) {
          throw res
        }
        const data = res.data.data

        setResult(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    })()
  }, [nftAccount, chain])

  return {
    result,
    loading
  }
}

export function useTokenHistoryCallback(chainId: number | undefined, nftAccount: string | undefined) {
  const [result, setResult] = useState<TokenHistoryProp>()

  const [loading, setLoading] = useState<boolean>(false)
  const chain = useMemo(() => {
    if (!chainId) return

    return SUPPORTED_NETWORKS[chainId as ChainId]?.nativeCurrency.symbol.toLocaleLowerCase()
  }, [chainId])
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (!chain || !nftAccount) return
      try {
        const res = await Axios.get(serverAwnsUrl + '/rpc/history/list', { chain, account: nftAccount })
        if (!res.data.data) {
          throw res
        }
        const data = res.data.data
        setResult(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    })()
  }, [nftAccount, chain])

  return {
    result,
    loading
  }
}

export function useTransferNFTCallback(address: string | undefined, queryChainId: number) {
  const contract = useERC721Contract(address, queryChainId as ChainId)
  const gasPriceInfoCallback = useGasPriceInfo()
  const addTransaction = useTransactionAdder()

  const TransFerCallback = useCallback(
    async (fromAddress: string, toAddress: string, tokenId: string) => {
      if (!contract) throw new Error('none contract')
      const args = [fromAddress, toAddress, tokenId]
      const method = 'transferFrom'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)
      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: fromAddress
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `NFT transfer`,
            claim: { recipient: `${fromAddress}_transfer_nft` }
          })
          return {
            hash: response.hash
          }
        })
        .catch((err: any) => {
          if (err.code !== 4001 && err.code !== 'ACTION_REJECTED') {
            commitErrorMsg(
              'useTransferNFTCallback',
              JSON.stringify(
                err?.reason || err?.data?.message || err?.error?.message || err?.message || 'unknown error'
              ),
              method,
              JSON.stringify(args)
            )
            ReactGA.event({
              category: `catch-${method}`,
              action: `${err?.error.message || ''} ${err?.message || ''} ${err?.data?.message || ''}`,
              label: JSON.stringify(args)
            })
          }
          throw err
        })
    },
    [addTransaction, contract, gasPriceInfoCallback]
  )

  return {
    TransFerCallback
  }
}

export function useIsOwnerCallback(
  contractAddress: string | undefined,
  chainId: number | undefined,
  tokenId: string | undefined
) {
  const contract = useERC721Contract(contractAddress, chainId)

  const isOwnerRes = useSingleCallResult(contract, 'ownerOf', [tokenId], undefined, chainId)
  const OwnerAccount = useMemo(() => (isOwnerRes.result?.[0] ? isOwnerRes.result?.[0] : undefined), [isOwnerRes.result])

  return { OwnerAccount }
}

export function useNftAccountAssetsBalanceCallback(AssetsList: AssetsTokenProp[]) {
  const bigNumberTotal = AssetsList.reduce((sum, item) => {
    const amountBN = new BigNumber(item.amount)
    const priceBN = new BigNumber(item.price)
    return sum.plus(amountBN.multipliedBy(priceBN))
  }, new BigNumber(0))

  const assetsTotal = useMemo(() => {
    const bool = bigNumberTotal.decimalPlaces()
    if (bool) {
      return bigNumberTotal.decimalPlaces(2).toString()
    }
    return bigNumberTotal.toString()
  }, [bigNumberTotal])

  return { assetsTotal: assetsTotal }
}
