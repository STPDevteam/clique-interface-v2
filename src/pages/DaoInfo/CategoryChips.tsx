import { Chip, Stack, styled, useTheme } from '@mui/material'
import { useMemo } from 'react'

export const StyledChip = styled(Chip)(({ theme, bgColor }: { theme?: any; bgColor?: string }) => ({
  fontWeight: 600,
  backgroundColor: bgColor || theme.palette.primary.dark,
  color: theme.palette.common.white,
  height: 24,
  fontSize: 12,
  '& span': {
    padding: '3px 10px'
  }
}))

export default function CategoryChips({ categoryStr }: { categoryStr: string | undefined }) {
  const theme = useTheme()

  const categoryList = useMemo(() => {
    if (!categoryStr) return []
    return categoryStr.split(',')
  }, [categoryStr])

  return (
    <Stack direction="row" spacing={8} flexWrap="wrap">
      {categoryList.map((name, index) => (
        <StyledChip
          key={name}
          label={name}
          bgColor={index % 2 === 0 ? theme.palette.primary.dark : theme.palette.primary.light}
        />
      ))}
    </Stack>
  )
}
