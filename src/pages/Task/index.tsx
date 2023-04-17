import { Box } from '@mui/material'
import Button from 'components/Button/Button'
import { useCallback } from 'react'
import SidePanel from './Children/SidePanel'
import useModal from 'hooks/useModal'

export default function Index() {
  const { showModal, hideModal } = useModal()
  const showSidePanel = useCallback(() => {
    showModal(<SidePanel open={true} onDismiss={hideModal} />)
  }, [hideModal, showModal])
  return (
    <Box gap={10}>
      <Button width="100px" onClick={showSidePanel}>
        New
      </Button>
    </Box>
  )
}
