import { ButtonGroup, styled, Button as MuiButton } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import { ChainId } from 'constants/chain'
import { routes } from 'constants/routes'
import { useActiveWeb3React } from 'hooks'
import { DaoAdminLevelProp, useDaoAdminLevel } from 'hooks/useDaoInfo'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { RowCenter } from '../Proposal/ProposalItem'
import { AirdropList, PublicSaleList } from './List'
import { useDaoActivityList } from 'hooks/useBackedActivityServer'

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  '& button': {
    borderWidth: '2px',
    color: theme.palette.text.primary,
    fontWeight: 600,
    height: 48,
    width: 185,
    '&:hover': {
      borderWidth: '2px'
    },
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    }
  }
}))

export enum ActivityType {
  PUBLIC_SALE = 'Public Sale',
  AIRDROP = 'Airdrop'
}

export default function Activity() {
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const { account } = useActiveWeb3React()
  const daoAdminLevel = useDaoAdminLevel(daoAddress, curDaoChainId, account || undefined)

  const history = useHistory()
  const [activityType, setActivityType] = useState<ActivityType>(ActivityType.AIRDROP)

  const airdropData = useDaoActivityList(curDaoChainId, daoAddress, ActivityType.AIRDROP)

  return (
    <div>
      <RowCenter mb={25}>
        <StyledButtonGroup variant="outlined">
          {/* <MuiButton
            className={activityType === ActivityType.PUBLIC_SALE ? 'active' : ''}
            onClick={() => setActivityType(ActivityType.PUBLIC_SALE)}
          >
            {ActivityType.PUBLIC_SALE}
          </MuiButton> */}
          <MuiButton
            className={activityType === ActivityType.AIRDROP ? 'active' : ''}
            onClick={() => setActivityType(ActivityType.AIRDROP)}
          >
            {ActivityType.AIRDROP}
          </MuiButton>
        </StyledButtonGroup>
        {(daoAdminLevel === DaoAdminLevelProp.SUPER_ADMIN || daoAdminLevel === DaoAdminLevelProp.ADMIN) && (
          <BlackButton
            width="252px"
            height="48px"
            onClick={() =>
              history.push(
                routes._DaoInfo +
                  `/${curDaoChainId}/${daoAddress}/active_info/${
                    activityType === ActivityType.PUBLIC_SALE ? 'create_sale' : 'create_airdrop'
                  }`
              )
            }
          >
            Create {activityType}
          </BlackButton>
        )}
      </RowCenter>
      {activityType === ActivityType.AIRDROP && <AirdropList {...airdropData} />}
      {activityType === ActivityType.PUBLIC_SALE && <PublicSaleList />}
    </div>
  )
}
