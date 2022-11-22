import { Box, Stack, Typography } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import Input from 'components/Input'
import Loading from 'components/Loading'
import { ChainId } from 'constants/chain'
import { useBackedDaoAdmins } from 'hooks/useBackedDaoServer'
import { DaoAdminLevelProp, useDaoAdminLevel } from 'hooks/useDaoInfo'
import ShowAdminTag, { AdminTagListBlock } from 'pages/DaoInfo/ShowAdminTag'
import { useParams } from 'react-router-dom'
import { StyledItem } from '../About'
import { useSetDaoAdminCallback, useSuperAdminTransferOwnershipCallback } from 'hooks/useGovernanceDaoCallback'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useCallback, useMemo, useState } from 'react'
import { isAddress } from 'utils'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import useBreakpoint from 'hooks/useBreakpoint'

export default function Admin() {
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const [addAddress, setAddAddress] = useState('')
  const [appendAccounts, setAppendAccounts] = useState<string[]>([])
  const { chainId, account, library } = useActiveWeb3React()
  const isSmDown = useBreakpoint('sm')

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

  const switchNetwork = useCallback(() => {
    triggerSwitchChain(library, curDaoChainId, account || '')
  }, [account, curDaoChainId, library])

  return (
    <StyledItem style={{ padding: isSmDown ? '20px 16px' : undefined }}>
      {daoAdminLoading ? (
        <Loading />
      ) : (
        <Box
          display={'grid'}
          sx={{
            gridTemplateColumns: { sm: '1fr 1fr', xs: 'unset' }
          }}
          alignItems={'center'}
          gap="20px"
        >
          {daoAdminList?.map(address => (
            <AdminBlock
              removeDaoAdminCallback={removeDaoAdminCallback}
              onSuperAdminTransferCallback={onSuperAdminTransferCallback}
              switchNetwork={switchNetwork}
              key={address}
              daoChainId={curDaoChainId}
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
            <Box display={'grid'} gridTemplateColumns="150px 1fr" gap={'20px'}>
              <div>
                <ShowAdminTag level={DaoAdminLevelProp.ADMIN} />
              </div>
              <Stack spacing={12} direction="row">
                <BlackButton
                  width="92px"
                  height="24px"
                  onClick={curDaoChainId === chainId ? addDaoAdminCallback : switchNetwork}
                  disabled={!isAddress(addAddress)}
                >
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
  daoChainId,
  daoAddress,
  account,
  removeDaoAdminCallback,
  onSuperAdminTransferCallback,
  switchNetwork,
  isTransferring
}: {
  removeDaoAdminCallback: (account: string) => void
  onSuperAdminTransferCallback: (account: string) => void
  switchNetwork: () => void
  daoChainId: ChainId
  daoAddress: string
  account: string
  isTransferring: boolean
}) {
  const level = useDaoAdminLevel(daoAddress, daoChainId, account)
  const { claimSubmitted: isRemoving } = useUserHasSubmittedClaim(`${daoAddress}_setAdmin_${account}`)
  const { chainId } = useActiveWeb3React()
  const isNeedSwitch = useMemo(() => chainId !== daoChainId, [chainId, daoChainId])

  return (
    <>
      <Typography
        fontWeight={600}
        key={account}
        sx={{
          wordBreak: 'break-all',
          mb: { xs: '-15px', sm: 'unset' }
        }}
      >
        {account}
      </Typography>
      <Box
        display={'grid'}
        sx={{
          gridTemplateColumns: { sm: '150px 1fr', xs: '1fr 1fr 1fr' }
        }}
        gap={'20px'}
      >
        <div>
          <AdminTagListBlock daoAddress={daoAddress} chainId={daoChainId} account={account} />
        </div>
        {level === DaoAdminLevelProp.ADMIN && (
          <Stack spacing={12} direction="row">
            <BlackButton
              width="92px"
              height="24px"
              disabled={isTransferring}
              onClick={() => (isNeedSwitch ? switchNetwork() : onSuperAdminTransferCallback(account))}
            >
              {isTransferring ? 'Transferring' : 'Transfer'}
            </BlackButton>
            <OutlineButton
              disabled={isRemoving}
              width="92px"
              height="24px"
              onClick={() => (isNeedSwitch ? switchNetwork() : removeDaoAdminCallback(account))}
            >
              {isRemoving ? 'Removing' : 'Remove'}
            </OutlineButton>
          </Stack>
        )}
      </Box>
    </>
  )
}
