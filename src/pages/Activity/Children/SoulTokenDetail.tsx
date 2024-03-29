import { Box, styled, TooltipProps, tooltipClasses, Typography, Tooltip } from '@mui/material'
import { DaoAvatars } from 'components/Avatars'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import Button from 'components/Button/Button'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import Image from 'components/Image'
import avatar from 'assets/images/avatar.png'
import EllipsisIcon from 'assets/images/ellipsis_icon.png'
import Back from 'components/Back'
import {
  useSbtDetail,
  useSbtClaim,
  useSbtClaimList,
  useSbtQueryIsClaim,
  ClaimWay,
  useSbtContractClaimTotal
} from 'hooks/useBackedSbtServer'
import { useNavigate, useParams } from 'react-router-dom'
import { useJoinDAO } from 'hooks/useBackedDaoServer'
import { useUserInfo, useLoginSignature } from 'state/userInfo/hooks'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { ChainListMap } from 'constants/chain'
import { shortenAddress, getEtherscanLink, formatTimestamp } from 'utils'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { Dots } from 'theme/components'
import { useIsJoined } from 'hooks/useBackedDaoServer'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import ReactHtmlParser from 'react-html-parser'
import { escapeAttrValue } from 'xss'
import Copy from 'components/essential/Copy'
import { ExternalLink } from 'theme/components'
import { toast } from 'react-toastify'
import isZero from 'utils/isZero'
import TooltipBgStyle from 'components/Tooltip'
import DelayLoading from 'components/DelayLoading'
import Loading from 'components/Loading'
import JoinDaoClaimModal from './JoinDaoClaimModal'
import { routes } from 'constants/routes'
import useBreakpoint from 'hooks/useBreakpoint'
const ContentBoxStyle = styled(Box)(({ maxWidth }: { maxWidth?: number }) => ({
  minHeight: 800,
  marginBottom: 40,
  maxWidth: maxWidth ? maxWidth : 600,
  width: '100%',
  border: '1px solid #D4D7E2',
  borderRadius: '10px'
}))
const ContentHeaderStyle = styled(Box)(({ theme }) => ({
  padding: '30px 40px',
  [theme.breakpoints.down('sm')]: { padding: 15 }
}))
const JoInButton = styled(Button)(() => ({
  height: 36,
  width: 70,
  '&:disabled': {
    border: ' 1px solid #D4D7E2',
    backgroundColor: 'rgba(0, 91, 198, 0.06)',
    color: '#97B7EF'
  }
}))
const DetailLayoutStyle = styled(Box)(({ theme }) => ({
  background: '#F8FBFF',
  padding: '13px 40px',
  height: 215,
  display: 'grid',
  flexDirection: 'column',
  gap: 20,
  [theme.breakpoints.down('sm')]: { padding: 15, height: 'max-content' }
}))

const ColumnLayoutStyle = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column'
}))

const DetailTitleStyle = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  color: '#8D8EA5'
}))
const DetailStyle = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: '18px',
  lineHeight: '20px',
  color: '#3F5170',
  marginTop: 6
}))
const ClaimButton = styled(Button)(() => ({
  width: 270,
  height: 40,
  background: '#0049C6',
  borderRadius: '8px',
  color: '#fff',
  '&:disabled': {
    backgroundColor: '#F8FBFF',
    color: '#97B7EF'
  }
}))

const DeployButton = styled(Button)(() => ({
  width: 270,
  height: 40,
  backgroundColor: '#FFFAEE',
  borderRadius: '8px',
  color: '#EABE56',
  '&:disabled': {
    backgroundColor: '#FFFAEE',
    color: '#EABE56'
  }
}))

const OwnersStyle = styled(Box)(() => ({
  padding: '20px 25px'
}))

const TooltipStyle = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#F8FBFF !important',
    color: '#97B7EF !important',
    width: 300,
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '16px',
    borderRadius: '6px',
    border: ' 1px solid #97B7EF',
    padding: '8px  8px 8px 12px',
    '& .MuiTooltip-arrow': {
      color: '#97B7EF !important'
    }
  }
}))

