import { MenuItem, Box } from '@mui/material'
import LogoText from 'components/LogoText'
import { useActiveWeb3React } from 'hooks'
import { ChainId, ChainList, SUPPORTED_NETWORKS } from 'constants/chain'
import useBreakpoint from 'hooks/useBreakpoint'
import Image from 'components/Image'
import PopperCard from 'components/PopperCard'
import { useMemo } from 'react'

export default function NetworkSelect() {
  const { chainId, account, library } = useActiveWeb3React()
  const isDownSm = useBreakpoint('sm')
  const curChainLogo = useMemo(() => {
    const res = ChainList.filter(item => item.id === chainId)
    return res[0]?.logo
  }, [chainId])
  if (!chainId || !account) return null

  return (
    <Box>
      <PopperCard
        sx={{
          marginTop: 13,
          maxHeight: '50vh',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
        placement="bottom-start"
        targetElement={
          <Box
            display={'flex'}
            sx={{
              width: 36,
              height: 36,
              padding: '0 4px',
              border: '1px solid #D4D7E2',
              borderRadius: '8px',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#97B7EF'
              }
            }}
            alignItems={'center'}
          >
            <Image src={curChainLogo} style={{ height: 24, width: 24 }} />
          </Box>
        }
      >
        <>
          {ChainList.map(option => (
            <MenuItem
              sx={{
                '&:hover': {
                  backgroundColor: '#0049C60D',
                  color: '#0049C6'
                },
                '&.Mui-selected': {
                  backgroundColor: '#0049C60D',
                  color: '#0049C6'
                },
                '& img': {
                  width: '24px !important'
                },
                '& span, & p': {
                  fontWeight: 500
                }
              }}
              onClick={() => {
                if ([1, 3, 4, 5, 42, 11155111].includes(option.id)) {
                  library?.provider?.request?.({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: SUPPORTED_NETWORKS[option.id as ChainId]?.chainId }, account]
                  })
                } else {
                  const params = SUPPORTED_NETWORKS[option.id as ChainId]
                  library?.provider?.request?.({ method: 'wallet_addEthereumChain', params: [params, account] })
                }
              }}
              value={option.id}
              key={option.id}
              selected={chainId === option.id}
            >
              {isDownSm ? (
                <Image src={option.logo} style={{ height: 24, width: 24, margin: '5px 0 0' }} />
              ) : (
                <LogoText logo={option.logo} text={option.symbol} gapSize={'small'} fontSize={14} />
              )}
            </MenuItem>
          ))}
        </>
      </PopperCard>
    </Box>
  )
}
