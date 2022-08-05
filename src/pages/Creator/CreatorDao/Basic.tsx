import { styled, Box, Alert, Stack } from '@mui/material'
import { ContainerWrapper, CreatorBox } from '../StyledCreate'
import UploadImage from 'components/UploadImage'
import Input from 'components/Input'
import { BlackButton } from 'components/Button/Button'
import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'
import { removeEmoji } from 'utils'
import { useMemo } from 'react'
import CategoriesSelect from 'components/Governance/CategoriesSelect'

const Wrapper = styled(CreatorBox)({
  display: 'grid',
  gridTemplateColumns: '296fr 564fr',
  gap: 24
})

export default function Basic({ next }: { next: () => void }) {
  const { buildingDaoData, updateBuildingDaoKeyData } = useBuildingDaoDataCallback()

  const nextHandler = useMemo(() => {
    if (!buildingDaoData.daoName.trim()) {
      return {
        disabled: true,
        error: 'Dao name required'
      }
    }
    if (!buildingDaoData.daoImage) {
      return {
        disabled: true,
        error: 'Dao logo required'
      }
    }
    if (!buildingDaoData.daoHandle.trim()) {
      return {
        disabled: true,
        error: 'DAO Handle on Clique required'
      }
    }
    if (!buildingDaoData.description.trim()) {
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
    return {
      disabled: false,
      handler: next
    }
  }, [
    buildingDaoData.category,
    buildingDaoData.daoHandle,
    buildingDaoData.daoImage,
    buildingDaoData.daoName,
    buildingDaoData.description,
    next
  ])

  return (
    <ContainerWrapper>
      <Wrapper>
        <Stack spacing={20}>
          <UploadImage
            onChange={val => updateBuildingDaoKeyData('daoImage', val)}
            value={buildingDaoData.daoImage}
            sx={{ margin: '0 auto', flexBasis: '124px' }}
            size={124}
          />
          <Input
            value={buildingDaoData.description}
            onChange={e => updateBuildingDaoKeyData('description', e.target.value || '')}
            type="textarea"
            label="*Description"
            rows="10"
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
            placeholder="No duplicates in Clique"
            value={buildingDaoData.daoName}
            onChange={e => updateBuildingDaoKeyData('daoName', removeEmoji(e.target.value || ''))}
          />
          <Input
            label="*DAO Handle on Clique"
            maxLength={30}
            userPattern={'^[0-9a-z_]*$'}
            placeholder="Lowercase characters, numbers, underscores"
            value={buildingDaoData.daoHandle}
            onChange={e => updateBuildingDaoKeyData('daoHandle', e.target.value || '')}
          />
          <Input
            label="Twitter handle"
            placeholder="https://twitter.com/"
            type="url"
            errSet={() => updateBuildingDaoKeyData('twitterLink', '')}
            value={buildingDaoData.twitterLink}
            onChange={e => updateBuildingDaoKeyData('twitterLink', e.target.value || '')}
          />
          <Input
            label="Github"
            placeholder="https://github.com/"
            type="url"
            errSet={() => updateBuildingDaoKeyData('githubLink', '')}
            value={buildingDaoData.githubLink}
            onChange={e => updateBuildingDaoKeyData('githubLink', e.target.value || '')}
          />
          <Input
            label="Discord server link"
            type="url"
            errSet={() => updateBuildingDaoKeyData('discordLink', '')}
            placeholder="https://discord.com"
            value={buildingDaoData.discordLink}
            onChange={e => updateBuildingDaoKeyData('discordLink', e.target.value || '')}
          />
          <Input
            label="Website link"
            placeholder="https://xxxx.com"
            type="url"
            errSet={() => updateBuildingDaoKeyData('websiteLink', '')}
            value={buildingDaoData.websiteLink}
            onChange={e => updateBuildingDaoKeyData('websiteLink', e.target.value || '')}
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
