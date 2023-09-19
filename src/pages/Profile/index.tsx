import { Avatar, Box, Link, Stack, styled, Typography, useTheme } from '@mui/material'
import Copy from 'components/essential/Copy'
import { useActiveWeb3React } from 'hooks'
import { ContainerWrapper } from 'pages/Creator/StyledCreate'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getEtherscanLink, isAddress, shortenAddress } from 'utils'
// import { ReactComponent as TwitterGray } from 'assets/svg/twitter_gray.svg'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
// import { ReactComponent as DiscordGray } from 'assets/svg/discord_gray.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
// import { ReactComponent as YoutobeGray } from 'assets/svg/youtobe_gray.svg'
import { ReactComponent as Youtobe } from 'assets/svg/youtobe.svg'
// import { ReactComponent as OpenseaGray } from 'assets/svg/opensea_gray.svg'
import { ReactComponent as Opensea } from 'assets/svg/opensea.svg'
import MyTokens from './MyTokens'
import MyRecords from './MyRecords'
import AccountNFTs from './AccountNFTs'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useIsDelayTime,
  // useAccountFollowersList,
  // useAccountFollowingList,
  useUserFollowStatus,
  useUserProfileInfo
} from 'hooks/useBackedProfileServer'
import { getSocialUrlEnd, isSocialUrl } from 'utils/dao'
import MyDaos from './MyDaos'
import UpdateProfileModal from './UpdateProfileModal'
import OutlineButton from 'components/Button/OutlineButton'
import useModal from 'hooks/useModal'
import useBreakpoint from 'hooks/useBreakpoint'
import { BlackButton } from 'components/Button/Button'
import Button from 'components/Button/Button'
// import Modal from 'components/Modal'
// import Pagination from 'components/Pagination'
// import EmptyData from 'components/EmptyData'
// import { routes } from 'constants/routes'
import Loading from 'components/Loading'

import { useWalletModalToggle } from 'state/application/hooks'
import { RowCenter } from 'pages/DaoInfo/Children/Proposal/ProposalItem'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import { ReactComponent as EditIcon } from 'assets/svg/edit.svg'
import bg from 'assets/images/blur-bg.png'

const StyledHeader = styled(Box)(({ theme }) => ({
  borderRadius: theme.borderRadius.default,
  minHeight: 150,
  // background: theme.palette.common.white,
  boxShadow: theme.boxShadow.bs2,
  background: 'linear-gradient(271.58deg, rgba(255, 255, 255, 0.85) 0%, #FFFFFF 53.36%, #FFFFFF 100.77%)',
  backdropFilter: 'blur(60px)',
  padding: '26px 26px 30px 30px',
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
    minHeight: 150
  }
}))

// const StyledBody = styled(Box)(({ theme }) => ({
//   minHeight: 200,
//   padding: '40px 32px',
//   [theme.breakpoints.down('sm')]: {
//     gridTemplateColumns: 'unset',
//     padding: '20px 16px'
//   }
// }))

// const StyledListText = styled(Typography)(({ theme }) => ({
//   fontSize: 13,
//   fontWeight: 600,
//   [theme.breakpoints.down('sm')]: {
//     fontSize: 10
//   }
// }))

const StyledLink = styled(Link)(({ borderColor, bgColor }: { borderColor?: string; bgColor?: string }) => ({
  maxWidth: 120,
  height: 28,
  fontSize: 12,
  border: `1px solid ${borderColor ? borderColor : '#C0E2F4'}`,
  padding: '0 12px',
  display: 'flex',
  alignItems: 'center',
  background: `${bgColor ? bgColor : '#EFFCFF'}`,
  borderRadius: '30px'
}))

