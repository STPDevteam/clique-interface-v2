import { Alert, Box, Link, Stack, styled, Typography, useTheme } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import CategoriesSelect from 'components/Governance/CategoriesSelect'
import Input from 'components/Input'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import UploadImage from 'components/UploadImage'
import { ChainId, ChainListMap } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { DaoInfoProp } from 'hooks/useDaoInfo'
import { useAdminSetInfoCallback } from 'hooks/useGovernanceDaoCallback'
import useModal from 'hooks/useModal'
import { useCallback, useMemo, useState } from 'react'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { Dots } from 'theme/components'
import { removeEmoji } from 'utils'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { StyledItem } from '../About'

const Wrapper = styled(StyledItem)({
  display: 'grid',
  gridTemplateColumns: '296fr 564fr',
  gap: 24
})

export default function General({ daoInfo, daoChainId }: { daoInfo: DaoInfoProp; daoChainId: ChainId }) {
  const [daoImage, setDaoImage] = useState(daoInfo.daoLogo)
  const [description, setDescription] = useState(daoInfo.description)
  const [category, setCategory] = useState(daoInfo.category)
  const [daoName, setDaoName] = useState(daoInfo.name)
  // const [daoHandle, setDaoHandle] = useState(daoInfo.handle)
  const [twitterLink, setTwitterLink] = useState(daoInfo.twitter)
  const [githubLink, setGithubLink] = useState(daoInfo.github)
  const [discordLink, setDiscordLink] = useState(daoInfo.discord)
  const [websiteLink, setWebsiteLink] = useState(daoInfo.website)
  const theme = useTheme()
  const { chainId, library, account } = useActiveWeb3React()
  const { claimSubmitted: isSaving } = useUserHasSubmittedClaim(`${daoInfo.daoAddress}_UpdateGeneralSetting`)
  const adminSetInfoCallback = useAdminSetInfoCallback(daoInfo.daoAddress)

  const { showModal, hideModal } = useModal()
  const onSetInfoCallback = useCallback(() => {
    showModal(<TransacitonPendingModal />)
    adminSetInfoCallback(daoName, category, description, twitterLink, githubLink, discordLink, daoImage, websiteLink)
      .then(hash => {
        hideModal()
        showModal(<TransactiontionSubmittedModal hash={hash} />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [
    showModal,
    adminSetInfoCallback,
    daoName,
    category,
    description,
    twitterLink,
    githubLink,
    discordLink,
    daoImage,
    websiteLink,
    hideModal
  ])

  const saveBtn: {
    disabled: boolean
    handler?: () => void
    error?: undefined | string | JSX.Element
  } = useMemo(() => {
    if (
      daoImage === daoInfo.daoLogo &&
      description === daoInfo.description &&
      category === daoInfo.category &&
      daoName === daoInfo.name &&
      twitterLink === daoInfo.twitter &&
      githubLink === daoInfo.github &&
      discordLink === daoInfo.discord &&
      websiteLink === daoInfo.website
    ) {
      return {
        disabled: true
      }
    }
    if (!daoName.trim()) {
      return {
        disabled: true,
        error: 'Dao name required'
      }
    }
    if (!daoImage) {
      return {
        disabled: true,
        error: 'Dao logo required'
      }
    }
    if (!description.trim()) {
      return {
        disabled: true,
        error: 'Description required'
      }
    }
    if (!category.trim()) {
      return {
        disabled: true,
        error: 'Categories required'
      }
    }
    if (daoChainId !== chainId) {
      return {
        disabled: true,
        error: (
          <>
            You need{' '}
            <Link
              sx={{ cursor: 'pointer' }}
              onClick={() => daoChainId && triggerSwitchChain(library, daoChainId, account || '')}
            >
              switch
            </Link>{' '}
            to {ChainListMap[daoChainId].name}
          </>
        )
      }
    }
    return {
      disabled: false,
      handler: onSetInfoCallback
    }
  }, [
    account,
    category,
    chainId,
    daoChainId,
    onSetInfoCallback,
    daoImage,
    daoInfo,
    daoName,
    description,
    discordLink,
    githubLink,
    library,
    twitterLink,
    websiteLink
  ])

  return (
    <Box>
      <Wrapper>
        <Stack spacing={20}>
          <UploadImage
            onChange={val => setDaoImage(val)}
            value={daoImage}
            sx={{ margin: '0 auto', flexBasis: '124px' }}
            size={124}
          />
          <Input
            value={description}
            onChange={e => setDescription(e.target.value || '')}
            type="textarea"
            label="*Description"
            rows="10"
            maxLength={200}
            endAdornment={
              <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2">
                {description.length}/200
              </Typography>
            }
            multiline
            placeholder="Describe your DAO to new and existing members"
          />
          <CategoriesSelect style={{ maxWidth: '296px' }} value={category} onChange={val => setCategory(val)} />
        </Stack>
        <Box display={'grid'}>
          <Input
            label="*DAO Name"
            maxLength={30}
            endAdornment={
              <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2">
                {daoName.length}/30
              </Typography>
            }
            placeholder="No duplicates in Clique"
            value={daoName}
            onChange={e => setDaoName(removeEmoji(e.target.value || ''))}
          />
          <Input
            label="*DAO Handle On Clique"
            maxLength={30}
            userPattern={'^[0-9a-z_]*$'}
            placeholder="Lowercase characters, numbers, underscores"
            readOnly
            endAdornment={
              <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2">
                {daoInfo.handle.length}/30
              </Typography>
            }
            value={daoInfo.handle}
          />
          <Input
            label="Twitter Handle"
            placeholder="https://twitter.com/"
            type="url"
            errSet={() => setTwitterLink('')}
            value={twitterLink}
            onChange={e => setTwitterLink(e.target.value || '')}
          />
          <Input
            label="Github"
            placeholder="https://github.com/"
            type="url"
            errSet={() => setGithubLink('')}
            value={githubLink}
            onChange={e => setGithubLink(e.target.value || '')}
          />
          <Input
            label="Discord Server Link"
            type="url"
            errSet={() => setDiscordLink('')}
            placeholder="https://discord.com"
            value={discordLink}
            onChange={e => setDiscordLink(e.target.value || '')}
          />
          <Input
            label="Website Link"
            placeholder="https://xxxx.com"
            type="url"
            errSet={() => setWebsiteLink('')}
            value={websiteLink}
            onChange={e => setWebsiteLink(e.target.value || '')}
          />
        </Box>
      </Wrapper>
      {saveBtn.error && <Alert severity="error">{saveBtn.error}</Alert>}
      <Box mt={50} display="flex" justifyContent={'center'}>
        <BlackButton width="166px" disabled={saveBtn.disabled || isSaving} onClick={saveBtn.handler}>
          {isSaving ? (
            <>
              Saving
              <Dots />
            </>
          ) : (
            'Save'
          )}
        </BlackButton>
      </Box>
    </Box>
  )
}
