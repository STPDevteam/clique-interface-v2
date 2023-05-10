// import { Close } from '@mui/icons-material'
import Button from 'components/Button/Button'
import Modal from '../../../components/Modal/index'
import { Typography, Box } from '@mui/material'
import cliqueIcon from 'assets/images/cliqueIcon.png'
// import cereIcon from 'assets/images/cereIcon.png'
import Image from 'components/Image'
import { useDaoInfo } from 'hooks/useDaoInfo'
import { ChainId } from 'constants/chain'
import { useGetMembersInfo } from 'hooks/useBackedTaskServer'
import { formatMillion } from 'utils/dao'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

export default function JoinDAOModal({
  onClick,
  open,
  disable,
  daoChainId,
  daoAddress,
  status
}: {
  onClick: () => void
  open: boolean
  disable: boolean
  daoChainId: ChainId
  daoAddress: string
  status: string | undefined
}) {
  const history = useHistory()
  const daoInfo = useDaoInfo(daoAddress, (daoChainId as unknown) as ChainId)
  const { result: membersInfo } = useGetMembersInfo(daoAddress, (daoChainId as unknown) as ChainId)
  const handleCloseModal = useCallback(() => {
    history.goBack()
  }, [history])

  return (
    <Modal maxWidth="482px" width="100%" customIsOpen={open} closeIcon customOnDismiss={handleCloseModal} BackdropClick>
      <Box
        display="grid"
        padding="32px"
        textAlign={'center'}
        width="100%"
        height="480px"
        sx={{
          '& img': {
            margin: 'auto'
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <div />
          <Image width={83} src={cliqueIcon}></Image>
        </Box>
        <Image width={147} height={147} src={daoInfo?.daoLogo || ''}></Image>
        <Typography variant="inherit" fontSize={24} fontWeight={600} color={'#3F5170'}>
          {daoInfo?.name}
        </Typography>
        <Typography
          variant="inherit"
          sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          height={66}
          lineHeight={'21px'}
          fontSize={14}
          fontWeight={400}
          color="#80829F"
        >
          {daoInfo?.description}
        </Typography>
        <Typography variant="inherit">
          Member <span style={{ fontWeight: 600 }}>{membersInfo && formatMillion(membersInfo?.members)}</span>
        </Typography>
        <Button onClick={onClick} disabled={disable} height="40px">
          {status}
        </Button>
      </Box>
    </Modal>
  )
}
