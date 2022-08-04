import { useTheme } from '@mui/material'
import { ChainId } from 'constants/chain'
import { DaoAdminLevelProp, useDaoAdminLevel } from 'hooks/useDaoInfo'
import { StyledChip } from './CategoryChips'

export function ShowAdminTag({
  daoAddress,
  chainId,
  account
}: {
  daoAddress: string
  chainId: ChainId
  account: string
}) {
  const daoAdminLevel = useDaoAdminLevel(daoAddress, chainId, account)
  console.log('🚀 ~ file: ShowAdminTag.tsx ~ line 16 ~ daoAdminLevel', daoAdminLevel)
  return <AdminTag level={daoAdminLevel} />
}

export default function AdminTag({ level }: { level: DaoAdminLevelProp }) {
  const theme = useTheme()
  return level === DaoAdminLevelProp.SUPER_ADMIN ? (
    <StyledChip label="Super admin" />
  ) : level === DaoAdminLevelProp.ADMIN ? (
    <StyledChip label="Admin" bgColor={theme.bgColor.bg6} />
  ) : null
}
