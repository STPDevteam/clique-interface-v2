import { useMemo } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { useTheme, Box, Typography } from '@mui/material'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import WalletModal from 'components/Modal/WalletModal/index'
import Spinner from 'components/Spinner'
import Button from 'components/Button/Button'
import useBreakpoint from 'hooks/useBreakpoint'
import Image from 'components/Image'
import { ChainListMap } from 'constants/chain'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function Web3StatusInner() {
  const { account, chainId, error } = useWeb3React()
  const { ENSName } = useENSName(account ?? undefined)
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])
  const pending = sortedRecentTransactions.filter(tx => !tx.receipt && tx.from === account).map(tx => tx.hash)
  const hasPendingTransactions = !!pending.length
  const toggleWalletModal = useWalletModalToggle()
  const theme = useTheme()
  const isDownSm = useBreakpoint()

  if (account && chainId) {
    return (
      <Box sx={{ cursor: 'pointer' }} onClick={toggleWalletModal}>
        <Box
          sx={{
            height: { xs: 36, sm: 50 },
            width: { xs: 'auto', sm: 200 },
            padding: '0 15px',
            borderRadius: `${theme.shape.borderRadius}px`,
            display: { sm: 'flex', xs: 'grid' },
            gridTemplateColumns: 'auto auto',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            border: `2px solid ${theme.palette.primary.main}`
          }}
        >
          {/* <div /> */}
          {hasPendingTransactions ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 10, sm: 17 }, ml: { xs: 10, sm: 20 } }}>
              <Spinner color={theme.palette.text.primary} size={isDownSm ? '10px' : '16px'} />
              <Box component="span" sx={{ ml: 3 }}>
                <Typography sx={{ fontSize: { xs: 9, sm: 14 }, ml: 8, color: theme.palette.text.primary }} noWrap>
                  {pending?.length} Pending
                </Typography>
              </Box>
            </Box>
          ) : (
            <>
              <Image src={ChainListMap[chainId].logo} style={{ height: 20 }} />
              <Typography
                fontWeight={700}
                sx={{
                  fontSize: { xs: 9, sm: 14 },
                  color: theme.palette.text.primary
                }}
              >
                {ENSName || shortenAddress(account, isDownSm ? 3 : 4)}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    )
  } else if (error) {
    return (
      <Button
        backgroundColor={theme.palette.error.main}
        width={isDownSm ? '128px' : '200px'}
        height={isDownSm ? '28px' : '50px'}
        onClick={toggleWalletModal}
      >
        {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}
      </Button>
    )
  } else {
    return (
      <Button width={isDownSm ? '128px' : '200px'} height={isDownSm ? '28px' : '50px'} onClick={toggleWalletModal}>
        Connect Wallet
      </Button>
    )
  }
}

export default function Web3Status() {
  const { active } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  // const { ENSName } = useENSName(account ?? undefined)

  // const allTransactions = useAllTransactions()

  // const sortedRecentTransactions = useMemo(() => {
  //   const txs = Object.values(allTransactions).filter(i => i.from === account)
  //   return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  // }, [allTransactions, account])

  // const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  // const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal />
      {/* <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} /> */}
    </>
  )
}
