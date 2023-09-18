import { useEffect, useState } from 'react'
import { Typography, Box, Link, Stack } from '@mui/material'
import usePrevious from 'hooks/usePrevious'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useWalletModalToggle } from 'state/application/hooks'
// import AccountDetails from 'components/Modal/WalletModal/AccountDetails'
import MyWallet from 'components/Modal/WalletModal/AccountDetails/MyWallet'

import Modal from '../index'
import Option from './Option'
import useBreakpoint from 'hooks/useBreakpoint'
import Button from '../../Button/Button'
import { ChainId, NETWORK_CHAIN_ID, SUPPORTED_NETWORKS } from '../../../constants/chain'
import { useActiveWeb3React } from 'hooks'
import { getConnections } from 'connection'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account'
}

export default function WalletModal({}: // pendingTransactions,
// confirmedTransactions,
// ENSName
{
  // pendingTransactions: string[] // hashes of pending
  // confirmedTransactions: string[] // hashes of confirmed
  // ENSName?: string
}) {
  const isUpToMD = useBreakpoint('md')
  const isSmDown = useBreakpoint('sm')
  // important that these are destructed from the account-specific web3-react context
  const { active, account, library, connector, errorNetwork } = useActiveWeb3React()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()

  const previousAccount = usePrevious(account)

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal()
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  // close modal when a connection is successful
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)
  useEffect(() => {
    if (
      walletModalOpen &&
      ((active && !activePrevious) || (connector && connector !== connectorPrevious && !errorNetwork))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, errorNetwork, connector, walletModalOpen, activePrevious, connectorPrevious])

  const connections = getConnections()

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    return connections
      .filter(connection => connection.shouldDisplay())
      .map(connection => (
        <Option
          header={connection.getName()}
          id={connection.getName()}
          key={connection.getName()}
          connection={connection}
          icon={(connection.getIcon && connection.getIcon(false)) || ''}
          active={connection.shouldDisplay() && connection.active !== false}
        />
      ))
  }

  function getModalContent() {
    if (active && library && errorNetwork) {
      return (
        <>
          <Typography variant="h6">Wrong Network</Typography>
          <Box padding={isUpToMD ? '16px' : '2rem 6rem 52px'}>
            {`Please connect to the    ${
              SUPPORTED_NETWORKS[NETWORK_CHAIN_ID]
                ? SUPPORTED_NETWORKS[NETWORK_CHAIN_ID]?.chainName
                : 'Binance Smart Chain'
            }.`}
          </Box>
          <Button
            onClick={() => {
              triggerSwitchChain(library, NETWORK_CHAIN_ID as ChainId, '')
            }}
          >
            Connect to {SUPPORTED_NETWORKS[NETWORK_CHAIN_ID] ? SUPPORTED_NETWORKS[NETWORK_CHAIN_ID]?.chainName : 'BSC'}
          </Button>
        </>
      )
    }
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return <MyWallet />
      // return (
      // <AccountDetails
      //   toggleWalletModal={toggleWalletModal}
      //   pendingTransactions={pendingTransactions}
      //   confirmedTransactions={confirmedTransactions}
      //   ENSName={ENSName}
      //   openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
      // />
      // )
    }
    return (
      <>
        {walletView === WALLET_VIEWS.ACCOUNT && (
          <Typography variant="h6" fontSize={18}>
            Connect wallet
          </Typography>
        )}

        <Stack spacing={10}>
          <Typography mb={6} width={isSmDown ? '100%' : 400} textAlign="center" variant="body1" lineHeight={1.3}>
            By connecting a wallet, you acknowledge that you have read and understand the Clique{' '}
            <Link target={'_blank'} href="https://stp-dao.gitbook.io/verse-network/clique/overview-of-clique">
              Disclaimer
            </Link>
            .
          </Typography>
          {getOptions()}
        </Stack>
      </>
    )
  }

  return (
    <Modal customIsOpen={walletModalOpen} customOnDismiss={toggleWalletModal} maxWidth="560px" closeIcon={true}>
      <Box
        width={'100%'}
        padding={isSmDown ? '20px' : '32px'}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={20}
      >
        {getModalContent()}
      </Box>
    </Modal>
  )
}
