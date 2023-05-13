import { Box, Button, ButtonGroup, Link, styled, Typography } from '@mui/material'
import EmptyData from 'components/EmptyData'
import Image from 'components/Image'
import Loading from 'components/Loading'
import Pagination from 'components/Pagination'
import { ChainId } from 'constants/chain'
import { BVNFTInfo, useAccountNFTsList } from 'hooks/useBackedProfileServer'
import useBreakpoint from 'hooks/useBreakpoint'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import { useEffect, useMemo, useState } from 'react'
import placeholderImage from 'assets/images/placeholder.png'

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  borderRadius: '16px',
  height: 24,
  opacity: 0.6,
  fontSize: 12,
  '& button': {
    height: 24,
    color: '#9A9A9A',
    minWidth: '82px!important',
    fontWeight: 400,
    borderColor: theme.palette.text.primary
  },
  '& .active': {
    opacity: 1,
    backgroundColor: '#fff',
    fontWeight: 500,
    color: theme.palette.text.primary
  }
}))

const StyledItems = styled(Box)(({ theme }) => ({
  height: 328,
  background: '#F9F9F9',
  border: '1px solid #E4E4E4',
  borderRadius: '10px',
  [theme.breakpoints.down('sm')]: {
    height: 200
  }
}))

export default function AccountNFTs({ account }: { account: string }) {
  const isSmDown = useBreakpoint('sm')
  const [viewAll, setViewAll] = useState(false)
  const [currentChainId, setCurrentChainId] = useState(1)
  const { result: accountNFTsList, loading, page } = useAccountNFTsList(account, currentChainId)
  const showAccountNFTsList = useMemo(() => {
    return viewAll ? accountNFTsList : accountNFTsList.slice(0, 4)
  }, [accountNFTsList, viewAll])

  useEffect(() => {
    if (accountNFTsList.length === 4) {
      setViewAll(true)
    }
    if (isSmDown) {
      setViewAll(true)
    }
  }, [accountNFTsList, isSmDown])

  return (
    <ContainerWrapper
      maxWidth={isSmDown ? '100%' : 1150}
      sx={{
        minHeight: 200
      }}
      style={{ width: isSmDown ? '100%' : '100vw' }}
      margin={'0 auto'}
    >
      <Box display={'flex'} justifyContent="space-between">
        <Typography variant="h6" fontSize={16} fontWeight={600}>
          NFTs
        </Typography>
        <StyledButtonGroup variant="outlined" aria-label="outlined button group">
          <Button
            className={currentChainId === ChainId.MAINNET ? `active` : ''}
            onClick={() => setCurrentChainId(ChainId.MAINNET)}
          >
            Ethereum
          </Button>
          <Button
            className={currentChainId === ChainId.BSC ? `active` : ''}
            onClick={() => setCurrentChainId(ChainId.BSC)}
          >
            BSC
          </Button>
        </StyledButtonGroup>
      </Box>
      <Box
        mt={16}
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            sm: viewAll ? '250fr 250fr 250fr 250fr' : '250fr 250fr 250fr 250fr 80fr',
            xs: '1fr 1fr'
          },
          gap: '15px',
          minWidth: isSmDown ? 'unset' : '800px',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        {showAccountNFTsList.map((item, index) => (
          <NFTItem key={index} nft={item} nftChainId={currentChainId}></NFTItem>
        ))}
        {!isSmDown && !viewAll && accountNFTsList.length > 4 && (
          <StyledItems
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setViewAll(true)}
          >
            <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2L11 10.5L2 19" stroke="#E6E6E6" strokeWidth="4" />
              <path d="M11 2L20 10.5L11 19" stroke="#E6E6E6" strokeWidth="4" />
            </svg>
            <Typography color={'#9A9A9A'} fontWeight={500}>
              View all
            </Typography>
            <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2L11 10.5L2 19" stroke="#E6E6E6" strokeWidth="4" />
              <path d="M11 2L20 10.5L11 19" stroke="#E6E6E6" strokeWidth="4" />
            </svg>
          </StyledItems>
        )}
      </Box>
      <Box mt={20}>
        {!accountNFTsList.length && !loading && <EmptyData />}
        {loading && <Loading />}
      </Box>

      {viewAll && page.totalPage > 1 && (
        <Box display={'flex'} mt={20} justifyContent="center">
          <Pagination
            count={page.totalPage}
            page={page.currentPage}
            onChange={(_, value) => page.setCurrentPage(value)}
          />
        </Box>
      )}
    </ContainerWrapper>
  )
}

function NFTItem({ nft, nftChainId }: { nft: BVNFTInfo; nftChainId: ChainId }) {
  const isSmDown = useBreakpoint('sm')
  return (
    <StyledItems>
      <Typography noWrap padding="5px 16px" maxWidth={isSmDown ? 160 : 250}>
        {nft.metadata.name || nft.metadata.collectionName || '-'}
      </Typography>
      <Image
        altSrc={placeholderImage}
        style={{
          width: '100%',
          height: isSmDown ? 124 : 248,
          objectFit: 'cover'
        }}
        src={nft.metadata.gatewayImageURL || placeholderImage}
      />
      <RowCenter padding="5px 16px">
        <Typography noWrap maxWidth={100}>
          #{nft.tokenId}
        </Typography>
        {nftChainId === ChainId.MAINNET && (
          <Link
            target={'_blank'}
            underline="none"
            href={`https://opensea.io/assets/ethereum/${nft.contractAddress}/${nft.tokenId}`}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.1875 3.66727L6.85862 8.97003C6.62922 9.19828 6.25824 9.19737 6.02997 8.96798C5.80172 8.7386 5.80263 8.36761 6.03202 8.13935L11.3851 2.8125H9.16992C8.84632 2.8125 8.58398 2.55016 8.58398 2.22656C8.58398 1.90296 8.84632 1.64062 9.16992 1.64062H11.7188C12.6248 1.64062 13.3594 2.37516 13.3594 3.28125V5.83008C13.3594 6.15368 13.097 6.41602 12.7734 6.41602C12.4498 6.41602 12.1875 6.15368 12.1875 5.83008V3.66727ZM12.1875 8.6464C12.1875 8.32279 12.4498 8.06046 12.7734 8.06046C13.097 8.06046 13.3594 8.32279 13.3594 8.6464V11.7188C13.3594 12.6248 12.6248 13.3594 11.7188 13.3594H3.28125C2.37516 13.3594 1.64062 12.6248 1.64062 11.7188V3.28125C1.64062 2.37516 2.37516 1.64062 3.28125 1.64062H6.35361C6.6772 1.64062 6.93955 1.90296 6.93955 2.22656C6.93955 2.55016 6.6772 2.8125 6.35361 2.8125H3.28125C3.02237 2.8125 2.8125 3.02237 2.8125 3.28125V11.7188C2.8125 11.9776 3.02237 12.1875 3.28125 12.1875H11.7188C11.9776 12.1875 12.1875 11.9776 12.1875 11.7188V8.64639V8.6464Z"
                fill="#9A9A9A"
              />
            </svg>
          </Link>
        )}
      </RowCenter>
    </StyledItems>
  )
}
