import Modal from 'components/Modal/index'
import { Box, Stack, Typography, styled } from '@mui/material'
import Input from 'components/Input'
// import Image from 'components/Image'
// import { ChainList } from 'constants/chain'
import { useCallback, useEffect, useMemo, useState } from 'react'
// import { useActiveWeb3React } from 'hooks'
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
import { useRecentNftList } from 'hooks/useBackedNftCallback'
import { getEtherscanLink, shortenAddress } from 'utils'
import EmptyData from 'components/EmptyData'
import Loading from 'components/Loading'

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
  color: 'var(--tile-grey, #80829F)',
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

export default function CreateNftModal({ nft }: { nft?: ScanNFTInfo }) {
  // const { chainId } = useActiveWeb3React()
  const userSignature = useUserInfo()
  const [contractAddress, setContractAddress] = useState<string>('')
  const [tokenId, setTokenId] = useState<string>('')
  const [tokenId_f, setTokenId_f] = useState<string>('')
  const [isChange, setIsChange] = useState<boolean>(false)
  const [isEnterIng, setIsEnterIng] = useState<boolean>(false)
  const { showModal, hideModal } = useModal()
  const { isDeploy, getAccount, createAccountCallback } = useCreateTBACallback(
    contractAddress as `0x${string}`,
    tokenId_f
  )
  // const curChain = useMemo(() => {
  //   const res = ChainList.filter(item => item.id === chainId)
  //   return res[0]
  // }, [chainId])
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
      const res = await createAccountCallback()
      hideModal()
      showModal(
        <TransactionSubmittedModal
          hideFunc={() => {
            console.log('next=>')
          }}
          hash={res}
        />
      )
    } catch (err: any) {
      showModal(
        <MessageBox type="error">
          {err?.reason || err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
        </MessageBox>
      )
    }
  }, [createAccountCallback, hideModal, showModal])

  const createBtn: {
    disabled: boolean
    handler?: () => void
    error?: undefined | string | JSX.Element
  } = useMemo(() => {
    if (!contractAddress) {
      return {
        disabled: true,
        error: 'Please enter your address'
      }
    }

    if (!isAddress(contractAddress)) {
      return {
        disabled: true,
        error: 'Address format error'
      }
    }

    if (!tokenId) {
      return {
        disabled: true,
        error: 'tokenId required'
      }
    }
    if (isDeploy) {
      return {
        disabled: true,
        error: 'Address is already deployed'
      }
    }
    return {
      disabled: false,
      handler: createAccount
    }
  }, [contractAddress, isDeploy, tokenId, createAccount])

  return (
    <Modal maxWidth="480px" width="100%" closeIcon>
      <BodyBoxStyle>
        <Stack spacing={20}>
          <TitleStyle>Create an account with an NFT</TitleStyle>
          <Input
            disabled={isChange}
            value={contractAddress}
            label="Your address"
            placeholder="0x..."
            onChange={e => {
              setContractAddress(e.target.value)
            }}
          />
          <Box sx={{ display: 'grid', gap: 5 }}>
            <ContentTitleStyle>Token Name</ContentTitleStyle>
            <Box sx={{ display: 'flex', gap: 10, alignItems: 'center', paddingLeft: 6 }}>
              <ContentTextStyle>{'--'}</ContentTextStyle>
              {/* <Image src={curChain?.logo} style={{ height: 24, width: 24 }} />
              <ContentTextStyle>{curChain?.name}</ContentTextStyle> */}
            </Box>
          </Box>
          <Input
            disabled={isChange}
            value={tokenId}
            label="NFT ID"
            placeholder="Token ID"
            onBlur={() => {
              setTokenId_f(tokenId)
              setIsEnterIng(false)
            }}
            onChange={e => {
              if (/^[1-9]\d*$/.test(e.target.value) || !e.target.value || e.target.value === '0') {
                setTokenId(e.target.value)
                setIsEnterIng(true)
              } else if (/^[0\d]*$/.test(e.target.value)) {
                setTokenId(e.target.value[1])
                setIsEnterIng(true)
              }
            }}
          />
          <Box sx={{ display: 'grid', gap: 5 }}>
            {isAddress(contractAddress) && isEnterIng ? (
              <Button style={{ height: 40 }} disabled>
                Create Account
              </Button>
            ) : (
              <Button
                style={{ height: 40 }}
                disabled={createBtn.disabled || isPending || isEnterIng}
                onClick={() => {
                  createBtn.handler && createBtn.handler()
                }}
              >
                {isPending ? (
                  <>
                    pending
                    <Dots />
                  </>
                ) : createBtn.error ? (
                  createBtn.error
                ) : (
                  'Create Account'
                )}
              </Button>
            )}
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
        <ContentTitleStyle>Recent creations</ContentTitleStyle>

        {RecentNftList?.length ? (
          RecentNftList?.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ContentTextStyle>{shortenAddress(item?.account, 4)}</ContentTextStyle>
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
          ))
        ) : (
          <>{loading ? <Loading sx={{ marginTop: 30 }} /> : <EmptyData>No data</EmptyData>}</>
        )}
      </Stack>
    </Box>
  )
}
