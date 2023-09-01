import { Box, Typography, styled, useTheme } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import WelcomeWeb3_Bg from 'assets/images/cratedao_bg.png'
// import { ReactComponent as WelcomeTitle } from 'assets/svg/web3title.svg'
import WelcomeWeb3 from 'assets/images/welcomweb3_bg.png'
import UpImgButton from 'components/UploadImage/UpImgButton'
import Input from 'components/Input'
import CategoriesSelect from 'components/Governance/CategoriesSelect'
import Back from 'components/Back'
// import OutlineButton from 'components/Button/OutlineButton'
import { createDao } from 'utils/fetch/server'
import { useDaoHandleQuery } from 'hooks/useBackedDaoServer'
import FormItem from 'components/FormItem'
import { Form, Formik } from 'formik'
import { formCheckValid } from 'utils'
import * as yup from 'yup'
import { FormType } from 'pages/DaoInfo/Children/Settings/type'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
import { useActiveWeb3React } from 'hooks'
import { useUserInfo } from 'state/userInfo/hooks'
import { useEffect } from 'react'

const TitleStyle = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '16px',
  color: '#80829F'
}))
const InputStyle = styled(Input)(() => ({
  marginTop: 10,
  height: 40,
  maxWidth: 564
}))

export default function Index() {
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()
  const userSignature = useUserInfo()
  const theme = useTheme()

  useEffect(() => {
    if (!account || !userSignature) {
      navigate(routes.Governance, { replace: true })
    }
  }, [account, navigate, userSignature])

  const validationSchema = yup.object().shape({
    daoLogo: yup.string().required('Please upload your Dao picture'),
    daoName: yup
      .string()
      .trim()
      .required('Please enter your Organization Name')
      .max(18, 'The organize username must be longer than 6 characters and shorter than 18 characters.')
      .min(6, 'The organize username must be longer than 6 characters and shorter than 18 characters.'),
    handle: yup
      .string()
      .trim()
      .required('Please enter your Organization Name')
      .min(4, 'Allow only a minimum of 4 letters and a maximum of 20 letters.')
      .max(20, 'Allow only a minimum of 4 letters and a maximum of 20 letters.')
      .matches(/^\w*$/, 'Only contain letters, numbers and underscores')
      .test('validate', 'Your Organization Username is invalid or This name has been used', async value => {
        if (value && value?.length >= 4 && value?.length <= 20) {
          try {
            const res = await queryHandleCallback(value)
            if (res.data.code === 200) {
              if (res.data.data === true) return false
              return true
            }
            return false
          } catch (error) {
            return false
          }
        }
        return true
      }),
    Introduction: yup.string().required('Please enter your Organization Introduction').trim(),
    category: yup.string().required(formCheckValid('category', FormType.Select))
  })

  const queryHandleCallback = useDaoHandleQuery()
  const { updateMyJoinedDaoListData } = useUpdateDaoDataCallback()

  const initialValues = {
    Introduction: '',
    category: '',
    daoLogo: '',
    daoName: '',
    handle: ''
  }

  const handleSubmit = async (values: any) => {
    const data = {
      bio: values.Introduction,
      category: values.category.split(','),
      daoLogo: values.daoLogo,
      daoName: values.daoName,
      handle: values.handle
    }

    const res = await createDao(data.bio, data.category, data.daoLogo, data.daoName, data.handle)
    if (res.data.code !== 200) {
      toast.error(res.data.msg || 'Network error')
      return
    }
    updateMyJoinedDaoListData()
    toast.success('Create success')
    navigate(routes._DaoInfo + `/${res.data.data}/proposal`)
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
          <Box component={Form} sx={{ height: '100%', width: '100%', display: 'flex' }}>
            <Box
              sx={{
                height: '100vh',
                maxWidth: '70vh',
                width: '50vw',
                [theme.breakpoints.down('sm')]: {
                  display: 'none'
                }
              }}
            >
              <img
                src={WelcomeWeb3}
                alt=""
                style={{
                  position: 'fixed',
                  height: '100vh',
                  maxWidth: '70vh',
                  width: '50vw',
                  objectFit: 'cover'
                }}
              />
            </Box>
            <Box
              sx={{
                boxSizing: 'border-box',
                maxWidth: 644,
                padding: '70px  80px',
                [theme.breakpoints.down('sm')]: {
                  padding: '0',
                  background: `url(${WelcomeWeb3_Bg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  height: '100vh'
                }
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  [theme.breakpoints.down('sm')]: {
                    padding: '40px  30px',
                    height: '100vh',
                    backdropFilter: 'blur(10px)'
                  }
                }}
              >
                <Typography variant="h3" sx={{ lineHeight: '56px', fontWeight: 700 }}>
                  Build a DAO
                </Typography>
                <FormItem name="daoLogo" required>
                  <Box>
                    <UpImgButton
                      sx={{ mt: 20 }}
                      logoTitle="LOGO"
                      size={125}
                      value={values.daoLogo}
                      onChange={val => {
                        setFieldValue('daoLogo', val)
                      }}
                    />
                  </Box>
                </FormItem>
                <Box sx={{ mt: 30, '& .MuiFormHelperText-root': { marginLeft: 0 } }}>
                  <TitleStyle>Organization Name</TitleStyle>
                  <FormItem name="daoName" required>
                    <InputStyle
                      style={{ borderColor: errors.daoName && touched.daoName ? '#E46767' : '#D4D7E2' }}
                      value={values.daoName}
                      placeholder="Enter name"
                      onChange={e => setFieldValue('daoName', e.target.value)}
                    />
                  </FormItem>
                </Box>
                <Box sx={{ mt: 20, '& .MuiFormHelperText-root': { marginLeft: 0 } }}>
                  <TitleStyle>Organization UserName</TitleStyle>
                  <Typography variant="body2" sx={{ lineHeight: '20px', fontSize: 14, mt: 8 }}>
                    Organize username must be between 4-20 lowercase characters and contain letters, numbers and
                    underscores only.
                  </Typography>
                  <FormItem name="handle" required>
                    <Input
                      style={{ borderColor: errors.handle && touched.handle ? '#E46767' : '#D4D7E2' }}
                      value={values.handle}
                      placeholder="Enter organize userName"
                    />
                  </FormItem>
                </Box>
                <Box sx={{ mt: 16, '& .MuiFormHelperText-root': { marginLeft: 0 } }}>
                  <TitleStyle>Introduction </TitleStyle>
                  <FormItem name="Introduction" required>
                    <InputStyle
                      style={{ borderColor: errors.Introduction && touched.Introduction ? '#E46767' : '#D4D7E2' }}
                      value={values.Introduction}
                      onChange={e => setFieldValue('Introduction', e.target.value)}
                      placeholder="Write a description"
                      maxLength={200}
                      endAdornment={
                        <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2" fontSize={14}>
                          {values.Introduction.length}/200
                        </Typography>
                      }
                    />
                  </FormItem>
                </Box>
                <Box sx={{ mt: 20, '& .MuiFormHelperText-root': { marginLeft: 0 } }}>
                  <FormItem name="category" fieldType="custom">
                    <CategoriesSelect
                      style={{
                        maxWidth: '564px',
                        borderColor: errors.category && touched.category ? '#E46767' : '#D4D7E2'
                      }}
                      value={values.category}
                      onChange={val => {
                        setFieldValue('category', val)
                      }}
                    />
                  </FormItem>
                </Box>

                <Box
                  sx={{
                    mt: 40,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 10
                  }}
                >
                  {/* <OutlineButton noBold color="#0049C6" width="200px" height="40px" onClick={history.goBack}>
                  Back
                </OutlineButton> */}
                  <Back sx={{ margin: '0 !important' }} />
                  <LoadingButton
                    // loading={isSaving}
                    loadingPosition="start"
                    startIcon={<></>}
                    variant="contained"
                    color="primary"
                    sx={{
                      width: 270,
                      height: 40,
                      textAlign: 'center',
                      [theme.breakpoints.down('sm')]: {
                        width: 180
                      }
                    }}
                    type="submit"
                  >
                    Create Now
                  </LoadingButton>
                </Box>
              </Box>
            </Box>
          </Box>
        )
      }}
    </Formik>
  )
}
