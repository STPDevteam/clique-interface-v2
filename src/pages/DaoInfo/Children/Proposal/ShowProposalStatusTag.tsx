import { Chip, styled, useTheme } from '@mui/material'
import { ProposalStatus } from 'hooks/useProposalInfo'

export const StyledChip = styled(Chip)(
  ({ bgColor, textColor, theme }: { theme?: any; bgColor: string; textColor: string }) => ({
    fontWeight: 600,
    marginLeft: 16,
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

export default function ShowProposalStatusTag({ status }: { status: ProposalStatus }) {
  const theme = useTheme()
  return status === ProposalStatus.SOON ? (
    <StyledChip label="Soon" variant="outlined" bgColor={theme.palette.common.white} textColor={theme.bgColor.bg7} />
  ) : status === ProposalStatus.OPEN ? (
    <StyledChip label="Active" bgColor={theme.bgColor.bg7} textColor={theme.palette.common.white} />
  ) : status === ProposalStatus.CANCEL ? (
    <StyledChip label="Cancel" bgColor={theme.bgColor.bg2} textColor={theme.textColor.text1} />
  ) : status === ProposalStatus.SUCCESS ? (
    <StyledChip label="Success" bgColor={theme.palette.primary.main} textColor={theme.palette.common.white} />
  ) : (
    <StyledChip label="Closed" bgColor={theme.bgColor.bg2} textColor={theme.textColor.text1} />
  )
}
