import { Chip, styled, useTheme } from '@mui/material'
import { ProposalStatus } from 'hooks/useProposalInfo'

export const StyledChip = styled(Chip)(
  ({ bgColor, textColor, theme }: { theme?: any; bgColor: string; textColor: string }) => ({
    fontWeight: 600,
    marginLeft: 10,
    backgroundColor: bgColor,
    color: textColor,
    height: 24,
    borderRadius: '18px',
    fontSize: 14,
    '& span': {
      padding: '3px 10px'
    },
    '&.MuiChip-outlined': {
      borderColor: theme.bgColor.bg7
    }
  })
)
export const StyledV3Chip = styled(Chip)(({ bgColor, textColor }: { bgColor: string; textColor: string }) => ({
  fontWeight: 600,
  backgroundColor: bgColor,
  color: textColor,
  minWidth: 70,
  height: 20,
  borderRadius: '18px',
  fontSize: 13,
  '& span': {
    padding: '3px 10px'
  },
  '&.MuiChip-outlined': {
    borderColor: '#21C331'
  }
}))
export default function ShowProposalStatusTag({ status }: { status: ProposalStatus | string }) {
  const theme = useTheme()
  return status === ProposalStatus.SOON || status === 'Soon' ? (
    <StyledChip label="Soon" variant="outlined" bgColor={theme.palette.common.white} textColor={theme.bgColor.bg7} />
  ) : status === ProposalStatus.OPEN || status === 'Active' ? (
    <StyledChip label="Open" bgColor={'#21C431'} textColor={theme.palette.common.white} />
  ) : status === ProposalStatus.CANCEL || status === 'Cancel' ? (
    <StyledChip label="Cancelled" bgColor={theme.bgColor.bg2} textColor={theme.textColor.text1} />
  ) : status === ProposalStatus.SUCCESS || status === 'Success' ? (
    <StyledChip label="Success" bgColor={theme.palette.primary.main} textColor={theme.palette.common.white} />
  ) : (
    <StyledChip label="Failed" bgColor={theme.bgColor.bg2} textColor={theme.textColor.text1} />
  )
}

export function ShowProposalStatusV3Tag({ status }: { status: ProposalStatus | string }) {
  const theme = useTheme()
  return status === ProposalStatus.SOON || status === 'Soon' ? (
    <StyledV3Chip label="Soon" variant="outlined" bgColor={theme.palette.common.white} textColor={'#21C331'} />
  ) : status === ProposalStatus.OPEN || status === 'Active' ? (
    <StyledV3Chip label="Active" bgColor={'#21C431'} textColor={theme.palette.common.white} />
  ) : status === ProposalStatus.CANCEL || status === 'Cancel' ? (
    <StyledV3Chip label="Cancelled" bgColor={theme.bgColor.bg2} textColor={theme.textColor.text1} />
  ) : status === ProposalStatus.SUCCESS || status === 'Success' ? (
    <StyledV3Chip label="Success" bgColor={theme.palette.primary.main} textColor={theme.palette.common.white} />
  ) : (
    <StyledV3Chip label="Closed" bgColor={'#D4D7E2'} textColor={'#80829F'} />
  )
}
