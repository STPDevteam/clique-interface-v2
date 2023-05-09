import { MenuItem, Box, styled, Typography } from '@mui/material'
import Select from 'components/Select/Select'
import useBreakpoint from 'hooks/useBreakpoint'
import { useMyJoinedDao } from 'hooks/useBackedDaoServer'
import { DaoAvatars } from 'components/Avatars'
import { routes } from 'constants/routes'
import { ChainId } from 'constants/chain'
import { useDaoBaseInfo } from 'hooks/useDaoInfo'
import { useHistory } from 'react-router-dom'

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
  display: 'flex',
  flexDirection: 'row',
  justifyItems: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  '& img': {
    width: 40,
    height: 40,
    borderRadius: '50%'
  },
  '& p': {
    fontSize: 14
  },
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

export default function MySpace() {
  const isDownSm = useBreakpoint('sm')
  const { result: myJoinedDaoList } = useMyJoinedDao()
  const history = useHistory()

  return (
    <Box>
      <Select
        noBold
        defaultValue={'My Space'}
        value={'My Space'}
        placeholder="My Space"
        width={isDownSm ? '106px' : '130px'}
        height={isDownSm ? '36px' : '50px'}
        style={{
          '&.MuiInputBase-root:before': {
            left: 14,
            color: '#3F5170'
          },
          '&.MuiInputBase-root:hover:before': {
            color: 'white'
          },
          '& .MuiSelect-select': {
            padding: '0 14px!important',
            '& img': {
              marginRight: 0
            },
            '& span': {
              // display: 'none'
            },
            '& .MuiSvgIcon': {
              width: '100%'
            }
          },
          '& .Mui-disabled.MuiSelect-select.MuiInputBase-input': {
            paddingRight: isDownSm ? 0 : 0,
            color: theme => theme.palette.text.primary,
            WebkitTextFillColor: theme => theme.palette.text.primary
          }
        }}
      >
        {myJoinedDaoList.map(option => (
          <MenuItem
            key={option.daoAddress + option.chainId}
            onClick={() => history.push(`${routes._DaoInfo}/${option.chainId}/${option.daoAddress}`)}
          >
            <DaoItem chainId={option.chainId} daoName={option.daoName} daoAddress={option.daoAddress} />
          </MenuItem>
        ))}
      </Select>
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
      <DaoAvatars src={daoBaseInfo?.daoLogo} alt={daoBaseInfo?.name || daoName} />
      <Text noWrap>{daoBaseInfo?.name || daoName}</Text>
    </Item>
  )
}
