import { Box, Pagination, Stack, Typography, styled } from '@mui/material'
import EmptyData from 'components/EmptyData'
import { useAddSpacesMember, useGetSpacesMemberList, useRemoveSpacesMember } from 'hooks/useBackedDaoServer'
import { ReactComponent as RemoveIcon } from 'assets/svg/removeIcon.svg'
import Modal from 'components/Modal'
import Image from 'components/Image'
import { isAddress, shortenAddress } from 'utils'
import { useCallback, useState } from 'react'
import Input from 'components/Input'
import Button from 'components/Button/Button'
import { toast } from 'react-toastify'

const StyledAddContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
})

const StyledBody = styled(Box)(({ theme }) => ({
  minHeight: 200,
  padding: '40px 32px',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'unset',
    padding: '20px 16px'
  }
}))

const StyledListText = styled(Typography)({
  fontSize: 13,
  fontWeight: 600,
  display: 'flex',
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

export default function ManageMemberModal({ spacesId }: { spacesId: number }) {
  const [rand, setRand] = useState(Math.random())
  const { result, page } = useGetSpacesMemberList(spacesId, rand)
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
    <Modal maxWidth="460px" closeIcon width="100%">
      <StyledAddContainer>
        <Input label="" width={'100%'} placeholder="0x..." value={address} onChange={e => setAddress(e.target.value)} />
        <Button onClick={addMemberClick} width="125px" height="40px" disabled={!address || !isAddress(address)}>
          Add Member
        </Button>
      </StyledAddContainer>
      <StyledBody>
        <Stack spacing={19}>
          <Typography variant="h6" fontWeight={500}>
            Manage members - 🏠 General
          </Typography>
          <Box
            display={'grid'}
            gridTemplateColumns="1fr 1fr 0.8fr"
            gap={'10px 5px'}
            alignItems={'center'}
            justifyContent="center"
          >
            {result &&
              result.map(item => (
                <>
                  <StyledListText>
                    <Image src={item.accountLogo} width={18} />
                    <Typography>{item.nickName}</Typography>
                  </StyledListText>
                  <StyledListText noWrap align="center">
                    {shortenAddress(item.account)}
                  </StyledListText>
                  <StyledListText align="right" onClick={() => removeMemberClick(item.id)}>
                    <RemoveIcon />
                    Remove
                  </StyledListText>
                </>
              ))}
          </Box>
          {!result.length && <EmptyData />}
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
