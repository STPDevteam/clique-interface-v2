import { Box, Stack, styled, Typography, useTheme, Checkbox } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import CategoriesSelect from 'components/Governance/CategoriesSelect'
import Input from 'components/Input'
// import UpImgButton from 'components/UploadImage/UpImgButton'
import UploadImage from 'components/UploadImage'
// import Button from 'components/Button/Button'
import NumericalInput from 'components/Input/InputNumerical'
import { DaoInfoProp } from 'hooks/useDaoInfo'
import Tooltip from 'components/Tooltip'
import ToggleButtonGroup from 'components/ToggleButtonGroup'
import ChainSelect from 'components/Select/ChainSelect'
import { useState, ReactNode } from 'react'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { useAdminSetInfoCallback } from 'hooks/useGovernanceDaoCallback'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import FormItem from 'components/FormItem'
import { FormType } from './type'
import { formCheckValid } from 'utils'
import { ChainId, ChainList, ChainListMap } from 'constants/chain'

// import { useActiveWeb3React } from 'hooks'
// import useModal from 'hooks/useModal'
// import MessageBox from 'components/Modal/TransactionModals/MessageBox'
// import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
// import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
// import { useCallback, useMemo, useState } from 'react'
// import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
// import { removeEmoji } from 'utils'
// import { triggerSwitchChain } from 'utils/triggerSwitchChain'

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

const InputStyle = styled(Input)(() => ({
  height: 40
}))

const validationSchema = yup.object({
  daoLogo: yup.string().required('Please upload your Dao picture'),
  name: yup
    .string()
    .trim()
    .required('Please enter your Organization Name')
    .max(20, 'Allow only no more than 20 letters'),
  handle: yup
    .string()
    .trim()
    .required('Please enter your Organize Username')
    .max(20, 'Allow only no more than 20 letters'),
  description: yup
    .string()
    .trim()
    .required(formCheckValid('description', FormType.Input))
    .max(200, `*The number of characters exceeds the limit`),
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
    .url('Please enter a valid URL'),
  daoTokenAddress: yup.string().trim(),
  daoTokenChainId: yup.number(),
  baseChain: yup.object({
    icon: yup.mixed<ReactNode>(),
    link: yup.string(),
    selectedIcon: yup.mixed<ReactNode>()
  })
})

