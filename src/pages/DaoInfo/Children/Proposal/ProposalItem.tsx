import { Box, Link, Skeleton, styled, Typography, useTheme } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { AdminTagBlock } from 'pages/DaoInfo/ShowAdminTag'
import { ProposalListBaseProp } from 'hooks/useBackedProposalServer'
import { useProposalBaseInfo } from 'hooks/useProposalInfo'
import { getEtherscanLink, shortenAddress } from 'utils'
import ShowProposalStatusTag from './ShowProposalStatusTag'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'

const StyledCard = styled(Box)(({ theme }) => ({
  padding: '24px',
  cursor: 'pointer',
  border: `1px solid ${theme.bgColor.bg2}`,
  borderRadius: theme.borderRadius.default,
  boxShadow: theme.boxShadow.bs2,
  transition: 'all 0.5s',
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

export default function ProposalItem({ daoChainId, daoAddress, proposalId }: ProposalListBaseProp) {
  const theme = useTheme()
  const history = useHistory()
  const proposalBaseInfo = useProposalBaseInfo(daoAddress, daoChainId, proposalId)

  return (
    <StyledCard
      onClick={() => history.push(routes._DaoInfo + `/${daoChainId}/${daoAddress}/proposal/detail/${proposalId}`)}
    >
      <Box display={'grid'} gridTemplateColumns="1fr 20px" gap={'10px'} alignItems="center">
        {proposalBaseInfo ? (
          <>
            <Typography variant="h5" noWrap>
              {proposalBaseInfo.title}
            </Typography>
            <KeyboardArrowRightIcon />
          </>
        ) : (
          <>
            <Skeleton animation="wave" />
          </>
        )}
      </Box>
      {proposalBaseInfo ? (
        <Typography className="content" variant="body1">
          Build decentralized automated organization, Build decentralized automated organization...Build decentralized
          automated organization, Build decentralized automated organization...
        </Typography>
      ) : (
        <>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </>
      )}
      <RowCenter mt={16}>
        <RowCenter>
          {proposalBaseInfo ? (
            <>
              <Link
                underline="hover"
                href={getEtherscanLink(daoChainId, proposalBaseInfo?.creator || '', 'address')}
                target="_blank"
              >
                <Typography fontSize={16} fontWeight={600} mr={8} color={theme.palette.text.primary}>
                  {proposalBaseInfo?.creator && shortenAddress(proposalBaseInfo.creator)}
                </Typography>
              </Link>
              <AdminTagBlock daoAddress={daoAddress} chainId={daoChainId} account={proposalBaseInfo.creator} />
            </>
          ) : (
            <Skeleton animation="wave" width={100} />
          )}
        </RowCenter>
        <RowCenter>
          {proposalBaseInfo ? (
            <>
              <Typography color={theme.textColor.text1} fontSize={14}>
                {proposalBaseInfo.targetTimeString}
              </Typography>
              <ShowProposalStatusTag status={proposalBaseInfo.status} />
            </>
          ) : (
            <Skeleton animation="wave" width={100} />
          )}
        </RowCenter>
      </RowCenter>
    </StyledCard>
  )
}
