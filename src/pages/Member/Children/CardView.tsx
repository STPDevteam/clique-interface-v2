import { Box, Card, Typography } from '@mui/material'
import Image from 'components/Image'
import owl from 'assets/images/owl.png'
import { shortenAddress } from 'utils'
import Button from 'components/Button/Button'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import { ReactComponent as Youtobe } from 'assets/svg/youtobe.svg'
import { ReactComponent as Opensea } from 'assets/svg/opensea.svg'
import { JobsListProps, useChangeAdminRole } from 'hooks/useBackedDaoServer'
import { useHistory, useParams } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useCallback, useState } from 'react'
import { ChainId } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'

export const JobsType: any = {
  A_superAdmin: 'Super Admin',
  B_admin: 'Admin',
  C_member: 'Member'
}

export default function CardView({ result, role }: { result: JobsListProps[]; role: string | undefined }) {
  const history = useHistory()
  const { account } = useActiveWeb3React()
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const [hoverIndex, setHoverIndex] = useState<any>(null)
  const { changeRole } = useChangeAdminRole()

  console.log(account)

  const onRemove = useCallback(
    async (e: any, id) => {
      changeRole(curDaoChainId, daoAddress, id)
      e.stopPropagation()
    },
    [changeRole, curDaoChainId, daoAddress]
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
          onClick={() => history.push(routes._Profile + `/${item.account}`)}
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
                backgroundImage: `url(${item.avatar || owl})`,
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
                '& .A_superAdmin': {
                  backgroundColor: '#0049C6'
                },
                '& .B_admin': {
                  backgroundColor: '#97B7EF'
                },
                '& .C_member': {
                  backgroundColor: '#EBF0F7',
                  color: '#80829F'
                }
              }}
            >
              <Image src={item.avatar || owl}></Image>
              <Typography noWrap maxWidth={'100%'} color="#3f5170" fontSize={18} minHeight={24}>
                {item.nickname}
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
                  gap: 10
                }}
              >
                <Twitter onClick={() => window.open(item.twitter, '_blank')}></Twitter>
                <Youtobe onClick={() => window.open(item.youtobe, '_blank')}></Youtobe>
                <Discord onClick={() => window.open(item.discord, '_blank')}></Discord>
                <Opensea onClick={() => window.open(item.opensea, '_blank')}></Opensea>
              </Box>
              <Button width="98px" height="22px" borderRadius="30px" fontSize={13} className={item.jobs}>
                {JobsType[item.jobs] || 'unnamed'}
              </Button>
            </Box>
            {hoverIndex === index &&
              role === 'A_superAdmin' &&
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
                    onClick={e => onRemove(e, item.jobId)}
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