export default function General({ daoInfo, daoChainId }: { daoInfo: DaoInfoProp; daoChainId: ChainId }) {
  // const currentBaseChain = useMemo(() => (daoChainId ? ChainListMap[daoChainId] || null : null), [daoChainId])
  const [currentBaseChain, setCurrentBaseChain] = useState<any>(ChainListMap[daoChainId])
  const ListItem = [
    { label: 'Anyone', value: 'Anyone' },
    { label: 'Holding token or NFT', value: 'Holding token or NFT' }
  ]
  const [checked, setChecked] = useState(false)
  const checkedChange = (event: any) => {
    setChecked(event.target.checked)
  }
  const [ToggleValue, setToggleValue] = useState('Anyone')
  const theme = useTheme()
  const { claimSubmitted: isSaving } = useUserHasSubmittedClaim(`${daoInfo.daoAddress}_UpdateGeneralSetting`)
  const adminSetInfoCallback = useAdminSetInfoCallback(daoInfo.daoAddress)
  const initialValues = {
    daoLogo: daoInfo.daoLogo || '',
    name: daoInfo.name || '',
    description: daoInfo.description || '',
    category: daoInfo.category || '',
    twitter: daoInfo.twitter || '',
    website: daoInfo.website || '',
    github: daoInfo.github || '',
    discord: daoInfo.discord || '',
    handle: daoInfo.handle || '',
    baseChain: currentBaseChain || null,
    daoTokenAddress: daoInfo.daoTokenAddress || '',
    daoTokenChainId: currentBaseChain?.id || 0
  }

  const handleSubmit = (values: any) => {
    console.log(values, adminSetInfoCallback)
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue }) => {
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
                    <UploadImage
                      onChange={val => setFieldValue('daoLogo', val)}
                      size={124}
                      showUploadBtn={true}
                      value={daoInfo.daoLogo}
                    />
                  </Box>
                </FormItem>
                <FormItem sx={sxInputStyle} name="description" required>
                  <Input
                    label="Introduction"
                    placeholderSize="14px"
                    endAdornment={
                      <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2" fontSize={14}>
                        {values.description.length}/200
                      </Typography>
                    }
                    placeholder="Add a brief description about your project."
                    value={values.description}
                  />
                </FormItem>
                <FormItem name="category" required fieldType="custom">
                  <CategoriesSelect
                    style={{ height: '42px!important' }}
                    value={values.category}
                    onChange={val => setFieldValue('category', val)}
                  />
                </FormItem>
                <FormItem sx={sxInputStyle} name="twitter">
                  <Input label="Twitter" value={values.twitter} />
                </FormItem>
              </Stack>
              <Box
                display={'grid'}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  // justifyContent: 'space-between',
                  gap: 20,
                  '& .MuiInputBase-input': {
                    height: '40!important',
                    padding: '0 15px 0 0!important'
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
                <FormItem name="handle" required>
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
                      <Tooltip value="Organize username must be between 4-20 characters and contain letters, numbers and underscores only." />
                    </Typography>
                    <Input
                      endAdornment={
                        <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2" fontSize={14}>
                          {values.handle.length}/20
                        </Typography>
                      }
                      value={values.handle}
                    />
                  </Box>
                </FormItem>
                <FormItem>
                  <Input label="Github" placeholderSize="14px" placeholder="e.c. bitcoin" value={values.github} />
                </FormItem>
                <FormItem>
                  <Input label="Discord" placeholderSize="14px" placeholder="e.c. bitcoin" value={values.discord} />
                </FormItem>
                <FormItem>
                  <Input label="Website" value={values.website} />
                </FormItem>
              </Box>
            </Wrapper>
            <Box sx={{ mt: 20, display: 'flex', gap: 38, alignItems: 'center' }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '16px',
                  color: '#80829F'
                }}
              >
                Who can join the DAO
              </Typography>
              <ToggleButtonGroup itemWidth={150} Props={ListItem} setToggleValue={setToggleValue} />
            </Box>

            {ToggleValue == 'Anyone' ? (
              ''
            ) : (
              <Box
                sx={{
                  mt: 20,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  gap: 16
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '16px',
                      color: '#80829F',
                      mb: 10
                    }}
                  >
                    Network
                  </Typography>
                  <FormItem name="daoTokenChainId" fieldType="custom">
                    <ChainSelect
                      chainList={ChainList.filter(
                        v =>
                          v.id !== ChainId.POLYGON_MANGO &&
                          v.id !== ChainId.COINBASE_TESTNET &&
                          v.id !== ChainId.ZetaChain_TESTNET &&
                          v.id !== ChainId.ZKSYNC_ERA &&
                          v.id !== ChainId.ZKSYNC_ERA_TESTNET
                      )}
                      height={40}
                      selectedChain={currentBaseChain}
                      onChange={(e: any) => {
                        setCurrentBaseChain(e)
                        setFieldValue('daoTokenChainId', e?.id)
                      }}
                    />
                  </FormItem>
                </Box>
                <FormItem name="daoTokenAddress">
                  <InputStyle
                    label="Token Contract Address"
                    placeholderSize="14px"
                    placeholder="0x..."
                    value={values.daoTokenAddress}
                  />
                </FormItem>
                <FormItem>
                  <NumericalInput label="Number" placeholderSize="14px" placeholder="0" value={''} />
                </FormItem>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '16px',
                      color: '#80829F'
                    }}
                  >
                    Token preview
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#3F5170',
                      mt: 10
                    }}
                  >
                    <Checkbox
                      sx={{ borderRadius: '50%', color: '#D9D9D9' }}
                      checked={checked}
                      onChange={checkedChange}
                    />{' '}
                    STP Network (STPT)
                  </Typography>
                </Box>
              </Box>
            )}

            <Box mt={30} display="flex" justifyContent={'flex-end'}>
              <LoadingButton
                loading={isSaving}
                loadingPosition="start"
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
