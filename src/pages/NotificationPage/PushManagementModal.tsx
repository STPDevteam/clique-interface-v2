import { Box, Stack, styled, Switch, Typography } from '@mui/material'
import theme from 'theme'
import Modal from 'components/Modal'
import { useState } from 'react'
// import Push from 'hooks/usePush'

const RowWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  marginBottom: 20,
  '& p': {
    color: theme.palette.primary
  },
  '& switch': {
    border: '2px solid',
    borderRadius: 16,
    borderColor: theme.palette.primary.main
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'unset',
    padding: '20px'
  }
}))

export default function PushManagementModal() {
  const [isALlSubscribe, setIsAllSubscribe] = useState<boolean>(true)
  const [isSubscribeNewDAO, setIsSubscribeNewDAO] = useState<boolean>(false)
  const [isSubscribeAirdrop, setIsSubscribeAirdrop] = useState<boolean>(true)
  const [isSubscribeProposal, setIsSubscribeProposal] = useState<boolean>(true)

  // const isSubscribeSTP = Push.useIsSubscribe('0xC7BBDed82767c2eEcA8a9C9E03a1F63c5725DaBa')
  // console.log('🚀 ~ file: PushManagementModal.tsx:36 ~ PushManagementModal ~ isSubscribeSTP:', isSubscribeSTP)

  return (
    <Modal closeIcon>
      <Box display="grid" padding="40px 24px" gap="24px" justifyItems="center">
        <Typography fontWeight={400} fontSize={18} variant="h5" textAlign={'left'} width={'100%'}>
          Push management
        </Typography>
        <RowWrapper>
          <Typography fontWeight={400} fontSize={14}>
            Subscribe to all updates of the DAOs I create/join
          </Typography>
          <Switch checked={isALlSubscribe} onChange={() => setIsAllSubscribe(!isALlSubscribe)} />
        </RowWrapper>
        <RowWrapper>
          <Typography fontWeight={400} fontSize={14}>
            Subscribe new DAO creation
          </Typography>
          <Switch checked={isSubscribeNewDAO} onChange={() => setIsSubscribeNewDAO(!isSubscribeNewDAO)} />
        </RowWrapper>
        <RowWrapper>
          <Typography fontWeight={400} fontSize={14}>
            Subscribe to all airdrop information
          </Typography>
          <Switch checked={isSubscribeAirdrop} onChange={() => setIsSubscribeAirdrop(!isSubscribeAirdrop)} />
        </RowWrapper>
        <RowWrapper>
          <Typography fontWeight={400} fontSize={14}>
            Subscribe to all DAO proposal information
          </Typography>
          <Switch checked={isSubscribeProposal} onChange={() => setIsSubscribeProposal(!isSubscribeProposal)} />
        </RowWrapper>
        <Typography fontWeight={400} fontSize={14} textAlign="center" color={theme.textColor.text3}></Typography>
      </Box>
    </Modal>
  )
}
