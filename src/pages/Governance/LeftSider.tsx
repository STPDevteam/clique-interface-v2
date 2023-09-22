import { Box, styled, Typography, useTheme, SpeedDial, SpeedDialIcon } from '@mui/material'
import { ReactComponent as AddIcon } from 'assets/svg/add_icon.svg'
import { ReactComponent as SearchIcon } from 'assets/svg/search_icon.svg'
import { routes } from 'constants/routes'
// import useModal from 'hooks/useModal'
import { useNavigate } from 'react-router-dom'
// import { CreateGovernanceModal } from 'components/Governance/CreateGovernanceModal'
import { useMyJoinedDao } from 'hooks/useBackedDaoServer'
import { DaoAvatars } from 'components/Avatars'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import useBreakpoint from 'hooks/useBreakpoint'
import { useState } from 'react'

const Wrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  borderRight: `1px solid ${theme.bgColor.bg2}`,
  height: `calc(100vh - ${theme.height.header})`,
  // overflowY: 'auto',
  padding: '16px 8px',
  zIndex: 999,
  // '&::-webkit-scrollbar': {
  //   display: 'none'
  // },
  [theme.breakpoints.up('sm')]: {
    '& .dao-box': {
      overflowY: 'auto',
      height: `calc(100vh - ${theme.height.header} - 260px)`,
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    }
  },
  [theme.breakpoints.down('sm')]: {
    zIndex: 999,
    // display: 'grid',
    // gridTemplateColumns: '1fr 138px',
    // borderRight: 0,
    '& .dao-box': {
      overflowY: 'auto',
      // overflowX: 'auto',
      maxHeight: '150px',
      display: 'block',
      width: `64px`,
      height: 'auto',
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    }
  }
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
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: 6
  }
}))

export default function LeftSider() {
  const theme = useTheme()
  // const { showModal } = useModal()
  const navigate = useNavigate()
  const { result: myJoinedDaoList } = useMyJoinedDao()
  const { account } = useActiveWeb3React()
  const userSignature = useUserInfo()
  const toggleWalletModal = useWalletModalToggle()
  const loginSignature = useLoginSignature()
  const isSmDown = useBreakpoint('sm')
  const [open, setOpen] = useState(true)
  return (
    <>
      {userSignature && isSmDown && (
        <SpeedDial
          ariaLabel="SpeedDial controlled open example"
          sx={{
            position: 'absolute',
            bottom: 4,
            right: 10,
            '& .css-z6e3j5-MuiButtonBase-root-MuiFab-root-MuiSpeedDial-fab': {
              height: 46,
              width: 46
            }
          }}
          icon={<SpeedDialIcon />}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
        />
      )}

      <Wrapper
        sx={{
          [theme.breakpoints.down('sm')]: {
            position: 'fixed',
            right: 4,
            bottom: 55,
            backgroundColor: 'rgba(244,244,244,0.85)',
            borderRadius: '16px',
            height: !open ? 0 : 'unset',
            overflow: !open ? 'hidden' : 'unset',
            display: userSignature ? 'block' : 'none',
            padding: !open ? 0 : '10px 0 6px',
            transition: 'all 0.3s '
          }
        }}
      >
        <Box
          className="dao-box"
          sx={{
            display: { sm: 'block', xs: 'inline-flex' }
          }}
        >
          {myJoinedDaoList.map(({ daoLogo, daoId, daoName }) => (
            <DaoItem key={daoName + daoId} daoId={daoId} daoName={daoName} daoLogo={daoLogo} />
          ))}
        </Box>
        <Box
        // sx={{
        //   display: { sm: 'block', xs: 'inline-flex' },
        //   justifyContent: { xs: 'flex-end', sm: undefined }
        // }}
        >
          {((!!myJoinedDaoList.length && isSmDown) || !isSmDown) && (
            <Box
              sx={{
                background: theme.bgColor.bg2,
                marginTop: 10,
                marginBottom: 16,
                height: '1px',
                [theme.breakpoints.down('sm')]: {
                  marginTop: 6,
                  marginBottom: 6
                }
              }}
            />
          )}
          <Item
            // sx={{ borderTop: { sm: 'none', xs: `1px solid ${theme.bgColor.bg2}` } }}
            onClick={() => navigate(routes.Governance)}
          >
            <div className="action">
              <SearchIcon></SearchIcon>
            </div>
            <Text mt={'0 !important'} noWrap>
              Search
            </Text>
          </Item>
          <Item
            onClick={() => {
              if (!account) return toggleWalletModal()
              if (!userSignature) return loginSignature()
              navigate(routes.CreateDao)
            }}
          >
            <div className="action">
              <AddIcon width={16}></AddIcon>
            </div>
            <Text mt={'0 !important'} noWrap>
              Add DAO
            </Text>
          </Item>
        </Box>
      </Wrapper>
    </>
  )
}

function DaoItem({ daoId, daoLogo, daoName }: { daoId: number; daoLogo: string; daoName: string }) {
  const navigate = useNavigate()

  return (
    <Item onClick={() => navigate(`${routes._DaoInfo}/${daoId}/proposal`)}>
      <DaoAvatars src={daoLogo} alt={'daoName'} />
      <Text noWrap>{daoName || 'daoName'}</Text>
    </Item>
  )
}
