import { useTheme } from '@mui/material'
import { ChainId } from 'constants/chain'
import { DaoAdminLevelProp, useDaoAdminLevel } from 'hooks/useDaoInfo'
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

export default function ShowAdminTag({ level }: { level?: DaoAdminLevelProp }) {
  const theme = useTheme()
  return level === DaoAdminLevelProp.SUPER_ADMIN ? (
    <StyledChip label="Super admin" />
  ) : level === DaoAdminLevelProp.ADMIN ? (
    <StyledChip label="Admin" bgColor={theme.bgColor.bg6} />
  ) : null
}
