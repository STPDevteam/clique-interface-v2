import { Box, Link, Skeleton, styled, Typography, useTheme } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { AdminTagBlock } from 'pages/DaoInfo/ShowAdminTag'
import { ProposalListBaseProp } from 'hooks/useBackedProposalServer'
import { useProposalDetailInfo } from 'hooks/useProposalInfo'
import { getEtherscanLink, shortenAddress } from 'utils'
import ShowProposalStatusTag from './ShowProposalStatusTag'
import { useHistory } from 'react-router-dom'
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
  '& .content': {
    fontSize: 14,
    height: 48,
    marginTop: 6,
    overflow: 'hidden',
    color: theme.palette.text.secondary,
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
  ) : true ? (
    <ProposalV2Item {...props} />
  ) : (
    <ProposalV3Item />
  )
}

function ProposalV3Item() {
  return (
    <StyledCard>
      <RowCenter>
        <Box sx={{ display: 'flex', gap: 12 }}>
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '16px',
              color: '#97B7EF'
            }}
          >
            SIP 001
          </Typography>
          <Box
            sx={{
              width: 0,
              height: 14,
              border: ' 1px solid #D4D7E2'
            }}
          ></Box>
          <Typography variant="body1" sx={{ lineHeight: '18px', color: '#97B7EF' }}>
            4 days left
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            height: 20,
            width: 70,
            borderRadius: '18px',
            background: '#21C431',
            color: '#fff',
            textAlign: 'center'
          }}
        >
          Open
        </Typography>
      </RowCenter>
      <Typography
        className="content"
        variant="h6"
        sx={{ mt: '13px  !important', fontSize: '18px !important', color: '#3F5170 !important' }}
      >
        Provide lunch with love for children in mountains areas Provide lunch with love for children in mountains areas
        Provide lunch with love for children in mountains areas Provide lunch with love for children in mountains areas
      </Typography>
      <RowCenter sx={{ mt: 10 }}>
        <Box sx={{ width: 115, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Image height={20} width={20} src={avatar} />
          <Typography variant="body1" sx={{ lineHeight: '20px' }}>
            UserName
          </Typography>
          <AdminIcon
            sx={{
              'path:first-of-type': {
                fill: '#0049C6'
              }
            }}
          />
        </Box>

        {false ? (
          <Typography sx={{ fontWeight: 800, color: '#0049C6' }} variant="h5">
            2,320,927,142 Votes
          </Typography>
        ) : (
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
              PASSED
            </Typography>
          </Box>
        )}
      </RowCenter>
    </StyledCard>
  )
}

function ProposalV2Item({ daoChainId, daoAddress, proposalId }: ProposalListBaseProp) {
  const theme = useTheme()
  const history = useHistory()
  const isSmDown = useBreakpoint('sm')
  const proposalInfo = useProposalDetailInfo(daoAddress, daoChainId, proposalId)

  const Creator = useMemo(() => {
    return proposalInfo ? (
      <>
        <Link
          underline="hover"
          href={getEtherscanLink(daoChainId, proposalInfo?.creator || '', 'address')}
          target="_blank"
        >
          <Typography fontSize={12} fontWeight={600} mr={8} color={theme.palette.text.primary}>
            {proposalInfo?.creator && shortenAddress(proposalInfo.creator)}
          </Typography>
        </Link>
        <AdminTagBlock daoAddress={daoAddress} chainId={daoChainId} account={proposalInfo.creator} />
      </>
    ) : (
      <Skeleton animation="wave" width={100} />
    )
  }, [daoAddress, daoChainId, proposalInfo, theme.palette.text.primary])

  return (
    <StyledCard
      onClick={() => history.push(routes._DaoInfo + `/${daoChainId}/${daoAddress}/proposal/detail/${proposalId}`)}
    >
      {isSmDown && (
        <Box mb={8} display={'flex'} alignItems="center">
          {Creator}
        </Box>
      )}
      <Box display={'grid'} gridTemplateColumns="1fr 20px" gap={'10px'} alignItems="center">
        {proposalInfo ? (
          <>
            <Typography variant="h5" noWrap>
              {proposalInfo.title}
            </Typography>
            <KeyboardArrowRightIcon />
          </>
        ) : (
          <>
            <Skeleton animation="wave" />
          </>
        )}
      </Box>
      {proposalInfo ? (
        <Typography className="content" variant="body1">
          {proposalInfo.introduction}
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
          {proposalInfo ? (
            <>
              <Typography color={theme.textColor.text1} fontSize={12}>
                {proposalInfo.targetTimeString}
              </Typography>
              <ShowProposalStatusTag status={proposalInfo.status} />
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
      <Link
        underline="hover"
        href={getEtherscanLink(proposalInfo.daoChainId, proposalInfo.proposer, 'address')}
        target="_blank"
      >
        <Typography fontSize={16} fontWeight={600} mr={8} color={theme.palette.text.primary}>
          {proposalInfo?.proposer && shortenAddress(proposalInfo.proposer)}
        </Typography>
      </Link>
    ),
    [proposalInfo.daoChainId, proposalInfo.proposer, theme.palette.text.primary]
  )

  return (
    <StyledCard
      onClick={() =>
        window.open(myCliqueV1Domain + `cross_detail/${proposalInfo.v1V2DaoAddress}/${proposalInfo.proposalId}`)
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
            <ShowProposalStatusTag status={proposalInfo.status} />
          </>
        </RowCenter>
      </RowCenter>
    </StyledCard>
  )
}
