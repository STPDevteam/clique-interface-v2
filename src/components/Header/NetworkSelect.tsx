import { MenuItem, Box } from '@mui/material'
import LogoText from 'components/LogoText'
import { useActiveWeb3React } from 'hooks'
import { ChainList, ChainListMap } from 'constants/chain'
import useBreakpoint from 'hooks/useBreakpoint'
import Image from 'components/Image'
import PopperCard from 'components/PopperCard'

import { triggerSwitchChain } from 'utils/triggerSwitchChain'

export default function NetworkSelect({ IsNftPage }: { IsNftPage: boolean }) {
  const { chainId, account, library } = useActiveWeb3React()
  const isDownSm = useBreakpoint('sm')

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
              border: `1px solid ${IsNftPage ? '#fff' : '#D4D7E2'}`,
              borderRadius: '8px',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
              '&:hover': {
                borderColor: IsNftPage ? '#D4D7E2' : '#97B7EF'
              },
              '& .exchange': {
                position: 'absolute',
                bottom: 0,
                right: 0
              }
            }}
            alignItems={'center'}
          >
            <svg
              className="exchange"
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="6.5" cy="6.5" r="6" fill="#0049C6" stroke="white" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.3204 3.90846C5.48358 3.70064 5.48358 3.36369 5.3204 3.15587C5.15723 2.94804 4.89265 2.94804 4.72948 3.15587L3.12239 5.20265C3.0029 5.35485 2.96715 5.58374 3.03181 5.7826C3.0965 5.98145 3.24885 6.11111 3.41785 6.11111H9.58191C9.81268 6.11111 9.99975 5.87285 9.99975 5.57895C9.99975 5.28504 9.81268 5.04678 9.58191 5.04678H4.42662L5.3204 3.90846ZM7.67963 9.09154C7.51645 9.29936 7.51645 9.63631 7.67963 9.84413C7.8428 10.052 8.10737 10.052 8.27055 9.84413L9.87764 7.79735C9.99713 7.64515 10.0329 7.41626 9.96821 7.2174C9.90353 7.01855 9.75117 6.88889 9.58218 6.88889H3.41812C3.18735 6.88889 3.00027 7.12715 3.00027 7.42105C3.00027 7.71496 3.18735 7.95322 3.41812 7.95322H8.57341L7.67963 9.09154Z"
                fill="white"
              />
            </svg>

            <Image src={ChainListMap[chainId || 1].logo} style={{ height: 24, width: 24 }} />
          </Box>
        }
      >
        <>
          {ChainList.map(option => (
            <MenuItem
              sx={{
                padding: '10px',
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
                triggerSwitchChain(library, option.id, account)
              }}
              value={option.id}
              key={option.id}
              selected={chainId === option.id}
            >
              {isDownSm ? (
                <Image src={option.logo} style={{ height: 24, width: 24, margin: '5px 0 0' }} />
              ) : (
                <LogoText logo={option.logo} text={option.symbol} gapSize={'small'} fontSize={14} size="24px" />
              )}
            </MenuItem>
          ))}
        </>
      </PopperCard>
    </Box>
  )
}
