import { useActiveWeb3React } from 'hooks'
import { TokenboundClient } from '@tokenbound/sdk'
import { useCallback, useMemo } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { isAddress } from 'ethers/lib/utils'
import { useContractIsDeploy } from './useContractIsDeploy'
// import { useTokenContract } from './useContract'

export function useCreateTBACallback(tokenContract?: `0x${string}`, tokenId?: string) {
  const { account, chainId, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const tokenboundClient = useMemo(
    () => (library && chainId ? new TokenboundClient({ signer: library.getSigner(), chainId }) : undefined),
    [chainId, library]
  )

  const getAccount = useMemo(() => {
    if (!tokenboundClient || !tokenContract || !tokenId || !isAddress(tokenContract)) {
      return undefined
    }
    return tokenboundClient.getAccount({
      tokenContract,
      tokenId
    })
  }, [tokenContract, tokenId, tokenboundClient])

  // const isDeploy = useMemo(
  //   () =>
  //     tokenboundClient && getAccount
  //       ? tokenboundClient.checkAccountDeployment({ accountAddress: getAccount })
  //       : undefined,
  //   [getAccount, tokenboundClient]
  // )
  const isDeploy = useContractIsDeploy(getAccount)

  const createAccountCallback = useCallback(async () => {
    if (
      !tokenboundClient ||
      !chainId ||
      !account ||
      !library ||
      !getAccount ||
      !tokenContract ||
      !tokenId ||
      isDeploy
    ) {
      throw new Error('Params error')
    }
    if (isDeploy) {
      throw new Error('The contract has been deployed.')
    }
    try {
      const tranData = await tokenboundClient.prepareCreateAccount({
        tokenContract,
        tokenId
      })
      const rep = await library.getSigner().sendTransaction(tranData)

      addTransaction(rep, {
        summary: 'NFT Account Created',
        claim: { recipient: `${getAccount}_create_Nft_Account` }
      })

      return rep.hash
    } catch (error) {
      throw error
    }
  }, [account, addTransaction, chainId, getAccount, isDeploy, library, tokenContract, tokenId, tokenboundClient])

  // const erc20Contract = useTokenContract('')
  // const transfer = useCallback(
  //   (to: string, value: string) => {
  //     return erc20Contract?.interface.encodeFunctionData('transfer', [to, value])
  //   },
  //   [erc20Contract?.interface]
  // )

  // const send = async () => {
  //   const data = transfer('', '10000')
  //   if (!data || !getAccount) return
  //   const tranData = await tokenboundClient?.prepareExecuteCall({
  //     account: getAccount,
  //     to: '',
  //     value: BigInt(0),
  //     data
  //   })

  //   if (tranData) await library?.getSigner().sendTransaction(tranData)
  // }

  return {
    isDeploy,
    getAccount,
    createAccountCallback
    // send
  }
}
