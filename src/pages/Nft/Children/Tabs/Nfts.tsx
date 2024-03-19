import { Box, styled, Typography, Link } from '@mui/material'
import { ChainId, ChainListMap } from 'constants/chain'
import { useCallback, useMemo } from 'react'
import LoopIcon from '@mui/icons-material/Loop'
import placeholderImage from 'assets/images/placeholder.png'
import Image from 'components/Image'
import { ScanNFTInfo, useAccountNFTsList, useRefreshNft } from 'hooks/useBackedProfileServer'
import { toast } from 'react-toastify'
import { ReactComponent as ShareIcon } from 'assets/svg/share.svg'
import { useSBTIsDeployList } from 'hooks/useContractIsDeploy'
import { getEtherscanLink } from 'utils'
import Loading from 'components/Loading'
import EmptyData from 'components/EmptyData'
// import { useActiveWeb3React } from 'hooks'

export function Nfts({ chainId, nftAddress }: { chainId: number; nftAddress: string | undefined }) {
  // const { account } = useActiveWeb3React()

  const { result: _accountNFTsList, loading } = useAccountNFTsList(nftAddress || undefined, chainId, 'erc721')

  const SBTIsDeployList = useSBTIsDeployList(
    _accountNFTsList.map(item => item.contract_address),
    _accountNFTsList.map(i => i.token_id)
  )

  const accountNFTsList = useMemo(() => {
    if (!_accountNFTsList.length) return []
    if (!SBTIsDeployList) return

    return _accountNFTsList.filter((_, idx) => SBTIsDeployList[idx] === true)
  }, [SBTIsDeployList, _accountNFTsList])

  return (
    <>
      <Box
        sx={{
          mt: 15,
          display: 'flex',
          gap: 13,
          flexWrap: 'wrap'
        }}
      >
        {!loading && accountNFTsList !== undefined && !accountNFTsList?.length && (
          <Box sx={{ width: '100%' }}>
            <EmptyData sx={{ width: '100%' }} />
          </Box>
        )}
        {accountNFTsList !== undefined && !loading ? (
          <>
            {accountNFTsList?.map((item, index) => (
              <>
                <Card nftInfo={item} chainId={chainId} key={item.name + index} />
              </>
            ))}
          </>
        ) : (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: 30 }}>
            <Loading />
          </Box>
        )}
      </Box>
    </>
  )
}

const CardStyled = styled(Box)(({}) => ({
  height: 190,
  width: 164,
  borderRadius: '8px',
  border: '1px solid var(--line, #D4D7E2)',
  background: 'rgb(236 236 236)',
  // background: '#0F1F39',
  position: 'relative'
}))

function Card({ nftInfo, chainId }: { nftInfo: ScanNFTInfo; chainId: number }) {
  const refreshCb = useRefreshNft()

  const refresh = useCallback(() => {
    refreshCb(nftInfo.contract_address, nftInfo.token_id).then((res: any) => {
      if (res.data.code !== 200) {
        toast.error(res.data.msg || 'Refresh error')
        return
      }
      toast.success('Refresh success')
    })
  }, [nftInfo.contract_address, nftInfo.token_id, refreshCb])
  return (
    <Box
      sx={{
        cursor: 'pointer',
        '&:hover': {
          '.deployButton, .class_loopIcon, .chainIcon': {
            display: 'block !important'
          },
          '.shareButton': {
            display: 'flex !important'
          },
          '.card': {
            border: '1px solid var(--button-line, #97B7EF)'
          }
        }
      }}
    >
      <CardStyled className="card">
        <img
          className="chainIcon"
          src={ChainListMap[Number(chainId)].logo || ''}
          alt=""
          height={'24px'}
          width={'24px'}
          style={{ borderRadius: '50%', position: 'absolute', top: 10, left: 10, display: 'none', zIndex: 10 }}
        />
        <LoopIcon
          className="class_loopIcon"
          sx={{
            cursor: 'pointer',
            display: 'none ',
            right: 5,
            top: 5,
            backgroundColor: 'rgba(0, 0, 0, 0.10)',
            borderRadius: '50%',
            padding: 1,
            zIndex: 10,
            width: '24px',
            height: '24px',
            position: 'absolute',
            '& path': {
              fill: '#fff'
            },
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.50)'
            }
          }}
          onClick={() => {
            refresh()
          }}
        />
        <Image
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            objectFit: 'cover',
            position: 'absolute',
            zIndex: 0
          }}
          src={nftInfo?.image_uri || placeholderImage}
          altSrc={placeholderImage}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 27,
            width: '100%',
            background: '#F8FBFF',
            borderRadius: '0 0 8px 8px',
            padding: '0 10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography
            noWrap
            sx={{
              color: ' var(--button-line, #97B7EF)',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px'
            }}
          >
            {nftInfo?.name || nftInfo?.contract_name || '-'}#{nftInfo?.token_id}
          </Typography>
          <Box className="shareButton" sx={{ display: 'none' }}>
            <Link
              sx={{ height: '16px', width: '16px' }}
              target={'_blank'}
              underline="none"
              href={
                chainId === ChainId.MAINNET
                  ? `https://opensea.io/assets/ethereum/${nftInfo.contract_address}/${nftInfo.token_id}`
                  : getEtherscanLink(chainId, nftInfo.contract_address, 'token') + `?a=${nftInfo.token_id}`
              }
            >
              <ShareIcon />
            </Link>
          </Box>
        </Box>
      </CardStyled>
    </Box>
  )
}
