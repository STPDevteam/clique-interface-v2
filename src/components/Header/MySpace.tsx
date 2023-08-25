import { Box, Button, Stack, styled, Typography, ButtonGroup, Button as MuiButton } from '@mui/material'
import Image from 'components/Image'
import { routes } from 'constants/routes'
import { useNavigate } from 'react-router-dom'
import PopperCard from 'components/PopperCard'
import { ReactComponent as ArrowIcon } from 'assets/svg/arrow_down.svg'
import HateIcon from 'assets/svg/hate.svg'
import { useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
import { useState } from 'react'
// import { useAccountNFTsList } from 'hooks/useBackedProfileServer'
import Loading from 'components/Loading'
import placeholderImage from 'assets/images/placeholder.png'
// import { useActiveWeb3React } from 'hooks'
import EmptyData from 'components/EmptyData'
import { useNftAccountList } from 'hooks/useBackedNftCallback'

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
  width: 227,
  padding: '10px 20px 10px 5px',
  gap: 10,
  // '&:hover .right': {
  //   height: 0,
  //   width: 0,
  //   border: '1px solid #999',
  //   position: 'relative',
  //   '::before': {
  //     position: 'absolute',
  //     right: 1,
  //     top: '-6px',
  //     content: '""',
  //     display: 'block',
  //     height: 7,
  //     width: 0,
  //     border: '1px solid #999',
  //     transform: 'rotate(135deg)'
  //   }
  // },
  '&:hover': {
    backgroundColor: '#0049C60D'
  },

  '&:hover p': {
    color: '#0049C6'
  },
  '& img': {
    width: 30,
    height: 30,
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
  width: 236,
  height: 140,
  padding: '16px 9px 6px',
  textAlign: 'center'
})

const ButtonStyledGroup = styled(Stack)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 5,
  '& button': {
    width: 106,
    height: 32,
    padding: '5px !important'
  }
})

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  width: 227,
  '& button': {
    height: 30,
    borderWidth: '1px',
    color: theme.palette.text.primary,
    fontWeight: 600,
    padding: '5px 8px !important',
    '&:hover': {
      borderWidth: '1px'
    },
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    }
  }
}))

export default function MySpace() {
  // const { account, chainId } = useActiveWeb3React()
  const { createDaoListData: myJoinedDaoList } = useUpdateDaoDataCallback()
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState<boolean>(false)
  const { result: NftList, loading } = useNftAccountList()
  // const { result: accountNFTsList, loading } = useAccountNFTsList(account || undefined, chainId, 'erc721')
  console.log('NftList=>', NftList)

  return (
    <Box>
      <PopperCard
        sx={{
          marginTop: 13,
          maxWidth: 250,
          padding: '12px 10px 0',
          '& ::-webkit-scrollbar': {
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
          <StyledButtonGroup>
            <MuiButton
              className={!isActive ? 'active' : ''}
              onClick={e => {
                e.stopPropagation()
                setIsActive(false)
              }}
            >
              {'DAOs'}
            </MuiButton>
            <MuiButton
              className={isActive ? 'active' : ''}
              onClick={e => {
                e.stopPropagation()
                setIsActive(true)
              }}
            >
              {'NFT Account'}
            </MuiButton>
          </StyledButtonGroup>
          {myJoinedDaoList.length === 0 && !isActive && <EmptyDaoItem />}
          {!isActive ? (
            <Box
              mt={10}
              sx={{
                maxHeight: '45vh',
                overflowY: 'auto',
                marginBottom: '6px'
              }}
            >
              {myJoinedDaoList?.map(option => (
                <Box
                  key={option.daoName + option.daoId}
                  onClick={() => navigate(`${routes._DaoInfo}/${option.daoId}/proposal`)}
                >
                  <DaoItem daoName={option.daoName} daoLogo={option.daoLogo} />
                </Box>
              ))}
            </Box>
          ) : (
            <>
              {loading && <Loading sx={{ marginTop: 30 }} />}
              {NftList.length ? (
                <Box
                  mt={10}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    gap: 4,
                    maxHeight: '45vh',
                    overflowY: 'auto',
                    minHeight: '160px',
                    marginBottom: '6px'
                  }}
                >
                  {NftList?.map((option, index) => (
                    <Box key={option.contract_name + index} sx={{ maxHeight: '54px', mb: 6 }}>
                      <Image
                        src={option.image_uri || placeholderImage}
                        alt={''}
                        width={54}
                        height={54}
                        style={{ border: '1px solid #97B7EF', borderRadius: '6px' }}
                        // onClick={() => {
                        //   navigate(routes.NftSelect)
                        // }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box padding={'15px 0'}>
                  <EmptyData>No data</EmptyData>
                </Box>
              )}
            </>
          )}
        </>
      </PopperCard>
    </Box>
  )
}

export function EmptyDaoItem() {
  const navigate = useNavigate()
  return (
    <EmptyWrapper>
      <Image src={HateIcon} width={36} />
      <Typography noWrap width={'100%'} lineHeight={'20px'} color={'#3F5170'} fontSize={12}>
        <span style={{ fontWeight: 700 }}>Oops!</span>
        <br />
        <span style={{ fontWeight: 400 }}> You haven&apos;t joined any DAOs yet.</span>
      </Typography>
      <ButtonStyledGroup>
        <Button variant="contained" onClick={() => navigate(routes.CreateDao)}>
          Create DAO
        </Button>
        <Button variant="outlined" color="primary" onClick={() => navigate(routes.Governance)}>
          Explore DAOs
        </Button>
      </ButtonStyledGroup>
    </EmptyWrapper>
  )
}

function DaoItem({ daoLogo, daoName }: { daoLogo: string; daoName: string }) {
  return (
    <Item>
      <Image src={daoLogo || ''} alt={daoName} />
      <Text noWrap>{daoName || ''}</Text>
      {/* <Typography className="right" maxWidth={14} width={'100%'} /> */}
    </Item>
  )
}
