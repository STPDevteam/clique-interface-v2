import { Box, Link, Skeleton, styled, Typography, useTheme } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { AdminTagBlock } from 'pages/DaoInfo/ShowAdminTag'
import { ProposalListBaseProp } from 'hooks/useBackedProposalServer'
import { formatNumberWithCommas, getEtherscanLink, shortenAddress } from 'utils'
import ShowProposalStatusTag from './ShowProposalStatusTag'
import { ShowProposalStatusV3Tag } from './ShowProposalStatusTag'
import { useHistory, useParams } from 'react-router-dom'
import { routes } from 'constants/routes'
import { myCliqueV1Domain } from '../../../../constants'
import useBreakpoint from 'hooks/useBreakpoint'
import { useMemo } from 'react'
import Image from 'components/Image'
import avatar from 'assets/images/avatar.png'
import { ReactComponent as adminIcon } from 'assets/svg/admin_icon.svg'

const StyledCard = styled(Box)(({ theme }) => ({
  padding: '19px 24px',
  width: 460,
  height: 150,
  cursor: 'pointer',
  border: `1px solid ${theme.bgColor.bg2}`,
  borderRadius: theme.borderRadius.default,
  boxShadow: theme.boxShadow.bs2,
  transition: 'all 0.5s',
  color: '#3f5170',
  '&:hover': {
    border: `1px solid #97B7EF`,
    padding: '22px'
  },
  '&:hover .AdminIcon path': {
    fill: '#0049C6'
  },
  '& .content': {
    fontSize: 18,
    height: 48,
    marginTop: 6,
    fontWeight: 600,
    overflow: 'hidden',
    color: '#3F5170',
    textOverflow: 'ellipsis',
    width: '100%',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': '2',
    wordBreak: 'break-all'
  }
}))

const AdminIcon = styled(adminIcon)(() => ({
  'path:first-of-type': {
    fill: '#97B7EF'
  }
}))

export const RowCenter = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
})

export default function ProposalItem(props: ProposalListBaseProp) {
  return props.version === 'v1' ? (
    <ProposalV1Item {...props} />
  ) : props.version === 'v2' ? (
    <ProposalV2Item {...props} />
  ) : (
    <ProposalV3Item {...props} />
  )
}

