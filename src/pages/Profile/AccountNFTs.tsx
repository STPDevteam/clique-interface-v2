import {
  Box,
  Link,
  MenuItem,
  Stack,
  styled,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses
} from '@mui/material'
import EmptyData from 'components/EmptyData'
import Image from 'components/Image'
import Loading from 'components/Loading'
import Pagination from 'components/Pagination'
import { AllChainList, ChainId, ChainListMap } from 'constants/chain'
import { ScanNFTInfo, useAccountNFTsList, useRefreshNft } from 'hooks/useBackedProfileServer'
import useBreakpoint from 'hooks/useBreakpoint'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import { useCallback, useEffect, useMemo, useState } from 'react'
import placeholderImage from 'assets/images/placeholder.png'
import Select from 'components/Select/Select'
import LogoText from 'components/LogoText'
import { getEtherscanLink, shortenAddress } from 'utils'
import LoopIcon from '@mui/icons-material/Loop'
import { toast } from 'react-toastify'
import { MyCreateNftListProp, useMyCreateNftAccountList } from 'hooks/useBackedNftCallback'
import { ExternalLink } from 'theme/components'
import Copy from 'components/essential/Copy'

// import { useActiveWeb3React } from 'hooks'

// const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
//   borderRadius: '16px',
//   height: 24,
//   opacity: 0.6,
//   fontSize: 12,
//   '& button': {
//     height: 24,
//     color: '#9A9A9A',
//     minWidth: '82px!important',
//     fontWeight: 400,
//     borderColor: theme.palette.text.primary
//   },
//   '& .active': {
//     opacity: 1,
//     backgroundColor: '#fff',
//     fontWeight: 500,
//     color: theme.palette.text.primary
//   }
// }))

const TabStyle = styled(Tabs)(({ theme }) => ({
  '& .MuiButtonBase-root': {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '22px',
    color: '#3F5170',
    textTransform: 'none',
    padding: 0
  },
  '& .MuiTabs-indicator': {
    height: 4,
    background: '#0049C6',
    borderRadius: '2px',
    margin: 'auto'
  },
  '& .active': {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '22px',
    color: '#0049C6'
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiButtonBase-root': {
      fontSize: 16
    },
    '& .active': {
      fontSize: 16
    }
  }
}))

const StyledItems = styled(Box)(({ theme }) => ({
  height: 298,
  background: '#F9F9F9',
  border: '1px solid #E4E4E4',
  borderRadius: '10px',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    height: 200
  }
}))

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    minWidth: 110,
    padding: '0px 20px',
    height: '31px',
    backgroundColor: '#F8FBFF',
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    color: '#3F5170',
    border: 'none',
    borderLeft: '1px solid #D4D7E2',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  [`&.${tableCellClasses.head}.firstColumn`]: {
    borderLeft: 'none'
  },
  [`&.${tableCellClasses.body}`]: {
    padding: '0px 20px',
    height: '50px',
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    color: '#3F5170'
  }
}))

const StyledTableRow = styled(TableRow)(() => ({
  '& td': {
    borderTop: '1px solid #D4D7E2',
    borderLeft: '1px solid #D4D7E2'
  },
  '& td:first-of-type': {
    borderLeft: 'none'
  },
  '&:last-child td': {
    borderBottom: 'none'
  }
}))

const nftSupportedChain = AllChainList.filter(i =>
  [ChainId.MAINNET, ChainId.BSC, ChainId.POLYGON, ChainId.ZKSYNC_ERA].includes(i.id)
)

const tabList = [
  {
    label: 'NFTs'
  },
  { label: 'My Created NFT Accounts' }
]

