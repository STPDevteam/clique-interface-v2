import { Box, styled, Typography, Link } from '@mui/material'
import { DaoAvatars } from 'components/Avatars'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import Button from 'components/Button/Button'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import Image from 'components/Image'
import avatar from 'assets/images/avatar.png'
import EllipsisIcon from 'assets/images/ellipsis_icon.png'
import Back from 'components/Back'
import { useSbtDetail, useSbtClaim, useSbtClaimList, useSbtQueryIsClaim, ClaimWay } from 'hooks/useBackedSbtServer'
import { useParams } from 'react-router-dom'
import { useJoinDAO } from 'hooks/useBackedDaoServer'
import { useUserInfo, useLoginSignature } from 'state/userInfo/hooks'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { useState, useEffect, useCallback, useMemo } from 'react'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { ChainListMap } from 'constants/chain'
import { shortenAddress, getEtherscanLink, formatTimestamp } from 'utils'

import { useIsJoined } from 'hooks/useBackedDaoServer'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import ReactHtmlParser from 'react-html-parser'
import { escapeAttrValue } from 'xss'
import Copy from 'components/essential/Copy'
import { ExternalLink } from 'theme/components'
import { useUserProfileInfo } from 'hooks/useBackedProfileServer'

// import owl from 'assets/images/owl.png'

