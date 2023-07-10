import { Tooltip, styled, TooltipProps, tooltipClasses, Box } from '@mui/material'

import { ReactComponent as TooltipIcon } from 'assets/svg/tooltip.svg'

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#F8FBFF',
    color: '#97B7EF',
    width: 300,
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '16px',
    borderRadius: '6px',
    border: ' 1px solid #97B7EF',
    padding: '8px  8px 8px 12px'
  }
}))

export default function VariableWidth({
  value,
  placement
}: {
  value: string
  placement?:
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'right-end'
    | 'right-start'
    | 'top-end'
    | 'top-start'
    | undefined
}) {
  return (
    <>
      <HtmlTooltip
        placement={placement || 'right'}
        title={value}
        sx={{
          zIndex: 999999,
          '& .css-1fkcro2-MuiTooltip-tooltip': { marginBottom: placement ? '5px !important' : '' },
          '&:hover': { cursor: 'pointer' }
        }}
      >
        <Box
          sx={{
            '&:hover': { cursor: 'pointer' }
          }}
        >
          <TooltipIcon />
        </Box>
      </HtmlTooltip>
    </>
  )
}
