import { Box, Stack, styled, Typography, useTheme } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import CategoriesSelect from 'components/Governance/CategoriesSelect'
import Input from 'components/Input'
import UpImgButton from 'components/UploadImage/UpImgButton'
import Tooltip from 'components/Tooltip'
import { useState } from 'react'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import FormItem from 'components/FormItem'
import { FormType } from './type'
import { formCheckValid } from 'utils'
import { CreateDaoDataProp } from 'state/buildingGovDao/actions'
import { toast } from 'react-toastify'
import { useUpdateDaoGeneral } from 'hooks/useBackedDaoServer'
import { useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'

export const sxInputStyle = {
  '& .MuiInputBase-root': {
    '& fieldset': {
      border: 'none'
    }
  }
}

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'unset',
    padding: '20px'
  }
}))

// const InputStyle = styled(Input)(() => ({
//   height: 40
// }))

export default function General({ daoInfo, daoChainId }: { daoInfo: CreateDaoDataProp; daoChainId: number }) {
  const [loading, setLoading] = useState(false)
  // const [ToggleValue, setToggleValue] = useState('Anyone')
  const schema = yup.object().shape({
    daoLogo: yup.string().required('Please upload your Dao picture'),
    name: yup
      .string()
      .trim()
      .required('Please enter your Organization Name')
      .max(20, 'Allow only no more than 20 letters'),
    handle: yup.string().trim(),
    description: yup
      .string()
      .trim()
      .required(formCheckValid('description', FormType.Input))
      .max(1000, `*The number of characters exceeds the limit`),
    category: yup.string().required(formCheckValid('category', FormType.Select)),
    website: yup
      .string()
      .trim()
      .url('Please enter a valid URL'),
    twitter: yup
      .string()
      .trim()
      .url('Please enter a valid URL'),
    github: yup
      .string()
      .trim()
      .url('Please enter a valid URL'),
    discord: yup
      .string()
      .trim()
      .url('Please enter a valid URL'),
    instagram: yup
      .string()
      .trim()
      .url('Please enter a valid URL')
    // tokenContractAddr: yup.string().matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid token contract address'),
    // holdAmount: yup.string().when('ToggleValue', {
    //   is: 'Anyone',
    //   then: yup.string(),
    //   otherwise: yup.string().required('amount can not be empty')
    // }),
    // tokenChain: yup.object({
    //   icon: yup.mixed<ReactNode>(),
    //   link: yup.string(),
    //   selectedIcon: yup.mixed<ReactNode>()
    // })
  })
  // const ListItem = [
  //   { label: 'Anyone', value: 'Anyone' },
  //   { label: 'Holding token or NFT', value: 'Holding token or NFT' }
  // ]
  // const childStateRef = useRef<{ token: Token; totalSupply: TokenAmount } | undefined | null>(null)
  const theme = useTheme()
  const updateDaoGeneral = useUpdateDaoGeneral()
  const { updateDaoBaseData } = useUpdateDaoDataCallback()
  const initialValues = {
    daoLogo: daoInfo.daoLogo || '',
    name: daoInfo.daoName || '',
    description: daoInfo.bio || '',
    category: daoInfo.category?.join(',') || '',
    twitter: daoInfo.twitter || '',
    website: daoInfo.website || '',
    github: daoInfo.github || '',
    discord: daoInfo.discord || '',
    handle: daoInfo.handle
  }

  const handleSubmit = (values: any) => {
    if (
      daoInfo?.daoLogo === values.daoLogo &&
      daoInfo?.daoName === values.name &&
      daoInfo?.twitter === values?.twitter &&
      daoInfo?.discord === values?.discord &&
      daoInfo?.bio === values?.description &&
      daoInfo?.website === values?.website &&
      daoInfo?.github === values?.github &&
      daoInfo?.category?.join(',') === values.category
    ) {
      toast.info('Nothing changed')
      return
    }
    setLoading(true)
    updateDaoGeneral(
      values.description,
      values.category.split(','),
      daoChainId,
      values.daoLogo,
      values.name,
      values.discord,
      values.github,
      undefined,
      values.twitter,
      values.website
    )
      .then((res: any) => {
        setLoading(false)
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'Network error')
          return
        }
        updateDaoBaseData()
        toast.success('Update success')
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  return (
    <Formik validationSchema={schema} initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ values, setFieldValue, errors }) => {
        return (
          <Box component={Form} noValidate>
            <Wrapper>
              <Stack
                spacing={19}
                sx={{
                  '& .MuiInputBase-input': {
                    height: '40!important',
                    padding: '0 15px 0 0!important'
                  },
                  '& .MuiSelect-select.MuiInputBase-input': {
                    paddingLeft: '20px!important'
                  }
                }}
              >
                <FormItem name="daoLogo" required>
                  <Box sx={{ display: 'flex', gap: 42, mt: 20, mb: 10 }}>
                    <UpImgButton onChange={val => setFieldValue('daoLogo', val)} size={124} value={values.daoLogo} />
                  </Box>
                </FormItem>
                <FormItem name="category" required fieldType="custom">
                  <CategoriesSelect
                    style={{ height: '42px!important' }}
                    value={values.category}
                    onChange={val => {
                      setFieldValue('category', val)
                    }}
                  />
                </FormItem>
                <FormItem name="discord">
                  <Input
                    style={{
                      borderColor: errors.discord ? '#e46767' : '#D4D7E2'
                    }}
                    label="Discord"
                    placeholderSize="14px"
                    placeholder="e.c. bitcoin"
                    value={values.discord}
                  />
                </FormItem>
                <FormItem name="website">
                  <Input
                    style={{
                      borderColor: errors.website ? '#e46767' : '#D4D7E2'
                    }}
                    label="Website"
                    value={values.website}
                  />
                </FormItem>
                <FormItem name="github">
                  <Input
                    style={{
                      borderColor: errors.github ? '#e46767' : '#D4D7E2'
                    }}
                    label="Github"
                    placeholderSize="14px"
                    placeholder="e.c. bitcoin"
                    value={values.github}
                  />
                </FormItem>
                <FormItem sx={sxInputStyle} name="twitter">
                  <Input
                    label="Twitter"
                    value={values.twitter}
                    style={{
                      borderColor: errors.twitter ? '#e46767' : '#D4D7E2'
                    }}
                  />
                </FormItem>
              </Stack>
              <Box
                display={'grid'}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  '& .MuiInputBase-input': {
                    height: '40!important',
                    padding: '0 15px 0 0!important'
                  },
                  '& .MuiBox-root .MuiFormLabel-root': {
                    marginBottom: 7
                  }
                }}
              >
                <FormItem name="name" required>
                  <Input
                    label="Organization Name"
                    placeholderSize="14px"
                    endAdornment={
                      <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2" fontSize={14}>
                        {values.name.length}/20
                      </Typography>
                    }
                    placeholder="Organization Name"
                    value={values.name}
                  />
                </FormItem>
                <FormItem name="handle">
                  <Box>
                    <Typography
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        mb: 10,
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#80829F'
                      }}
                    >
                      Organize Username
                      <Tooltip
                        placement="top-start"
                        value="Organize username must be between 4-20 characters and contain letters, numbers and underscores only."
                      />
                    </Typography>
                    <Input
                      readOnly
                      endAdornment={
                        <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2" fontSize={14}>
                          {values.handle.length}/20
                        </Typography>
                      }
                      value={values.handle}
                    />
                  </Box>
                </FormItem>
                <FormItem sx={sxInputStyle} name="description" required>
                  <Input
                    height={377}
                    width={319}
                    label="Introduction"
                    placeholderSize="14px"
                    multiline
                    rows={15}
                    style={{
                      borderColor: errors.description ? '#e46767' : '#D4D7E2'
                    }}
                    endAdornment={
                      <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2" fontSize={14}>
                        {values.description.length}/1,000
                      </Typography>
                    }
                    placeholder="Add a brief description about your project."
                    value={values.description}
                  />
                </FormItem>
              </Box>
            </Wrapper>
            <Box mt={30} display="flex" justifyContent={'flex-end'} mb={20}>
              <LoadingButton
                loading={loading}
                loadingPosition="center"
                startIcon={<></>}
                variant="contained"
                color="primary"
                sx={{ width: 270, height: 40, textAlign: 'center' }}
                type="submit"
              >
                Save
              </LoadingButton>
            </Box>
          </Box>
        )
      }}
    </Formik>
  )
}

