import Modal from '../../../components/Modal/index'
import { Box, Stack, MenuItem, Typography, useTheme } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import Input from 'components/Input'
import { useState } from 'react'
import Select from 'components/Select/Select'
import useModal from 'hooks/useModal'
import { toast } from 'react-toastify'
import { useAddTeamspace, useUpdateTeamspace } from 'hooks/useBackedDaoServer'
import * as yup from 'yup'
import FormItem from 'components/FormItem'
import { Form, Formik } from 'formik'
import { LoadingButton } from '@mui/lab'

const guestList = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' }
]

export default function AddTeamspaceModal({
  isEdit,
  daoId,
  spacesId,
  originTitle,
  originContent,
  originAccess,
  onDimiss
}: {
  isEdit: boolean
  daoId: number
  spacesId?: number
  originContent?: string
  originTitle?: string
  originAccess?: string
  onDimiss: () => void
}) {
  const [currentStatus, setCurrentStatus] = useState<string>(originAccess ?? 'public')
  const { hideModal } = useModal()
  const create = useAddTeamspace()
  const update = useUpdateTeamspace()
  const theme = useTheme()

  const validationSchema = yup.object().shape({
    title: yup
      .string()
      .trim()
      .required('Title required'),
    des: yup
      .string()
      .trim()
      .required('Description required')
  })

  const initialValues = {
    title: originTitle || '',
    des: originContent || ''
  }

  const handleSubmit = (values: any) => {
    if (isEdit) {
      if (!spacesId) return
      update(currentStatus, values.des, spacesId, values.title).then((res: any) => {
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'network error')
          return
        }
        toast.success('Update success')
        hideModal()
        onDimiss()
      })
    } else {
      create(currentStatus, values.des, daoId, values.title)
        .then((res: any) => {
          if (res.data.code !== 200) {
            toast.error(res.data.msg || 'network error')
            return
          }
          toast.success('Create success')
          hideModal()
          onDimiss()
        })
        .catch(err => {
          console.log(err)
          toast.error('create error')
        })
    }
  }

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, errors, touched }) => {
        return (
          <Modal maxWidth="480px" width="100%" closeIcon padding="13px 28px">
            <Box component={Form} display="grid" textAlign={'center'} width="100%" height="480px">
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
                {isEdit ? 'Edit Workspace' : 'Add Workspace'}
              </Box>
              <FormItem name="title" required>
                <Input
                  value={values.title}
                  style={{ borderColor: errors.title && touched.title ? '#e46767' : '#d4d7e2' }}
                  maxLength={20}
                  onChange={e => setFieldValue('title', e)}
                  label="Title"
                  endAdornment={
                    <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2" fontSize={14}>
                      {values.title.length}/20
                    </Typography>
                  }
                />
              </FormItem>
              <FormItem name="des" required>
                <Input
                  height={138}
                  style={{
                    padding: '5px 20px',
                    borderColor: errors.des && touched.des ? '#e46767' : '#d4d7e2',
                    lineHeight: '20px'
                  }}
                  value={values.des}
                  maxLength={200}
                  multiline
                  rows={6}
                  label="Description"
                  onChange={e => setFieldValue('des', e)}
                />
              </FormItem>
              <Select
                placeholder=""
                width={'422px'}
                height={40}
                noBold
                label="Guests"
                value={currentStatus}
                style={{ borderRadius: '8px', borderColor: '#D4D7E2' }}
                onChange={e => {
                  setCurrentStatus(e.target.value)
                }}
              >
                {guestList.map(item => (
                  <MenuItem
                    key={item.value}
                    sx={{ fontWeight: 500, fontSize: 10 }}
                    value={item.value}
                    selected={currentStatus === item.value}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              <Stack gridTemplateColumns={'1fr 1fr'} justifyContent={'space-between'} flexDirection={'row'} mt={10}>
                <OutlineButton onClick={hideModal} noBold color="#0049C6" width={'125px'} height="40px">
                  Close
                </OutlineButton>
                {isEdit ? (
                  <LoadingButton
                    loadingPosition="start"
                    startIcon={<></>}
                    variant="contained"
                    color="primary"
                    sx={{ width: 125, height: 40, textAlign: 'center' }}
                    type="submit"
                  >
                    Save
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    loadingPosition="start"
                    startIcon={<></>}
                    variant="contained"
                    color="primary"
                    sx={{ width: 125, height: 40, textAlign: 'center' }}
                    type="submit"
                  >
                    Add
                  </LoadingButton>
                )}
              </Stack>
            </Box>
          </Modal>
        )
      }}
    </Formik>
  )
}
