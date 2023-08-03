import { Box, Button, Stack, styled, Typography } from '@mui/material'
import Image from 'components/Image'
import { routes } from 'constants/routes'
import { useHistory } from 'react-router-dom'
import PopperCard from 'components/PopperCard'
import { ReactComponent as ArrowIcon } from 'assets/svg/arrow_down.svg'
import HateIcon from 'assets/svg/hate.svg'
import { useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'

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

const EmptyWrapper = styled(Box)({
  width: 329,
  height: 140,
  padding: '16px 9px 6px',
  textAlign: 'center'
})

const ButtonGroup = styled(Stack)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 14,
  '& button': {
    width: 140,
    height: 32
  }
})

export default function MySpace() {
  const { createDaoListData: myJoinedDaoList } = useUpdateDaoDataCallback()
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
          {myJoinedDaoList.length === 0 && <EmptyDaoItem />}
          {myJoinedDaoList?.map(option => (
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

export function EmptyDaoItem() {
  const history = useHistory()
  return (
    <EmptyWrapper>
      <Image src={HateIcon} width={36} />
      <Typography noWrap width={'100%'} lineHeight={'20px'} color={'#3F5170'}>
        <span style={{ fontWeight: 700 }}>Oops!</span>
        <span style={{ fontWeight: 400 }}> You haven&apos;t joined any DAOs yet.</span>
      </Typography>
      <ButtonGroup>
        <Button variant="contained" onClick={() => history.push(routes.CreateDao)}>
          Create DAO
        </Button>
        <Button variant="outlined" color="primary" onClick={() => history.push(routes.Governance)}>
          Explore DAOs
        </Button>
      </ButtonGroup>
    </EmptyWrapper>
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
