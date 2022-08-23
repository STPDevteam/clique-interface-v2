import { Box, Stack, styled, Typography, useTheme } from '@mui/material'
import { SimpleProgress } from 'components/Progress'
import { RowCenter } from '../ProposalItem'
import { VoteWrapper } from './Vote'

const StyledItem = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.bgColor.bg2}`,
  borderRadius: '12px',
  padding: '12px 32px 15px'
}))

export default function VoteProgress() {
  const theme = useTheme()
  return (
    <VoteWrapper>
      <RowCenter>
        <Typography variant="h6" fontWeight={500}>
          Current Results
        </Typography>
        <Typography variant="body1" sx={{ cursor: 'pointer' }} color={theme.palette.primary.main}>
          View all votes (281)
        </Typography>
      </RowCenter>
      <Stack mt={16} spacing={10}>
        {[1, 2, 3].map(item => (
          <StyledItem key={item}>
            <Typography>First option</Typography>
            <Box display={'grid'} gridTemplateColumns="1fr 150px" columnGap="24px">
              <SimpleProgress width="100%" per={80} />
              <Typography color={theme.palette.text.secondary} fontSize={14} fontWeight={600}>
                80% - 3,033 Votes
              </Typography>
            </Box>
          </StyledItem>
        ))}
      </Stack>
    </VoteWrapper>
  )
}