export default function AccountNFTs({ account }: { account: string }) {
  const isSmDown = useBreakpoint('sm')
  const [viewAll, setViewAll] = useState(false)
  const [currentChainId, setCurrentChainId] = useState<ChainId>(1)
  const [ercType, setErcType] = useState<'erc721' | 'erc1155'>('erc721')
  const [tabValue, setTabValue] = useState<number>(0)
  const { result: myCreateNftList, loading: loading_c } = useMyCreateNftAccountList(account)
  const { result: accountNFTsList, loading, page } = useAccountNFTsList(account, currentChainId, ercType)
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
        <TabStyle value={tabValue}>
          {tabList.map((item, idx) => (
            <Tab
              key={item.label + idx}
              label={item.label}
              onClick={() => {
                setTabValue(idx)
              }}
              sx={{ gap: 10, marginRight: 50 }}
              className={tabValue === idx ? 'active' : ''}
            ></Tab>
          ))}
        </TabStyle>

        {tabValue === 0 && (
          <Stack spacing={10} direction={'row'}>
            <Select
              noBold
              defaultValue={ChainListMap[currentChainId]?.symbol}
              value={currentChainId}
              height={36}
              onChange={e => setCurrentChainId(e.target.value)}
            >
              {nftSupportedChain.map(option => (
                <MenuItem value={option.id} key={option.id} selected={currentChainId === option.id}>
                  <LogoText logo={option.logo} text={option.symbol} />
                </MenuItem>
              ))}
            </Select>
            <Select noBold value={ercType} height={36} onChange={e => setErcType(e.target.value)}>
              <MenuItem value={'erc721'} key={'erc721'} selected={ercType === 'erc721'}>
                Erc721
              </MenuItem>
              <MenuItem value={'erc1155'} key={'erc1155'} selected={ercType === 'erc1155'}>
                Erc1155
              </MenuItem>
            </Select>
          </Stack>
        )}
      </Box>

      {tabValue === 0 && (
        <Box mt={20}>
          {!accountNFTsList.length && !loading && <EmptyData />}
          {loading && (
            <Box sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loading />
            </Box>
          )}
        </Box>
      )}
      {tabValue === 1 && (
        <Box mt={20}>
          {!myCreateNftList.length && <EmptyData />}
          {loading_c && (
            <Box sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loading />
            </Box>
          )}
        </Box>
      )}

      {tabValue === 0 && (
        <>
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
              <NFTItem key={index} nft={item} idx={index} nftChainId={currentChainId}></NFTItem>
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

          {viewAll && page.totalPage > 1 && (
            <Box display={'flex'} mt={20} justifyContent="center">
              <Pagination
                count={page.totalPage}
                page={page.currentPage}
                onChange={(_, value) => page.setCurrentPage(value)}
              />
            </Box>
          )}
        </>
      )}
      {tabValue === 1 && myCreateNftList.length ? <CreateNft6551 myCreateNftList={myCreateNftList} /> : null}
    </ContainerWrapper>
  )
}

