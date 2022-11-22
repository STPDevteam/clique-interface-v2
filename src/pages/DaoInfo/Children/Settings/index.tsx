import { Box, MenuItem, MenuList, styled, useTheme } from '@mui/material'
import { ChainId } from 'constants/chain'
import { routes } from 'constants/routes'
import { useActiveWeb3React } from 'hooks'
import { DaoAdminLevelProp, useDaoAdminLevel, useDaoInfo } from 'hooks/useDaoInfo'
import { useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Admin from './Admin'
import GovernanceSetting from './GovernanceSetting'
import General from './General'

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  margin: '16px 0',
  padding: '0 14px',
  fontSize: 14,
  fontWeight: 600,
  color: theme.palette.text.secondary,
  lineHeight: '26px',
  position: 'relative',
  '&.active': {
    color: theme.palette.text.primary,
    '&:before': {
      content: `''`,
      position: 'absolute',
      bottom: 0,
      top: 0,
      left: 0,
      width: 4,
      backgroundColor: theme.palette.text.primary,
      borderRadius: '0 2px 2px 0'
    }
  },
  [theme.breakpoints.down('sm')]: {
    margin: '0'
  }
}))

export default function Settings() {
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState(0)
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const daoInfo = useDaoInfo(daoAddress, curDaoChainId)

  const { account } = useActiveWeb3React()
  const history = useHistory()
  const accountLevel = useDaoAdminLevel(daoAddress, curDaoChainId, account || undefined)

  useEffect(() => {
    if (!account || (accountLevel !== undefined && accountLevel === DaoAdminLevelProp.NORMAL)) {
      history.replace(routes._DaoInfo + `/${daoChainId}/${daoAddress}`)
    }
    if (accountLevel !== undefined && accountLevel !== DaoAdminLevelProp.SUPER_ADMIN) {
      setActiveTab(0)
    }
  }, [account, accountLevel, daoAddress, daoChainId, history])

  const tabs = useMemo(() => {
    const _tabs = [
      {
        name: 'General',
        component: daoInfo ? <General daoInfo={daoInfo} daoChainId={curDaoChainId} /> : null
      },
      {
        name: 'Governance Setting',
        component: <GovernanceSetting daoInfo={daoInfo} daoChainId={curDaoChainId} />
      }
    ]
    if (accountLevel === DaoAdminLevelProp.SUPER_ADMIN) {
      _tabs.push({
        name: 'Admin',
        component: <Admin />
      })
    }
    return _tabs
  }, [accountLevel, daoInfo, curDaoChainId])

  return (
    <Box
      display={'grid'}
      sx={{
        gridTemplateColumns: { sm: '162px 1fr', xs: 'unset' }
      }}
      gap={25}
    >
      <div>
        <MenuList
          sx={{
            borderRadius: theme.borderRadius.default,
            boxShadow: theme.boxShadow.bs1,
            border: `1px solid ${theme.bgColor.bg2}`
          }}
        >
          {tabs.map(({ name }, index) => (
            <StyledMenuItem
              key={name}
              onClick={() => setActiveTab(index)}
              className={`${index === activeTab ? 'active' : ''}`}
            >
              {name}
            </StyledMenuItem>
          ))}
        </MenuList>
      </div>

      {tabs[activeTab]?.component}
    </Box>
  )
}
