import { Box, styled, Typography, useTheme } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { AdminTagBlock } from 'pages/DaoInfo/ShowAdminTag'

const StyledCard = styled(Box)(({ theme }) => ({
  padding: '24px',
  cursor: 'pointer',
  border: `1px solid ${theme.bgColor.bg2}`,
  borderRadius: theme.borderRadius.default,
  boxShadow: theme.boxShadow.bs2,
  transition: 'all 0.5s',
  '&:hover': {
    border: `2px solid ${theme.palette.primary.main}`,
    padding: '22px'
  },
  '& .content': {
    fontSize: 14,
    height: 48,
    marginTop: 16,
    overflow: 'hidden',
    color: theme.palette.text.secondary,
    textOverflow: 'ellipsis',
    width: '100%',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': '2',
    wordBreak: 'break-all'
  }
}))

export const RowCenter = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
})

export default function ProposalItem() {
  const theme = useTheme()
  return (
    <StyledCard>
      <Box display={'grid'} gridTemplateColumns="1fr 20px" gap={'10px'} alignItems="center">
        <Typography variant="h5" noWrap>
          The DAO organization has moved into the he DAO organization has moved into the
        </Typography>
        <KeyboardArrowRightIcon />
      </Box>
      <Typography className="content" variant="body1">
        Build decentralized automated organization, Build decentralized automated organization...Build decentralized
        automated organization, Build decentralized automated organization...
      </Typography>
      <RowCenter mt={16}>
        <RowCenter>
          <Typography fontSize={16} fontWeight={600} mr={8}>
            0x22...3452
          </Typography>
          <AdminTagBlock daoAddress="" chainId={4} account="" />
        </RowCenter>
        <RowCenter>
          <Typography color={theme.textColor.text1} fontSize={14}>
            4 days left
          </Typography>
        </RowCenter>
      </RowCenter>
    </StyledCard>
  )
}
