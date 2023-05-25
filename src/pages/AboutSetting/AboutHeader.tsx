import { Box, Link, styled, Typography } from '@mui/material'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import { ReactComponent as Youtobe } from 'assets/svg/youtobe.svg'
import { ReactComponent as Opensea } from 'assets/svg/opensea.svg'
import { useDaoAdminLevel, useDaoInfo } from 'hooks/useDaoInfo'
import { useParams } from 'react-router-dom'
import { ChainId } from 'constants/chain'
import { useBackedDaoInfo } from 'hooks/useBackedDaoServer'
import { isSocialUrl } from 'utils/dao'
import { useActiveWeb3React } from 'hooks'
import { DaoAvatars } from 'components/Avatars'
import AdminTag from '../DaoInfo/ShowAdminTag'
import useBreakpoint from 'hooks/useBreakpoint'
import { useMemo } from 'react'
import { ReactComponent as AuthIcon } from 'assets/svg/auth_tag_icon.svg'

const StyledHeader = styled(Box)(({ theme }) => ({
  borderRadius: theme.borderRadius.default,
  minHeight: 142,
  background: theme.palette.common.white,
  padding: '20px 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

export default function Header() {
  const isSmDown = useBreakpoint('sm')
  const { account } = useActiveWeb3React()
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const { result: backedDaoInfo } = useBackedDaoInfo(daoAddress, curDaoChainId)
  const daoAdminLevel = useDaoAdminLevel(daoAddress, curDaoChainId, account || undefined)

  const daoInfo = useDaoInfo(daoAddress, curDaoChainId)
  const categoryList = useMemo(() => {
    if (!daoInfo?.category) return []
    return daoInfo.category.split(',')
  }, [daoInfo?.category])

  return (
    <Box>
      <ContainerWrapper maxWidth={1180}>
        <StyledHeader>
          <Box
            sx={{
              display: 'flex'
            }}
          >
            <Box
              sx={{
                height: 142,
                width: 142,
                border: '1px solid #D4D7E2',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <DaoAvatars size={isSmDown ? 60 : 100} src={daoInfo?.daoLogo} />
            </Box>
            <Box sx={{ ml: 35, height: 142 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ font: '600 24px/29px "Inter" ', mr: 8 }}>
                  {daoInfo?.name || '--'}
                </Typography>
                {backedDaoInfo?.verified && <AuthIcon />}

                <AdminTag level={daoAdminLevel} />
              </Box>
              <Typography sx={{ mt: 6, font: ' 500 14px/17px "Inter"', color: '#97B7EF' }}>
                @{daoInfo?.handle}
              </Typography>
              <Box sx={{ display: 'flex' }}>
                {categoryList.map((name, index) => (
                  <Box
                    key={index}
                    sx={{
                      mr: 6,
                      mt: 25,
                      padding: '1px 14px',
                      gap: '10px',
                      height: '22px',
                      background: ' rgba(0, 91, 198, 0.06)',
                      borderRadius: '30px'
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        fontSize: '13px',
                        lineHeight: '20px',
                        color: '#3F5170'
                      }}
                    >
                      {name}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 13, display: 'flex', alignItems: 'center' }}>
                {daoInfo?.twitter && isSocialUrl('twitter', daoInfo.twitter) && (
                  <Link
                    target={'_blank'}
                    href={daoInfo.twitter}
                    underline="none"
                    sx={{ mr: 10, display: 'flex', alignItems: 'center' }}
                  >
                    <Twitter />
                  </Link>
                )}
                {daoInfo?.discord && isSocialUrl('discord', daoInfo.discord) && (
                  <Link
                    target={'_blank'}
                    href={daoInfo.discord}
                    underline="none"
                    sx={{ mr: 10, display: 'flex', alignItems: 'center' }}
                  >
                    <Discord />
                  </Link>
                )}
                {daoInfo?.github && isSocialUrl('github', daoInfo.github) && (
                  <Link fontSize={12} target={'_blank'} href={daoInfo.github} underline="none" mr={10}>
                    <Youtobe />
                  </Link>
                )}
                {daoInfo?.website && isSocialUrl('', daoInfo.website) && (
                  <Link fontSize={12} target={'_blank'} href={daoInfo.website} underline="none">
                    <Opensea />
                  </Link>
                )}
              </Box>
            </Box>
          </Box>
          {/* (<Button
            variant="contained"
            sx={{
              width: '95px',
              height: '36px',
              background: '#0049C6',
              borderRadius: '8px',
              color: '#fff',
              font: '700 14px/20px "Inter"'
            }}
          >
            + Follow
          </Button>) */}
        </StyledHeader>
      </ContainerWrapper>
    </Box>
  )
}
