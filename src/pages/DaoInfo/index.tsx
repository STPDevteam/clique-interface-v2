import { Avatar, Box, Link, styled, Typography, useTheme } from '@mui/material'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { getEtherscanLink } from 'utils'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import { useCallback, useState } from 'react'
import { useDaoBaseInfo } from 'hooks/useDaoInfo'
import { useToken } from 'state/wallet/hooks'
import { useMemberJoinDao } from 'hooks/useBackedDaoServer'
// import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import { useParams } from 'react-router-dom'
import { ChainId } from 'constants/chain'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { useBackedDaoInfo } from 'hooks/useBackedDaoServer'
import { toFormatGroup } from 'utils/dao'
import { BlackButton } from 'components/Button/Button'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import CategoryChips from './CategoryChips'

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

const StyledTabs = styled('ul')(({ theme }) => ({
  display: 'flex',
  fontWeight: 600,
  fontSize: 14,
  listStyle: 'none',
  padding: 0,
  marginTop: 20,
  li: {
    padding: '15px 0',
    marginRight: 60,
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
  marginLeft: 12,
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

enum Tabs {
  PROPOSAL = 'Proposal',
  ACTIVITY = 'Activity',
  ABOUT = 'About',
  SETTINGS = 'Settings'
}
const tabLinks = Object.values(Tabs)

export default function DaoInfo() {
  const theme = useTheme()
  const [currentTab, setCurrentTab] = useState(Tabs.PROPOSAL)
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const { result: backedDaoInfo } = useBackedDaoInfo(daoAddress, curDaoChainId)

  const daoBaseInfo = useDaoBaseInfo(daoAddress, curDaoChainId)
  const token = useToken(daoBaseInfo?.daoTokenAddress || '', curDaoChainId)
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

  return (
    <Box padding="0 20px">
      <ContainerWrapper maxWidth={1248}>
        <StyledHeader>
          <div className="top1">
            <Avatar sx={{ width: 100, height: 100 }} src={daoBaseInfo?.daoLogo || ''}></Avatar>
            <Box ml={'24px'}>
              <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
                <Box display="flex" alignItems={'center'} gap="5px" marginBottom={5}>
                  <Typography variant="h5">{daoBaseInfo?.name || '--'}</Typography>
                  {/* <VerifiedTag address={daoInfo?.daoAddress} /> */}
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
                </Box>
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
                  href={getEtherscanLink(curDaoChainId, daoBaseInfo?.daoTokenAddress || '', 'address')}
                >
                  <Box display={'flex'} alignItems="center">
                    <CurrencyLogo currency={token || undefined} style={{ width: 16, height: 16, marginRight: '5px' }} />
                    <Typography fontSize={16} variant="body2" noWrap maxWidth={'200px'}>
                      {token ? `${token.name} (${token.symbol})` : '--'}
                    </Typography>
                  </Box>
                </Link>
                <Box display={'flex'} alignItems="center">
                  {daoBaseInfo?.twitter && (
                    <Link target={'_blank'} href={daoBaseInfo.twitter} underline="none" ml={10}>
                      <Twitter />
                    </Link>
                  )}
                  {daoBaseInfo?.discord && (
                    <Link target={'_blank'} href={daoBaseInfo.discord} underline="none" ml={10}>
                      <Discord />
                    </Link>
                  )}
                  {daoBaseInfo?.website && (
                    <Link fontSize={12} target={'_blank'} href={daoBaseInfo.website} underline="none" ml={10}>
                      {daoBaseInfo.website}
                    </Link>
                  )}
                </Box>
              </Box>
              <Typography mb={8} color={theme.palette.text.secondary} sx={{ wordBreak: 'break-all' }}>
                {daoBaseInfo?.description}
              </Typography>
              <CategoryChips categoryStr={daoBaseInfo?.category} />
            </Box>
          </div>

          <StyledTabs>
            {tabLinks.map(item => (
              <li
                key={item}
                onClick={() => setCurrentTab(item)}
                className={`border-tab-item ${currentTab === item ? 'active' : ''}`}
              >
                {item}
              </li>
            ))}
          </StyledTabs>
        </StyledHeader>
      </ContainerWrapper>
    </Box>
  )
}
