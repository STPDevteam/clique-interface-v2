import { Avatar, Box, Link, Stack, styled, Typography, useTheme } from '@mui/material'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { getEtherscanLink } from 'utils'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import { useCallback, useMemo } from 'react'
import { DaoAdminLevelProp, useDaoAdminLevel, useDaoInfo } from 'hooks/useDaoInfo'
import { useMemberJoinDao } from 'hooks/useBackedDaoServer'
// import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import { NavLink, useHistory, useParams } from 'react-router-dom'
import { ChainId } from 'constants/chain'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { useBackedDaoInfo } from 'hooks/useBackedDaoServer'
import { isSocialUrl, toFormatGroup } from 'utils/dao'
import { BlackButton } from 'components/Button/Button'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import CategoryChips from './CategoryChips'
import { useActiveWeb3React } from 'hooks'
import AdminTag from './ShowAdminTag'
import { routes } from 'constants/routes'

const StyledHeader = styled(Box)(({ theme }) => ({
  borderRadius: theme.borderRadius.default,
  minHeight: 138,
  background: theme.palette.common.white,
  boxShadow: theme.boxShadow.bs2,
  padding: '30px 45px 0',
  '& .top1': {
    display: 'grid',
    gridTemplateColumns: '100px 1fr'
  }
}))

const StyledTabs = styled('div')(({ theme }) => ({
  display: 'flex',
  fontWeight: 600,
  fontSize: 14,
  listStyle: 'none',
  padding: 0,
  marginTop: 20,
  '&>*': {
    padding: '15px 0',
    marginRight: 60,
    textDecoration: 'none',
    color: theme.palette.text.secondary,
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.common.black
    },
    '&.active': {
      color: theme.palette.common.black
    }
  }
}))

const StyledJoin = styled(Box)(({ theme }) => ({
  '& button': {
    borderRadius: '8px'
  },
  '& .joined': {
    backgroundColor: theme.palette.text.disabled,
    '&:hover': {
      backgroundColor: theme.palette.text.disabled
    }
  }
}))

const tabs = [
  {
    name: 'Proposal',
    routeSuffix: 'proposal'
  },
  {
    name: 'Activity',
    routeSuffix: 'active_info'
  },
  {
    name: 'About',
    routeSuffix: 'about'
  },
  {
    name: 'Settings',
    routeSuffix: 'settings'
  }
]

