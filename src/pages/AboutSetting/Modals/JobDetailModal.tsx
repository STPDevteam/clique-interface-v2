import Modal from '../../../components/Modal/index'
import { Box, Stack, Typography } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'

export default function JobDetailModal({ onClick }: { onClick: () => void }) {
  return (
    <Modal maxWidth="480px" width="100%" closeIcon padding="13px 28px">
      <Box display="grid" textAlign={'center'} width="100%" height="480px">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          color={'#3F5170'}
          sx={{
            fontSize: 14,
            fontWeight: 500
          }}
        >
          Add job
        </Box>
        <Typography color="#80829F" fontWeight={500} fontSize={14} lineHeight={'20px'} fontFamily={'Inter'}>
          Title
        </Typography>
        <Typography color="#3F5170" fontWeight={600} fontSize={16} lineHeight={'16px'} fontFamily={'Inter'}>
          Contract developer（Core）
        </Typography>
        <Typography color="#80829F" fontWeight={500} fontSize={14} lineHeight={'20px'} fontFamily={'Inter'}>
          Job description
        </Typography>
        <Stack gridTemplateColumns={'1fr 1fr'} justifyContent={'space-between'} flexDirection={'row'}>
          <></>
          <OutlineButton onClick={onClick} noBold color="#0049C6" width={'125px'} height="40px">
            Edit
          </OutlineButton>
        </Stack>
      </Box>
    </Modal>
  )
}
