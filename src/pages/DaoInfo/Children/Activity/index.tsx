import { ButtonGroup, styled, Button as MuiButton, Tooltip, Box, useTheme } from '@mui/material'
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
import { useBackedDaoInfo } from 'hooks/useBackedDaoServer'
import { ErrorOutline } from '@mui/icons-material'

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

export const activityTypeText = {
  [ActivityType.PUBLIC_SALE]: 'Public Sale',
  [ActivityType.AIRDROP]: 'DAO Reward'
}

export default function Activity() {
  const theme = useTheme()
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const { account } = useActiveWeb3React()
  const daoAdminLevel = useDaoAdminLevel(daoAddress, curDaoChainId, account || undefined)

  const history = useHistory()
  const [activityType, setActivityType] = useState<ActivityType>(ActivityType.AIRDROP)
  const { result: backedDaoInfo } = useBackedDaoInfo(daoAddress, curDaoChainId)

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
            {activityTypeText[ActivityType.AIRDROP]}
          </MuiButton>
        </StyledButtonGroup>
        {(daoAdminLevel === DaoAdminLevelProp.SUPER_ADMIN || daoAdminLevel === DaoAdminLevelProp.ADMIN) && (
          <>
            {backedDaoInfo?.verified ? (
              <BlackButton
                width="252px"
                height="48px"
                onClick={() =>
                  history.push(
                    routes._DaoInfo +
                      `/${curDaoChainId}/${daoAddress}/active_info/${
                        activityType === ActivityType.PUBLIC_SALE ? 'create_sale' : 'create_dao_drop'
                      }`
                  )
                }
              >
                Create {activityTypeText[activityType]}
              </BlackButton>
            ) : (
              <Box
                width="252px"
                height="48px"
                display={'flex'}
                alignItems="center"
                justifyContent={'center'}
                sx={{
                  backgroundColor: theme.bgColor.bg2,
                  borderRadius: '16px',
                  color: theme.palette.text.secondary,
                  fontSize: 14,
                  fontWeight: 700
                }}
              >
                Create {activityTypeText[activityType]}
                <Tooltip title="Can be created after verification">
                  <ErrorOutline sx={{ marginLeft: 4 }} />
                </Tooltip>
              </Box>
            )}
          </>
        )}
      </RowCenter>
      {activityType === ActivityType.AIRDROP && <AirdropList {...airdropData} />}
      {activityType === ActivityType.PUBLIC_SALE && <PublicSaleList />}
    </div>
  )
}
