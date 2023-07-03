import { Box, Typography, styled } from '@mui/material'
import ShowProposalStatusTag from '../ShowProposalStatusTag'
// import ReactHtmlParser from 'react-html-parser'
import 'react-quill/dist/quill.snow.css'
// import { escapeAttrValue, filterXSS } from 'xss'
import { useProposalDetailInfoProps } from 'hooks/useBackedProposalServer'
import { currentTimeStamp, getTargetTimeString } from 'utils'
import { ReactComponent as adminIcon } from 'assets/svg/admin_icon.svg'
import Image from 'components/Image'
import avatar from 'assets/images/avatar.png'

const AdminIcon = styled(adminIcon)(() => ({
  'path:first-of-type': {
    fill: '#97B7EF'
  }
}))
function createTimeStampStr(startTime: number, endTime: number, status: string) {
  const now = currentTimeStamp()
  let targetTimeString = ''
  if (status === 'Soon') {
    targetTimeString = getTargetTimeString(now, startTime)
  } else if (status === 'Active') {
    targetTimeString = getTargetTimeString(now, endTime)
  } else if (status === 'Cancel') {
    targetTimeString = 'User Cancel'
  } else {
    targetTimeString = 'Closed ' + getTargetTimeString(now, endTime)
  }
  return targetTimeString
}

export default function Index({ proposalInfo }: { proposalInfo: useProposalDetailInfoProps }) {
  // const theme = useTheme()
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Typography
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '16px',
            color: '#97B7EF'
          }}
        >
          {proposalInfo.proposalSIP}
        </Typography>
        <Box
          sx={{
            width: 0,
            height: 14,
            border: ' 1px solid #D4D7E2'
          }}
        ></Box>
        <Typography variant="body1" sx={{ lineHeight: '18px', color: '#97B7EF' }}>
          {createTimeStampStr(proposalInfo.startTime, proposalInfo.endTime, proposalInfo.status)}
        </Typography>
      </Box>
      <Typography fontSize={30} fontWeight={600} lineHeight={'20px'} mt={16}>
        {proposalInfo.title}
      </Typography>
      <Box display={'flex'} mt={15}>
        <Box sx={{ width: 115, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Image height={20} width={20} src={proposalInfo.proposer?.avatar || avatar} />
          <Typography variant="body1" sx={{ lineHeight: '20px' }}>
            {proposalInfo.proposer?.nickname || 'unnamed'}
          </Typography>
          <AdminIcon />
        </Box>
        <ShowProposalStatusTag status={proposalInfo.status} />
      </Box>
      {/* <Box
        mt={15}
        sx={{
          '& img': { maxWidth: '50%' },
          '& .ql-editor': {
            paddingLeft: 0,
            paddingRight: 0
          }
        }}
      >
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
      </Box> */}
    </Box>
  )
}
