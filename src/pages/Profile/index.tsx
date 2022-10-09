import { Avatar, Box, Link, styled, Typography } from '@mui/material'
import Copy from 'components/essential/Copy'
import { useActiveWeb3React } from 'hooks'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getEtherscanLink, isAddress, shortenAddress } from 'utils'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import MyTokens from './MyTokens'
import { useParams } from 'react-router-dom'
import { useUserProfileInfo } from 'hooks/useBackedProfileServer'
import { isSocialUrl } from 'utils/dao'
import MyDaos from './MyDaos'
import UpdateProfileModal from './UpdateProfileModal'
import OutlineButton from 'components/Button/OutlineButton'
import useModal from 'hooks/useModal'

const StyledHeader = styled(Box)(({ theme }) => ({
  borderRadius: theme.borderRadius.default,
  minHeight: 215,
  background: theme.palette.common.white,
  boxShadow: theme.boxShadow.bs2,
  padding: '32px 48px 20px'
}))

export default function Profile() {
  const { account, chainId } = useActiveWeb3React()
  const { address } = useParams<{ address: string }>()
  const { showModal, hideModal } = useModal()
  const currentAccount = useMemo(() => (isAddress(address) ? address : account), [account, address])
  const isSelf = useMemo(() => currentAccount && account && account === currentAccount, [account, currentAccount])
  const [rand, setRand] = useState(Math.random())

  const { result: profileInfo } = useUserProfileInfo(currentAccount || undefined, rand)
  const refreshProfile = useCallback(() => {
    setRand(Math.random())
    hideModal()
  }, [hideModal])

  useEffect(() => {
    hideModal()
  }, [account, hideModal])

  return (
    <Box paddingBottom={40}>
      <ContainerWrapper maxWidth={1248} margin={'24px auto 40px'}>
        <StyledHeader>
          <Box display={'flex'}>
            <Avatar src={profileInfo?.accountLogo} sx={{ width: 100, height: 100, marginRight: 24 }} />
            <Box display={'flex'} flexDirection="column" justifyContent={'space-between'}>
              <Box display={'flex'} alignItems="center">
                <Typography variant="h5" mr={10}>
                  {profileInfo?.nickname || 'unnamed'}
                </Typography>
                {isSelf && (
                  <OutlineButton
                    noBold
                    width="75px"
                    height={'24px'}
                    onClick={() =>
                      profileInfo &&
                      showModal(<UpdateProfileModal userProfile={profileInfo} refreshProfile={refreshProfile} />)
                    }
                  >
                    Edit
                  </OutlineButton>
                )}
              </Box>
              <Box display={'flex'} alignItems="center">
                <Link
                  fontSize={13}
                  href={getEtherscanLink(chainId || 1, currentAccount || '', 'address')}
                  fontWeight={600}
                  target="_blank"
                  underline="none"
                  mr={6}
                >
                  {shortenAddress(currentAccount || '')}
                </Link>
                <Copy toCopy={currentAccount || ''} />
              </Box>
              <Box>
                {profileInfo?.twitter && isSocialUrl('twitter', profileInfo.twitter) && (
                  <Link target={'_blank'} href={profileInfo.twitter} underline="none" mr={10}>
                    <Twitter />
                  </Link>
                )}

                {profileInfo?.discord && isSocialUrl('discord', profileInfo.discord) && (
                  <Link target={'_blank'} href={profileInfo.discord} underline="none" mr={10}>
                    <Discord />
                  </Link>
                )}
              </Box>
            </Box>
          </Box>
          <Typography mt={40} fontSize={14} fontWeight={600}>
            {profileInfo?.introduction}
          </Typography>
        </StyledHeader>
      </ContainerWrapper>

      <Box display={'grid'} gap="48px">
        {isSelf && <MyTokens account={currentAccount || ''} />}

        <MyDaos adminDao={profileInfo?.adminDao} memberDao={profileInfo?.memberDao} />
      </Box>
    </Box>
  )
}
