import { Box, Card, Typography } from '@mui/material'
import Image from 'components/Image'
import Avatar from 'assets/images/avatar.png'
import { shortenAddress } from 'utils'
import Button from 'components/Button/Button'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import { ReactComponent as Youtobe } from 'assets/svg/youtobe.svg'
import { ReactComponent as Opensea } from 'assets/svg/opensea.svg'
import { JobsListProps, useChangeAdminRole } from 'hooks/useBackedDaoServer'
import { useNavigate, useParams } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useCallback, useState } from 'react'
import { ChainId } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { toast } from 'react-toastify'
import { ReactComponent as TwitterGray } from 'assets/svg/twitter_gray.svg'
import { ReactComponent as DiscordGray } from 'assets/svg/discord_gray.svg'
import { ReactComponent as YoutobeGray } from 'assets/svg/youtobe_gray.svg'
import { ReactComponent as OpenseaGray } from 'assets/svg/opensea_gray.svg'

export enum DaoLevel {
  CREATOR,
  OWNER,
  ADMIN
}
export const JobsType: { [key in number]: string } = {
  [DaoLevel.CREATOR]: 'Creator',
  [DaoLevel.OWNER]: 'Owner',
  [DaoLevel.ADMIN]: 'Admin'
}

export default function CardView({ result, role }: { result: JobsListProps[]; role: string | undefined }) {
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()
  const { daoId: curDaoId } = useParams<{ daoId: string }>()
  const daoId = Number(curDaoId) as ChainId
  const [hoverIndex, setHoverIndex] = useState<any>(null)
  const changeRole = useChangeAdminRole()

  const onRemove = useCallback(
    async (e: any, address: string) => {
      changeRole(address, 100, daoId).then((res: any) => {
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'Network error')
          return
        }
        toast.success('Remove success')
      })
      e.stopPropagation()
    },
    [changeRole, daoId]
  )
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        padding: '20px 0'
      }}
    >
      {result.map((item: JobsListProps, index) => (
        <Box
          key={item.account + item.jobId}
          onMouseEnter={() => {
            setHoverIndex(index)
          }}
          onMouseLeave={() => {
            setHoverIndex(null)
          }}
          onClick={() => navigate(routes._Profile + `/${item.account}`)}
        >
          <Card
            sx={{
              cursor: 'pointer',
              position: 'relative',
              // width: '100%',
              // height: '100%',
              // aspectRatio: 'auto 220/226',
              // minWidth: 220,
              // minHeight: 226,
              boxShadow: 'none',
              width: 220,
              height: 226,
              textAlign: 'center',
              border: '1px solid #d4d7e2',
              '& img': {
                border: '1px solid #d4d7e2',
                borderRadius: '50%',
                zIndex: 10,
                marginTop: 20,
                width: 70,
                height: 70
              },
              '& p': {
                fontWeight: 600
              }
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 60,
                backgroundSize: '130% auto',
                backgroundPosition: 'center center',
                backgroundImage: `url(${item.avatar || Avatar})`,
                backgroundRepeat: 'no-repeat'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: 60,
                  backdropFilter: 'blur(17px)'
                }}
              ></Box>
            </Box>
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                '& button': {
                  fontWeight: 500
                },
                '& .Creator': {
                  backgroundColor: '#0049C6'
                },
                '& .Owner': {
                  backgroundColor: '#97B7EF'
                },
                '& .Admin': {
                  backgroundColor: '#EBF0F7',
                  color: '#80829F'
                }
              }}
            >
              <Image src={item.avatar || Avatar}></Image>
              <Typography noWrap maxWidth={'100%'} color="#3f5170" fontSize={18} minHeight={24} padding={'0 10px'}>
                {item.nickname || 'unnamed'}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Typography
                  sx={{
                    background: '#F8FBFF',
                    borderRadius: '30px',
                    width: 140,
                    height: 28,
                    color: '#0049c6',
                    fontSize: 13
                  }}
                  noWrap
                >
                  {shortenAddress(item.account, 3)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '10px 0',
                  cursor: 'pointer',
                  height: 16,
                  gap: 10
                }}
              >
                {item.twitter ? (
                  <Twitter onClick={() => window.open(item.twitter, '_blank')}></Twitter>
                ) : (
                  <TwitterGray />
                )}
                {item.youtobe ? (
                  <Youtobe onClick={() => window.open(item.youtobe, '_blank')}></Youtobe>
                ) : (
                  <YoutobeGray />
                )}
                {item.discord ? (
                  <Discord onClick={() => window.open(item.discord, '_blank')}></Discord>
                ) : (
                  <DiscordGray />
                )}
                {item.opensea ? (
                  <Opensea onClick={() => window.open(item.opensea, '_blank')}></Opensea>
                ) : (
                  <OpenseaGray />
                )}
              </Box>
              <Button width="98px" height="22px" borderRadius="30px" fontSize={13} className={JobsType[item.jobsLevel]}>
                {JobsType[item.jobsLevel] || 'unnamed'}
              </Button>
            </Box>
            {hoverIndex === index &&
              (role === 'superAdmin' || role === 'owner') &&
              item.jobsLevel !== DaoLevel.CREATOR &&
              account &&
              account.toLowerCase() !== item.account.toLowerCase() && (
                <Box
                  sx={{
                    borderRadius: '4px',
                    zIndex: 99,
                    position: 'absolute',
                    top: 0,
                    right: 0
                  }}
                >
                  <Button
                    width="98px"
                    height="22px"
                    borderRadius="30px"
                    fontSize={13}
                    onClick={e => onRemove(e, item.account)}
                  >
                    Remove
                  </Button>
                </Box>
              )}
          </Card>
        </Box>
      ))}
    </Box>
  )
}