function ProposalV3Item(props: ProposalListBaseProp) {
  const history = useHistory()
  const { daoId: daoId } = useParams<{ daoId: string }>()
  const curDaoId = Number(daoId)

  return (
    <StyledCard onClick={() => history.push(routes._DaoInfo + `/${curDaoId}/proposal/detail/${props.proposalId}`)}>
      <RowCenter>
        <Box sx={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '16px',
              color: '#97B7EF'
            }}
          >
            SIP {props.proposalSIP}
          </Typography>
          <Box
            sx={{
              width: 0,
              height: 14,
              border: ' 1px solid #D4D7E2'
            }}
          ></Box>
          <Typography variant="body1" sx={{ lineHeight: '18px', color: '#97B7EF' }}>
            {props.targetTimeString}
          </Typography>
        </Box>
        <ShowProposalStatusV3Tag status={props.status} />
      </RowCenter>
      <Typography
        className="content"
        variant="h6"
        sx={{ mt: '13px  !important', fontSize: '18px !important', color: '#3F5170 !important' }}
      >
        {props.title}
      </Typography>
      <RowCenter sx={{ mt: 10 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 6 }}
          onClick={e => {
            history.push(routes._Profile + `/${props.proposer.account}`)
            e.stopPropagation()
          }}
        >
          <Image
            height={20}
            width={20}
            style={{ border: '1px solid #D4DCE2', borderRadius: '50%' }}
            src={props.proposer?.avatar || avatar}
          />
          <Typography variant="body1" noWrap sx={{ lineHeight: '20px', maxWidth: 80 }}>
            {props.proposer?.nickname || 'unnamed'}
          </Typography>
          <AdminIcon className="AdminIcon" />
        </Box>
        {props.status === 2 && props.votes > 0 ? (
          <Typography sx={{ fontWeight: 800, color: '#0049C6' }} variant="h5">
            {formatNumberWithCommas(props.votes)} Votes
          </Typography>
        ) : props.status === 3 && props.isPass === 'Success' ? (
          <>
            <Box
              sx={{
                width: 100,
                height: 30,
                background: '#21C431',
                borderRadius: '6px',
                padding: 2
              }}
            >
              <Typography
                sx={{
                  height: '100%',
                  fontWeight: 700,
                  fontSize: 17,
                  lineHeight: '20px',
                  border: ' 1px solid #FFFFFF',
                  borderRadius: '5px',
                  background: '#21C431',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Success
              </Typography>
            </Box>
          </>
        ) : (
          ''
        )}
        {
          // : props.status === 3 && props.isPass === 'Failed' ? (
          //   <Box
          //     sx={{
          //       width: 100,
          //       height: 30,
          //       background: '#80829F',
          //       borderRadius: '6px',
          //       padding: 2
          //     }}
          //   >
          //     <Typography
          //       sx={{
          //         height: '100%',
          //         fontWeight: 700,
          //         fontSize: 17,
          //         lineHeight: '20px',
          //         border: ' 1px solid #FFFFFF',
          //         borderRadius: '5px',
          //         background: '#80829F',
          //         color: '#FFFFFF',
          //         display: 'flex',
          //         alignItems: 'center',
          //         justifyContent: 'center'
          //       }}
          //     >
          //       Failed
          //     </Typography>
          //   </Box>
          // )
        }
      </RowCenter>
    </StyledCard>
  )
}

function ProposalV2Item(props: ProposalListBaseProp) {
  const history = useHistory()
  const isSmDown = useBreakpoint('sm')
  const { daoId: daoId } = useParams<{ daoId: string }>()
  const curDaoId = Number(daoId)

  const Creator = useMemo(() => {
    return props && props.v1V2ChainId ? (
      <>
        <Link
          underline="hover"
          href={getEtherscanLink(props.v1V2ChainId, props.proposer.account || '', 'address')}
          target="_blank"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Image
              height={20}
              width={20}
              style={{ border: '1px solid #D4DCE2', borderRadius: '50%' }}
              src={props.proposer?.avatar || avatar}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Typography variant="body1" noWrap sx={{ lineHeight: '20px', maxWidth: 80 }}>
                {props.proposer?.nickname || 'unnamed'}
              </Typography>
              <AdminIcon className="AdminIcon" />
            </Box>
          </Box>
        </Link>
        <AdminTagBlock daoAddress={props.daoAddress} chainId={props.v1V2ChainId} account={props.proposer.account} />
      </>
    ) : (
      <Skeleton animation="wave" width={100} />
    )
  }, [props])

  return (
    <StyledCard onClick={() => history.push(routes._DaoInfo + `/${curDaoId}/proposal/detail/${props.proposalId}`)}>
      {isSmDown && (
        <Box mb={8} display={'flex'} alignItems="center">
          {Creator}
        </Box>
      )}
      <Box display={'grid'} gap={'10px'} alignItems="center">
        {props ? (
          <Box
            sx={{
              display: 'grid',
              justifyContent: 'space-between',
              alignItems: 'center',
              gridTemplateColumns: '1fr 70px'
            }}
          >
            <Box sx={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '16px',
                  color: '#97B7EF'
                }}
              >
                SIP {props.proposalSIP}
              </Typography>
              <Box
                sx={{
                  width: 0,
                  height: 14,
                  border: ' 1px solid #D4D7E2'
                }}
              ></Box>
              <Typography variant="body1" sx={{ lineHeight: '18px', color: '#97B7EF' }}>
                {props.targetTimeString}
              </Typography>
            </Box>
            <ShowProposalStatusV3Tag status={props.status} />
          </Box>
        ) : (
          <>
            <Skeleton animation="wave" />
          </>
        )}
      </Box>
      {props ? (
        <Typography className="content" variant="body1">
          {props.title}
        </Typography>
      ) : (
        <>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </>
      )}
      <Box display={'flex'} justifyContent={'space-between'} mt={6}>
        <RowCenter sx={{ color: '#3f5170' }}>{!isSmDown && Creator}</RowCenter>
        <RowCenter>
          {props ? (
            <>
              {props.status === 2 && props.votes > 0 ? (
                <Typography sx={{ fontWeight: 800, color: '#0049C6' }} variant="h5">
                  {formatNumberWithCommas(props.votes)} Votes
                </Typography>
              ) : props.status === 3 && props.isPass === 'Success' ? (
                <>
                  <Box
                    sx={{
                      width: 100,
                      height: 30,
                      background: '#21C431',
                      borderRadius: '6px',
                      padding: 2
                    }}
                  >
                    <Typography
                      sx={{
                        height: '100%',
                        fontWeight: 700,
                        fontSize: 17,
                        lineHeight: '20px',
                        border: ' 1px solid #FFFFFF',
                        borderRadius: '5px',
                        background: '#21C431',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      Success
                    </Typography>
                  </Box>
                </>
              ) : props.status === 3 && props.isPass === 'Failed' ? (
                <Box
                  sx={{
                    width: 100,
                    height: 30,
                    background: '#80829F',
                    borderRadius: '6px',
                    padding: 2
                  }}
                >
                  <Typography
                    sx={{
                      height: '100%',
                      fontWeight: 700,
                      fontSize: 17,
                      lineHeight: '20px',
                      border: ' 1px solid #FFFFFF',
                      borderRadius: '5px',
                      background: '#80829F',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    Failed
                  </Typography>
                </Box>
              ) : (
                ''
              )}
            </>
          ) : (
            <Skeleton animation="wave" width={100} />
          )}
        </RowCenter>
      </Box>
    </StyledCard>
  )
}

function ProposalV1Item(proposalInfo: ProposalListBaseProp) {
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')

  const Creator = useMemo(
    () => (
      // <Link
      //   underline="hover"
      //   href={
      //     proposalInfo.proposer
      //       ? getEtherscanLink(proposalInfo.v1V2ChainId, proposalInfo.proposer.account, 'address')
      //       : undefined
      //   }
      //   target="_blank"
      // >
      //   <Typography fontSize={16} fontWeight={600} mr={8} color={theme.palette.text.primary}>
      //     {proposalInfo?.proposer.account && shortenAddress(proposalInfo.proposer.account)}
      //   </Typography>
      // </Link>
      <>
        <Typography fontSize={16} fontWeight={600} mr={8} color={theme.palette.text.primary}>
          {proposalInfo?.proposer.account && shortenAddress(proposalInfo.proposer.account)}
        </Typography>
      </>
    ),
    [proposalInfo.proposer, theme.palette.text.primary]
  )

  return (
    <StyledCard
      onClick={() =>
        window.open(myCliqueV1Domain + `cross_detail/${proposalInfo.v1V2DaoAddress}/${proposalInfo.v1V2ProposalNum}`)
      }
    >
      {isSmDown && <Box>{Creator}</Box>}
      <Box display={'grid'} gridTemplateColumns="1fr 20px" gap={'10px'} alignItems="center">
        <Typography variant="h5" noWrap fontSize={'18px!important'}>
          {proposalInfo.title}
        </Typography>
        <KeyboardArrowRightIcon />
      </Box>
      <Typography className="content" variant="body1">
        {proposalInfo.contentV1}
      </Typography>
      <RowCenter mt={6}>
        <RowCenter>{!isSmDown && Creator}</RowCenter>
        <RowCenter>
          <>
            <Typography color={'#97B7EF'} fontSize={14}>
              {proposalInfo.targetTimeString}
            </Typography>
            <ShowProposalStatusTag status={proposalInfo.isPass} />
          </>
        </RowCenter>
      </RowCenter>
    </StyledCard>
  )
}
