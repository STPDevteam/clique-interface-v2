import { Box } from '@mui/material'
import { ReactComponent as HourglassIcon } from 'assets/svg/hourglass_icon.svg'
import { SearchCardStyle } from 'pages/Nft/NftLayout'
import { ContentTextStyle } from 'pages/Nft/NftSelect'

export function Searching() {
  return (
    <SearchCardStyle
      style={{
        height: 280,
        width: '278.816px'
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
        <HourglassIcon />
        <ContentTextStyle>Searching for available NFTs</ContentTextStyle>
      </Box>
    </SearchCardStyle>
  )
}
