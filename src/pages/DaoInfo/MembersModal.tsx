import { Preview } from '@mui/icons-material'
import { Avatar, Box, Stack, styled, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material'
import EmptyData from 'components/EmptyData'
import Copy from 'components/essential/Copy'
import Loading from 'components/Loading'
import Modal from 'components/Modal'
import Pagination from 'components/Pagination'
import { useJoinDaoMembersLogs } from 'hooks/useBackedDaoServer'
import { shortenAddress } from 'utils'
import { timeStampToFormat } from 'utils/dao'

const StyledBody = styled(Box)({
  minHeight: 200,
  padding: '40px 32px'
})

export default function MembersModal({ chainId, daoAddress }: { chainId: number; daoAddress: string }) {
  const { page, loading, result } = useJoinDaoMembersLogs(chainId, daoAddress)

  return (
    <Modal maxWidth="600px" closeIcon width="100%">
      <StyledBody>
        <Typography mb={20} fontWeight={500} variant="h6">
          Member Logs
        </Typography>
        {loading ? (
          <Loading />
        ) : !result.length ? (
          <EmptyData />
        ) : (
          <>
            <Box display="grid" gridTemplateColumns={'3fr 4fr 30px'} alignItems="center" gap="10px">
              {result.map(item => (
                <>
                  <Box display={'flex'} alignItems="center">
                    <Avatar src={item.accountLogo}></Avatar>
                    <Typography ml={6}>{shortenAddress(item.account)}</Typography>
                  </Box>
                  <Typography>
                    {item.operate === 'join' ? 'Joined ' : item.operate === 'quit' ? 'Leaved ' : 'Created '} at{' '}
                    {timeStampToFormat(item.timestamp)}
                  </Typography>
                  <LightTooltip
                    title={
                      <Stack spacing={15}>
                        <Typography>
                          Message: {item.message} <Copy toCopy={item.message} />
                        </Typography>
                        <Typography>
                          User Signature: {item.signature} <Copy toCopy={item.signature} />
                        </Typography>
                      </Stack>
                    }
                  >
                    <Preview />
                  </LightTooltip>
                </>
              ))}
            </Box>
            <Box mt={20} display={'flex'} justifyContent="center">
              <Pagination
                count={page.totalPage}
                page={page.currentPage}
                onChange={(_, value) => page.setCurrentPage(value)}
              />
            </Box>
          </>
        )}
      </StyledBody>
    </Modal>
  )
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.secondary,
    padding: '20px',
    borderRadius: '16px',
    boxShadow: theme.boxShadow.bs2,
    fontSize: 11
  }
}))
