import { ButtonGroup, styled, Tooltip, Box, useTheme } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import { routes } from 'constants/routes'
import { DaoAdminLevelProp } from 'hooks/useDaoInfo'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { RowCenter } from '../Proposal/ProposalItem'
import { AirdropList, PublicSaleList } from './List'
import { useDaoActivityList } from 'hooks/useBackedActivityServer'
import { ErrorOutline } from '@mui/icons-material'
import useBreakpoint from 'hooks/useBreakpoint'
import { useBuildingDaoDataCallback, useMyDaoDataCallback } from 'state/buildingGovDao/hooks'

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
  [ActivityType.AIRDROP]: 'DAO Rewards'
}

export default function Activity() {
  const theme = useTheme()
  const { daoId: curDaoId } = useParams<{ daoId: string }>()
  const daoId = Number(curDaoId)
  const { myJoinDaoData: daoAdminLevel } = useMyDaoDataCallback()
  const history = useHistory()
  const [activityType] = useState<ActivityType>(ActivityType.AIRDROP)
  const { buildingDaoData: backedDaoInfo } = useBuildingDaoDataCallback()
  const airdropData = useDaoActivityList(daoId, ActivityType.AIRDROP)
  const isSmDown = useBreakpoint('sm')

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
          {/* <MuiButton
            className={activityType === ActivityType.AIRDROP ? 'active' : ''}
            onClick={() => setActivityType(ActivityType.AIRDROP)}
          >
            {activityTypeText[ActivityType.AIRDROP]}
          </MuiButton> */}
        </StyledButtonGroup>
        {(daoAdminLevel.job === DaoAdminLevelProp[0] ||
          daoAdminLevel.job === DaoAdminLevelProp[1] ||
          daoAdminLevel.job === DaoAdminLevelProp[2]) && (
          <>
            {backedDaoInfo?.approve ? (
              <BlackButton
                width={isSmDown ? '146px' : '252px'}
                fontSize={isSmDown ? 10 : 14}
                height={isSmDown ? '40px' : '36px'}
                borderRadius={isSmDown ? '8px' : undefined}
                onClick={() =>
                  history.push(
                    routes._DaoInfo +
                      `/${daoId}/DAO_Rewards/${
                        activityType === ActivityType.PUBLIC_SALE ? 'create_sale' : 'create_DAO_Rewards'
                      }`
                  )
                }
              >
                Create {activityTypeText[activityType]}
              </BlackButton>
            ) : (
              <Box
                width={isSmDown ? '146px' : '252px'}
                height={isSmDown ? '40px' : '36px'}
                display={'flex'}
                alignItems="center"
                justifyContent={'center'}
                sx={{
                  backgroundColor: theme.bgColor.bg2,
                  borderRadius: { xs: '8px', sm: '16px' },
                  color: theme.palette.text.secondary,
                  fontSize: { xs: 10, sm: 14 },
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
