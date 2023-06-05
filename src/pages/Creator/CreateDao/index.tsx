import { Alert, Box, Typography, styled } from '@mui/material'
import CrateBg from 'assets/images/cratedao_bg.png'
import { ReactComponent as WelcomeTitle } from 'assets/svg/web3title.svg'
import UpImgButton from 'components/UploadImage/UpImgButton'
import { BlackButton } from 'components/Button/Button'
import Input from 'components/Input'
import CategoriesSelect from 'components/Governance/CategoriesSelect'
import Back from 'components/Back'
import { createDao } from 'utils/fetch/server'
import { useState, useMemo, useCallback } from 'react'

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
  const [imgLogo, setimgLogo] = useState('http://devapiv2.myclique.io/static/1665558531929085683.png')
  const [daoName, setdaoName] = useState('asdas')
  const [userName, setUserName] = useState('asdasd')
  const [Introduction, setIntroduction] = useState('asdasd')
  const [selectType, setSelectType] = useState('Social')

  const CreateDaofn = useCallback(async () => {
    try {
      const res = await createDao(Introduction, selectType.split(','), imgLogo, daoName, userName)
      console.log(res, 9)
    } catch (error) {
      console.log('Error occurred while creating DAO:', error)
    }
  }, [Introduction, selectType, imgLogo, daoName, userName])

  const createHandler = useMemo(() => {
    if (!imgLogo) {
      return {
        disabled: true,
        error: 'Logo required'
      }
    }

    if (!daoName) {
      return {
        disabled: true,
        error: 'DaoName required'
      }
    }
    if (!userName) {
      return {
        disabled: true,
        error: 'UserName required'
      }
    }
    if (userName && userName.length < 4) {
      return {
        disabled: true,
        error: 'The number of characters is too few.'
      }
    }
    if (userName && userName.length > 20) {
      return {
        disabled: true,
        error: 'The number of characters exceeds the limit'
      }
    }

    if (!Introduction) {
      return {
        disabled: true,
        error: 'Introduction required'
      }
    }
    if (!selectType) {
      return {
        disabled: true,
        error: 'selectType required'
      }
    }
    return {
      disabled: false,
      handler: CreateDaofn
    }
  }, [Introduction, selectType, imgLogo, daoName, userName, CreateDaofn])

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex' }}>
      <Box
        sx={{
          padding: '77px 108px 0 61px',
          height: 'calc(100vh - 80px)',
          width: '700px',
          backgroundImage: `url(${CrateBg})`,
          backgroundSize: '100% 100%'
        }}
      >
        <WelcomeTitle />
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: '18px',
            lineHeight: '24px',
            color: ' #FFFFFF',
            mt: 10
          }}
        >
          Elevate the blockchain space.
        </Typography>
      </Box>
      <Box
        sx={{
          boxSizing: 'border-box',
          maxWidth: 644,
          padding: '70px 0 0 80px'
        }}
      >
        <Typography variant="h3" sx={{ lineHeight: '56px', fontWeight: 700 }}>
          Build a DAO
        </Typography>

        <UpImgButton sx={{ mt: 20 }} logoTitle="LOGO" size={125} value={imgLogo} onChange={val => setimgLogo(val)} />

        <Box sx={{ mt: 30 }}>
          <TitleStyle>Organization Name</TitleStyle>
          <InputStyle value={daoName} placeholder="Enter name" onChange={e => setdaoName(e.target.value)} />
        </Box>
        <Box sx={{ mt: 20 }}>
          <TitleStyle>Organization UserName</TitleStyle>
          <Typography variant="body2" sx={{ lineHeight: '20px', fontSize: 14, mt: 8 }}>
            Organize username must be between 4-20 characters and contain letters, numbers and underscores only.
          </Typography>
          <InputStyle
            value={userName}
            onChange={e => setUserName(e.target.value)}
            placeholder="Enter organize userName"
          />
        </Box>
        <Box sx={{ mt: 16 }}>
          <TitleStyle>Introduction </TitleStyle>
          <InputStyle
            value={Introduction}
            onChange={e => setIntroduction(e.target.value)}
            placeholder="Write a description"
          />
        </Box>
        <Box sx={{ mt: 20 }}>
          <CategoriesSelect
            style={{ maxWidth: '564px' }}
            value={selectType}
            onChange={val => {
              setSelectType(val)
            }}
          />
        </Box>
        <Box sx={{ height: 60 }}>
          {createHandler.error ? <Alert severity="error">{createHandler.error}</Alert> : ''}
        </Box>

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Back sx={{ margin: '0 !important' }} />
          <BlackButton
            disabled={createHandler.disabled}
            style={{ width: '270px', height: '40px' }}
            onClick={createHandler.handler}
          >
            Create Now
          </BlackButton>
        </Box>
      </Box>
    </Box>
  )
}
