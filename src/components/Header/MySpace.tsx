import { Box, styled, Typography } from '@mui/material'
import { useMyJoinedDao } from 'hooks/useBackedDaoServer'
import Image from 'components/Image'
import { routes } from 'constants/routes'
import { ChainId } from 'constants/chain'
import { useDaoBaseInfo } from 'hooks/useDaoInfo'
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
              key={option.daoAddress + option.chainId}
              onClick={() => history.push(`${routes._DaoInfo}/${option.chainId}/${option.daoAddress}`)}
            >
              <DaoItem chainId={option.chainId} daoName={option.daoName} daoAddress={option.daoAddress} />
            </Box>
          ))}
        </>
      </PopperCard>
    </Box>
  )
}

function DaoItem({
  chainId,
  daoAddress,
  daoName
}: {
  chainId: ChainId | undefined
  daoAddress: string
  daoName: string
}) {
  const daoBaseInfo = useDaoBaseInfo(daoAddress, chainId)

  return (
    <Item>
      <Image src={daoBaseInfo?.daoLogo || ''} alt={daoBaseInfo?.name || daoName} />
      <Text noWrap>{daoBaseInfo?.name || daoName}</Text>
    </Item>
  )
}
