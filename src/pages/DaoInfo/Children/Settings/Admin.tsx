import { Box, Stack, Typography } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import Input from 'components/Input'
import Loading from 'components/Loading'
import { ChainId } from 'constants/chain'
import { useBackedDaoAdmins } from 'hooks/useBackedDaoServer'
import { DaoAdminLevelProp, useDaoAdminLevel } from 'hooks/useDaoInfo'
import ShowAdminTag from 'pages/DaoInfo/ShowAdminTag'
import { useParams } from 'react-router-dom'
import { StyledItem } from '../About'
import { useSetDaoAdminCallback, useSuperAdminTransferOwnershipCallback } from 'hooks/useGovernanceDaoCallback'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useCallback, useState } from 'react'
import { isAddress } from 'utils'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'

export default function Admin() {
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const [addAddress, setAddAddress] = useState('')
  const [appendAccounts, setAppendAccounts] = useState<string[]>([])

  const { result: daoAdminList, loading: daoAdminLoading } = useBackedDaoAdmins(
    daoAddress,
    curDaoChainId,
    appendAccounts
  )

  const setDaoAdminCallback = useSetDaoAdminCallback(daoAddress)
  const { claimSubmitted: isTransferring } = useUserHasSubmittedClaim(`${daoAddress}_transferOwnership`)

  const superAdminTransferOwnershipCallback = useSuperAdminTransferOwnershipCallback(daoAddress)
  const { showModal, hideModal } = useModal()
  const addDaoAdminCallback = useCallback(() => {
    if (!addAddress) return
    showModal(<TransacitonPendingModal />)
    setDaoAdminCallback(addAddress, true)
      .then(() => {
        hideModal()
        setAppendAccounts([...appendAccounts, addAddress])
        setAddAddress('')
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [addAddress, appendAccounts, hideModal, setDaoAdminCallback, showModal])

  const removeDaoAdminCallback = useCallback(
    (account: string) => {
      showModal(<TransacitonPendingModal />)
      setDaoAdminCallback(account, false)
        .then(() => {
          hideModal()
        })
        .catch((err: any) => {
          hideModal()
          showModal(
            <MessageBox type="error">
              {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
            </MessageBox>
          )
          console.error(err)
        })
    },
    [hideModal, setDaoAdminCallback, showModal]
  )

  const onSuperAdminTransferCallback = useCallback(
    (account: string) => {
      showModal(<TransacitonPendingModal />)
      superAdminTransferOwnershipCallback(account)
        .then(() => {
          hideModal()
        })
        .catch((err: any) => {
          hideModal()
          showModal(
            <MessageBox type="error">
              {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
            </MessageBox>
          )
          console.error(err)
        })
    },
    [hideModal, showModal, superAdminTransferOwnershipCallback]
  )

  return (
    <StyledItem>
      {daoAdminLoading ? (
        <Loading />
      ) : (
        <Box display={'grid'} gridTemplateColumns="1fr 1fr" alignItems={'center'} gap="20px">
          {daoAdminList?.map(address => (
            <AdminBlock
              removeDaoAdminCallback={removeDaoAdminCallback}
              onSuperAdminTransferCallback={onSuperAdminTransferCallback}
              key={address}
              chainId={curDaoChainId}
              daoAddress={daoAddress}
              account={address}
              isTransferring={isTransferring}
            />
          ))}
          <>
            <Input
              value={addAddress}
              onChange={e => setAddAddress(e.target.value)}
              errSet={() => setAddAddress('')}
              type="address"
              placeholder="Address"
            />
            <Box display={'grid'} gridTemplateColumns="100px 1fr" gap={'20px'}>
              <div>
                <ShowAdminTag level={DaoAdminLevelProp.ADMIN} />
              </div>
              <Stack spacing={12} direction="row">
                <BlackButton width="92px" height="24px" onClick={addDaoAdminCallback} disabled={!isAddress(addAddress)}>
                  Add
                </BlackButton>
              </Stack>
            </Box>
          </>
        </Box>
      )}
    </StyledItem>
  )
}

function AdminBlock({
  chainId,
  daoAddress,
  account,
  removeDaoAdminCallback,
  onSuperAdminTransferCallback,
  isTransferring
}: {
  removeDaoAdminCallback: (account: string) => void
  onSuperAdminTransferCallback: (account: string) => void
  chainId: ChainId
  daoAddress: string
  account: string
  isTransferring: boolean
}) {
  const level = useDaoAdminLevel(daoAddress, chainId, account)
  const { claimSubmitted: isRemoving } = useUserHasSubmittedClaim(`${daoAddress}_setAdmin_${account}`)

  return (
    <>
      <Typography fontWeight={600} key={account}>
        {account}
      </Typography>
      <Box display={'grid'} gridTemplateColumns="100px 1fr" gap={'20px'}>
        <div>
          <ShowAdminTag level={level} />
        </div>
        {level === DaoAdminLevelProp.ADMIN && (
          <Stack spacing={12} direction="row">
            <BlackButton
              width="92px"
              height="24px"
              disabled={isTransferring}
              onClick={() => onSuperAdminTransferCallback(account)}
            >
              {isTransferring ? 'Transferring' : 'Transfer'}
            </BlackButton>
            <OutlineButton
              disabled={isRemoving}
              width="92px"
              height="24px"
              onClick={() => removeDaoAdminCallback(account)}
            >
              {isRemoving ? 'Removing' : 'Remove'}
            </OutlineButton>
          </Stack>
        )}
      </Box>
    </>
  )
}
