import { Stack, useTheme } from '@mui/material'
import { ChainId } from 'constants/chain'
import useBreakpoint from 'hooks/useBreakpoint'
import { DaoAdminLevelProp, useDaoAdminLevel, useDaoAdminLevelList } from 'hooks/useDaoInfo'
import { StyledChip } from './CategoryChips'

export function AdminTagBlock({
  daoAddress,
  chainId,
  account
}: {
  daoAddress: string
  chainId: ChainId
  account: string
}) {
  const daoAdminLevel = useDaoAdminLevel(daoAddress, chainId, account)
  return <ShowAdminTag level={daoAdminLevel} />
}

export function AdminTagListBlock({
  daoAddress,
  chainId,
  account
}: {
  daoAddress: string
  chainId: ChainId
  account: string
}) {
  const isSmDown = useBreakpoint('sm')
  const daoAdminLevelList = useDaoAdminLevelList(daoAddress, chainId, account)
  return (
    <Stack direction={isSmDown ? 'column' : 'row'} spacing={5}>
      {daoAdminLevelList?.map(daoAdminLevel => (
        <ShowAdminTag key={daoAdminLevel} level={daoAdminLevel} />
      ))}
    </Stack>
  )
}

export default function ShowAdminTag({ level }: { level?: DaoAdminLevelProp }) {
  const theme = useTheme()
  return level === DaoAdminLevelProp.SUPER_ADMIN ? (
    <StyledChip label="Super Admin" />
  ) : level === DaoAdminLevelProp.ADMIN ? (
    <StyledChip label="Admin" bgColor={theme.bgColor.bg6} />
  ) : null
}
