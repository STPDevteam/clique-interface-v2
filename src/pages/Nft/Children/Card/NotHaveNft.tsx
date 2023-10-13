import { ReactComponent as NotHaveNftIcon } from 'assets/svg/nothavenft_icon.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import { SearchCardStyle } from 'pages/Nft/NftLayout'
import { Box } from '@mui/material'
export function NotHaveNft({ children }: { children: any }) {
  const isSmDown = useBreakpoint('sm')

  return (
    <SearchCardStyle
      style={{
        width: isSmDown ? '340px' : '443px',
        height: isSmDown ? '280px' : '280px'
      }}
    >
      <Box
        className="item"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 30
        }}
      >
        <NotHaveNftIcon />
        {children}
      </Box>
    </SearchCardStyle>
  )
}
