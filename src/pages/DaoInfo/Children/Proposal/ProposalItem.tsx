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

const StyledCard = styled(Box)(({ theme }) => ({
  padding: '24px',
  cursor: 'pointer',
  border: `1px solid ${theme.bgColor.bg2}`,
  borderRadius: theme.borderRadius.default,
  boxShadow: theme.boxShadow.bs2,
  transition: 'all 0.5s',
  color: '#3f5170',
  '&:hover': {
    border: `2px solid ${theme.palette.primary.main}`,
    padding: '22px'
  },
  '& .content': {
    fontSize: 14,
    height: 48,
    marginTop: 16,
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

export const RowCenter = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
})

export default function ProposalItem(props: ProposalListBaseProp) {
  return props.version === 'v1' ? <ProposalV1Item {...props} /> : <ProposalV2Item {...props} />
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
      <Box display={'flex'} justifyContent={'space-between'} mt={16}>
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
        window.open(myCliqueV1Domain + `cross_detail/${proposalInfo.daoAddressV1}/${proposalInfo.proposalId}`)
      }
    >
      {isSmDown && <Box>{Creator}</Box>}
      <Box display={'grid'} gridTemplateColumns="1fr 20px" gap={'10px'} alignItems="center">
        <Typography variant="h5" noWrap>
          {proposalInfo.title}
        </Typography>
        <KeyboardArrowRightIcon />
      </Box>
      <Typography className="content" variant="body1">
        {proposalInfo.contentV1}
      </Typography>
      <RowCenter mt={16}>
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
