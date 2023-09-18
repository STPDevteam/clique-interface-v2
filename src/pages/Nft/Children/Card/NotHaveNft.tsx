import { useSbtListPaginationCallback } from 'state/pagination/hooks'
import { ReactComponent as NotHaveNftIcon } from 'assets/svg/nothavenft_icon.svg'
import { useNavigate } from 'react-router-dom'
import useBreakpoint from 'hooks/useBreakpoint'
import { SearchCardStyle } from 'pages/Nft/NftLayout'
import { Box, Link } from '@mui/material'
import { ContentTextStyle } from 'pages/Nft/NftSelect'
import { routes } from 'constants/routes'

export function NotHaveNft() {
  const isSmDown = useBreakpoint('sm')
  const navigate = useNavigate()
  const { setCategory } = useSbtListPaginationCallback()
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
        <ContentTextStyle
          sx={{
            maxWidth: 340,
            textAlign: 'center',
            fontSize: isSmDown ? 13 : 14
          }}
        >
          {"Whoops, you don't have any available NFTs."}
          <br />
          {" It's okay, go into "}
          <Link
            style={{
              cursor: 'pointer',
              color: '#F9F9F9',
              textDecoration: 'underline'
            }}
            onClick={() => {
              setCategory(1)
              navigate(routes.Activity)
            }}
          >
            Clique Discovery
          </Link>
          {' to claim a NFT !'}
        </ContentTextStyle>
      </Box>
    </SearchCardStyle>
  )
}
