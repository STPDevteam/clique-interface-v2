import { Box, styled, Typography } from '@mui/material'
import { useMyJoinedDao } from 'hooks/useBackedDaoServer'
import Image from 'components/Image'
import { routes } from 'constants/routes'
import { useHistory } from 'react-router-dom'
import PopperCard from 'components/PopperCard'
import { ReactComponent as ArrowIcon } from 'assets/svg/arrow_down.svg'

const Text = styled(Typography)(({ theme }) => ({
  width: 64,
  fontSize: 12,
  fontWeight: 500,
  marginTop: 6,
  lineHeight: '20px',
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

const Item = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyItems: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  width: 250,
  padding: '9px 20px',
  gap: 10,
  '&:hover': {
    backgroundColor: '#0049C60D'
  },
  '&:hover p': {
    color: '#0049C6'
  },
  '& img': {
    width: 24,
    height: 24,
    border: '1px solid #D4D7E2',
    borderRadius: '50%'
  },
  '& p': {
    flex: 1,
    marginTop: 0,
    textAlign: 'left',
    fontSize: 14
  }
}))

export default function MySpace() {
  const { result: myJoinedDaoList } = useMyJoinedDao()
  console.log('🚀 ~ file: MySpace.tsx:50 ~ MySpace ~ myJoinedDaoList:', myJoinedDaoList)
  const history = useHistory()

  return (
    <Box>
      <PopperCard
        sx={{
          marginTop: 13,
          maxHeight: '50vh',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
        placement="bottom-start"
        targetElement={
          <Box
            flexDirection={'row'}
            display={'flex'}
            gap={12}
            sx={{
              height: 36,
              padding: '0 14px',
              border: '1px solid #D4D7E2',
              borderRadius: '8px',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#97B7EF'
              },
              '& svg': {
                marginLeft: 'auto'
              }
            }}
            alignItems={'center'}
          >
            <Typography fontWeight={500} fontSize={14} textAlign={'left'} sx={{ color: '#3F5170' }}>
              My Space
            </Typography>
            <ArrowIcon />
          </Box>
        }
      >
        <>
          {myJoinedDaoList.map(option => (
            <Box
              key={option.daoName + option.daoId}
              onClick={() => history.push(`${routes._DaoInfo}/${option.daoId}/proposal`)}
            >
              <DaoItem daoName={option.daoName} daoLogo={option.daoLogo} />
            </Box>
          ))}
        </>
      </PopperCard>
    </Box>
  )
}

function DaoItem({ daoLogo, daoName }: { daoLogo: string; daoName: string }) {
  return (
    <Item>
      <Image src={daoLogo || ''} alt={daoName} />
      <Text noWrap>{daoName || ''}</Text>
    </Item>
  )
}
