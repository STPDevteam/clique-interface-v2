import { Box, Pagination, Stack, Typography, styled } from '@mui/material'
import EmptyData from 'components/EmptyData'
import { useAddSpacesMember, useGetSpacesMemberList, useRemoveSpacesMember } from 'hooks/useBackedDaoServer'
import { ReactComponent as RemoveIcon } from 'assets/svg/removeIcon.svg'
import Avatar from 'assets/images/avatar.png'
import Modal from 'components/Modal'
import Image from 'components/Image'
import { isAddress, shortenAddress } from 'utils'
import { useCallback, useState } from 'react'
import Input from 'components/Input'
import Button from 'components/Button/Button'
import { toast } from 'react-toastify'
import { useActiveWeb3React } from 'hooks'

const StyledAddContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 125px',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  marginTop: 20
})

const StyledBody = styled(Box)(({ theme }) => ({
  minHeight: 200,
  padding: '40px 0',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'unset',
    padding: '20px 16px'
  }
}))

const StyledListText = styled(Typography)({
  fontSize: 13,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  '& img': {
    width: 18,
    height: 18,
    borderRadius: '50%'
  },
  '& p': {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: 100
  }
})

const StyledListRightText = styled(Typography)({
  fontSize: 13,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  cursor: 'pointer',
  justifyContent: 'flex-end'
})

export default function ManageMemberModal({ spacesId }: { spacesId: number }) {
  const [rand, setRand] = useState(Math.random())
  const { account } = useActiveWeb3React()
  const { result: memberList, page } = useGetSpacesMemberList(spacesId, rand)
  // const filteredList = useMemo(() => memberList.filter(item => item.account !== account?.toLocaleLowerCase()), [
  //   account,
  //   memberList
  // ])
  const [address, setAddress] = useState('')
  const remove = useRemoveSpacesMember()
  const add = useAddSpacesMember()

  const removeMemberClick = useCallback(
    (id: number) => {
      remove(id).then((res: any) => {
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'network error')
          return
        }
        setRand(Math.random())
        toast.success('Remove member success')
      })
    },
    [remove]
  )

  const addMemberClick = useCallback(() => {
    add(address, spacesId).then((res: any) => {
      if (res.data.code !== 200) {
        toast.error(res.data.msg || 'network error')
        return
      }
      setRand(Math.random())
      toast.success('Add member success')
    })
  }, [add, address, spacesId])

  return (
    <Modal maxWidth="460px" closeIcon width="100%" padding="20px 30px">
      <Typography variant="h6" fontWeight={500}>
        Manage members - 🏠 General
      </Typography>
      <StyledAddContainer>
        <Input
          label=""
          width={'287px'}
          placeholder="0x..."
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <Button onClick={addMemberClick} width="125px" height="40px" disabled={!address || !isAddress(address)}>
          Add Member
        </Button>
      </StyledAddContainer>
      <StyledBody>
        <Stack spacing={19}>
          {memberList.map(item => (
            <Box
              key={item.account}
              display={'grid'}
              gridTemplateColumns="1fr 1fr 0.8fr"
              gap={'10px 5px'}
              alignItems={'center'}
            >
              <>
                <StyledListText>
                  <Image src={item.accountLogo || Avatar} width={18} />
                  <Typography>{item.nickname || 'unnamed'}</Typography>
                </StyledListText>
                <StyledListText noWrap>{shortenAddress(item.account)}</StyledListText>
                <StyledListRightText
                  onClick={() => {
                    if (account && item.account === account.toLocaleLowerCase()) {
                      toast.error('Unable to remove yourself')
                      return
                    }
                    removeMemberClick(item.id)
                  }}
                >
                  <RemoveIcon />
                  Remove
                </StyledListRightText>
              </>
            </Box>
          ))}
          {!memberList.length && <EmptyData />}
          <Box display={'flex'} justifyContent="center">
            <Pagination
              count={page.totalPage}
              page={page.currentPage}
              onChange={(_, value) => page.setCurrentPage(value)}
            />
          </Box>
        </Stack>
      </StyledBody>
    </Modal>
  )
}
