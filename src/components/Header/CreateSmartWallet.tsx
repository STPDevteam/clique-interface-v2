import Button from '../Button/Button'
import useBreakpoint from '../../hooks/useBreakpoint'
import { useCallback } from 'react'
import { getConnection } from '../../connection'
import { ConnectionType } from '../../connection/types'
import { useActiveWeb3React } from '../../hooks'

export default function CreateSmartWallet() {
  const isDownSm = useBreakpoint()
  const connection = getConnection(ConnectionType.COINBASE_WALLET)
  const { account, chainId } = useActiveWeb3React()

  const createWallet = useCallback(() => {
    console.log('CreateSmartWallet', chainId)
    connection.connector.activate()
  }, [chainId, connection.connector])

  if (account) return null

  return (
    <Button width={isDownSm ? '128px' : '140px'} height={isDownSm ? '28px' : '36px'} onClick={createWallet}>
      Create Wallet
    </Button>
  )
}
