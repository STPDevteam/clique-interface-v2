import { Box, Stack, styled, Typography, useTheme } from '@mui/material'
import { DaoAvatars } from 'components/Avatars'
import { routes } from 'constants/routes'
import { UserProfileDaoProp } from 'hooks/useBackedProfileServer'
import useBreakpoint from 'hooks/useBreakpoint'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import ShowAdminTag from 'pages/DaoInfo/ShowAdminTag'
import { useHistory } from 'react-router'

const StyledBox = styled(Box)(({ theme }) => ({
  padding: '28px 40px',
  display: 'flex',
  alignItems: 'center',
  overflowX: 'auto',
  border: `1px solid ${theme.bgColor.bg2}`,
  boxShadow: theme.boxShadow.bs1,
  borderRadius: theme.borderRadius.default,
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  [theme.breakpoints.down('sm')]: {
    display: 'grid',
    gridGap: '15px',
    padding: '20px',
    gridTemplateColumns: '1fr 2fr',
    alignItems: 'flex-start'
  }
}))

export default function MyDaos({
  adminDao,
  memberDao
}: {
  adminDao: UserProfileDaoProp[] | undefined
  memberDao: UserProfileDaoProp[] | undefined
}) {
  const theme = useTheme()
  const isSmDown = useBreakpoint()
  if ((!adminDao || !adminDao.length) && (!memberDao || !memberDao.length)) {
    return null
  }
  return (
    <ContainerWrapper
      maxWidth={isSmDown ? '100%' : 1150}
      style={{ width: isSmDown ? '100%' : '100vw' }}
      margin={'0 auto'}
    >
      <Typography variant="h6" fontSize={16} fontWeight={600}>
        DAOs
      </Typography>
      <StyledBox mt={25}>
        {adminDao && !!adminDao.length && (
          <Box>
            <Typography textAlign={isSmDown ? 'center' : undefined} mb={10} variant="h6" fontSize={14} fontWeight={500}>
              Admin
            </Typography>
            <Stack
              direction={'row'}
              mr={isSmDown ? 0 : 65}
              spacing={isSmDown ? 0 : 33}
              sx={{
                display: { xs: 'grid', sm: 'flex' },
                justifyItems: 'center'
              }}
            >
              {adminDao.map((item, index) => (
                <DaoBlock key={index} info={item} />
              ))}
            </Stack>
          </Box>
        )}

        {memberDao && !!memberDao.length && (
          <Box
            sx={{
              borderLeft: { xs: `1px solid ${theme.bgColor.bg2}`, sm: 'none' }
            }}
          >
            <Typography textAlign={isSmDown ? 'center' : undefined} mb={10} variant="h6" fontSize={14} fontWeight={500}>
              Member
            </Typography>
            <Stack
              direction={'row'}
              spacing={isSmDown ? 0 : 33}
              sx={{
                display: { xs: 'grid', sm: 'flex' },
                gridTemplateColumns: '1fr 1fr',
                justifyItems: { xs: 'center', sm: undefined }
              }}
            >
              {memberDao.map((item, index) => (
                <DaoBlock key={index} info={item} />
              ))}
            </Stack>
          </Box>
        )}
      </StyledBox>
    </ContainerWrapper>
  )
}

function DaoBlock({ info }: { info: UserProfileDaoProp }) {
  const history = useHistory()
  return (
    <Box>
      <Box
        sx={{ position: 'relative', cursor: 'pointer' }}
        onClick={() => history.push(routes._DaoInfo + `/${info.chainId}/${info.daoAddress}`)}
      >
        <DaoAvatars size={64} src={info.daoLogo} />
        <Box
          sx={{
            position: 'absolute',
            width: 92,
            bottom: -8,
            left: -14,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <ShowAdminTag level={info.accountLevel} />
        </Box>
      </Box>
      <Typography maxWidth={64} noWrap fontSize={12} mt={12} textAlign="center">
        {info.daoName}
      </Typography>
    </Box>
  )
}
