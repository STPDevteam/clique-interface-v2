import { Box, Skeleton, styled, Typography, useTheme } from '@mui/material'
import { ReactComponent as AuthIcon } from 'assets/svg/auth_tag_icon.svg'
import { DaoAvatars } from 'components/Avatars'
import { BlackButton } from 'components/Button/Button'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { routes } from 'constants/routes'
import { HomeListProp, useMemberJoinDao } from 'hooks/useBackedDaoServer'
import { useDaoBaseInfo } from 'hooks/useDaoInfo'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useToken } from 'state/wallet/hooks'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'

const StyledCard = styled(Box)(({ theme }) => ({
  height: 298,
  padding: '23px',
  cursor: 'pointer',
  border: `1px solid ${theme.bgColor.bg2}`,
  borderRadius: theme.borderRadius.default,
  boxShadow: theme.boxShadow.bs2,
  transition: 'all 0.5s',
  '&:hover': {
    border: `2px solid ${theme.palette.primary.main}`,
    padding: '22px'
  },
  '& .joined': {
    backgroundColor: theme.palette.text.disabled,
    '&:hover': {
      backgroundColor: theme.palette.text.disabled
    }
  }
}))

const StyledDesc = styled(Typography)(({ theme }) => ({
  overflow: 'hidden',
  marginTop: 16,
  fontWeight: 400,
  height: 72,
  color: theme.palette.text.secondary,
  textOverflow: 'ellipsis',
  width: '100%',
  display: '-webkit-box',
  '-webkit-box-orient': 'vertical',
  '-webkit-line-clamp': '3',
  wordBreak: 'break-all'
}))

const StyledTextNumber = styled(Box)(() => ({
  marginTop: 16,
  display: 'flex',
  justifyContent: 'space-between',
  '& .item': {
    display: 'flex',
    '&>*:first-child': {
      marginRight: 16
    }
  }
}))

export default function DaoItem({
  daoAddress,
  chainId,
  daoName,
  daoLogo,
  members,
  verified,
  proposals,
  joinSwitch
}: HomeListProp) {
  const theme = useTheme()
  const history = useHistory()
  const daoBaseInfo = useDaoBaseInfo(daoAddress, chainId)
  const token = useToken(daoBaseInfo?.daoTokenAddress || '', daoBaseInfo?.daoTokenChainId)
  const { isJoined, switchJoin, curMembers } = useMemberJoinDao(joinSwitch, members)
  const user = useUserInfo()
  const { account } = useActiveWeb3React()
  const walletModalToggle = useWalletModalToggle()
  const loginSignature = useLoginSignature()

  const toSwitchJoin = useCallback(
    async (join: boolean) => {
      if (!account) {
        walletModalToggle()
        return
      }
      let signatureStr = user?.signature
      if (!signatureStr) {
        signatureStr = await loginSignature()
      }
      if (!signatureStr) return
      switchJoin(join, chainId, daoAddress, signatureStr)
    },
    [account, chainId, daoAddress, loginSignature, switchJoin, user?.signature, walletModalToggle]
  )

  return (
    <StyledCard onClick={() => history.push(`${routes._DaoInfo}/${chainId}/${daoAddress}`)}>
      <Box display={'grid'} gap="12px" gridTemplateColumns={'48px calc(100%)'}>
        <DaoAvatars size={48} src={daoBaseInfo?.daoLogo || daoLogo} alt={daoBaseInfo?.name || daoName} />
        <Box>
          <Box display={'flex'} alignItems="center">
            <Typography variant="h6" noWrap fontSize={20} marginRight="8px" maxWidth={'calc(100% - 80px)'}>
              {daoBaseInfo?.name || daoName || '--'}
            </Typography>
            {verified && <AuthIcon />}
          </Box>
          {token ? (
            <Box display={'flex'} alignItems="center">
              <CurrencyLogo currency={token || undefined} style={{ width: 16, height: 16, marginRight: '5px' }} />
              <Typography fontSize={16} variant="body2" noWrap maxWidth={'calc(100% - 90px)'}>
                {token ? `${token.name} (${token.symbol})` : '--'}
              </Typography>
            </Box>
          ) : (
            <Skeleton animation="wave" width={'30%'}></Skeleton>
          )}
        </Box>
      </Box>
      <StyledDesc variant="body1">
        {daoBaseInfo?.description ? (
          daoBaseInfo.description
        ) : (
          <>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </>
        )}
      </StyledDesc>
      <StyledTextNumber>
        <div className="item">
          <Typography fontSize={13} color={theme.textColor.text1} fontWeight={600}>
            Members
          </Typography>
          <Typography fontSize={16} fontWeight={600}>
            {curMembers}
          </Typography>
        </div>
        <div className="item">
          <Typography fontSize={13} color={theme.textColor.text1} fontWeight={600}>
            Proposals
          </Typography>
          <Typography fontSize={16} fontWeight={600}>
            {proposals}
          </Typography>
        </div>
      </StyledTextNumber>
      <Box mt={20}>
        <BlackButton
          className={isJoined ? 'joined' : ''}
          onClick={e => {
            e.stopPropagation()
            toSwitchJoin(!isJoined)
          }}
        >
          {isJoined ? 'Joined' : 'Join'}
        </BlackButton>
      </Box>
    </StyledCard>
  )
}
