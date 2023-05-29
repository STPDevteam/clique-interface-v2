import { Tooltip, styled, TooltipProps, tooltipClasses } from '@mui/material'

import { ReactComponent as TooltipIcon } from 'assets/svg/tooltip.svg'

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#F8FBFF',
    color: '#97B7EF',
    width: 299,
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '16px',
    borderRadius: '6px',
    border: ' 1px solid #97B7EF',
    padding: '8px 12px',
    boxSizing: 'border-box'
  }
}))

export default function VariableWidth({ value }: { value: string }) {
  return (
    <>
      <HtmlTooltip
        placement="top-start"
        title={value}
        sx={{ '& .css-1fkcro2-MuiTooltip-tooltip': { margin: '0 0 5px 0 !important' } }}
      >
        <TooltipIcon />
      </HtmlTooltip>
    </>
  )
}
