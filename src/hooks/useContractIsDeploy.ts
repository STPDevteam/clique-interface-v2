import { useBlockNumber } from 'state/application/hooks'
import { useActiveWeb3React } from './index'
import { useEffect, useMemo, useState } from 'react'
import { isAddress } from 'ethers/lib/utils'
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
        console.log(code)

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
  console.log(isDeploy)

  return useMemo(() => isDeploy, [isDeploy])
}
