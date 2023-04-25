import { Box, Typography, styled } from '@mui/material'
import Button from 'components/Button/OutlineButton'
import { useCallback } from 'react'
import Image from 'components/Image'
import fans from 'assets/images/fans.png'
import comment from 'assets/images/comment.png'
import msg from 'assets/images/msg.png'
// import avatar from 'assets/images/avatar.png'
import lBanner from 'assets/images/l_banner.png'
import rBanner from 'assets/images/r_banner.png'
import tag from 'assets/images/tag.png'
import ball from 'assets/images/ball.png'
import { useHistory } from 'react-router'
// import stp from 'assets/images/stp.png'
import { ReactComponent as Mirror } from 'assets/svg/mirror.svg'
import { ReactComponent as Tg } from 'assets/svg/tg.svg'
import { ReactComponent as Tw } from 'assets/svg/tw.svg'
import { ReactComponent as Wechat } from 'assets/svg/wechat.svg'
import { ReactComponent as Email } from 'assets/svg/email.svg'
import { useHomeTopList } from 'hooks/useBackedHomeServer'
import { useHomeDaoList } from 'hooks/useBackedDaoServer'
import { useDaoBaseInfo } from 'hooks/useDaoInfo'
import { HomeListProp } from 'hooks/useBackedDaoServer'
import { routes } from 'constants/routes'

const ColSentence = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'center',
  margin: '60px 0 0',
  '& button': {
    width: 88,
    height: 36,
    borderRadius: 12,
    border: '1px solid #d4d7e2'
  }
}))