function CreateNft6551({ myCreateNftList }: { myCreateNftList: MyCreateNftListProp[] }) {
  // const { chainId } = useActiveWeb3React()
  const isSmDown = useBreakpoint('sm')
  console.log(isSmDown)

  return (
    <>
      <TableContainer sx={{ border: '1px solid #D4D7E2', borderRadius: '8px', minWidth: 942 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell className="firstColumn">ERC-6551 Account </StyledTableCell>
              <StyledTableCell>Token ID</StyledTableCell>
              <StyledTableCell>Token Contract</StyledTableCell>
              <StyledTableCell>Create Time</StyledTableCell>
              <StyledTableCell>Hash</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myCreateNftList.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>
                  <Box display={'flex'} alignItems={'center'}>
                    {row.account ? shortenAddress(row.account, 4) : '--'}
                    <Copy margin="0 0 0 10px" toCopy={row.account} />
                  </Box>
                </StyledTableCell>

                <StyledTableCell>
                  <Typography
                    sx={{
                      maxWidth: 50,
                      width: '100%'
                    }}
                    noWrap
                  >
                    {row.tokenId}
                  </Typography>
                </StyledTableCell>

                <StyledTableCell>
                  <Box display={'flex'} alignItems={'center'}>
                    <ExternalLink href={getEtherscanLink(row.chainId ? row.chainId : 1, row.tokenContract, 'address')}>
                      {row.tokenContract ? shortenAddress(row.tokenContract, 4) : '--'}
                    </ExternalLink>
                    <Copy margin="0 0 0 10px" toCopy={row.tokenContract} />
                  </Box>
                </StyledTableCell>
                <StyledTableCell>{row.createTime || '--'}</StyledTableCell>
                <StyledTableCell>
                  <Typography
                    sx={{
                      maxWidth: 200,
                      width: '100%'
                    }}
                    noWrap
                  >
                    <ExternalLink
                      href={getEtherscanLink(row.chainId ? row.chainId : 1, row.transactionHash, 'transaction')}
                    >
                      {row.transactionHash || '--'}
                    </ExternalLink>
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

function NFTItem({ nft, idx, nftChainId }: { nft: ScanNFTInfo; idx: number; nftChainId: ChainId }) {
  const isSmDown = useBreakpoint('sm')
  const [hoverIndex, setHoverIndex] = useState<any>(null)
  const refreshCb = useRefreshNft()

  const refresh = useCallback(() => {
    refreshCb(nft.contract_address, nft.token_id).then((res: any) => {
      if (res.data.code !== 200) {
        toast.error(res.data.msg || 'Refresh error')
        return
      }
      toast.success('Refresh success')
    })
  }, [nft.contract_address, nft.token_id, refreshCb])

  return (
    <StyledItems
      onMouseEnter={() => {
        setHoverIndex(idx)
      }}
      onMouseLeave={() => {
        setHoverIndex(null)
      }}
    >
      {hoverIndex === idx && (
        <Box
          sx={{
            position: 'absolute',
            right: 10,
            top: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            width: 23,
            height: 23,
            borderRadius: '50%'
          }}
        >
          <LoopIcon
            sx={{
              cursor: 'pointer',
              display: 'inline-block',
              marginLeft: 3,
              marginTop: 3,
              width: '16px',
              height: '16px',
              // mixBlendMode: 'difference',
              '& path': {
                fill: '#fff'
              }
            }}
            onClick={refresh}
          ></LoopIcon>
        </Box>
      )}
      <Image
        altSrc={placeholderImage}
        style={{
          width: '100%',
          height: isSmDown ? 124 : 248,
          borderRadius: '10px 10px 0 0',
          objectFit: 'cover'
        }}
        src={nft.image_uri || placeholderImage}
      />
      <RowCenter padding="5px 16px">
        <Typography noWrap maxWidth={160}>
          {nft.name || nft.contract_name || '-'}#{nft.token_id}
        </Typography>
        {/* {nftChainId === ChainId.MAINNET && ( */}
        <Link
          target={'_blank'}
          underline="none"
          href={
            nftChainId === ChainId.MAINNET
              ? `https://opensea.io/assets/ethereum/${nft.contract_address}/${nft.token_id}`
              : getEtherscanLink(nftChainId, nft.contract_address, 'token') + `?a=${nft.token_id}`
          }
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.1875 3.66727L6.85862 8.97003C6.62922 9.19828 6.25824 9.19737 6.02997 8.96798C5.80172 8.7386 5.80263 8.36761 6.03202 8.13935L11.3851 2.8125H9.16992C8.84632 2.8125 8.58398 2.55016 8.58398 2.22656C8.58398 1.90296 8.84632 1.64062 9.16992 1.64062H11.7188C12.6248 1.64062 13.3594 2.37516 13.3594 3.28125V5.83008C13.3594 6.15368 13.097 6.41602 12.7734 6.41602C12.4498 6.41602 12.1875 6.15368 12.1875 5.83008V3.66727ZM12.1875 8.6464C12.1875 8.32279 12.4498 8.06046 12.7734 8.06046C13.097 8.06046 13.3594 8.32279 13.3594 8.6464V11.7188C13.3594 12.6248 12.6248 13.3594 11.7188 13.3594H3.28125C2.37516 13.3594 1.64062 12.6248 1.64062 11.7188V3.28125C1.64062 2.37516 2.37516 1.64062 3.28125 1.64062H6.35361C6.6772 1.64062 6.93955 1.90296 6.93955 2.22656C6.93955 2.55016 6.6772 2.8125 6.35361 2.8125H3.28125C3.02237 2.8125 2.8125 3.02237 2.8125 3.28125V11.7188C2.8125 11.9776 3.02237 12.1875 3.28125 12.1875H11.7188C11.9776 12.1875 12.1875 11.9776 12.1875 11.7188V8.64639V8.6464Z"
              fill="#9A9A9A"
            />
          </svg>
        </Link>
        {/* )} */}
      </RowCenter>
    </StyledItems>
  )
}
