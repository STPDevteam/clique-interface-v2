import { Box, Chip, styled, useTheme } from '@mui/material'
import { useMemo } from 'react'

export const StyledChip = styled(Chip, {
  shouldForwardProp: () => true
})<{ bgColor?: string }>(({ theme, bgColor }) => ({
  fontFamily: 'Inter',
  lineHeight: '20px',
  fontWeight: 500,
  backgroundColor: bgColor || '#0049C6',
  color: theme.palette.common.white,
  height: 20,
  width: 98,
  fontSize: 13,
  '& span': {
    padding: '1px 9px'
  },
  [theme.breakpoints.down('sm')]: {
    '& span': {
      padding: '1px 6px'
    }
  }
}))

export default function CategoryChips({ categoryStr }: { categoryStr: string | undefined }) {
  const theme = useTheme()

  const categoryList = useMemo(() => {
    if (!categoryStr) return []
    return categoryStr.split(',')
  }, [categoryStr])

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 90px)',
        gap: '5px'
      }}
    >
      {categoryList.map((name, index) => (
        <StyledChip
          key={name}
          label={name}
          bgColor={index % 2 === 0 ? theme.palette.primary.dark : theme.palette.primary.light}
        />
      ))}
    </Box>
  )
}
