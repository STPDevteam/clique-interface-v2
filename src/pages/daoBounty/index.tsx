import DaoContainer from 'components/DaoContainer'
import DaoInfoActivity from 'pages/DaoInfo/Children/Activity'
import { ReactComponent as BountyIcon } from 'assets/svg/bounty.svg'
import { Box, Stack, Typography, useTheme } from '@mui/material'

export default function DaoBounty() {
  const theme = useTheme()

  return (
    <DaoContainer>
      <Box>
        <Stack
          sx={{
            'svg path': {
              fill: 'rgba(0, 73, 198, 1)'
            }
          }}
          direction={'row'}
          alignItems={'center'}
          mb={20}
        >
          <BountyIcon width={38} height={38} />
          <Typography
            sx={{
              ml: 10,
              fontWeight: 600,
              fontSize: 30,
              [theme.breakpoints.down('sm')]: {
                fontSize: 26
              }
            }}
          >
            Clique Rewards & SBT
          </Typography>
        </Stack>
        <DaoInfoActivity />
      </Box>
    </DaoContainer>
  )
}