const ContentBoxStyle = styled(Box)(({ maxWidth }: { maxWidth?: number }) => ({
  height: 800,
  maxWidth: maxWidth ? maxWidth : 600,
  width: '100%',
  border: '1px solid #D4D7E2',
  borderRadius: '10px'
}))
const ContentHeaderStyle = styled(Box)(() => ({
  padding: '30px 40px'
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
const DetailLayoutStyle = styled(Box)(() => ({
  background: '#F8FBFF',
  padding: '13px 40px',
  height: 150,
  marginTop: 25,
  display: 'grid',
  flexDirection: 'column',
  gap: 20
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
const OwnersStyle = styled(Box)(() => ({
  padding: '20px 25px'
}))

export default function SoulTokenDetail() {
  const { library, account, chainId } = useActiveWeb3React()
  const userSignature = useUserInfo()
  const loginSignature = useLoginSignature()
  const toggleWalletModal = useWalletModalToggle()
  const { showModal, hideModal } = useModal()
  const { result: profileInfo } = useUserProfileInfo(account || undefined)
  const { daoId, sbtId } = useParams<{
    daoId: string
    sbtId: string
  }>()
  // const curDaoChainId = Number(daoChainId) as ChainId

  const { result: sbtDetail, contractQueryIsClaim, loading, ContractQueryLoading } = useSbtDetail(sbtId)
  const { result: sbtClaimList } = useSbtClaimList(Number(sbtId))
  const { result: sbtIsClaim } = useSbtQueryIsClaim(Number(sbtId))
  const { isJoined, loading: JoinedLoading } = useIsJoined(Number(daoId))
  const { SbtClaimCallback } = useSbtClaim()
  const joinDAO = useJoinDAO()

  const [isJoin, setIsJoin] = useState(false)

  const isClaim = useMemo(() => {
    if (
      !account ||
      !userSignature ||
      !sbtDetail ||
      chainId !== sbtDetail?.tokenChainId ||
      (sbtClaimList && sbtClaimList?.length >= sbtDetail?.totalSupply) ||
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
    chainId,
    sbtDetail,
    isJoin,
    sbtIsClaim?.canClaim,
    sbtIsClaim?.isWhite,
    sbtIsClaim?.signature,
    sbtClaimList
  ])

  useEffect(() => {
    if (isJoined?.isJoin) {
      setIsJoin(true)
    } else {
      setIsJoin(false)
    }
  }, [isJoined?.isJoin])

  const nextHandler = useMemo(() => {
    if (!sbtDetail && !loading) {
      return {
        error: 'Query data is null.'
      }
    }
    if (
      !contractQueryIsClaim &&
      sbtDetail &&
      (Math.floor(Date.now() / 1000) < sbtDetail?.startTime || Math.floor(Date.now() / 1000) > sbtDetail?.endTime)
    ) {
      return {
        error: 'The claiming period has either ended or has not yet started.'
      }
    }

    if (!account || !chainId || !userSignature) {
      return {
        error: 'Please log in first.'
      }
    }

    if (sbtDetail && chainId !== sbtDetail?.tokenChainId) {
      return {
        error: (
          <Box>
            Please{' '}
            <Link
              sx={{ cursor: 'pointer', color: '#E46767', textDecorationColor: '#E46767' }}
              onClick={() => {
                triggerSwitchChain(library, sbtDetail?.tokenChainId, account)
              }}
            >
              Click Switch Chain
            </Link>
          </Box>
        )
      }
    }

    if (
      !ContractQueryLoading &&
      !contractQueryIsClaim &&
      sbtClaimList &&
      sbtDetail &&
      sbtClaimList?.length >= sbtDetail?.totalSupply
    ) {
      return {
        error: 'Total quantity has been fully claimed.'
      }
    }

    if (!isJoin && !JoinedLoading && ClaimWay.Joined === sbtDetail?.way) {
      return {
        error: 'Please join the DAO first.'
      }
    }

    if (!sbtIsClaim?.canClaim && ClaimWay.WhiteList === sbtDetail?.way) {
      return {
        error: 'Not within the whitelist range.'
      }
    }

    return
  }, [
    sbtDetail,
    loading,
    contractQueryIsClaim,
    account,
    chainId,
    userSignature,
    isJoin,
    JoinedLoading,
    sbtIsClaim?.canClaim,
    ContractQueryLoading,
    sbtClaimList,
    library
  ])

  const JoinCallback = useCallback(async () => {
    if (!account) return toggleWalletModal()
    if (!userSignature) return loginSignature()
    await joinDAO(Number(daoId))
      .then(() => {
        setIsJoin(true)
      })
      .catch(() => {
        setIsJoin(false)
        console.log('error')
      })
  }, [account, toggleWalletModal, userSignature, loginSignature, joinDAO, daoId])

  const sbtClaimCallback = useCallback(() => {
    if (!account) return toggleWalletModal()
    if (!userSignature) return loginSignature()
    showModal(<TransacitonPendingModal />)
    SbtClaimCallback(sbtId, account)
      .then(res => {
        hideModal()
        console.log(res)
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
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [SbtClaimCallback, sbtId, account, userSignature, hideModal, showModal, toggleWalletModal, loginSignature])

  return (
    <>
      <ContainerWrapper maxWidth={1200} sx={{ paddingTop: 30 }}>
        <Back />
        <Box sx={{ display: 'flex', gap: 20, marginTop: 30 }}>
          <ContentBoxStyle>
            <ContentHeaderStyle>
              <Typography noWrap fontSize={24} fontWeight={700} lineHeight={'29px'} color={'#3F5170'}>
                {sbtDetail?.itemName || '--'}
              </Typography>
              <Box sx={{ mt: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
                <DaoAvatars src={sbtDetail?.daoLogo} size={45} />
                <Box>
                  <Typography variant="body1" color={'#80829F'}>
                    Base on
                  </Typography>
                  <Typography variant="h6" fontSize={18} lineHeight={'20px'}>
                    {sbtDetail?.daoName || '--'}
                  </Typography>
                </Box>
                <JoInButton disabled={isJoin} onClick={JoinCallback}>
                  {isJoin ? 'Joined' : 'Join'}
                </JoInButton>
              </Box>
            </ContentHeaderStyle>
            <DetailLayoutStyle>
              <RowCenter>
                <Box>
                  <DetailTitleStyle>Items </DetailTitleStyle>
                  <DetailStyle>{sbtDetail?.totalSupply}</DetailStyle>
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
                  {sbtDetail?.startTime ? formatTimestamp(sbtDetail?.startTime) : '--'} -
                  {sbtDetail?.endTime ? formatTimestamp(sbtDetail?.endTime) : '--'}
                </DetailStyle>
              </Box>
            </DetailLayoutStyle>
            <Box sx={{ padding: '20px 40px' }}>
              <Typography
                sx={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                variant="body1"
                lineHeight={'20px'}
                fontWeight={400}
              >
                {/* {sbtDetail?.introduction || '--'} */}
                {ReactHtmlParser(
                  sbtDetail?.introduction
                    ? sbtDetail?.introduction
                    : filterXSS(sbtDetail?.introduction || '', {
                        onIgnoreTagAttr: function(_, name, value) {
                          if (name === 'class') {
                            return name + '="' + escapeAttrValue(value) + '"'
                          }
                          return undefined
                        }
                      })
                )}
              </Typography>
            </Box>
          </ContentBoxStyle>
          <ContentBoxStyle maxWidth={580}>
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
                <ClaimButton
                  disabled={contractQueryIsClaim ? contractQueryIsClaim : isClaim}
                  onClick={sbtClaimCallback}
                >
                  {contractQueryIsClaim ? 'Owned' : isClaim ? 'CannotClaim' : 'Claim'}
                </ClaimButton>
                {nextHandler?.error && (
                  <Box
                    sx={{ display: 'flex', gap: 10, width: '100%', font: '500 14px/24px "Inter"', color: '#E46767' }}
                  >
                    <ErrorOutlineOutlinedIcon />
                    {nextHandler?.error}
                  </Box>
                )}
              </ColumnLayoutStyle>
            </ColumnLayoutStyle>
            <OwnersStyle>
              <Typography variant="body1" color="#8D8EA5" lineHeight={'20px'}>
                Owners({sbtClaimList && sbtClaimList?.length > 0 ? sbtClaimList?.length : contractQueryIsClaim ? 1 : 0})
              </Typography>
              <Box sx={{ marginTop: 20, display: 'flex', gap: 17, flexWrap: 'wrap' }}>
                {sbtClaimList && sbtClaimList?.length > 0 ? (
                  sbtClaimList?.map((item: any) => (
                    <Image
                      key={item.account}
                      src={item.accountLogo || avatar}
                      style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }}
                    />
                  ))
                ) : contractQueryIsClaim ? (
                  <Image
                    src={profileInfo?.accountLogo || avatar}
                    style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }}
                  />
                ) : (
                  ''
                )}

                {sbtClaimList && sbtClaimList?.length > 32 ? <Image src={EllipsisIcon} width={50} /> : ''}
              </Box>
            </OwnersStyle>
          </ContentBoxStyle>
        </Box>
      </ContainerWrapper>
    </>
  )
}
