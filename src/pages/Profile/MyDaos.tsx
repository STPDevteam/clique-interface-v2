import { Box, Stack, styled, Typography } from '@mui/material'
import { DaoAvatars } from 'components/Avatars'
import { routes } from 'constants/routes'
import { UserProfileDaoProp } from 'hooks/useBackedProfileServer'
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
  }
}))

export default function MyDaos({
  adminDao,
  memberDao
}: {
  adminDao: UserProfileDaoProp[] | undefined
  memberDao: UserProfileDaoProp[] | undefined
}) {
  if ((!adminDao || !adminDao.length) && (!memberDao || !memberDao.length)) {
    return null
  }
  return (
    <ContainerWrapper maxWidth={1150} margin={'0 auto'}>
      <Typography variant="h6" fontSize={16} fontWeight={600}>
        DAOs
      </Typography>
      <StyledBox mt={25}>
        {adminDao && !!adminDao.length && (
          <Box>
            <Typography mb={10} variant="h6" fontSize={14} fontWeight={500}>
              Admin
            </Typography>
            <Stack direction={'row'} spacing={33} mr={65}>
              {adminDao.map((item, index) => (
                <DaoBlock key={index} info={item} />
              ))}
            </Stack>
          </Box>
        )}

        {memberDao && !!memberDao.length && (
          <Box>
            <Typography mb={10} variant="h6" fontSize={14} fontWeight={500}>
              Member
            </Typography>
            <Stack direction={'row'} spacing={33}>
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
