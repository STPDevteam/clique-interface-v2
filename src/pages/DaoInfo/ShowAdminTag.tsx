import { Stack } from '@mui/material'
import { ChainId } from 'constants/chain'
import useBreakpoint from 'hooks/useBreakpoint'
import { useDaoAdminLevel, useDaoAdminLevelList } from 'hooks/useDaoInfo'
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

export default function ShowAdminTag({ level }: { level?: string }) {
  // const theme = useTheme()
  return level === 'owner' ? (
    <StyledChip label="Creator" />
  ) : level === 'superAdmin' ? (
    <StyledChip label="Owner" />
  ) : level === 'admin' ? (
    <StyledChip label="Admin" bgColor="#97B7EF" />
  ) : null
}
