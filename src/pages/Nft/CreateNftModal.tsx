import Modal from 'components/Modal/index'
import { Box, Stack, Typography, styled, Link } from '@mui/material'
import Input from 'components/Input'
// import Image from 'components/Image'
// import { ChainList } from 'constants/chain'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import Button from 'components/Button/Button'
import { ReactComponent as ShareIconComponent } from 'assets/svg/share.svg'
import { isAddress } from 'ethers/lib/utils'
import { useCreateTBACallback } from 'hooks/useTBA'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import { Dots } from 'theme/components'
import { ScanNFTInfo } from 'hooks/useBackedProfileServer'
import { useUserInfo } from 'state/userInfo/hooks'
import { useRecentNftList, useNftAccountInfo, RecentNftListProp } from 'hooks/useBackedNftCallback'
import { getEtherscanLink } from 'utils'
import EmptyData from 'components/EmptyData'
import Loading from 'components/Loading'
import { ChainId } from 'constants/chain'
import { routes } from 'constants/routes'
import { useNavigate } from 'react-router-dom'

const BodyBoxStyle = styled(Box)(() => ({
  padding: '30px 28px '
}))

const TitleStyle = styled(Typography)(() => ({
  color: 'var(--word-color, #3F5170)',
  fontSize: '16px',
  fontWeight: '500',
  lineHeight: '24px',
  textAlign: 'center'
}))

const ContentTitleStyle = styled(Typography)(() => ({
  color: 'var(--tile-grey, #808191)',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px'
}))

const ContentTextStyle = styled(Typography)(() => ({
  color: 'var(--word-color, #3F5170)',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px'
}))

const ShareIcon = styled(ShareIconComponent)(() => ({
  height: 16,
  width: 16,
  '& path': {
    fill: '#97B7EF'
  }
}))

const ErrorText = styled(Typography)(() => ({
  color: '#E46767',
  font: '400 12px/20px "Inter"',
  marginTop: '3px'
}))

