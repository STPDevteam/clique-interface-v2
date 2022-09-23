import { Avatar, Box, Link, styled, Typography } from '@mui/material'
import Copy from 'components/essential/Copy'
import { useActiveWeb3React } from 'hooks'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { useMemo } from 'react'
import { getEtherscanLink, isAddress, shortenAddress } from 'utils'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
// import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import MyTokens from './MyTokens'
import { useParams } from 'react-router-dom'
import { useUserProfileInfo } from 'hooks/useBackedProfileServer'
import { isSocialUrl } from 'utils/dao'
import MyDaos from './MyDaos'

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
  const currentAccount = useMemo(() => (isAddress(address) ? address : account), [account, address])
  const isSelf = useMemo(() => currentAccount && account && account === currentAccount, [account, currentAccount])

  const { result: profileInfo } = useUserProfileInfo(currentAccount || undefined)

  return (
    <Box paddingBottom={40}>
      <ContainerWrapper maxWidth={1248} margin={'24px auto 40px'}>
        <StyledHeader>
          <Box display={'flex'}>
            <Avatar src={profileInfo?.accountLogo} sx={{ width: 100, height: 100, marginRight: 24 }} />
            <Box display={'flex'} flexDirection="column" justifyContent={'space-between'}>
              <Typography variant="h5">{profileInfo?.nickname || 'unnamed'}</Typography>
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

                {profileInfo?.github && isSocialUrl('twitter', profileInfo.github) && (
                  <Link target={'_blank'} href={profileInfo.github} underline="none" mr={10}>
                    github
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
