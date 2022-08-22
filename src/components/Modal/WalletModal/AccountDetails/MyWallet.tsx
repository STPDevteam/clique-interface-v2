import { Box, Stack, Typography } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import Copy from 'components/essential/Copy'
import { injected, walletlink } from 'connectors'
import { routes } from 'constants/routes'
import { useActiveWeb3React } from 'hooks'
import { useHistory } from 'react-router-dom'
import { ApplicationModal } from 'state/application/actions'
import { useToggleModal } from 'state/application/hooks'

export default function MyWallet() {
  const { account, deactivate, connector } = useActiveWeb3React()
  const toggleModal = useToggleModal(ApplicationModal.WALLET)
  const history = useHistory()

  return (
    <Box>
      <Stack direction={'row'} alignItems="center" spacing={6}>
        <Typography fontSize={12} fontWeight={600}>
          {account}
        </Typography>
        <Copy toCopy={account || ''} />
      </Stack>
      <Box display={'flex'} mt={24} justifyContent="space-around">
        <OutlineButton
          onClick={() => {
            toggleModal()
            history.push(routes._Profile)
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
          disabled={connector !== injected || connector === walletlink}
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
    </Box>
  )
}
