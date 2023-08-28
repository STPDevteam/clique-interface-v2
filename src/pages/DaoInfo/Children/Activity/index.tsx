import { Tooltip, Box, useTheme, Tab } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import { routes } from 'constants/routes'
import { DaoAdminLevelProp } from 'hooks/useDaoInfo'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RowCenter } from '../Proposal/ProposalItem'
import { AirdropList, PublicSaleList } from './List'
import { useDaoActivityList } from 'hooks/useBackedActivityServer'
import { ErrorOutline } from '@mui/icons-material'
import useBreakpoint from 'hooks/useBreakpoint'
import { useBuildingDaoDataCallback, useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
import { useDaoSbtList } from 'hooks/useBackedSbtServer'
import DaoSbtList from './DaoSbtList'
import { TooltipStyle } from 'pages/DaoInfo/LeftSider'
import { TabStyle } from 'pages/Activity'

// const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
//   display: 'grid',
//   gridTemplateColumns: '1fr 1fr',
//   '& button': {
//     borderWidth: '2px',
//     color: theme.palette.text.primary,
//     fontWeight: 600,
//     height: 48,
//     width: 185,
//     '&:hover': {
//       borderWidth: '2px'
//     },
//     '&.active': {
//       backgroundColor: theme.palette.primary.main,
//       color: theme.palette.common.white
//     }
//   }
// }))

export enum ActivityType {
  PUBLIC_SALE = 'Public Sale',
  AIRDROP = 'Airdrop'
}

export const activityTypeText = {
  [ActivityType.PUBLIC_SALE]: 'Public Sale',
  [ActivityType.AIRDROP]: 'Clique Rewards'
}

const tabList = [
  { value: 'Clique Rewards', label: 'Clique Rewards' },
  { value: 'Soulbound Token', label: 'Soulbound Token' }
]

export default function Activity() {
  const theme = useTheme()
  const { daoId: curDaoId } = useParams<{ daoId: string }>()
  const daoId = Number(curDaoId)
  const { myJoinDaoData: daoAdminLevel } = useUpdateDaoDataCallback()
  const navigate = useNavigate()
  const [activityType] = useState<ActivityType>(ActivityType.AIRDROP)
  const { buildingDaoData: backedDaoInfo } = useBuildingDaoDataCallback()
  const airdropData = useDaoActivityList(daoId, ActivityType.AIRDROP)
  const { search, loading, result, page } = useDaoSbtList(daoId)
  const isSmDown = useBreakpoint('sm')
  const [tabValue, setTabValue] = useState(search.category || 0)
  const handleChange = (event: any, newValue: any) => {
    search.setCategory(newValue)
  }

  return (
    <div>
      <RowCenter mb={25}>
        <TabStyle value={tabValue} onChange={handleChange} style={{ maxWidth: 440 }}>
          {tabList.map((item, idx) => (
            <Tab
              key={item.label + idx}
              label={item.label}
              onClick={() => {
                setTabValue(idx)
              }}
              sx={{ gap: 10, marginRight: 50 }}
              className={tabValue === idx ? 'active' : ''}
            ></Tab>
          ))}
        </TabStyle>
        {tabValue === 0 && (daoAdminLevel.job === DaoAdminLevelProp[0] || daoAdminLevel.job === DaoAdminLevelProp[1]) && (
          <>
            {backedDaoInfo?.approve ? (
              <BlackButton
                width={isSmDown ? '146px' : '252px'}
                fontSize={isSmDown ? 10 : 14}
                height={isSmDown ? '40px' : '36px'}
                borderRadius={isSmDown ? '8px' : undefined}
                onClick={() =>
                  navigate(
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
        {tabValue === 0 && daoAdminLevel.job !== DaoAdminLevelProp[0] && daoAdminLevel.job !== DaoAdminLevelProp[1] && (
          <TooltipStyle title={'Only DAO creator and DAO owner can create Clique Rewards.'} placement="top">
            {backedDaoInfo?.approve ? (
              <Box>
                <BlackButton
                  disabled
                  width={isSmDown ? '146px' : '252px'}
                  fontSize={isSmDown ? 10 : 14}
                  height={isSmDown ? '40px' : '36px'}
                  borderRadius={isSmDown ? '8px' : undefined}
                >
                  Create {activityTypeText[activityType]}
                </BlackButton>
              </Box>
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
                {/* <Tooltip title="Can be created after verification">
                  <ErrorOutline sx={{ marginLeft: 4 }} />
                </Tooltip> */}
              </Box>
            )}
          </TooltipStyle>
        )}
        {tabValue === 1 && (daoAdminLevel.job === DaoAdminLevelProp[0] || daoAdminLevel.job === DaoAdminLevelProp[1]) && (
          <BlackButton
            width={isSmDown ? '146px' : '252px'}
            fontSize={isSmDown ? 10 : 14}
            height={isSmDown ? '40px' : '36px'}
            borderRadius={isSmDown ? '8px' : undefined}
            onClick={() => navigate(routes.CreateSoulToken + `/${daoId}`)}
          >
            Create SBT
          </BlackButton>
        )}
        {tabValue === 1 && daoAdminLevel.job !== DaoAdminLevelProp[0] && daoAdminLevel.job !== DaoAdminLevelProp[1] && (
          <TooltipStyle title={'Only DAO creator and DAO owner can create SBT.'} placement="top">
            <Box>
              <BlackButton
                disabled
                width={isSmDown ? '146px' : '252px'}
                fontSize={isSmDown ? 10 : 14}
                height={isSmDown ? '40px' : '36px'}
                borderRadius={isSmDown ? '8px' : undefined}
                onClick={() => navigate(routes.CreateSoulToken + `/${daoId}`)}
              >
                Create SBT
              </BlackButton>
            </Box>
          </TooltipStyle>
        )}
      </RowCenter>
      {tabValue === 0 && activityType === ActivityType.AIRDROP && <AirdropList {...airdropData} />}
      {tabValue === 0 && activityType === ActivityType.PUBLIC_SALE && <PublicSaleList />}
      {tabValue === 1 && <DaoSbtList loading={loading} page={page} result={result} />}
    </div>
  )
}
