import { Box, styled, Typography, Alert } from '@mui/material'
import { DaoAvatars } from 'components/Avatars'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import Button from 'components/Button/Button'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import Image from 'components/Image'
import avatar from 'assets/images/avatar.png'
import EllipsisIcon from 'assets/images/ellipsis_icon.png'
import Back from 'components/Back'
import { useSbtDetail, useSbtClaim, useSbtClaimList, useSbtWhetherClaim } from 'hooks/useBackedSbtServer'
import { useParams } from 'react-router-dom'
import { useJoinDAO } from 'hooks/useBackedDaoServer'
import { useUserInfo, useLoginSignature } from 'state/userInfo/hooks'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { useState, useEffect, useCallback } from 'react'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { ChainList, ChainId } from 'constants/chain'
import { shortenAddress } from 'utils'
import { useIsJoined } from 'hooks/useBackedDaoServer'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'

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
const DetailTitleStyle = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  color: '#B5B7CF'
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

export default function SoulboundDetail() {
  const { library, account, chainId } = useActiveWeb3React()
  const userSignature = useUserInfo()
  const loginSignature = useLoginSignature()
  const toggleWalletModal = useWalletModalToggle()

  const { sbtId } = useParams<{ sbtId: string }>()
  const { result: sbtDetail, whetherClaimBool } = useSbtDetail(sbtId)
  const { result: sbtClaimList } = useSbtClaimList(parseFloat(sbtId))
  const [sbtClaimBool, setsbtClaimBool] = useState(true)
  // const [whiteBool, setwhiteBool] = useState(false)
  const { SbtClaimCallback } = useSbtClaim()
  const { claimBool } = useSbtWhetherClaim(sbtId)
  const [isJoin, setIsJoin] = useState(true)
  const [switchChain, setSwitchChain] = useState(false)
  const joinDAO = useJoinDAO()
  const { isJoined } = useIsJoined(sbtDetail?.chainId, sbtDetail?.daoAddress)

  const [Chain, setChain] = useState<{
    icon: JSX.Element
    logo: string
    symbol: string
    name: string
    id: ChainId
    hex: string
  }>()
  const { showModal, hideModal } = useModal()
  useEffect(() => {
    const ChainData = ChainList.filter(v => v.id == sbtDetail?.chainId)
    setChain(ChainData[0])

    if (sbtId && account && chainId) {
      if (chainId === sbtDetail?.tokenChainId) {
        setSwitchChain(false)
        if (claimBool) {
          setsbtClaimBool(false)
        } else {
          setsbtClaimBool(true)
        }
      } else {
        setsbtClaimBool(true)
        setSwitchChain(true)
      }
      if (isJoined) {
        setIsJoin(true)
      }
    }
  }, [sbtDetail, sbtId, userSignature, chainId, account, whetherClaimBool, isJoined, claimBool, isJoin])

  const JoninCallback = useCallback(async () => {
    if (!account) return toggleWalletModal()
    if (!userSignature) return loginSignature()
    await joinDAO(sbtDetail?.chainId, sbtDetail?.daoAddress)
      .then(() => {
        setIsJoin(true)
      })
      .catch(() => {
        setIsJoin(false)
        console.log('error')
      })
  }, [sbtDetail, joinDAO, account, userSignature, toggleWalletModal, loginSignature])

  const sbtClaimCallbak = useCallback(() => {
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

  // const nextHandler = useMemo(() => {
  //   if (!isJoin) {
  //     return {
  //       JoinDaodisabled: true,
  //       Claimdisabled: true,
  //       error: 'Dao required'
  //     }
  //   }
  //   if (whetherClaim === undefined) {
  //     return {
  //       JoinDaodisabled: false,
  //       Claimdisabled: true,
  //       error: 'Blockchain required'
  //     }
  //   }
  //   if (!whiteBool) {
  //     return {
  //       JoinDaodisabled: false,
  //       Claimdisabled: true,
  //       error: 'File required'
  //     }
  //   }
  //   return {
  //     JoinDaodisabled: false,
  //     Claimdisabled: false
  //   }
  // }, [])
  return (
    <>
      <ContainerWrapper maxWidth={1200} sx={{ paddingTop: 30 }}>
        <Back />
        <Box sx={{ display: 'flex', gap: 20, marginTop: 30 }}>
          <ContentBoxStyle>
            <ContentHeaderStyle>
              <Typography fontSize={24} fontWeight={700} lineHeight={'29px'} color={'#3F5170'}>
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
                <JoInButton disabled={isJoin} onClick={JoninCallback}>
                  {isJoin ? 'Joined' : 'Joined'}
                </JoInButton>
              </Box>
            </ContentHeaderStyle>
            <DetailLayoutStyle>
              <RowCenter>
                <Box>
                  <DetailTitleStyle>Items</DetailTitleStyle>
                  <DetailStyle>{sbtDetail?.totalSupply}</DetailStyle>
                </Box>
                <Box>
                  <DetailTitleStyle>Network</DetailTitleStyle>
                  <DetailStyle>{Chain?.name || '--'}</DetailStyle>
                </Box>
                <Box>
                  <DetailTitleStyle>Contract Address</DetailTitleStyle>
                  <DetailStyle>
                    {sbtDetail?.tokenAddress ? shortenAddress(sbtDetail?.tokenAddress, 3) : '--'}
                  </DetailStyle>
                </Box>
              </RowCenter>
              <Box>
                <DetailTitleStyle>Claimable Period</DetailTitleStyle>
                <DetailStyle fontSize={20}>
                  {formatTimestamp(sbtDetail?.startTime)} -{' '}
                  {sbtDetail?.endTime ? formatTimestamp(sbtDetail?.endTime) : '--'}
                </DetailStyle>
              </Box>
            </DetailLayoutStyle>
            <Typography sx={{ padding: '20px 40px' }} variant="body1" lineHeight={'20px'} fontWeight={400}>
              {sbtDetail?.introduction}
            </Typography>
          </ContentBoxStyle>
          <ContentBoxStyle maxWidth={580}>
            <Box
              sx={{
                height: 470,
                pt: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                alignItems: 'center',
                borderBottom: '1px solid #D4D7E2'
              }}
            >
              <Box
                sx={{
                  padding: '0 135px',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  gap: 30
                }}
              >
                <Image src={sbtDetail?.fileUrl} style={{ height: 310, width: 310, borderRadius: '10px' }} />
                <ClaimButton disabled={whetherClaimBool ? whetherClaimBool : sbtClaimBool} onClick={sbtClaimCallbak}>
                  {whetherClaimBool ? 'Owned' : sbtClaimBool ? 'ont Owned' : 'Claim'}
                </ClaimButton>
              </Box>
              {switchChain && (
                <Alert
                  severity="error"
                  onClick={() => {
                    account && triggerSwitchChain(library, sbtDetail?.tokenChainId, account)
                  }}
                >
                  Address format error, please download the template.
                </Alert>
              )}
            </Box>
            <OwnersStyle>
              <Typography variant="body1" color="#B5B7CF" lineHeight={'20px'}>
                Owners(2,000)
              </Typography>
              <Box sx={{ marginTop: 20, display: 'flex', gap: 17, flexWrap: 'wrap' }}>
                {sbtClaimList &&
                  sbtClaimList.map((item: any) => (
                    <Image
                      key={item.account}
                      src={item.accountLogo || avatar}
                      style={{ height: 50, width: 50, borderRadius: '50%', backgroundColor: '#bfbf' }}
                    />
                  ))}

                {sbtClaimList && sbtClaimList.length > 32 ? <Image src={EllipsisIcon} width={50} /> : ''}
              </Box>
            </OwnersStyle>
          </ContentBoxStyle>
        </Box>
      </ContainerWrapper>
    </>
  )
}
function formatTimestamp(timestamp: any) {
  const date = new Date(timestamp * 1000)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${month}/${day}/${year} ${hours}:${minutes}`
}
