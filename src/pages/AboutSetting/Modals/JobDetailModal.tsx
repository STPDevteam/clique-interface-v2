import Modal from '../../../components/Modal/index'
import { Box, Stack, Typography } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import useModal from 'hooks/useModal'
import { useCallback } from 'react'
import AddJobsModal from './AddJobsModal'

export default function JobDetailModal({ title, requirements }: { title: string; requirements: string[] }) {
  const { showModal, hideModal } = useModal()
  const deleteClick = useCallback(() => {}, [])
  const updateClick = useCallback(() => {}, [])
  const editClick = useCallback(() => {
    hideModal()
    showModal(<AddJobsModal isEdit={true} onClose={deleteClick} onClick={updateClick} />)
  }, [deleteClick, hideModal, showModal, updateClick])
  return (
    <Modal maxWidth="480px" width="100%" closeIcon padding="13px 28px">
      <Box
        display="flex"
        textAlign={'center'}
        width="100%"
        height="480px"
        flexDirection={'column'}
        sx={{
          '& p': {
            textAlign: 'left',
            width: '100%'
          }
        }}
      >
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
          Job Detail
        </Box>
        <Typography
          mt={27}
          height={'fit-content'}
          color="#80829F"
          fontWeight={500}
          fontSize={14}
          lineHeight={'20px'}
          fontFamily={'Inter'}
        >
          Title
        </Typography>
        <Typography
          mt={10}
          height={'fit-content'}
          color="#3F5170"
          fontWeight={600}
          fontSize={16}
          lineHeight={'16px'}
          fontFamily={'Inter'}
        >
          {title}
        </Typography>
        <Typography
          mt={30}
          height={'fit-content'}
          color="#80829F"
          fontWeight={500}
          fontSize={14}
          lineHeight={'20px'}
          fontFamily={'Inter'}
        >
          Job description
        </Typography>
        <Box
          mt={20}
          height={80}
          sx={{
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column'
          }}
        >
          {requirements.map((item, index) => (
            <Typography key={item + index} fontWeight={500} fontSize={16}>
              {index + 1}.{item}
            </Typography>
          ))}
        </Box>
        <Stack gridTemplateColumns={'1fr 1fr'} justifyContent={'space-between'} flexDirection={'row'} mt={186}>
          <div></div>
          <OutlineButton onClick={editClick} noBold color="#0049C6" width={'125px'} height="40px">
            Edit
          </OutlineButton>
        </Stack>
      </Box>
    </Modal>
  )
}