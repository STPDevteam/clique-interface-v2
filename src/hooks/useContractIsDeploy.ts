import { useBlockNumber } from 'state/application/hooks'
import { useActiveWeb3React } from './index'
import { useEffect, useMemo, useState } from 'react'
import { isAddress } from 'ethers/lib/utils'
import { TokenboundClient } from '@tokenbound/sdk'
export function useContractIsDeploy(tokenContract?: string) {
  const [isDeploy, setIsDeploy] = useState<boolean | undefined>(false)
  const { library } = useActiveWeb3React()
  const block = useBlockNumber()

  useEffect(() => {
    if (!tokenContract || !library || !block || !isAddress(tokenContract)) return
    setIsDeploy(undefined)
    library
      .getCode(tokenContract)
      .then(code => {
        if (code === '0x' || code === '0x0') {
          setIsDeploy(false)
        } else {
          setIsDeploy(true)
        }
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }, [block, tokenContract, library])

  return useMemo(() => isDeploy, [isDeploy])
}

export function useContractIsDeployList(tokenContracts?: string[]) {
  const { library } = useActiveWeb3React()
  const [isDeploys, setIsDeploys] = useState<boolean[]>()

  const tokenContractsLength = useMemo(() => tokenContracts?.length, [tokenContracts?.length])

  useEffect(() => {
    if (!tokenContracts?.length || !library) return
    const list = tokenContracts.map(item => {
      if (!isAddress(item)) return false
      return library
        .getCode(item)
        .then(code => {
          if (code === '0x' || code === '0x0') {
            return false
          } else {
            return true
          }
        })
        .catch(() => false)
    })

    Promise.all(list).then(res => setIsDeploys(res))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenContractsLength])

  return useMemo(() => isDeploys, [isDeploys])
}

export function useSBTIsDeployList(erc721Address: string[], tokenIds: string[]) {
  const { chainId, library } = useActiveWeb3React()

  const tokenboundClient = useMemo(
    () => (library && chainId ? new TokenboundClient({ signer: library.getSigner(), chainId }) : undefined),
    [chainId, library]
  )

  const getAllAccount = useMemo(() => {
    if (!tokenboundClient) {
      return []
    }
    if (erc721Address.length !== tokenIds.length) {
      throw new Error('length error')
    }
    return erc721Address.map((addr, idx) =>
      tokenboundClient.getAccount({
        tokenContract: addr as `0x${string}`,
        tokenId: tokenIds[idx]
      })
    )
  }, [erc721Address, tokenIds, tokenboundClient])

  return useContractIsDeployList(getAllAccount)
}
