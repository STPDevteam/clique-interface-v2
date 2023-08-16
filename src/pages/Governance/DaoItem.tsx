import { Box, Skeleton, styled, Typography, useTheme } from '@mui/material'
import { ReactComponent as AuthIcon } from 'assets/svg/auth_tag_icon.svg'
import { DaoAvatars } from 'components/Avatars'
// import { BlackButton } from 'components/Button/Button'
// import CurrencyLogo from 'components/essential/CurrencyLogo'
import { routes } from 'constants/routes'
import { ListProp } from 'hooks/useBackedDaoServer'
// import { useDaoBaseInfo } from 'hooks/useDaoInfo'
// import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
// import { useToken } from 'state/wallet/hooks'
// import { useActiveWeb3React } from 'hooks'
// import { useWalletModalToggle } from 'state/application/hooks'
// import useModal from 'hooks/useModal'
// import MembersModal from 'pages/DaoInfo/MembersModal'
import { Token } from 'constants/token'
import { formatMillion, toFormatGroup } from 'utils/dao'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import useBreakpoint from 'hooks/useBreakpoint'

const StyledCard = styled(Box)(({ theme }) => ({
  height: 270,
  padding: '23px',
  cursor: 'pointer',
  border: `1px solid ${theme.bgColor.bg2}`,
  borderRadius: theme.borderRadius.default,
  boxShadow: theme.boxShadow.bs2,
  transition: 'all 0.5s',
  // '&:hover': {
  //   border: `2px solid ${theme.palette.primary.main}`,
  //   padding: '22px'
  // },
  '& .joined': {
    backgroundColor: theme.palette.text.disabled,
    '&:hover': {
      backgroundColor: theme.palette.text.disabled
    }
  },
  [theme.breakpoints.up('sm')]: {
    '&:hover': {
      border: `2px solid ${theme.palette.primary.main}`,
      padding: '22px'
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
    '&>*:first-of-type': {
      marginRight: 16
    }
  }
}))

export function ShowDaoToken({ token }: { token: Token | undefined }) {
  return token ? <>{`${token.name === 'STPT' ? 'STP' : token.name} (${token.symbol})`}</> : <>--</>
}

export default function DaoItem({
  daoId,
  daoName,
  daoLogo,
  hanDle,
  iodBio,
  memberCount,
  proposalCount,
  activityProposalCount,
  approve
}: ListProp) {
  const theme = useTheme()
  const navigate = useNavigate()
  const isSmDown = useBreakpoint('sm')
  // const { showModal } = useModal()
  // const daoBaseInfo = useDaoBaseInfo(daoAddress, chainId)
  // const token = useToken(daoBaseInfo?.daoTokenAddress || '', daoBaseInfo?.daoTokenChainId)
  // const { curMembers } = useMemberJoinDao(joinSwitch, members)
  // const { account } = useActiveWeb3React()
  // const walletModalToggle = useWalletModalToggle()

  // const toSwitchJoin = useCallback(
  //   async (join: boolean) => {
  //     if (!account) {
  //       walletModalToggle()
  //       return
  //     }
  //     switchJoin(join, chainId, daoAddress)
  //   },
  //   [account, chainId, daoAddress, switchJoin, walletModalToggle]
  // )

  return (
    <StyledCard onClick={() => navigate(`${routes._DaoInfo}/${daoId}`)}>
      <Box display={'grid'} gap="12px" gridTemplateColumns={'48px calc(100%)'}>
        <DaoAvatars size={48} src={daoLogo} alt={daoName} />
        <Box>
          <Box display={'flex'} alignItems="center">
            <Typography variant="h6" noWrap fontSize={20} marginRight="8px" maxWidth={'calc(100% - 80px)'}>
              {daoName || '--'}
            </Typography>
            {approve && <AuthIcon />}
          </Box>
          {/* {token ? (
            <Box display={'flex'} alignItems="center">
              <CurrencyLogo currency={token || undefined} style={{ width: 16, height: 16, marginRight: '5px' }} />
              <Typography fontSize={16} variant="body2" noWrap maxWidth={'calc(100% - 90px)'}>
                <ShowDaoToken token={token || undefined} />
              </Typography>
            </Box>
          ) : (
            <Skeleton animation="wave" width={'30%'}></Skeleton>
          )} */}
          {hanDle ? (
            <Box display={'flex'} alignItems="center">
              <Typography fontSize={16} variant="body2" noWrap maxWidth={isSmDown ? '200px' : 'calc(100% - 90px)'}>
                @{hanDle}
              </Typography>
            </Box>
          ) : (
            <Skeleton animation="wave" width={'30%'}></Skeleton>
          )}
        </Box>
      </Box>
      <StyledDesc variant="body1">
        {iodBio ? (
          iodBio
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
            {formatMillion(memberCount)}
          </Typography>
        </div>
        {/* <div
          className="item"
          onClick={e => {
            e.stopPropagation()
            showModal(<MembersModal daoAddress={daoAddress} chainId={chainId} />)
          }}
        >
          <Typography fontSize={13} color={theme.textColor.text1} fontWeight={600}>
            Members
          </Typography>
          <Typography fontSize={16} fontWeight={600}>
            {formatMillion(curMembers)}
          </Typography>
        </div> */}
        <div className="item">
          <Typography fontSize={13} color={theme.textColor.text1} fontWeight={600}>
            Proposals
          </Typography>
          <Typography fontSize={16} fontWeight={600}>
            {formatMillion(proposalCount)}
          </Typography>
        </div>
      </StyledTextNumber>
      {/* <Box mt={20}>
        <BlackButton
          className={isJoined ? 'joined' : ''}
          onClick={e => {
            e.stopPropagation()
            toSwitchJoin(!isJoined)
          }}
        >
          {isJoined ? 'Joined' : 'Join'}
        </BlackButton>
      </Box> */}
      <Box mt={20}>
        <RowCenter
          sx={{
            border: `1px solid ${theme.bgColor.bg2}`,
            borderRadius: '14px',
            height: 26,
            padding: '0 35.5px'
          }}
        >
          <Typography color={theme.bgColor.bg7} fontSize={12} fontWeight={600}>
            <span
              style={{
                display: 'inline-block',
                width: 5,
                height: 5,
                marginBottom: 2,
                backgroundColor: theme.bgColor.bg7,
                borderRadius: '50%'
              }}
            />
            <span> Active proposal</span>
          </Typography>
          <Typography color={theme.palette.text.secondary} fontSize={12} fontWeight={500}>
            {toFormatGroup(activityProposalCount || 0)}
          </Typography>
        </RowCenter>
      </Box>
    </StyledCard>
  )
}
