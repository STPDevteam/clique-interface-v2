import { Box, useTheme } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import React from 'react'
import { ExternalLink } from 'theme/components'
import { getEtherscanLink } from 'utils'
import MessageBox from './MessageBox'

export default function TransactionSubmittedModal({
  children,
  hash,
  header,
  BackdropClick,
  hideFunc
}: {
  hash?: string
  header?: string
  children?: React.ReactNode
  BackdropClick?: boolean
  hideFunc?: () => void
}) {
  const { chainId } = useActiveWeb3React()
  const theme = useTheme()

  return (
    <MessageBox
      type={'success'}
      hideFunc={hideFunc}
      header={header || 'Transaction Submitted'}
      BackdropClick={BackdropClick}
    >
      <Box display="grid" gap="20px" justifyContent="center">
        {children}
        {chainId && hash && (
          <ExternalLink
            underline="always"
            href={getEtherscanLink(chainId, hash, 'transaction')}
            style={{ color: theme.palette.primary.main, fontSize: 12 }}
          >
            View on explorer
          </ExternalLink>
        )}
      </Box>
    </MessageBox>
  )
}