export default function Profile() {
  const { account, chainId, deactivate } = useActiveWeb3React()
  const { address } = useParams<{ address: string }>()
  const theme = useTheme()
  const { showModal, hideModal } = useModal()
  const walletModalToggle = useWalletModalToggle()
  const currentAccount = useMemo(() => (isAddress(address) ? address : account || undefined), [account, address])
  const isSelf = useMemo(
    () => currentAccount && account && account.toLowerCase() === currentAccount.toLowerCase(),
    [account, currentAccount]
  )
  const { isFollowed, toggleFollow } = useUserFollowStatus(
    account || undefined,
    currentAccount && currentAccount !== account ? currentAccount : undefined
  )
  const [rand, setRand] = useState(Math.random())
  const navigate = useNavigate()
  const isSmDown = useBreakpoint('sm')
  const { result: profileInfo, loading } = useUserProfileInfo(currentAccount || undefined, rand, isFollowed)
  const { isDelayTime } = useIsDelayTime()
  // const { result: accountFollowersList } = useAccountFollowersList(profileInfo?.userId)
  // const { result: accountFollowingList } = useAccountFollowingList(profileInfo?.userId)

  // const FollowersNum = useMemo(() => {
  //   if (!accountFollowersList) return 0
  //   return accountFollowersList.length
  // }, [accountFollowersList])

  // const FollowingNum = useMemo(() => {
  //   if (!accountFollowingList) return 0
  //   return accountFollowingList.length
  // }, [accountFollowingList])

  const isFollow = useMemo(() => {
    if (!account) return false
    return profileInfo?.isFollow
  }, [account, profileInfo])

  const refreshProfile = useCallback(() => {
    setRand(Math.random())
    hideModal()
  }, [hideModal])

  useEffect(() => {
    if (isDelayTime) return
    if (!currentAccount || !account) {
      navigate('/', { replace: true })
    }
    hideModal()
  }, [currentAccount, hideModal, account, navigate, isDelayTime])

  const userSignature = useUserInfo()
  const loginSignature = useLoginSignature()

  return account && profileInfo ? (
    <Box
      paddingBottom={40}
      sx={{
        padding: { sm: '44px 0 40px 0', xs: '0 16px 20px' },
        background: `url(${bg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: isSmDown ? '100% 230px' : '100% 320px'
      }}
    >
      <ContainerWrapper maxWidth={1200} margin={isSmDown ? '0 auto 24px' : '0 auto 40px'}>
        <StyledHeader>
          <Box display={'flex'}>
            <Avatar
              src={profileInfo?.accountLogo}
              sx={{ width: { xs: 64, sm: 100 }, height: { xs: 64, sm: 100 }, marginRight: isSmDown ? 8 : 24 }}
            />
            <Box
              sx={{
                width: 'calc(100% - 100px)'
              }}
            >
              <Box
                sx={{
                  display: { sm: 'grid', xs: 'flex' },
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: { sm: 10, xs: 0 },
                  gridTemplateColumns: { sm: '1fr 200px', xs: 'unset' }
                }}
              >
                <Box
                  display={'grid'}
                  alignItems="center"
                  sx={{
                    gridTemplateColumns: { sm: 'auto auto auto 1fr', xs: 'unset' },
                    gap: 6
                  }}
                >
                  <Typography variant="h5" noWrap>
                    {profileInfo?.nickname || 'unnamed'}
                  </Typography>
                  <Box
                    fontSize={0}
                    display={'grid'}
                    gridTemplateColumns="auto auto auto auto"
                    gap={10}
                    alignItems={'center'}
                  >
                    {profileInfo?.twitter && isSocialUrl('twitter', profileInfo.twitter) ? (
                      <StyledLink
                        target={'_blank'}
                        href={profileInfo.twitter}
                        underline="none"
                        width={isSmDown ? '40px' : 'auto'}
                      >
                        <Twitter />
                        {!isSmDown && (
                          <Typography color="#0F7CAB" fontSize={12} ml={5} noWrap maxWidth={70}>
                            {getSocialUrlEnd(profileInfo.twitter)}
                          </Typography>
                        )}
                      </StyledLink>
                    ) : (
                      // <TwitterGray />
                      ''
                    )}

                    {profileInfo?.discord && isSocialUrl('discord', profileInfo.discord) ? (
                      <StyledLink
                        target={'_blank'}
                        href={profileInfo.discord}
                        underline="none"
                        borderColor={'#E6D2FF'}
                        bgColor="#FCF3FF"
                        width={isSmDown ? '40px' : 'auto'}
                      >
                        <Discord />
                        {!isSmDown && (
                          <Typography color="#5D619C" fontSize={12} ml={5} noWrap maxWidth={70}>
                            {getSocialUrlEnd(profileInfo.discord)}
                          </Typography>
                        )}
                      </StyledLink>
                    ) : (
                      // <DiscordGray />
                      ''
                    )}

                    {profileInfo?.youtube && isSocialUrl('youtube', profileInfo.youtube) ? (
                      <StyledLink
                        target={'_blank'}
                        href={profileInfo.youtube}
                        underline="none"
                        borderColor={'#FFD2D2'}
                        bgColor="#FFF3F3"
                        width={isSmDown ? '40px' : 'auto'}
                      >
                        <Youtobe />
                        {!isSmDown && (
                          <Typography color="#5D619C" fontSize={12} ml={5} noWrap maxWidth={70}>
                            {getSocialUrlEnd(profileInfo.youtube)}
                          </Typography>
                        )}
                      </StyledLink>
                    ) : (
                      // <YoutobeGray />
                      ''
                    )}

                    {profileInfo?.opensea && isSocialUrl('opensea', profileInfo.opensea) ? (
                      <StyledLink
                        target={'_blank'}
                        href={profileInfo.opensea}
                        underline="none"
                        borderColor={'#F3F9FF'}
                        bgColor="#D2DAFF"
                        width={isSmDown ? '40px' : 'auto'}
                      >
                        <Opensea />
                        {!isSmDown && (
                          <Typography color="#5D619C" fontSize={12} ml={5} noWrap maxWidth={70}>
                            {getSocialUrlEnd(profileInfo.opensea)}
                          </Typography>
                        )}
                      </StyledLink>
                    ) : (
                      // <OpenseaGray />
                      ''
                    )}
                  </Box>
                </Box>
                {!isSmDown && (
                  <>
                    {isSelf ? (
                      <RowCenter
                        mt={{ xs: 0, sm: 10 }}
                        sx={{
                          justifyContent: 'flex-end',
                          '& svg': {
                            marginRight: 5
                          },
                          '&:hover svg path': {
                            fill: theme.palette.primary.main
                          }
                        }}
                      >
                        <OutlineButton
                          style={{ border: 'none' }}
                          noBold
                          disabled={loading}
                          width="75px"
                          height={'24px'}
                          onClick={async () => {
                            if (!userSignature) {
                              await loginSignature()
                              refreshProfile()
                            } else if (profileInfo) {
                              showModal(
                                <UpdateProfileModal userProfile={profileInfo} refreshProfile={refreshProfile} />
                              )
                            }
                          }}
                        >
                          <EditIcon />
                          Edit
                        </OutlineButton>
                      </RowCenter>
                    ) : (
                      <Box mt={{ xs: 10 }}>
                        {isFollow ? (
                          <Button
                            onClick={() => toggleFollow(false)}
                            width={isSmDown ? '100px' : '200px'}
                            height={isSmDown ? '30px' : '44px'}
                            backgroundColor="transparent"
                            style={{ border: '1px solid #0049C6' }}
                            color="#0049C6"
                            hoverbg="#1976D20A "
                          >
                            - Unfollowed
                          </Button>
                        ) : (
                          <BlackButton
                            onClick={() => {
                              if (!account) {
                                walletModalToggle()
                              } else {
                                toggleFollow(true)
                              }
                            }}
                            width={isSmDown ? '100px' : '200px'}
                            height={isSmDown ? '30px' : '44px'}
                          >
                            + Follow
                          </BlackButton>
                        )}
                      </Box>
                    )}
                  </>
                )}
              </Box>
              <Box
                sx={{
                  display: { xs: 'flex', sm: 'block' },
                  gap: { xs: 10, sm: 0 },
                  marginTop: { xs: 10, sm: 0 }
                }}
              >
                <Box
                  mt={isSmDown ? 0 : 12}
                  display={'flex'}
                  alignItems="center"
                  sx={{
                    width: 'fit-content',
                    borderRadius: '30px',
                    padding: '4px 4px 2px 16px',
                    backgroundColor: '#F2F2F2',
                    height: isSmDown ? '30px' : 'auto',
                    svg: {
                      marginRight: isSmDown ? '0 !important' : 'auto'
                    }
                  }}
                >
                  <Link
                    fontSize={13}
                    href={getEtherscanLink(chainId || 1, currentAccount || '', 'address')}
                    fontWeight={600}
                    target="_blank"
                    underline="none"
                    mr={6}
                  >
                    {currentAccount ? shortenAddress(currentAccount) : ''}
                  </Link>
                  <Copy toCopy={currentAccount || ''} />
                </Box>
                {isSmDown && (
                  <>
                    {isSelf ? (
                      <RowCenter
                        sx={{
                          justifyContent: 'flex-end',
                          '& svg': {
                            marginRight: 5
                          },
                          '&:hover svg path': {
                            fill: theme.palette.primary.main
                          }
                        }}
                      >
                        <OutlineButton
                          style={{ border: 'none' }}
                          noBold
                          disabled={loading}
                          width="75px"
                          height={'24px'}
                          onClick={async () => {
                            if (!userSignature) {
                              await loginSignature()
                              refreshProfile()
                            } else if (profileInfo) {
                              showModal(
                                <UpdateProfileModal userProfile={profileInfo} refreshProfile={refreshProfile} />
                              )
                            }
                          }}
                        >
                          <EditIcon />
                          Edit
                        </OutlineButton>
                      </RowCenter>
                    ) : (
                      <Box>
                        {isFollow ? (
                          <Button
                            onClick={() => toggleFollow(false)}
                            width={isSmDown ? '100px' : '200px'}
                            height={isSmDown ? '30px' : '44px'}
                            backgroundColor="transparent"
                            style={{ border: '1px solid #0049C6' }}
                            color="#0049C6"
                            hoverbg="#1976D20A "
                          >
                            - Unfollowed
                          </Button>
                        ) : (
                          <BlackButton
                            onClick={() => {
                              if (!account) {
                                walletModalToggle()
                              } else {
                                toggleFollow(true)
                              }
                            }}
                            width={isSmDown ? '100px' : '200px'}
                            height={isSmDown ? '30px' : '44px'}
                          >
                            + Follow
                          </BlackButton>
                        )}
                      </Box>
                    )}
                  </>
                )}
              </Box>

              {/* <Stack mt={10} direction={'row'} alignItems="center" spacing={isSmDown ? 10 : 20}>
                <Typography
                  fontWeight={600}
                  fontSize={16}
                  sx={{
                    cursor: 'pointer'
                  }}
                  onClick={() => showModal(<AccountFollowersList userId={profileInfo?.userId} />)}
                >
                  {FollowersNum || 0} Followers
                </Typography>
                <Box
                  sx={{
                    width: '1px',
                    height: '12px',
                    background: '#D4D4D4'
                  }}
                />
                <Typography
                  fontWeight={600}
                  fontSize={16}
                  sx={{
                    cursor: 'pointer'
                  }}
                  onClick={() => showModal(<AccountFollowingList userId={profileInfo?.userId} />)}
                >
                  {FollowingNum || 0} Following
                </Typography>
              </Stack> */}
              <Stack
                mt={10}
                direction={'row'}
                alignItems="start"
                justifyContent={'space-between'}
                spacing={isSmDown ? 10 : 20}
              >
                {!isSmDown && (
                  <Box sx={{ width: '60%', maxWidth: '700px', wordWrap: 'break-word' }}>
                    <Typography mt={10} fontSize={14} fontWeight={600}>
                      {profileInfo?.introduction || ''}
                    </Typography>
                    {/* <Box
                    display={'flex'}
                    alignItems="center"
                    sx={{
                      color: '#97B7EF',
                      cursor: 'pointer',
                      width: 'fit-content',
                      borderRadius: '30px',
                      padding: '1px 14px',
                      fontSize: 13,
                      backgroundColor: '#005BC60F'
                    }}
                  >
                    + Add
                  </Box> */}
                  </Box>
                )}
                {isSelf ? (
                  <OutlineButton
                    noBold
                    style={{
                      borderColor: '#C60C00',
                      color: '#C60C00'
                    }}
                    width="100px"
                    height={'36px'}
                    onClick={deactivate}
                  >
                    Disconnect
                  </OutlineButton>
                ) : (
                  <></>
                )}
              </Stack>
            </Box>
          </Box>
          {isSmDown && (
            <>
              <Box sx={{ width: '100%', maxWidth: '700px', wordWrap: 'break-word' }}>
                <Typography
                  mt={10}
                  fontSize={14}
                  fontWeight={600}
                  sx={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                    paddingRight: 20,
                    textOverflow: 'ellipsis',
                    wordBreak: ' break-all'
                  }}
                >
                  {profileInfo?.introduction || ''}
                </Typography>
              </Box>
            </>
          )}
        </StyledHeader>
      </ContainerWrapper>
      <Box display={'grid'} gap="48px">
        <AccountNFTs account={currentAccount || ''} />

        {isSelf && <MyTokens account={currentAccount || ''} chainId={chainId} />}

        <MyDaos adminDao={profileInfo?.adminDao} />

        {isSelf && <MyRecords account={currentAccount || ''} />}
      </Box>
    </Box>
  ) : (
    <Box>
      <Loading sx={{ marginTop: 50 }} />
    </Box>
  )
}

// function AccountFollowersList({ userId }: { userId: number | undefined }) {
//   const { result: accountFollowersList, page, loading } = useAccountFollowersList(userId)
//   const { hideModal } = useModal()
//   const navigate = useNavigate()
//   const isSmDown = useBreakpoint('sm')
//   console.log(accountFollowersList, 90)
//   return (
//     <Modal maxWidth="600px" closeIcon width="100%">
//       <StyledBody>
//         <Typography variant="h5">Followers</Typography>
//         <Stack spacing={isSmDown ? 10 : 19} mt={20}>
//           {accountFollowersList?.map(item => (
//             <Box
//               display={'grid'}
//               gridTemplateColumns="1fr 1fr 1.3fr"
//               gap={'10px 5px'}
//               alignItems={'center'}
//               justifyContent="center"
//               key={item.userId}
//             >
//               <>
//                 <Link
//                   underline="none"
//                   target={'_blank'}
//                   sx={{ cursor: 'pointer' }}
//                   onClick={() => {
//                     hideModal()
//                     navigate(routes._Profile + `/${item.account}`)
//                   }}
//                 >
//                   <Box display={'flex'} alignItems="center">
//                     <Avatar src={item.accountLogo} sx={{ width: { xs: 20, sm: 30 }, height: { xs: 20, sm: 30 } }} />
//                     <StyledListText ml={4}>{item.nickname || 'unnamed'}</StyledListText>
//                   </Box>
//                 </Link>
//                 <StyledListText>{shortenAddress(item.account)}</StyledListText>
//                 <StyledListText textAlign={'right'}>{item.relation}</StyledListText>
//               </>
//             </Box>
//           ))}
//           {loading && <Loading />}
//           {!accountFollowersList.length && !loading && <EmptyData />}
//           <Box display={'flex'} justifyContent="center">
//             <Pagination
//               count={page.totalPage}
//               page={page.currentPage}
//               onChange={(_, value) => page.setCurrentPage(value)}
//             />
//           </Box>
//         </Stack>
//       </StyledBody>
//     </Modal>
//   )
// }

// function AccountFollowingList({ userId }: { userId: number | undefined }) {
//   const { result: accountFollowingList, page, loading } = useAccountFollowingList(userId)
//   const { hideModal } = useModal()
//   const navigate = useNavigate()
//   const isSmDown = useBreakpoint('sm')
//   return (
//     <Modal maxWidth="600px" closeIcon width="100%">
//       <StyledBody>
//         <Typography variant="h5">Following</Typography>
//         <Stack spacing={isSmDown ? 10 : 19} mt={20}>
//           {accountFollowingList.map(item => (
//             <Box
//               display={'grid'}
//               gridTemplateColumns="1fr 1fr 1.3fr"
//               gap={'10px 5px'}
//               alignItems={'center'}
//               justifyContent="center"
//               key={item.userId}
//             >
//               <>
//                 <Link
//                   underline="none"
//                   target={'_blank'}
//                   sx={{ cursor: 'pointer' }}
//                   onClick={() => {
//                     hideModal()
//                     navigate(routes._Profile + `/${item.account}`)
//                   }}
//                 >
//                   <Box display={'flex'} alignItems="center">
//                     <Avatar src={item.accountLogo} sx={{ width: { xs: 20, sm: 30 }, height: { xs: 20, sm: 30 } }} />
//                     <StyledListText ml={4}>{item.nickname || 'unnamed'}</StyledListText>
//                   </Box>
//                 </Link>
//                 <StyledListText>{shortenAddress(item.account)}</StyledListText>
//                 <StyledListText textAlign={'right'}>{item.relation}</StyledListText>
//               </>
//             </Box>
//           ))}
//           {loading && <Loading />}
//           {!accountFollowingList.length && !loading && <EmptyData />}
//           <Box display={'flex'} justifyContent="center">
//             <Pagination
//               count={page.totalPage}
//               page={page.currentPage}
//               onChange={(_, value) => page.setCurrentPage(value)}
//             />
//           </Box>
//         </Stack>
//       </StyledBody>
//     </Modal>
//   )
// }
