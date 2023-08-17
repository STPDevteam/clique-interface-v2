import { useActiveWeb3React } from 'hooks'
import { TokenboundClient } from '@tokenbound/sdk'
import { useCallback, useMemo } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'

import { useContractIsDeploy } from './useContractIsDeploy'

export function useCreateTBACallback(tokenContract?: `0x${string}`, tokenId?: string) {
  const { account, chainId, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const tokenboundClient = useMemo(
    () => (library && chainId ? new TokenboundClient({ signer: library.getSigner(), chainId }) : undefined),
    [chainId, library]
  )

  const getAccount = useMemo(() => {
    if (!tokenboundClient || !tokenContract || !tokenId) {
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
  console.log(isDeploy, 90)

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
        summary: 'NftAccount Create',
        claim: { recipient: `${getAccount}_create_Nft_Account` }
      })

      return rep.hash
    } catch (error) {
      throw error
    }
  }, [account, addTransaction, chainId, getAccount, isDeploy, library, tokenContract, tokenId, tokenboundClient])

  return {
    isDeploy,
    getAccount,
    createAccountCallback
  }
}
