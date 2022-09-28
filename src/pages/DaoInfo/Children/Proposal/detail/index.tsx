import { Box, Typography, useTheme } from '@mui/material'
import { ProposalDetailProp, ProposalStatus } from 'hooks/useProposalInfo'
import ShowProposalStatusTag from '../ShowProposalStatusTag'
import ReactHtmlParser from 'react-html-parser'
import 'react-quill/dist/quill.snow.css'
import { timeStampToFormat } from 'utils/dao'
import { escapeAttrValue, filterXSS } from 'xss'

export default function Index({ proposalInfo }: { proposalInfo: ProposalDetailProp }) {
  const theme = useTheme()
  return (
    <Box>
      <Typography variant="h5">{proposalInfo.title}</Typography>
      <Box display={'flex'} mt={15}>
        {proposalInfo.cancel ? (
          <>
            <Typography variant="body1" fontSize={14} fontWeight={600} color={theme.palette.text.secondary}>
              User closed
            </Typography>
          </>
        ) : proposalInfo.status === ProposalStatus.SOON ? (
          <>
            <Typography fontSize={14} fontWeight={600} color={theme.textColor.text1} mr={6}>
              Start at
            </Typography>
            <Typography variant="body1" fontSize={14} fontWeight={600} color={theme.palette.text.secondary}>
              {timeStampToFormat(proposalInfo.startTime)}
            </Typography>
          </>
        ) : (
          <>
            <Typography fontSize={14} fontWeight={600} color={theme.textColor.text1} mr={6}>
              Close at
            </Typography>
            <Typography variant="body1" fontSize={14} fontWeight={600} color={theme.palette.text.secondary}>
              {timeStampToFormat(proposalInfo.endTime)}
            </Typography>
          </>
        )}

        <ShowProposalStatusTag status={proposalInfo.status} />
      </Box>
      <Box mt={15} sx={{ '& img': { maxWidth: '50%' } }}>
        <Typography mb={10} color={theme.palette.text.secondary} fontSize={14}>
          {proposalInfo.introduction}
        </Typography>
        <div className="ql-editor">
          {ReactHtmlParser(
            filterXSS(proposalInfo.content || '', {
              onIgnoreTagAttr: function(_, name, value) {
                if (name === 'class') {
                  return name + '="' + escapeAttrValue(value) + '"'
                }
                return undefined
              }
            })
          )}
        </div>
      </Box>
    </Box>
  )
}