const ClaimWayMapText = {
  [ClaimWay.AnyOne]: 'Anyone',
  [ClaimWay.Joined]: 'DAO members',
  [ClaimWay.WhiteList]: 'Whitelisted'
}

export default function SoulTokenDetail() {
  const { library, account, chainId } = useActiveWeb3React()
  const userSignature = useUserInfo()
  const navigate = useNavigate()
  const loginSignature = useLoginSignature()
  const toggleWalletModal = useWalletModalToggle()
  const { showModal, hideModal } = useModal()
  const { daoId, sbtId } = useParams<{
    daoId: string
    sbtId: string
  }>()
  const [isJoin, setIsJoin] = useState(false)
  const {
    result: sbtDetail,
    contractQueryIsClaim,
    contractQueryLoading,
    loading: sbtDetailLoading
  } = useSbtDetail(sbtId || '')
  const { result: sbtClaimList, total: ClaimTotal } = useSbtClaimList(Number(sbtId))
  const { result: sbtIsClaim, setUpdateIsClaim } = useSbtQueryIsClaim(Number(sbtId))
  const { isJoined, loading: JoinedLoading } = useIsJoined(Number(daoId))
  const { SbtClaimCallback } = useSbtClaim()
  const { claimSubmitted: isClaiming } = useUserHasSubmittedClaim(`${account}_claim_sbt_${Number(sbtId)}`)
  const joinDAO = useJoinDAO()
  const { cap, total } = useSbtContractClaimTotal(sbtDetail?.tokenAddress, sbtDetail?.tokenChainId)
  const TextRef = useRef<HTMLSpanElement | null>(null)
  const [open, setOpen] = useState(false)
  const [isOverflowed, setIsOverflowed] = useState(false)
  const isSm = useBreakpoint('sm')
  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  useEffect(() => {
    const element = TextRef.current
    if ((element?.scrollWidth || 0) > (element?.clientWidth || 0)) {
      setIsOverflowed(true)
    } else {
      setIsOverflowed(false)
    }
  }, [sbtDetail?.itemName])

  const isClaimed = useMemo(() => {
    if (total && cap && total >= cap) {
      return true
    }
    return false
  }, [cap, total])
  const isClaim = useMemo(() => {
    if (
      !account ||
      !userSignature ||
      isClaimed ||
      chainId !== sbtDetail?.tokenChainId ||
      !sbtDetail?.tokenAddress ||
      isZero(sbtDetail?.tokenAddress) ||
      ClaimTotal >= sbtDetail?.totalSupply ||
      (!isJoin && ClaimWay.Joined === sbtDetail?.way) ||
      (!sbtIsClaim?.canClaim && !sbtIsClaim?.isWhite && !sbtIsClaim?.signature)
    ) {
      return true
    }
    if (sbtIsClaim?.canClaim && sbtIsClaim?.signature) {
      return false
    }
    return true
  }, [
    account,
    userSignature,
    isClaimed,
    chainId,
    sbtDetail?.tokenChainId,
    sbtDetail?.tokenAddress,
    sbtDetail?.totalSupply,
    sbtDetail?.way,
    ClaimTotal,
    isJoin,
    sbtIsClaim?.canClaim,
    sbtIsClaim?.isWhite,
    sbtIsClaim?.signature
  ])

  useEffect(() => {
    if (isJoined?.isJoin) {
      setIsJoin(true)
    } else {
      setIsJoin(false)
    }
  }, [isJoined?.isJoin])

  const JoinCallback = useCallback(async () => {
    if (!account) return toggleWalletModal()
    if (!userSignature) return loginSignature()
    await joinDAO(Number(daoId))
      .then(() => {
        setIsJoin(true)
        setUpdateIsClaim(true)
        toast.success('Join success')
      })
      .catch(() => {
        setIsJoin(false)
        console.log('error')
      })
  }, [account, toggleWalletModal, userSignature, loginSignature, joinDAO, daoId, setUpdateIsClaim])

  const sbtClaimCallback = useCallback(() => {
    if (!account) return toggleWalletModal()
    if (!userSignature) return loginSignature()
    if (!sbtId) return
    showModal(<TransacitonPendingModal />)
    SbtClaimCallback(sbtId)
      .then(res => {
        hideModal()
        showModal(
          <TransactionSubmittedModal
            hideFunc={() => {
              console.log('next=>')
            }}
            hash={res.hash}
          />
        )
      })
      .catch((err: any) => {
        console.log(err)
        showModal(
          <MessageBox type="error">
            {err?.reason || err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [SbtClaimCallback, sbtId, account, userSignature, hideModal, showModal, toggleWalletModal, loginSignature])

  const nextHandler = useMemo(() => {
    if (!sbtDetail) return

    if (
      !sbtDetail?.tokenAddress ||
      isZero(sbtDetail?.tokenAddress) ||
      (sbtDetail?.startTime < Math.floor(Date.now() / 1000) && sbtDetail?.status === 'soon')
    ) {
      return {
        buttonText: (
          <DeployButton disabled>
            Deploying <Dots />
          </DeployButton>
        )
      }
    }
    if (!contractQueryIsClaim && Math.floor(Date.now() / 1000) < sbtDetail?.startTime && sbtDetail?.status === 'soon') {
      return {
        buttonText: <ClaimButton disabled>Not Start</ClaimButton>
      }
    }

    if (!contractQueryIsClaim && Math.floor(Date.now() / 1000) > sbtDetail?.endTime) {
      return {
        buttonText: <ClaimButton disabled>Expired</ClaimButton>
      }
    }

    if (!account || !chainId || !userSignature) {
      return {
        buttonText: (
          <ClaimButton
            onClick={() => {
              toggleWalletModal()
            }}
          >
            Claim
          </ClaimButton>
        )
      }
    }

    if (chainId !== sbtDetail?.tokenChainId) {
      return {
        buttonText: (
          <ClaimButton
            onClick={() => {
              triggerSwitchChain(library, sbtDetail?.tokenChainId, account)
            }}
          >
            Claim
          </ClaimButton>
        )
      }
    }

    if (!contractQueryLoading && !contractQueryIsClaim && isClaimed) {
      return {
        buttonText: <ClaimButton disabled>Expired</ClaimButton>
      }
    }

    if (!isJoin && !JoinedLoading && ClaimWay.Joined === sbtDetail?.way) {
      return {
        buttonText: (
          <ClaimButton
            onClick={() => {
              showModal(
                <JoinDaoClaimModal
                  onClose={hideModal}
                  daoId={sbtDetail.daoId}
                  setIsJoin={setIsJoin}
                  setUpdateIsClaim={setUpdateIsClaim}
                />
              )
            }}
          >
            Claim
          </ClaimButton>
        )
      }
    }

    if (!sbtIsClaim?.canClaim && ClaimWay.WhiteList === sbtDetail?.way && sbtDetail.status === 'active') {
      return {
        buttonText: (
          <ClaimButton
            disabled
            sx={{
              '&:disabled': {
                background: '#F1F4F8',
                color: '#C6CEDA'
              }
            }}
          >
            Not Eligible
          </ClaimButton>
        )
      }
    }
    if (isClaiming) {
      return {
        buttonText: (
          <ClaimButton disabled>
            Claiming
            <Dots />
          </ClaimButton>
        )
      }
    }
    if (contractQueryIsClaim) {
      return {
        buttonText: <ClaimButton disabled>Owned</ClaimButton>
      }
    }
    if (isClaim) {
      return {
        buttonText: <ClaimButton disabled>Claim</ClaimButton>
      }
    }
    return {
      buttonText: <ClaimButton onClick={sbtClaimCallback}>Claim</ClaimButton>
    }
  }, [
    sbtDetail,
    contractQueryIsClaim,
    account,
    chainId,
    userSignature,
    contractQueryLoading,
    isClaimed,
    isJoin,
    JoinedLoading,
    sbtIsClaim?.canClaim,
    isClaiming,
    isClaim,
    sbtClaimCallback,
    toggleWalletModal,
    library,
    showModal,
    hideModal,
    setUpdateIsClaim
  ])

  return (
    <>
      {!sbtDetail ? (
        <DelayLoading loading={sbtDetailLoading}>
          <Loading sx={{ marginTop: 30 }} />
        </DelayLoading>
      ) : (
        <ContainerWrapper maxWidth={1200} sx={{ paddingTop: 30, px: isSm ? 20 : 0 }}>
          <Back sx={{ marginLeft: '0 !important' }} />
          <Box
            sx={[
              { display: 'flex', gap: 20, marginTop: 30, flexDirection: 'row' },
              isSm && { flexDirection: 'column' }
            ]}
          >
            <ContentBoxStyle>
              <ContentHeaderStyle>
                <TooltipStyle
                  onClose={handleTooltipClose}
                  open={open}
                  title={sbtDetail?.itemName}
                  placement="top-end"
                  sx={{
                    '& .MuiTooltip-tooltip': {
                      marginBottom: '5px !important'
                    }
                  }}
                >
                  <Typography
                    ref={TextRef}
                    onClick={isOverflowed ? handleTooltipOpen : undefined}
                    noWrap
                    fontSize={24}
                    fontWeight={700}
                    lineHeight={'29px'}
                    color={'#3F5170'}
                    sx={{ cursor: isOverflowed ? 'pointer' : 'auto' }}
                  >
                    {sbtDetail?.itemName || '--'}
                  </Typography>
                </TooltipStyle>
                <Box sx={{ mt: 20, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <DaoAvatars src={sbtDetail?.daoLogo} size={45} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                    <Typography variant="body1" color={'#80829F'}>
                      Base on
                    </Typography>
                    <Typography
                      variant="h6"
                      fontSize={18}
                      lineHeight={'20px'}
                      sx={{
                        cursor: 'pointer'
                        // ':hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => {
                        navigate(routes._DaoInfo + `/${sbtDetail.daoId}` + '/proposal')
                      }}
                    >
                      {sbtDetail?.daoName || '--'}
                    </Typography>
                    <Typography variant="body1" color={'#80829F'}>
                      DAO
                    </Typography>
                  </Box>
                  <JoInButton disabled={isJoin} onClick={JoinCallback}>
                    {isJoin ? 'Joined' : 'Join'}
                  </JoInButton>
                </Box>
              </ContentHeaderStyle>
              <DetailLayoutStyle>
                <RowCenter sx={[isSm && { flexWrap: 'wrap', gap: 10 }]}>
                  <Box>
                    <DetailTitleStyle>Number of Items </DetailTitleStyle>
                    <DetailStyle>{sbtDetail?.totalSupply || '--'}</DetailStyle>
                  </Box>
                  <Box>
                    <DetailTitleStyle>Network</DetailTitleStyle>
                    <DetailStyle>
                      {sbtDetail?.tokenChainId ? ChainListMap[sbtDetail?.tokenChainId]?.name : '--'}
                    </DetailStyle>
                  </Box>
                  <Box>
                    <DetailTitleStyle>Contract Address</DetailTitleStyle>
                    <DetailStyle sx={{ display: 'flex', justifyContent: 'center' }}>
                      {sbtDetail?.tokenAddress ? (
                        <ExternalLink
                          href={getEtherscanLink(
                            sbtDetail?.tokenChainId ? sbtDetail?.tokenChainId : 1,
                            sbtDetail?.tokenAddress || '',
                            'address'
                          )}
                        >
                          {shortenAddress(sbtDetail?.tokenAddress, 3)}
                        </ExternalLink>
                      ) : (
                        '--'
                      )}
                      <Copy margin="0 0 0 10px" toCopy={sbtDetail?.tokenAddress || ''} />
                    </DetailStyle>
                  </Box>
                </RowCenter>
                <Box>
                  <DetailTitleStyle>Claimable Period</DetailTitleStyle>
                  <DetailStyle fontSize={20}>
                    {sbtDetail?.startTime ? formatTimestamp(sbtDetail?.startTime) : '--'} -{' '}
                    {sbtDetail?.endTime ? formatTimestamp(sbtDetail?.endTime) : '--'}
                  </DetailStyle>
                </Box>
                <Box>
                  <DetailTitleStyle>Claimable Eligibility</DetailTitleStyle>
                  <DetailStyle>{ClaimWayMapText[sbtDetail.way as ClaimWay] || '--'}</DetailStyle>
                </Box>
              </DetailLayoutStyle>
              <Box sx={{ padding: '20px 40px' }}>
                <Typography
                  sx={{
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    // '& span': {
                    //   background: 'transparent !important'
                    // },
                    '& img': {
                      maxWidth: '100%'
                    }
                  }}
                  variant="body1"
                  lineHeight={'20px'}
                  fontWeight={400}
                >
                  {/* {sbtDetail?.introduction || '--'} */}
                  {ReactHtmlParser(
                    filterXSS(sbtDetail?.introduction || '', {
                      onIgnoreTagAttr: function (_, name, value) {
                        if (name === 'class' || name === 'style') {
                          return name + '="' + escapeAttrValue(value) + '"'
                        }
                        return undefined
                      }
                    })
                  )}
                </Typography>
              </Box>
            </ContentBoxStyle>
            <ContentBoxStyle maxWidth={580} maxHeight={800}>
              <ColumnLayoutStyle
                sx={{
                  height: 470,
                  pt: '30px',
                  gap: 30,
                  borderBottom: '1px solid #D4D7E2'
                }}
              >
                <Image src={sbtDetail?.fileUrl || ''} style={{ height: 310, width: 310, borderRadius: '10px' }} />
                <ColumnLayoutStyle
                  sx={{
                    gap: 10
                  }}
                >
                  {nextHandler?.buttonText ? nextHandler?.buttonText : <ClaimButton disabled>{'Claim'}</ClaimButton>}
                </ColumnLayoutStyle>
              </ColumnLayoutStyle>
              <OwnersStyle>
                <Typography variant="body1" color="#8D8EA5" lineHeight={'20px'} sx={{ display: 'flex', gap: 5 }}>
                  Owners({ClaimTotal || 0})
                  <TooltipBgStyle value="The owners will appear here in a few minutes." />
                </Typography>
                <Box sx={{ marginTop: 20, display: 'flex', gap: 17, flexWrap: 'wrap' }}>
                  {sbtClaimList?.length && ClaimTotal > 32
                    ? sbtClaimList?.map((item: any, index: number) =>
                        index < 31 ? (
                          <UserAvatar key={item.account} logoUrl={item.accountLogo} userAccount={item.account} />
                        ) : (
                          <Image src={EllipsisIcon} key={item.account} width={50} />
                        )
                      )
                    : sbtClaimList?.map((item: any) => (
                        <UserAvatar key={item.account} logoUrl={item.accountLogo} userAccount={item.account} />
                      ))}
                </Box>
              </OwnersStyle>
            </ContentBoxStyle>
          </Box>
        </ContainerWrapper>
      )}
    </>
  )
}

function UserAvatar({ logoUrl, userAccount }: { logoUrl: string; userAccount: string }) {
  const { account } = useActiveWeb3React()
  const userSignature = useUserInfo()
  const navigate = useNavigate()
  const loginSignature = useLoginSignature()
  const toggleWalletModal = useWalletModalToggle()
  return (
    <>
      <Image
        onClick={() => {
          if (!account) return toggleWalletModal()
          if (!userSignature) return loginSignature()
          navigate(routes._Profile + `/${userAccount}`)
        }}
        src={logoUrl || avatar}
        style={{
          height: 50,
          width: 50,
          borderRadius: '50%',
          backgroundColor: '#bfbf',
          cursor: 'pointer'
        }}
      />
    </>
  )
}
