import { DaoAdminLevelProp } from 'hooks/useDaoInfo'
import { StyledChip } from './CategoryChips'

export default function ShowAdminTag({ level }: { level: DaoAdminLevelProp }) {
  return level === DaoAdminLevelProp.SUPER_ADMIN ? (
    <StyledChip label="Super admin" />
  ) : level === DaoAdminLevelProp.ADMIN ? (
    <StyledChip label="Admin" />
  ) : null
}