function DaoItem({
  daoAddress,
  chainId,
  daoName,
  daoLogo,
  members,
  verified,
  activeProposals,
  proposals,
  joinSwitch
}: HomeListProp) {
  const history = useHistory()
  const daoBaseInfo = useDaoBaseInfo(daoAddress, chainId)
  console.log(verified, joinSwitch)

  return (
    <Box
      minWidth={281}
      height={218}
      sx={{
        overflowX: 'scroll',
        padding: 16,
        border: '1px solid #d4d7e2',
        borderRadius: '10px',
        marginRight: 10,
        cursor: 'pointer',
        '&:hover': {
          border: `2px solid #0049C6`
        },
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        '& .des': {
          display: '-webkit-box',
          fontSize: 14,
          width: '247px',
          height: '76px',
          textAlign: 'left',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3
        }
      }}
      onClick={() => {
        history.push(routes._DaoInfo + `/${chainId}/${daoAddress}/proposal`)
      }}
    >
      <Box display={'flex'} justifyContent={'flex-start'} flexDirection={'row'} alignItems={'center'} gap={10}>
        <Image src={daoLogo} width={48} height={48}></Image>
        <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={10}>
            <p
              style={{
                fontSize: 20,
                margin: 0,
                fontWeight: 700,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
            >
              {daoName}
            </p>
            <Image src={tag} width={16}></Image>
          </Box>
          <div style={{ fontSize: 14, textAlign: 'left' }}>@{daoBaseInfo?.handle}</div>
        </Box>
      </Box>
      <Typography className="des">{daoBaseInfo?.description}</Typography>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        sx={{
          '& .wrapper': {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            '& img': {
              width: '30px',
              height: '30px'
            }
          }
        }}
      >
        <Box className="wrapper">
          <Image src={fans} alt=""></Image>
          <p>{members}</p>
        </Box>
        <Box className="wrapper">
          <Image src={comment} alt=""></Image>
          <p>{proposals}</p>
        </Box>
        <Box className="wrapper">
          <Image src={msg} alt=""></Image>
          <p>{activeProposals}</p>
        </Box>
      </Box>
    </Box>
  )
}

export default function Home() {
  const history = useHistory()
  const { result } = useHomeTopList()
  const { result: homeDaoList } = useHomeDaoList()
  const showAll = useCallback(() => {
    history.push('/daos')
  }, [history])
  // const loadAll = useCallback(() => {}, [])

  return (
    <Box
      sx={{
        maxWidth: 964,
        width: '100%',
        margin: '30px auto 20px',
        textAlign: 'center',
        fontSize: 12,
        padding: { xs: '0 16px', sm: undefined }
      }}
    >
      <Box display={'flex'} justifyContent={'center'} flexDirection={'row'} alignItems={'center'} mt={40} gap={20}>
        <Box
          width={'50%'}
          sx={{
            '& img': {
              width: '100%'
            },
            '& p': {
              fontSize: 16,
              marginTop: 0,
              color: '#777e90',
              textAlign: 'left'
            }
          }}
        >
          <Image src={lBanner}></Image>
          <p>
            This is a space for your team to collaborate and manage tasks. Begin with your DAO and invite your
            community!
          </p>
        </Box>
        <Image width={'50%'} src={rBanner}></Image>
      </Box>
      <ColSentence>
        <Typography color="#3f5170" variant="h5" fontSize={40}>
          Discover DAOs
        </Typography>
        <Button width={88} height={36} onClick={showAll}>
          View all
        </Button>
      </ColSentence>
      <Box
        mt={40}
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          overflowX: 'scroll',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        {homeDaoList?.map(item => (
          <DaoItem {...item} key={item.chainId} />
        ))}
      </Box>
      <ColSentence>
        <Typography color="#3f5170" variant="h5" fontSize={40}>
          Top Contributors
        </Typography>
        <Typography color="#3f5170" variant="h5" fontSize={40}></Typography>
        {/* <Button onClick={loadAll}>Load more</Button> */}
      </ColSentence>
      <Box
        mt={40}
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          overflowX: 'scroll',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        {result?.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              minWidth: 184,
              height: 228,
              border: '1px solid #d4d7e2',
              borderRadius: '8px',
              padding: '10px',
              marginRight: 10,
              cursor: 'pointer',
              '& img': {
                width: 160,
                height: 160
              },
              '& p': {
                textAlign: 'left',
                margin: 0
              }
            }}
            onClick={() => {
              history.push(routes._Profile + `/${item.account}`)
            }}
          >
            <Image src={item.avatar || ball} alt=""></Image>
            <p style={{ color: '#0049c6', fontWeight: 700, fontSize: 16 }}>{item.nickname || 'User name'}</p>
            <p style={{ fontSize: 12 }}>
              <span style={{ color: '#80829f', marginRight: 10 }}>Follower</span>
              <span style={{ color: '#23262f' }}>{item.fansNum}</span>
            </p>
          </Box>
        ))}
      </Box>
      {/* <ColSentence>
        <Typography color="#3f5170" variant="h5" fontSize={40}>
          Open Jobs
        </Typography>
        <Typography color="#3f5170" variant="h5" fontSize={40}></Typography>
      </ColSentence>
      <Box mt={40}>
        <Box
          sx={{
            width: 284,
            height: 100,
            border: '1px solid #d4d7e2',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            gap: 10,
            flexDirection: 'row',
            '& img': {
              width: 48
            },
            '& p:first-of-type': {
              fontSize: 16,
              fontWeight: 700,
              color: '#11142d'
            },
            '& p': {
              textAlign: 'left',
              margin: 0
            }
          }}
        >
          <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} gap={5}>
            <Image src={stp}></Image>
            <p style={{ fontSize: 13, textAlign: 'center' }}>STP</p>
          </Box>
          <Box>
            <p>Contract Developer</p>
            <p>1. Job requirements</p>
            <p>2. Work content</p>
          </Box>
        </Box>
      </Box> */}
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        gap={50}
        mt={100}
        sx={{
          cursor: 'pointer',
          '& svg:hover path': {
            fill: '#0049c6'
          }
        }}
      >
        <Tg onClick={() => window.open('https://t.me/STPofficial', '_blank')} />
        <Tw onClick={() => window.open('https://twitter.com/STP_Networks', '_blank')} />
        <Mirror
          onClick={() => window.open('https://mirror.xyz/0xB9d761AF53845D1F3C68f99c38f4dB6fcCfB66A1', '_blank')}
        />
        <Wechat onClick={() => window.open('https://verse.one/static/media/QR.96a0857f.jpeg', '_blank')} />
        <Email onClick={() => window.open('mailto:contact@stp.network', '_blank')} />
      </Box>
    </Box>
  )
}
