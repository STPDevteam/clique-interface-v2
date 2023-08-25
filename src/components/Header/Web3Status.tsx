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
import useModal from 'hooks/useModal'
// import { ReactComponent as NotificationIcon } from '../../assets/svg/notification_icon.svg'
import { useNotificationListPaginationCallback } from 'state/pagination/hooks'
import { routes } from 'constants/routes'
import { useNavigate } from 'react-router-dom'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

// const NoticeMsg = muiStyled(NavLink)(({ theme }) => ({
//   cursor: 'pointer',
//   borderRadius: '50%',
//   width: 24,
//   height: 24,
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   transition: 'all 0.5s',
//   backgroundColor: theme.bgColor.bg1,
//   '&:hover': {
//     backgroundColor: theme.bgColor.bg2
//   },
//   '&.active': {
//     backgroundColor: theme.palette.primary.main,
//     '& svg path': {
//       stroke: theme.palette.common.white
//     }
//   },
//   [theme.breakpoints.down('sm')]: {
//     height: 30,
//     width: 30
//   }
// }))

function Web3StatusInner({ IsNftPage }: { IsNftPage?: boolean }) {
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
  const { hideModal } = useModal()
  const isDownSm = useBreakpoint()
  const {
    data: { unReadCount: notReadCount }
  } = useNotificationListPaginationCallback()
  const navigate = useNavigate()

  if (account && chainId) {
    return (
      <Box
        sx={{ cursor: 'pointer' }}
        onClick={() => {
          hideModal()
          toggleWalletModal()
        }}
      >
        <Box
          sx={{
            height: { xs: 36, sm: 36 },
            width: { xs: 'auto', sm: 180 },
            padding: '0 12px',
            borderRadius: `${theme.shape.borderRadius}px`,
            display: { sm: 'flex', xs: 'grid' },
            gridTemplateColumns: 'auto auto',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5px',
            border: `1px solid ${IsNftPage ? '#fff' : '#D4D7E2'}`,
            '&:hover': {
              borderColor: IsNftPage ? '#D4D7E2' : '#97B7EF'
            }
          }}
        >
          {/* <div /> */}
          {hasPendingTransactions ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 10, sm: 17 }, ml: { xs: 10, sm: 20 } }}>
              <Spinner color={IsNftPage ? '#fff' : theme.palette.text.primary} size={isDownSm ? '10px' : '16px'} />
              <Box component="span" sx={{ ml: 3 }}>
                <Typography
                  sx={{ fontSize: { xs: 9, sm: 14 }, ml: 8, color: IsNftPage ? '#fff' : theme.palette.text.primary }}
                  noWrap
                >
                  {pending?.length} Pending
                </Typography>
              </Box>
            </Box>
          ) : (
            <>
              <Image src={ChainListMap[chainId]?.logo} style={{ height: 20 }} />
              <Typography
                fontWeight={700}
                sx={{
                  fontSize: { xs: 9, sm: 14 },
                  color: IsNftPage ? '#fff' : theme.palette.text.primary
                }}
              >
                {ENSName || shortenAddress(account, isDownSm ? 3 : 4)}
              </Typography>
              {account && (
                <svg
                  onClick={e => {
                    e.stopPropagation()
                    navigate(routes.Notification)
                  }}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="12" fill={IsNftPage ? '#fff' : '#0049C6'} fillOpacity="0.05" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.4817 12.5C7.84299 12.1087 7.91846 10.9985 7.95908 10.4616C7.99401 10 7.95908 9.6561 7.99401 9.25622C8.17447 7.33105 10.078 6 11.9583 6H12.0049C13.8851 6 15.7887 7.33105 15.975 9.25622C16.0099 9.6561 16.0041 10 16.0041 10.4616C16.0041 11.1348 16.2144 12.1057 16.5745 12.5C17.1066 13.2856 17.1871 13.7746 16.5745 14.5004C16.1258 14.9709 15.5169 15.2636 14.8631 15.3231C12.9459 15.5287 11.0115 15.5287 9.09423 15.3231C8.44114 15.261 7.83311 14.9687 7.38278 14.5004C6.77395 13.7672 6.95486 13.2906 7.4817 12.5Z"
                    fill={IsNftPage ? '#558EEF' : '#0049C6'}
                    fillOpacity="0.05"
                    stroke={IsNftPage ? '#fff' : '#1B1D21'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.5146 17C10.8142 17.376 11.2541 17.6193 11.737 17.6762C12.2199 17.733 12.706 17.5986 13.0876 17.3028C13.205 17.2153 13.3107 17.1135 13.402 17"
                    fill={IsNftPage ? '#fff' : '#0049C6'}
                    fillOpacity="0.05"
                  />
                  <path
                    d="M10.5146 17C10.8142 17.376 11.2541 17.6193 11.737 17.6762C12.2199 17.733 12.706 17.5986 13.0876 17.3028C13.205 17.2153 13.3107 17.1135 13.402 17"
                    stroke={IsNftPage ? '#fff' : '#0049C6'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {notReadCount && <circle cx="18.5" cy="19.5" r="4" fill={'#E46767'} stroke="white" />}
                </svg>

                // <NoticeMsg to={routes.Notification}>
                //   <Badge
                //     badgeContent={notReadCount}
                //     color="error"
                //     sx={{ width: 16 }}
                //     anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                //   >
                //     <NotificationIcon />
                //   </Badge>
                // </NoticeMsg>
              )}
            </>
          )}
        </Box>
      </Box>
    )
  } else if (error) {
    return (
      <Button
        backgroundColor={theme.palette.error.main}
        width={isDownSm ? '128px' : '140px'}
        height={isDownSm ? '28px' : '36px'}
        onClick={() => {
          hideModal()
          toggleWalletModal()
        }}
      >
        {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}
      </Button>
    )
  } else {
    return (
      <Button
        width={isDownSm ? '128px' : '140px'}
        height={isDownSm ? '28px' : '36px'}
        onClick={() => {
          hideModal()
          toggleWalletModal()
        }}
      >
        Connect Wallet
      </Button>
    )
  }
}

export default function Web3Status({ IsNftPage }: { IsNftPage: boolean }) {
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
      <Web3StatusInner IsNftPage={IsNftPage} />
      <WalletModal />
      {/* <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} /> */}
    </>
  )
}