export default function DaoInfo({ children }: { children: any }) {
  const theme = useTheme()
  const history = useHistory()
  const { account } = useActiveWeb3React()
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const { result: backedDaoInfo } = useBackedDaoInfo(daoAddress, curDaoChainId)
  const daoAdminLevel = useDaoAdminLevel(daoAddress, curDaoChainId, account || undefined)

  const daoInfo = useDaoInfo(daoAddress, curDaoChainId)
  const token = daoInfo?.token
  const { isJoined, switchJoin, curMembers } = useMemberJoinDao(
    backedDaoInfo?.joinSwitch || false,
    backedDaoInfo?.members || 0
  )
  const user = useUserInfo()
  const loginSignature = useLoginSignature()

  const toSwitchJoin = useCallback(
    async (join: boolean) => {
      let signatureStr = user?.signature
      if (!signatureStr) {
        signatureStr = await loginSignature()
      }
      if (!signatureStr) return
      switchJoin(join, curDaoChainId, daoAddress, signatureStr)
    },
    [curDaoChainId, daoAddress, loginSignature, switchJoin, user?.signature]
  )

  const currentTabLinks = useMemo(() => {
    const list =
      daoAdminLevel === DaoAdminLevelProp.SUPER_ADMIN || daoAdminLevel === DaoAdminLevelProp.ADMIN
        ? tabs
        : tabs.filter(i => i.name !== 'Settings')

    return list.map(({ name, routeSuffix }) => ({
      name,
      link: routes._DaoInfo + `/${daoChainId}/${daoAddress}${routeSuffix ? '/' + routeSuffix : ''}`
    }))
  }, [daoAddress, daoAdminLevel, daoChainId])

  const isDefaultTabIndex = useMemo(() => {
    if (history.location.pathname === routes._DaoInfo + `/${daoChainId}/${daoAddress}`) {
      return true
    }
    return false
  }, [history.location.pathname, daoAddress, daoChainId])

  return (
    <Box padding="0 20px">
      <ContainerWrapper maxWidth={1248}>
        <StyledHeader>
          <div className="top1">
            <Avatar sx={{ width: 100, height: 100 }} src={daoInfo?.daoLogo || ''}></Avatar>
            <Box ml={'24px'}>
              <Box display={'flex'} justifyContent="space-between" alignItems={'center'} marginBottom={6}>
                <Stack direction="row" spacing={8} alignItems="center">
                  <Typography variant="h5">{daoInfo?.name || '--'}</Typography>
                  {/* <VerifiedTag address={daoInfo?.daoAddress} /> */}
                  <AdminTag level={daoAdminLevel} />
                  <StyledJoin>
                    <BlackButton
                      width="79px"
                      height="32px"
                      className={isJoined ? 'joined' : ''}
                      onClick={() => {
                        toSwitchJoin(!isJoined)
                      }}
                    >
                      {isJoined ? 'Joined' : 'Join'}
                    </BlackButton>
                  </StyledJoin>
                </Stack>
                <Box display={'flex'} alignItems="center">
                  <Typography mr={5} variant="caption" color={theme.palette.text.secondary}>
                    Members
                  </Typography>
                  <Typography variant="caption">{toFormatGroup(curMembers)}</Typography>
                </Box>
              </Box>
              <Box display={'flex'} justifyContent="space-between" mb={6}>
                <Link
                  target={'_blank'}
                  underline="none"
                  href={getEtherscanLink(curDaoChainId, daoInfo?.daoTokenAddress || '', 'address')}
                >
                  <Box display={'flex'} alignItems="center">
                    <CurrencyLogo currency={token || undefined} style={{ marginRight: '5px' }} />
                    <Typography fontSize={16} variant="body2" noWrap maxWidth={'200px'}>
                      {token ? `${token.name} (${token.symbol})` : '--'}
                    </Typography>
                  </Box>
                </Link>
                <Box display={'flex'} alignItems="center">
                  {daoInfo?.twitter && isSocialUrl('twitter', daoInfo.twitter) && (
                    <Link target={'_blank'} href={daoInfo.twitter} underline="none" ml={10}>
                      <Twitter />
                    </Link>
                  )}
                  {daoInfo?.discord && isSocialUrl('discord', daoInfo.discord) && (
                    <Link target={'_blank'} href={daoInfo.discord} underline="none" ml={10}>
                      <Discord />
                    </Link>
                  )}
                  {daoInfo?.github && isSocialUrl('github', daoInfo.github) && (
                    <Link fontSize={12} target={'_blank'} href={daoInfo.github} underline="none" ml={10}>
                      github
                    </Link>
                  )}
                  {daoInfo?.website && isSocialUrl('', daoInfo.website) && (
                    <Link fontSize={12} target={'_blank'} href={daoInfo.website} underline="none" ml={10}>
                      {daoInfo.website}
                    </Link>
                  )}
                </Box>
              </Box>
              <Typography mb={8} color={theme.palette.text.secondary} sx={{ wordBreak: 'break-all' }}>
                {daoInfo?.description}
              </Typography>
              <CategoryChips categoryStr={daoInfo?.category} />
            </Box>
          </div>

          <StyledTabs>
            {currentTabLinks.map((item, index) => (
              <NavLink
                key={item.name}
                to={item.link}
                // onClick={() => history.replace(item.link)}
                className={`border-tab-item ${isDefaultTabIndex && index === 0 ? 'active' : ''}`}
              >
                {item.name}
              </NavLink>
            ))}
          </StyledTabs>
        </StyledHeader>
        <Box padding="30px 45px">{children}</Box>
      </ContainerWrapper>
    </Box>
  )
}