export default function CreateNftModal({ nft }: { nft?: ScanNFTInfo }) {
  const { chainId } = useActiveWeb3React()
  const userSignature = useUserInfo()
  const navigate = useNavigate()
  const [contractAddress, setContractAddress] = useState<string>('')
  const [tokenId, setTokenId] = useState<string>('')
  const [tokenId_f, setTokenId_f] = useState<string>('')
  const [isChange, setIsChange] = useState<boolean>(false)
  const [isEnterIng_address, setIsEnterIng_address] = useState<boolean>()
  const [isEnterIng_id, setIsEnterIng_id] = useState<boolean>()
  const { showModal, hideModal } = useModal()
  const { isDeploy, getAccount, createAccountCallback } = useCreateTBACallback(
    contractAddress as `0x${string}`,
    tokenId_f
  )
  const { result: nftInfo } = useNftAccountInfo(contractAddress, chainId)

  const IsEthChain = useMemo(() => {
    if (chainId === ChainId.MAINNET) {
      return true
    }
    return false
  }, [chainId])

  console.log(isDeploy, getAccount)

  const isPending = useMemo(() => {
    if (isDeploy === undefined) {
      return true
    } else {
      return false
    }
  }, [isDeploy])

  useEffect(() => {
    if (nft) {
      setContractAddress(nft.contract_address)
      setTokenId(nft.token_id)
      setTokenId_f(nft.token_id)
      setIsChange(true)
    } else {
      setContractAddress('')
      setTokenId('')
      setIsChange(false)
      setTokenId_f('')
    }
  }, [nft])

  useEffect(() => {
    if (!userSignature) return hideModal()
  }, [userSignature, hideModal])

  const createAccount = useCallback(async () => {
    showModal(<TransacitonPendingModal />)

    try {
      await createAccountCallback()
      hideModal()
      showModal(
        <TransactionSubmittedModal
          hideFunc={() => {
            console.log('next=>')
          }}
        >
          <Link
            style={{
              fontSize: 12,
              cursor: 'pointer'
            }}
            onClick={() => {
              hideModal()
              navigate(routes.Profile)
            }}
          >
            view on profile
          </Link>
        </TransactionSubmittedModal>
      )
    } catch (err: any) {
      showModal(
        <MessageBox type="error">
          {err?.reason || err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
        </MessageBox>
      )
    }
  }, [createAccountCallback, hideModal, navigate, showModal])

  // const createBtn: {
  //   disabled: boolean
  //   handler?: () => void
  //   error?: undefined | string | JSX.Element
  // } = useMemo(() => {
  //   if (!contractAddress) {
  //     return {
  //       disabled: true,
  //       error: <ErrorText>Please enter your address</ErrorText>
  //     }
  //   }

  //   if (!isAddress(contractAddress)) {
  //     return {
  //       disabled: true,
  //       error: <ErrorText>Address format error</ErrorText>
  //     }
  //   }

  //   if (!tokenId) {
  //     return {
  //       disabled: true,
  //       error: <ErrorText>Token ID required</ErrorText>
  //     }
  //   }
  //   if (isDeploy) {
  //     return {
  //       disabled: true,
  //       error: <ErrorText>Address is already deployed</ErrorText>
  //     }
  //   }
  //   return {
  //     disabled: false,
  //     handler: createAccount
  //   }
  // }, [contractAddress, isDeploy, tokenId, createAccount])

  return (
    <Modal maxWidth="480px" width="100%" closeIcon>
      <BodyBoxStyle>
        <Stack spacing={20}>
          <TitleStyle>Manually Create a Smart Wallet using a NFT</TitleStyle>
          <Box>
            <Input
              disabled={isChange}
              value={contractAddress}
              label="NFT Collection Address"
              style={{
                borderColor:
                  !isEnterIng_address &&
                  isEnterIng_address !== undefined &&
                  (!contractAddress || !isAddress(contractAddress))
                    ? '#E46767'
                    : '#D4D7E2'
              }}
              placeholder="0x..."
              onBlur={() => {
                setIsEnterIng_address(false)
              }}
              onChange={e => {
                setContractAddress(e.target.value)
                setIsEnterIng_address(true)
              }}
            />
            {(!contractAddress || !isAddress(contractAddress)) &&
              !isEnterIng_address &&
              isEnterIng_address !== undefined && (
                <ErrorText>{!contractAddress ? 'Please enter your address.' : 'Address format error.'}</ErrorText>
              )}
          </Box>
          <Box sx={{ display: 'grid', gap: 5 }}>
            <ContentTitleStyle>Token Name</ContentTitleStyle>
            <Box sx={{ display: 'flex', gap: 10, alignItems: 'center', paddingLeft: 6 }}>
              <ContentTextStyle>{nftInfo?.name || '--'}</ContentTextStyle>
              {/* <Image src={curChain?.logo} style={{ height: 24, width: 24 }} />
              <ContentTextStyle>{curChain?.name}</ContentTextStyle> */}
            </Box>
          </Box>
          <Box>
            <Input
              disabled={isChange}
              value={tokenId}
              label="Token ID"
              placeholder="Token ID"
              style={{
                borderColor: !isEnterIng_id && isEnterIng_id !== undefined && !tokenId ? '#E46767' : '#D4D7E2'
              }}
              onBlur={() => {
                setTokenId_f(tokenId)
                setIsEnterIng_id(false)
              }}
              onChange={e => {
                if (/^[1-9]\d*$/.test(e.target.value) || !e.target.value || e.target.value === '0') {
                  setTokenId(e.target.value)
                  setIsEnterIng_id(true)
                } else if (/^[0\d]*$/.test(e.target.value)) {
                  setTokenId(e.target.value[1])
                  setIsEnterIng_id(true)
                }
              }}
            />
            {!tokenId && !isEnterIng_id && isEnterIng_id !== undefined && <ErrorText>{'Token ID required.'}</ErrorText>}
          </Box>
          <Box sx={{ display: 'grid', gap: 10 }}>
            {getAccount && (
              <Box>
                <ContentTitleStyle
                  sx={{
                    background: 'var(--light-bg, #F8FBFF)',
                    borderRadius: '6px',
                    padding: '8px 0 8px 12px'
                  }}
                >
                  Generated Address:{' '}
                  <Typography fontSize={12} color={isDeploy ? '#E46767' : '#0049C6'}>
                    {getAccount}
                  </Typography>
                </ContentTitleStyle>
                {isDeploy && <ErrorText>{'This NFT has been deployed already.'}</ErrorText>}
              </Box>
            )}

            <Box>
              {isAddress(contractAddress) && isEnterIng_id ? (
                <Button style={{ height: 40 }} disabled>
                  Create Account
                </Button>
              ) : (
                <Button
                  style={{ height: 40 }}
                  disabled={
                    isPending ||
                    isEnterIng_id ||
                    isEnterIng_address ||
                    isDeploy ||
                    !tokenId ||
                    !contractAddress ||
                    !isAddress(contractAddress) ||
                    !IsEthChain
                  }
                  onClick={() => {
                    createAccount()
                  }}
                >
                  {isPending ? (
                    <>
                      Pending
                      <Dots />
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              )}
              {!IsEthChain && (
                <ErrorText marginBottom={'3px'}>{'Currently, only the Ethereum network is supported.'}</ErrorText>
              )}
            </Box>
          </Box>
          <MessageList />
        </Stack>
      </BodyBoxStyle>
    </Modal>
  )
}

function MessageList() {
  const { result: RecentNftList, loading } = useRecentNftList()
  console.log(RecentNftList)

  return (
    <Box
      sx={{
        padding: '8px 20px 20px 12px',
        width: '100%',
        borderRadius: '8px',
        background: 'var(--light-bg, #F8FBFF)'
      }}
    >
      <Stack spacing={13}>
        <ContentTitleStyle>Recent Creations</ContentTitleStyle>

        {RecentNftList?.length ? (
          RecentNftList?.map((item, index) => <RecentList key={index} item={item} />)
        ) : (
          <>{loading ? <Loading sx={{ marginTop: 30 }} /> : <EmptyData>No data</EmptyData>}</>
        )}
      </Stack>
    </Box>
  )
}

function RecentList({ item }: { item: RecentNftListProp }) {
  const { result: nftInfo } = useNftAccountInfo(item.tokenContract, item.chainId)

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <ContentTextStyle noWrap maxWidth={200}>
        {nftInfo?.name || '--'}#{item.tokenId}
      </ContentTextStyle>
      <ContentTextStyle
        onClick={() => {
          window.open(getEtherscanLink(item?.chainId, item?.transactionHash, 'transaction'))
        }}
        sx={{ color: '#0049C6', cursor: 'pointer', display: 'flex', gap: 5, alignItems: 'center' }}
      >
        View on Blockchain
        <ShareIcon />
      </ContentTextStyle>
    </Box>
  )
}