// function TokenContainer({
//   daoInfo,
//   values,
//   errors,
//   shareChildRef
// }: {
//   daoInfo: CreateDaoDataProp
//   values: any
//   errors: any
//   shareChildRef: any
// }) {
//   const [currentBaseChain, setCurrentBaseChain] = useState<any>(ChainListMap[daoInfo.join.chainId ?? 0])
//   const govToken = useTokenByChain(
//     isAddress(values.tokenContractAddr) ? values.tokenContractAddr : undefined,
//     currentBaseChain?.id
//   )
//   useEffect(() => {
//     shareChildRef.current = govToken
//   }, [govToken, shareChildRef])

//   return (
//     <>
//       <Box
//         sx={{
//           mt: 20,
//           display: 'grid',
//           gridTemplateColumns: '1fr 1fr 1fr 1fr',
//           gap: 16
//         }}
//       >
//         <Box>
//           <Typography
//             sx={{
//               fontWeight: 500,
//               fontSize: '14px',
//               lineHeight: '16px',
//               color: '#80829F',
//               mb: 10
//             }}
//           >
//             Network
//           </Typography>
//           <FormItem>
//             <ChainSelect
//               chainList={ChainList.filter(
//                 v =>
//                   v.id !== ChainId.POLYGON_MANGO &&
//                   v.id !== ChainId.COINBASE_TESTNET &&
//                   v.id !== ChainId.ZetaChain_TESTNET &&
//                   v.id !== ChainId.ZKSYNC_ERA &&
//                   v.id !== ChainId.ZKSYNC_ERA_TESTNET
//               )}
//               height={40}
//               selectedChain={currentBaseChain}
//               onChange={(e: any) => {
//                 setCurrentBaseChain(e)
//               }}
//             />
//           </FormItem>
//         </Box>
//         <FormItem name="tokenContractAddr">
//           <InputStyle
//             label="Token Contract Address"
//             placeholderSize="14px"
//             placeholder="0x..."
//             value={values.tokenContractAddr}
//             sx={{
//               borderColor: errors.tokenContractAddr ? '#e46767 !important' : '#D4D7E2'
//             }}
//           />
//         </FormItem>
//         <FormItem name="holdAmount">
//           <NumericalInput
//             style={{
//               borderColor: errors.holdAmount ? '#e46767' : '#D4D7E2'
//             }}
//             label="Number"
//             placeholderSize="14px"
//             placeholder="0"
//             value={values.holdAmount}
//           />
//         </FormItem>
//         <Box>
//           <Typography
//             sx={{
//               fontWeight: 500,
//               fontSize: '14px',
//               lineHeight: '16px',
//               color: '#80829F'
//             }}
//           >
//             Token preview
//           </Typography>
//           <Box
//             sx={{
//               '& p': {
//                 fontWeight: 500,
//                 fontSize: '14px',
//                 lineHeight: '20px',
//                 color: '#3F5170'
//               },
//               mt: 14,
//               gap: 10,
//               height: 40,
//               display: 'flex',
//               flexDirection: 'row',
//               alignItems: 'center'
//             }}
//           >
//             {govToken?.token && (
//               <>
//                 <Image width={20} src={govToken?.token.logo || tokenLogo} />
//                 <Typography>{`${govToken?.token.name}(${govToken?.token.symbol})`}</Typography>
//               </>
//             )}
//           </Box>
//         </Box>
//       </Box>
//     </>
//   )
// }
