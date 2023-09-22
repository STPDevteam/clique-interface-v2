import { Box, Typography, styled } from '@mui/material'
import { NftIsDelayCard, NftLayout } from './NftLayout'
import { ReactComponent as AddSvg } from 'assets/svg/add.svg'
import Image from 'components/Image'
import placeholderImage from 'assets/images/placeholder.png'
import { useEffect, useMemo } from 'react'
import { useSBTIsDeployList } from 'hooks/useContractIsDeploy'
import { ScanNFTInfo, useAccountNFTsList, useIsDelayTime } from 'hooks/useBackedProfileServer'
import { useActiveWeb3React } from 'hooks'
import { Searching } from './Children/Card/Searching'
import { NotHaveNft } from './Children/Card/NotHaveNft'
import { useCreateTBACallback } from 'hooks/useTBA'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useUserInfo } from 'state/userInfo/hooks'

const TitleLayout = styled(Box)(() => ({
  height: 'auto',
  width: '100%',
  display: 'grid',
  gap: '6px',
  justifyContent: 'center',
  marginTop: '20px'
}))

const TitleStyle = styled(Typography)(() => ({
  color: '#FFF',
  fontSize: '30px',
  fontWeight: 700,
  lineHeight: '42px',
  letterSpacing: '1px'
}))

const AddIcon = styled(AddSvg)(() => ({
  width: '12px',
  height: '12px',
  '& circle': {
    fill: 'transparent',
    stroke: '#A7F46A'
  },
  '& path': {
    fill: '#A7F46A'
  }
}))

const TitleButton = styled(Typography)(() => ({
  color: 'var(--spot-color, #A7F46A)',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '28px',
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
}))

const CardHeadStyle = styled(Typography)(() => ({
  color: '#FFF',
  fontSize: '18px',
  fontWeight: 600,
  lineHeight: '28px'
}))

const NftImgStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '244px',
  borderRadius: '7px',
  background: 'rgb(249, 249, 249)',
  [theme.breakpoints.down('sm')]: {
    height: '100%'
  }
}))

const CardBottomText = styled(Typography)(({ theme }) => ({
  color: '#FFF',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '28px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '13px',
    lineHeight: '18px'
  }
}))

const CardNftName = styled(Typography)(({ theme }) => ({
  color: '#FFF',
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: '28px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    lineHeight: '20px'
  }
}))

const NftCards = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',
  flexWrap: 'wrap',
  padding: '20px 125px',
  maxHeight: '60vh',
  overflowX: 'auto',

  '::-webkit-scrollbar': {
    display: 'none'
  },
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
    justifyContent: 'space-between',
    gap: 0,
    rowGap: '10px'
  }
}))

export function NftAccounts() {
  const navigate = useNavigate()
  const { account, chainId } = useActiveWeb3React()
  const userSignature = useUserInfo()
  const { isDelayTime } = useIsDelayTime()
  const { result: _accountNFTsList, loading } = useAccountNFTsList(account || undefined, chainId, 'erc721')
  // '0x5aEFAA34EaDaC483ea542077D30505eF2472cfe3'

  const SBTIsDeployList = useSBTIsDeployList(
    _accountNFTsList.map(item => item.contract_address),
    _accountNFTsList.map(i => i.token_id)
  )

  const accountNFTsList = useMemo(() => {
    if (!_accountNFTsList.length) return []
    if (!SBTIsDeployList) return

    return _accountNFTsList.filter((_, idx) => SBTIsDeployList[idx] === true)
  }, [SBTIsDeployList, _accountNFTsList])

  useEffect(() => {
    if (isDelayTime) return
    if (!account || !userSignature) {
      navigate(routes.NftGenerator)
    }
  }, [account, userSignature, isDelayTime, navigate])

  console.log('accounts=>', accountNFTsList)

  return (
    <NftLayout>
      <Box sx={{ display: 'grid', gap: '20px' }}>
        <TitleLayout>
          <TitleStyle>NFT Accounts</TitleStyle>
          <TitleButton
            onClick={() => {
              navigate(routes.NftSelect)
            }}
          >
            <AddIcon />
            Create NFT Account
          </TitleButton>
        </TitleLayout>
        {accountNFTsList !== undefined && !loading ? (
          accountNFTsList.length ? (
            <NftCards justifyContent={accountNFTsList && accountNFTsList?.length > 4 ? 'start' : 'center'}>
              {accountNFTsList?.map(item => (
                <NftCard key={item.contract_name} nft={item} chainId={chainId} />
              ))}
            </NftCards>
          ) : (
            <NotHaveNft />
          )
        ) : (
          <Searching />
        )}
      </Box>
    </NftLayout>
  )
}

function NftCard({ nft, chainId }: { nft: ScanNFTInfo; chainId: number | undefined }) {
  const navigate = useNavigate()
  const { getAccount } = useCreateTBACallback(nft.contract_address as `0x${string}`, nft.token_id)

  return (
    <Box
      sx={{
        cursor: 'pointer',
        '&:hover': {
          '.nft_card': {
            transition: 'all 0.5s',
            transform: 'translateY(-15px)'
          }
        }
      }}
      onClick={() => {
        navigate(routes._NftDetail + `/${getAccount}/${chainId}`)
      }}
    >
      <NftIsDelayCard className="nft_card">
        <>
          <Box sx={{ display: 'grid', gap: 10 }}>
            <CardHeadStyle>$ {nft?.latest_trade_price || 0}</CardHeadStyle>
            <NftImgStyle>
              <Image
                altSrc={placeholderImage}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  zIndex: 0
                }}
                src={nft?.image_uri || placeholderImage}
              />
            </NftImgStyle>
          </Box>
          <div style={{ marginTop: '9px' }}>
            <CardBottomText>Collection name</CardBottomText>
            <CardNftName noWrap>
              {nft.name || nft.contract_name || '-'}#{nft.token_id}
            </CardNftName>
          </div>
        </>
      </NftIsDelayCard>
    </Box>
  )
}
