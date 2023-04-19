import { Box, Stack, styled, Typography, useTheme } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import Input from 'components/Input'
import Modal from 'components/Modal'
import UploadImage from 'components/UploadImage'
import { useActiveWeb3React } from 'hooks'
import { UserProfileProp } from 'hooks/useBackedProfileServer'
import { useCallback, useMemo, useState } from 'react'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import { userProfileUpdate } from 'utils/fetch/server'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import useModal from 'hooks/useModal'

const StyledBody = styled(Box)({
  minHeight: 200,
  padding: '32px'
})

export default function UpdateProfileModal({
  userProfile,
  refreshProfile
}: {
  userProfile: UserProfileProp
  refreshProfile: () => void
}) {
  const { showModal } = useModal()
  const theme = useTheme()
  const { account } = useActiveWeb3React()
  const [avatar, setAvatar] = useState(userProfile.accountLogo)
  const [name, setName] = useState(userProfile.nickname)
  const [twitter, setTwitter] = useState(userProfile.twitter)
  const [discord, setDiscord] = useState(userProfile.discord)
  const [email, setEmail] = useState(userProfile.email)
  const [country, setCountry] = useState(userProfile.country)
  const [youtube, setYoutube] = useState(userProfile.youtube)
  const [opensea, setOpensea] = useState(userProfile.opensea)
  const [bio, setBio] = useState(userProfile.introduction)

  const userSignature = useUserInfo()
  const loginSignature = useLoginSignature()

  const updateAccount = useCallback(async () => {
    if (!account) return
    let signatureStr = userSignature?.signature
    if (!signatureStr) {
      signatureStr = await loginSignature()
    }
    if (!signatureStr) return
    try {
      await userProfileUpdate(avatar, name, bio, discord, twitter, country, email, opensea, youtube)
      showModal(<TransactiontionSubmittedModal header="Update success!" hideFunc={refreshProfile} />)
    } catch (error) {
      const err: any = error
      showModal(
        <MessageBox type="error">
          {err?.data?.message || err?.error?.message || err?.message || 'Update error'}
        </MessageBox>
      )
    }
  }, [
    account,
    avatar,
    bio,
    country,
    discord,
    email,
    loginSignature,
    name,
    opensea,
    refreshProfile,
    showModal,
    twitter,
    userSignature?.signature,
    youtube
  ])

  const disabledSave = useMemo(() => {
    return (
      userProfile.accountLogo === avatar &&
      name === userProfile.nickname &&
      twitter === userProfile.twitter &&
      discord === userProfile.discord &&
      country === userProfile.country &&
      email === userProfile.email &&
      youtube === userProfile.youtube &&
      opensea === userProfile.opensea &&
      bio === userProfile.introduction
    )
  }, [avatar, bio, country, discord, email, name, opensea, twitter, userProfile, youtube])

  return (
    <Modal maxWidth="628px" closeIcon width="100%">
      <StyledBody>
        <Typography textAlign={'center'} fontWeight={600} variant="h6">
          Edit Profile
        </Typography>
        <Stack spacing={16}>
          <Box padding="12px">
            <UploadImage value={avatar || ''} size={124} onChange={val => setAvatar(val)} />
            <Typography fontSize={12} textAlign={'center'} color={theme.textColor.text1}>
              {'Supports JPG, PNG, and size <2MB.'}
            </Typography>
          </Box>
          <Input value={name} label="User Name" placeholder="nickname" onChange={e => setName(e.target.value)} />
          <Input
            value={bio}
            multiline
            placeholder="Tell us about yourself!"
            rows={6}
            label="Bio"
            onChange={e => setBio(e.target.value)}
          />
          <Input
            value={twitter}
            label="Twitter"
            placeholder="https://twitter.com/"
            onChange={e => setTwitter(e.target.value)}
            type="url"
            errSet={() => setTwitter('')}
          />
          <Input
            value={email}
            label="Email"
            placeholder=""
            onChange={e => setEmail(e.target.value)}
            type="email"
            errSet={() => setEmail('')}
          />
          <Input value={country} label="Country" placeholder="" onChange={e => setCountry(e.target.value)} />
          <Input
            value={youtube}
            label="Youtube"
            placeholder="https://www.youtube.com/"
            onChange={e => setYoutube(e.target.value)}
            type="url"
            errSet={() => setYoutube('')}
          />
          <Input
            value={opensea}
            label="Opensea"
            placeholder="https://opensea.io/"
            onChange={e => setOpensea(e.target.value)}
            type="url"
            errSet={() => setOpensea('')}
          />
          <Input
            value={discord}
            label="Discord"
            placeholder="https://"
            onChange={e => setDiscord(e.target.value)}
            type="url"
            errSet={() => setDiscord('')}
          />
          <Box display={'flex'} justifyContent="center">
            <BlackButton width="166px" disabled={disabledSave} onClick={updateAccount}>
              Save
            </BlackButton>
          </Box>
        </Stack>
      </StyledBody>
    </Modal>
  )
}
