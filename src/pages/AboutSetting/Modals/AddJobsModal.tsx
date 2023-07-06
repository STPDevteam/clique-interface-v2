import Modal from '../../../components/Modal/index'
import { Box, Stack, MenuItem } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import Input from 'components/Input'
import { useCallback, useState } from 'react'
import Select from 'components/Select/Select'
import { useCreateNewJob, useDeleteJob, useUpdateNewJob } from 'hooks/useBackedTaskServer'
import useModal from 'hooks/useModal'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import FormItem from 'components/FormItem'
import { Form, Formik } from 'formik'
import { LoadingButton } from '@mui/lab'

const guestList = [
  { value: 1, label: 'Super Admin' },
  { value: 2, label: 'admin' }
]

export default function AddJobsModal({
  isEdit,
  publishId,
  chainId,
  originTitle,
  originContent,
  originLevel,
  onDimiss
}: {
  isEdit: boolean
  publishId?: number
  chainId: number
  originContent?: string
  originTitle?: string
  originLevel: number
  onDimiss: () => void
}) {
  const [currentStatus, setCurrentStatus] = useState<number>(originLevel || 1)
  const { hideModal } = useModal()
  const create = useCreateNewJob()
  const deleteFn = useDeleteJob()
  const update = useUpdateNewJob()
  const [isSubmit, setIsSubmit] = useState(false)

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

  const onDelete = useCallback(() => {
    setIsSubmit(true)
    if (!publishId) return
    deleteFn(publishId)
      .then((res: any) => {
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'Network error')
          return
        }
        toast.success('Delete success')
        hideModal()
        onDimiss()
        setIsSubmit(false)
      })
      .catch(err => {
        console.log(err)
        toast.error('Delete error')
      })
  }, [deleteFn, hideModal, onDimiss, publishId])

  const handleSubmit = (values: any) => {
    setIsSubmit(true)
    if (isEdit) {
      if (!publishId) return
      update(values.des, publishId, currentStatus, values.title)
        .then((res: any) => {
          if (res.data.code !== 200) {
            toast.error(res.data.msg || 'Network error')
            return
          }
          toast.success('Update success')
          hideModal()
          onDimiss()
          setIsSubmit(false)
        })
        .catch(err => {
          console.log(err)
          toast.error('Update error')
        })
    } else {
      create(chainId, values.des, currentStatus, values.title)
        .then((res: any) => {
          if (res.data.code !== 200) {
            toast.error(res.data.msg || 'Network error')
            return
          }
          toast.success('Create success')
          hideModal()
          onDimiss()
          setIsSubmit(false)
        })
        .catch(err => {
          console.log(err)
          toast.error('Create error')
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
                {isEdit ? 'Edit job' : 'Add job'}
              </Box>
              <FormItem name="title" required>
                <Input
                  value={values.title}
                  style={{ borderColor: errors.title && touched.title ? '#E46767' : '#D4D7E2' }}
                  maxLength={200}
                  onChange={e => setFieldValue('title', e)}
                  label="Title"
                />
              </FormItem>
              <FormItem name="des" required>
                <Input
                  height={138}
                  style={{
                    padding: '5px 20px',
                    borderColor: errors.des && touched.des ? '#e46767' : '#d4d7e2'
                  }}
                  value={values.des}
                  maxLength={200}
                  multiline
                  rows={6}
                  label="Job description"
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
                {isEdit ? (
                  <>
                    <OutlineButton onClick={onDelete} noBold color="#E46767" width={'125px'} height="40px">
                      Delete
                    </OutlineButton>
                    <LoadingButton
                      disabled={isSubmit}
                      loadingPosition="start"
                      startIcon={<></>}
                      variant="contained"
                      color="primary"
                      sx={{ width: 125, height: 40, textAlign: 'center' }}
                      type="submit"
                    >
                      Save
                    </LoadingButton>
                  </>
                ) : (
                  <>
                    <OutlineButton onClick={hideModal} noBold color="#0049C6" width={'125px'} height="40px">
                      Close
                    </OutlineButton>
                    <LoadingButton
                      disabled={isSubmit}
                      loadingPosition="start"
                      startIcon={<></>}
                      variant="contained"
                      color="primary"
                      sx={{ width: 125, height: 40, textAlign: 'center' }}
                      type="submit"
                    >
                      Add
                    </LoadingButton>
                  </>
                )}
              </Stack>
            </Box>
          </Modal>
        )
      }}
    </Formik>
  )
}
