import { Box, Typography, styled } from '@mui/material'
import { ShowProposalStatusV3Tag } from '../ShowProposalStatusTag'
import 'react-quill/dist/quill.snow.css'
import { useProposalDetailInfoProps, CreateType } from 'hooks/useBackedProposalServer'
import { currentTimeStamp, getTargetTimeString } from 'utils'
import { ReactComponent as adminIcon } from 'assets/svg/admin_icon.svg'
import { ReactComponent as ShareIcon } from 'assets/svg/share_icon.svg'
import Image from 'components/Image'
import avatar from 'assets/images/avatar.png'
import { RowCenter } from '../ProposalItem'
import useCopyClipboard from 'hooks/useCopyClipboard'

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
    targetTimeString = 'User Cancelled'
  } else {
    targetTimeString = 'Closed ' + getTargetTimeString(now, endTime)
  }
  return targetTimeString
}

export default function Index({ proposalInfo }: { proposalInfo: useProposalDetailInfoProps }) {
  const currentUrl = window.location.href
  const [isCopied, setCopied] = useCopyClipboard()
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
          SIP {proposalInfo.proposalSIP}
        </Typography>
        <Box
          sx={{
            width: 0,
            height: 14,
            border: ' 1px solid #D4D7E2'
          }}
        ></Box>
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '16px',
            color: '#97B7EF'
          }}
        >
          {proposalInfo.isChain ? CreateType.ONCHAIN : CreateType.GASLESS}
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
      <Typography
        sx={{ width: '100%', wordWrap: 'break-word' }}
        fontSize={30}
        fontWeight={600}
        lineHeight={'32px'}
        mt={16}
      >
        {proposalInfo.title}
      </Typography>
      <RowCenter>
        <Box display={'flex'} mt={15} gap={10}>
          <Box
            sx={{ width: 'fit-content', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 6 }}
          >
            <Image
              height={20}
              width={20}
              src={proposalInfo.proposer?.avatar || avatar}
              style={{ borderRadius: '50%' }}
            />
            <Typography variant="body1" noWrap sx={{ lineHeight: '20px', maxWidth: 80 }}>
              {proposalInfo.proposer?.nickname || 'unnamed'}
            </Typography>
            <AdminIcon />
          </Box>
          <ShowProposalStatusV3Tag status={proposalInfo.status} />
        </Box>
        <Box
          onClick={() => {
            setCopied(currentUrl)
          }}
          sx={{ display: 'flex', gap: 7, alignItems: 'center', cursor: 'pointer' }}
        >
          <ShareIcon />
          <Typography variant="body1">{isCopied ? 'Link Copied' : 'Share'}</Typography>
        </Box>
      </RowCenter>
    </Box>
  )
}
