import { Tooltip, styled, TooltipProps, tooltipClasses, Box, SxProps, Theme } from '@mui/material'
import { ReactComponent as TooltipIcon } from 'assets/svg/tooltip.svg'
import { useState, useEffect } from 'react'
import useBreakpoint from 'hooks/useBreakpoint'
import ClickAwayListener from '@mui/material/ClickAwayListener'

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
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
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiTooltip-tooltip': {
      marginBottom: '6px !important',
      marginLeft: '15px'
    }
  }
}))

export default function VariableWidth({
  value,
  isShowIcon,
  children,
  placement,
  sx
}: {
  value: string
  isShowIcon?: boolean
  children?: JSX.Element | number | string
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
  sx?: SxProps<Theme>
}) {
  const isSmDown = useBreakpoint('sm')

  const [tooltipOpen, setTooltipOpen] = useState(false)

  const handleTooltipClick = () => {
    setTooltipOpen(!tooltipOpen)
  }
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      setTooltipOpen(false)
      event.stopPropagation()
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      {isSmDown ? (
        <ClickAwayListener
          onClickAway={() => {
            setTooltipOpen(false)
          }}
        >
          <HtmlTooltip
            open={tooltipOpen}
            onClick={handleTooltipClick}
            placement={placement || 'top'}
            title={value}
            sx={{
              zIndex: 999999,
              '& .css-1fkcro2-MuiTooltip-tooltip': { marginBottom: placement ? '5px !important' : '' },
              '&:hover': { cursor: 'pointer' },
              ...sx
            }}
          >
            {isShowIcon ? (
              <>{children}</>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': { cursor: 'pointer' }
                }}
              >
                <TooltipIcon />
              </Box>
            )}
          </HtmlTooltip>
        </ClickAwayListener>
      ) : (
        <HtmlTooltip
          placement={placement || 'right'}
          title={value}
          sx={{
            zIndex: 999999,
            '& .css-1fkcro2-MuiTooltip-tooltip': { marginBottom: placement ? '5px !important' : '' },
            '&:hover': { cursor: 'pointer' },
            ...sx
          }}
        >
          {isShowIcon ? (
            <>{children}</>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                '&:hover': { cursor: 'pointer' }
              }}
            >
              <TooltipIcon />
            </Box>
          )}
        </HtmlTooltip>
      )}
    </>
  )
}
