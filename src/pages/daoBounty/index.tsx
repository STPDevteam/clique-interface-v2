import DaoContainer from 'components/DaoContainer'
import DaoInfoActivity from 'pages/DaoInfo/Children/Activity'
import { ReactComponent as BountyIcon } from 'assets/svg/bounty.svg'
import { Box, Stack, Typography } from '@mui/material'

export default function DaoBounty() {
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
          mb={10}
        >
          <BountyIcon width={38} height={38} />
          <Typography ml={10} fontWeight={600} fontSize={30}>
            DAO Rewards
          </Typography>
        </Stack>
        <DaoInfoActivity />
      </Box>
    </DaoContainer>
  )
}
