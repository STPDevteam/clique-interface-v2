import { ChainId } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { useEffect, useState } from 'react'
import { sign } from 'utils/fetch/server'
import { retry } from 'utils/retry'
import { SignType } from './useCreateProposalCallback'

export enum ProposalStatus {
  SOON = 1,
  OPEN = 2,
  CLOSED = 3
}

export interface CreateProposalSignProp {
  account: string
  balance: string
  signature: string
  tokenAddress: string
  tokenChainId: ChainId
}

export function useCreateProposalSign(daoAddress: string) {
  const { account } = useActiveWeb3React()
  const [ret, setRet] = useState<CreateProposalSignProp>()

  useEffect(() => {
    ;(async () => {
      if (!account || !daoAddress) {
        setRet(undefined)
        return
      }
      const { promise } = retry(() => sign(account, daoAddress, SignType.CREATE_PROPOSAL), {
        n: 100,
        minWait: 1000,
        maxWait: 2500
      })
      try {
        const returnData = await promise
        setRet(returnData.data.data as CreateProposalSignProp)
      } catch (error) {
        setRet(undefined)
      }
    })()
  }, [account, daoAddress])

  return ret
}
