import { Box, styled, Typography, useTheme } from '@mui/material'
import { ReactComponent as AddIcon } from 'assets/svg/add_icon.svg'
import { ReactComponent as SearchIcon } from 'assets/svg/search_icon.svg'
import { routes } from 'constants/routes'
import useModal from 'hooks/useModal'
import { useHistory } from 'react-router-dom'
import { CreateGovernanceModal } from 'components/Governance/CreateGovernanceModal'
import { useDaoBaseInfo } from 'hooks/useDaoInfo'
import { useMyJoinedDao } from 'hooks/useBackedDaoServer'
import { ChainId } from 'constants/chain'
import { DaoAvatars } from 'components/Avatars'

const Wrapper = styled('div')(({ theme }) => ({
  overflowY: 'auto',
  borderRight: `1px solid ${theme.bgColor.bg2}`,
  height: `calc(100vh - ${theme.height.header})`,
  padding: '16px 8px',
  '&::-webkit-scrollbar': {
    display: 'none'
  }
  // [theme.breakpoints.down('md')]: {
  //   height: `calc(100vh - ${theme.height.header})`
  // }
}))

const Text = styled(Typography)(({ theme }) => ({
  width: 64,
  fontSize: 12,
  fontWeight: 500,
  marginTop: 6,
  lineHeight: '20px',
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

const Item = styled(Box)(({ theme }) => ({
  display: 'grid',
  justifyItems: 'center',
  cursor: 'pointer',
  marginBottom: 16,
  '& .action': {
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    transition: 'all 0.5s',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& svg path': {
        fill: '#fff'
      }
    }
  }
}))

export default function LeftSider() {
  const theme = useTheme()
  const { showModal } = useModal()
  const history = useHistory()
  const { result: myJoinedDaoList } = useMyJoinedDao()

  return (
    <Wrapper>
      {myJoinedDaoList.map(({ daoAddress, chainId, daoName }) => (
        <DaoItem key={daoAddress + chainId} chainId={chainId} daoName={daoName} daoAddress={daoAddress} />
      ))}
      {!!myJoinedDaoList.length && <Box sx={{ background: theme.bgColor.bg2, marginBottom: 16, height: '1px' }} />}
      <Item onClick={() => history.push(routes.Governance)}>
        <div className="action">
          <SearchIcon></SearchIcon>
        </div>
        <Text mt={'0 !important'} noWrap>
          Search
        </Text>
      </Item>
      <Item onClick={() => showModal(<CreateGovernanceModal />)}>
        <div className="action">
          <AddIcon width={16}></AddIcon>
        </div>
        <Text mt={'0 !important'} noWrap>
          Add DAO
        </Text>
      </Item>
    </Wrapper>
  )
}

function DaoItem({ chainId, daoAddress, daoName }: { chainId: ChainId; daoAddress: string; daoName: string }) {
  const history = useHistory()
  const daoBaseInfo = useDaoBaseInfo(daoAddress, chainId)

  return (
    <Item onClick={() => history.push(`${routes._DaoInfo}/${chainId}/${daoAddress}`)}>
      <DaoAvatars src={daoBaseInfo?.daoLogo} alt={daoBaseInfo?.name || daoName} />
      <Text noWrap>{daoBaseInfo?.name || daoName}</Text>
    </Item>
  )
}
