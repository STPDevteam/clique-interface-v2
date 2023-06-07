import { styled, Box, Alert, Stack, Typography, useTheme, Link } from '@mui/material'
import { ContainerWrapper, CreatorBox } from '../StyledCreate'
import UploadImage from 'components/UploadImage'
import Input from 'components/Input'
import { BlackButton } from 'components/Button/Button'
import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'
import { removeEmoji } from 'utils'
import { useEffect, useMemo } from 'react'
import CategoriesSelect from 'components/Governance/CategoriesSelect'
import { useDaoHandleQuery } from 'hooks/useBackedDaoServer'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'

const Wrapper = styled(CreatorBox)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '296fr 564fr',
  gap: 24,
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'unset',
    padding: '20px'
  }
}))

export default function Basic({ next }: { next: () => void }) {
  const theme = useTheme()
  const { chainId, account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const { buildingDaoData, updateBuildingDaoKeyData } = useBuildingDaoDataCallback()
  const { available: daoHandleAvailable, queryHandleCallback } = useDaoHandleQuery(buildingDaoData.handle)

  useEffect(() => {
    queryHandleCallback(account || undefined, chainId || undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId])

  const nextHandler = useMemo(() => {
    if (!buildingDaoData.daoName.trim()) {
      return {
        disabled: true,
        error: 'Dao name required'
      }
    }
    if (!buildingDaoData.daoLogo) {
      return {
        disabled: true,
        error: 'Dao logo required'
      }
    }
    if (!buildingDaoData.handle.trim()) {
      return {
        disabled: true,
        error: 'DAO Handle on Clique required'
      }
    }
    if (!buildingDaoData.bio.trim()) {
      return {
        disabled: true,
        error: 'Description required'
      }
    }
    if (!buildingDaoData.category.trim()) {
      return {
        disabled: true,
        error: 'Categories required'
      }
    }
    if (!account) {
      return {
        disabled: true,
        error: (
          <>
            You need to{' '}
            <Link sx={{ cursor: 'pointer' }} onClick={toggleWalletModal}>
              connect
            </Link>{' '}
            your wallet
          </>
        )
      }
    }
    if (daoHandleAvailable !== true) {
      return {
        disabled: true,
        error: 'DAO Handle on Clique unavailable'
      }
    }
    return {
      disabled: false,
      handler: next
    }
  }, [
    account,
    buildingDaoData.bio,
    buildingDaoData.category,
    buildingDaoData.daoLogo,
    buildingDaoData.daoName,
    buildingDaoData.handle,
    daoHandleAvailable,
    next,
    toggleWalletModal
  ])

  return (
    <ContainerWrapper
      sx={{
        padding: { xs: '0 16px', sm: undefined }
      }}
    >
      <Wrapper>
        <Stack spacing={20}>
          <UploadImage
            onChange={val => updateBuildingDaoKeyData('daoLogo', val)}
            value={buildingDaoData.daoLogo}
            sx={{ margin: '0 auto', flexBasis: '124px' }}
            size={124}
          />
          <Input
            value={buildingDaoData.bio}
            onChange={e => updateBuildingDaoKeyData('bio', e.target.value || '')}
            type="textarea"
            label="*Description"
            rows="10"
            maxLength={1000}
            endAdornment={
              <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2">
                {buildingDaoData.bio.length}/1000
              </Typography>
            }
            multiline
            placeholder="Describe your DAO to new and existing members"
          />
          <CategoriesSelect
            style={{ maxWidth: '296px' }}
            value={buildingDaoData.category}
            onChange={val => updateBuildingDaoKeyData('category', val)}
          />
        </Stack>
        <Box display={'grid'}>
          <Input
            label="*DAO Name"
            maxLength={30}
            endAdornment={
              <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2">
                {buildingDaoData.daoName.length}/30
              </Typography>
            }
            placeholder="No duplicates in Clique"
            value={buildingDaoData.daoName}
            onChange={e => updateBuildingDaoKeyData('daoName', removeEmoji(e.target.value || ''))}
          />
          <Input
            label="*DAO Handle On Clique"
            maxLength={30}
            userPattern={'^[0-9a-z_]*$'}
            placeholder="Lowercase characters, numbers, underscores"
            error={daoHandleAvailable === false}
            onBlur={() => queryHandleCallback(account || undefined, chainId || undefined)}
            endAdornment={
              <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2">
                {buildingDaoData.handle.length}/30
              </Typography>
            }
            value={buildingDaoData.handle}
            onChange={e => updateBuildingDaoKeyData('handle', removeEmoji(e.target.value || '').replace(' ', ''))}
          />
          <Input
            label="Twitter Handle"
            placeholder="https://twitter.com/"
            type="url"
            errSet={() => updateBuildingDaoKeyData('twitter', '')}
            value={buildingDaoData.twitter}
            onChange={e => updateBuildingDaoKeyData('twitter', e.target.value || '')}
          />
          <Input
            label="Github"
            placeholder="https://github.com/"
            type="url"
            errSet={() => updateBuildingDaoKeyData('github', '')}
            value={buildingDaoData.github}
            onChange={e => updateBuildingDaoKeyData('github', e.target.value || '')}
          />
          <Input
            label="Discord Server Link"
            type="url"
            errSet={() => updateBuildingDaoKeyData('discord', '')}
            placeholder="https://discord.com"
            value={buildingDaoData.discord}
            onChange={e => updateBuildingDaoKeyData('discord', e.target.value || '')}
          />
          <Input
            label="Website Link"
            placeholder="https://xxxx.com"
            type="url"
            errSet={() => updateBuildingDaoKeyData('website', '')}
            value={buildingDaoData.website}
            onChange={e => updateBuildingDaoKeyData('website', e.target.value || '')}
          />
        </Box>
      </Wrapper>
      {nextHandler.error && <Alert severity="error">{nextHandler.error}</Alert>}
      <Box display="flex" justifyContent="center" mt={20}>
        <BlackButton width="252px" disabled={nextHandler.disabled} onClick={nextHandler.handler}>
          Next
        </BlackButton>
      </Box>
    </ContainerWrapper>
  )
}
