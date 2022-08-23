import { Box, Typography, useTheme } from '@mui/material'
import { ProposalDetailProp } from 'hooks/useProposalInfo'
import ShowProposalStatusTag from '../ShowProposalStatusTag'
import ReactHtmlParser from 'react-html-parser'
import xss from 'xss'

export default function Index({ proposalInfo }: { proposalInfo: ProposalDetailProp }) {
  const theme = useTheme()
  return (
    <Box>
      <Typography variant="h5">{proposalInfo.title}</Typography>
      <Box display={'flex'} mt={15}>
        <Typography fontSize={14} fontWeight={600} color={theme.textColor.text1} mr={6}>
          Close at
        </Typography>
        <Typography variant="body1" fontSize={14} fontWeight={600} color={theme.palette.text.secondary}>
          2021-11-29 11:10:58
        </Typography>
        <ShowProposalStatusTag status={1} />
      </Box>
      <Box mt={15}>{ReactHtmlParser(xss(proposalInfo.content || ''))}</Box>
    </Box>
  )
}
