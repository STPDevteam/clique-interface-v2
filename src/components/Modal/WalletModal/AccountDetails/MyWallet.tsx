import { Box, Stack, Typography } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import Copy from 'components/essential/Copy'
import { routes } from 'constants/routes'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApplicationModal } from 'state/application/actions'
import { useToggleModal } from 'state/application/hooks'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import { TxShow } from '.'

function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

export default function MyWallet() {
  const { account, deactivate } = useActiveWeb3React()
  const toggleModal = useToggleModal(ApplicationModal.WALLET)
  const navigate = useNavigate()

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions).filter(i => i.from === account)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions, account])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  return (
    <Box
      sx={{
        width: { sm: '84%', xs: '100%' }
      }}
    >
      <Stack direction={'row'} alignItems="center" spacing={6} justifyContent="center">
        <Typography fontSize={12} fontWeight={600}>
          {account}
        </Typography>
        <Copy toCopy={account || ''} />
      </Stack>
      <Box display={'flex'} mt={24} justifyContent="space-around">
        <OutlineButton
          onClick={() => {
            toggleModal()
            navigate(routes._Profile)
          }}
          fontSize={12}
          style={{ borderWidth: 1 }}
          fontWeight={500}
          width={125}
          height={24}
        >
          View Profile
        </OutlineButton>
        <OutlineButton
          fontSize={12}
          style={{ borderWidth: 1 }}
          fontWeight={500}
          width={125}
          height={24}
          onClick={deactivate}
        >
          Disconnect
        </OutlineButton>
      </Box>
      <Box mt={24}>
        <TxShow pendingTransactions={pending} confirmedTransactions={confirmed} />
      </Box>
    </Box>
  )
}
