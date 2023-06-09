// import Button from 'components/Button/Button'
import Modal from 'components/Modal'
import { Typography, Box, styled, Link, useTheme, Alert } from '@mui/material'
import Input from 'components/Input'
import { BlackButton } from 'components/Button/Button'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ChainSelect from 'components/Select/ChainSelect'
import { ChainList, ChainListMap } from 'constants/chain'
import InputNumerical from 'components/Input/InputNumerical'
import { toFormatGroup } from 'utils/dao'
import TokenRow from './TokenRow'
import VotingTypesSelect from './VotingTypesSelect'
import CategoriesSelect from './CategoriesSelect'
import OutlineButton from 'components/Button/OutlineButton'
import DateTimeSet from './DateTimeSet'
import UploadImage from 'components/UploadImage'
import { useBuildingDaoDataCallback } from 'state/buildingGovDao/hooks'
import { isAddress, removeEmoji } from 'utils'
import { useTokenByChain } from 'state/wallet/hooks'
import { useCreateDaoCallback } from 'hooks/useGovernanceDaoCallback'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { routes } from 'constants/routes'
import { useDaoHandleQuery } from 'hooks/useBackedDaoServer'
import useBreakpoint from 'hooks/useBreakpoint'
import { ChainId } from 'constants/chain'

const StyledBody = styled(Box)(({ theme }) => ({
  minHeight: 200,
  padding: '40px 32px',
  [theme.breakpoints.down('sm')]: {
    padding: '30px 16px 30px'
  }
}))

enum CreateGovernanceStep {
  BASE_INFO,
  CONFIG
}

export function CreateGovernanceModal() {
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')
  const { buildingDaoData, updateBuildingDaoKeyData } = useBuildingDaoDataCallback()
  const [step, setStep] = useState<CreateGovernanceStep>(CreateGovernanceStep.BASE_INFO)
  const { account, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const queryHandleCallback = useDaoHandleQuery()

  useEffect(() => {
    queryHandleCallback(account ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createDaoCallback = useCreateDaoCallback()
  const { showModal } = useModal()

  const onCreateDao = useCallback(() => {
    showModal(<TransacitonPendingModal />)
    createDaoCallback()
      .then(hash => {
        showModal(<TransactionSubmittedModal hash={hash} />)
      })
      .catch((err: any) => {
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [createDaoCallback, showModal])

  const baseNextHandler = useMemo(() => {
    if (!buildingDaoData.daoName.trim()) {
      return {
        disabled: true,
        error: 'Dao name required'
      }
    }
    if (!buildingDaoData.daoLogo) {
      return {
        disabled: true,
        error: 'Dao logo required'
      }
    }
    if (!buildingDaoData.handle.trim()) {
      return {
        disabled: true,
        error: 'DAO Handle on Clique required'
      }
    }
    if (!buildingDaoData.bio.trim()) {
      return {
        disabled: true,
        error: 'Description required'
      }
    }
    if (!buildingDaoData.category) {
      return {
        disabled: true,
        error: 'Categories required'
      }
    }
    if (!account) {
      return {
        disabled: true,
        error: (
          <>
            You need to{' '}
            <Link sx={{ cursor: 'pointer' }} onClick={toggleWalletModal}>
              connect
            </Link>{' '}
            your wallet
          </>
        )
      }
    }
    // if (daoHandleAvailable !== true) {
    //   return {
    //     disabled: true,
    //     error: 'DAO Handle on Clique unavailable'
    //   }
    // }
    return {
      disabled: false,
      handler: () => setStep(CreateGovernanceStep.CONFIG)
    }
  }, [
    account,
    buildingDaoData.bio,
    buildingDaoData.category,
    buildingDaoData.daoLogo,
    buildingDaoData.daoName,
    buildingDaoData.handle,
    toggleWalletModal
  ])

  const govToken = useTokenByChain(
    isAddress(buildingDaoData.governance[0].tokenAddress) ? buildingDaoData.governance[0].tokenAddress : undefined,
    buildingDaoData.governance[0].chainId
  )

  const currentBaseChain = useMemo(
    () => (buildingDaoData.governance[0].chainId ? ChainListMap[buildingDaoData.governance[0].chainId] || null : null),
    [buildingDaoData.governance]
  )

  const nextBuildHandler = useMemo(() => {
    if (
      !buildingDaoData.daoName.trim() ||
      !buildingDaoData.handle.trim() ||
      !buildingDaoData.bio.trim() ||
      !buildingDaoData.daoLogo
    ) {
      return {
        disabled: true,
        error: 'Basic data required'
      }
    }
    if (!buildingDaoData.governance[0].chainId) {
      return {
        disabled: true,
        error: 'Network required'
      }
    }
    if (!govToken?.token) {
      return {
        disabled: true,
        error: 'Token required'
      }
    }
    if (!buildingDaoData.governance[0].createRequire) {
      return {
        disabled: true,
        error: 'Minimum tokens needed to create proposal required'
      }
    }
    // if (!buildingDaoData.executeMinimum) {
    //   return {
    //     disabled: true,
    //     error: 'Minimum votes needed for proposal to execute required'
    //   }
    // }
    // if (!buildingDaoData.defaultVotingPeriod) {
    //   return {
    //     disabled: true,
    //     error: 'Default voting period required'
    //   }
    // }
    if (buildingDaoData.votingType === undefined) {
      return {
        disabled: true,
        error: 'Voting types required'
      }
    }
    if (!account) {
      return {
        disabled: true,
        error: (
          <>
            You need to{' '}
            <Link sx={{ cursor: 'pointer' }} onClick={toggleWalletModal}>
              connect
            </Link>{' '}
            your wallet
          </>
        )
      }
    }
    return {
      disabled: false,
      handler: onCreateDao
    }
  }, [account, buildingDaoData, govToken?.token, onCreateDao, toggleWalletModal])

  return (
    <Modal maxWidth="628px" closeIcon width="100%" overflow="hidden">
      <StyledBody>
        <Typography variant="h5" textAlign={'center'}>
          Add your DAO
        </Typography>
        <Typography pb={8} variant="body1" textAlign={'center'} fontWeight={400} color={theme.palette.text.secondary}>
          If your DAO is not on chain yet, please{' '}
          <Link
            target={'_blank'}
            underline="none"
            href="https://stp-dao.gitbook.io/verse-network/clique/how-to-create-a-dao"
          >
            click here
          </Link>
        </Typography>

        <Box
          sx={{
            maxHeight: `calc(100vh - ${theme.height.header} - 150px)`,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          {step === CreateGovernanceStep.BASE_INFO && (
            <Box>
              <UploadImage
                sx={{ margin: '30px auto' }}
                size={156}
                onChange={val => updateBuildingDaoKeyData('daoLogo', val)}
                value={buildingDaoData.daoLogo}
              />
              <Box display={'grid'} gap="16px">
                <Input
                  label="*DAO Name"
                  maxLength={30}
                  placeholder="No duplicates in Clique"
                  endAdornment={
                    <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2">
                      {buildingDaoData.daoName.length}/30
                    </Typography>
                  }
                  value={buildingDaoData.daoName}
                  onChange={e => updateBuildingDaoKeyData('daoName', removeEmoji(e.target.value || ''))}
                />
                <Input
                  label="*DAO Handle On Clique"
                  placeholder="Lowercase characters, numbers, underscores"
                  userPattern={'^[0-9a-z_]*$'}
                  maxLength={30}
                  // error={daoHandleAvailable === false}
                  onBlur={() => queryHandleCallback(account ?? '')}
                  endAdornment={
                    <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2">
                      {buildingDaoData.handle.length}/30
                    </Typography>
                  }
                  value={buildingDaoData.handle}
                  onChange={e => updateBuildingDaoKeyData('handle', removeEmoji(e.target.value || '').replace(' ', ''))}
                />
                <Input
                  type="textarea"
                  label="*Description"
                  maxLength={1000}
                  endAdornment={
                    <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2">
                      {buildingDaoData.bio.length}/1000
                    </Typography>
                  }
                  rows="6"
                  multiline
                  placeholder="Describe your DAO to new and existing members"
                  value={buildingDaoData.bio}
                  onChange={e => updateBuildingDaoKeyData('bio', e.target.value || '')}
                />
                <CategoriesSelect
                  value={buildingDaoData.category.join(',')}
                  onChange={val => updateBuildingDaoKeyData('category', val)}
                />

                {baseNextHandler.error && <Alert severity="error">{baseNextHandler.error}</Alert>}

                <Box mt={20} display="center" justifyContent={'center'}>
                  <BlackButton width="166px" disabled={baseNextHandler.disabled} onClick={baseNextHandler.handler}>
                    Next
                  </BlackButton>
                </Box>
              </Box>
            </Box>
          )}

          {step === CreateGovernanceStep.CONFIG && (
            <Box mt={24} display={'grid'} gap="16px">
              <ChainSelect
                chainList={ChainList.filter(
                  v =>
                    v.id !== ChainId.POLYGON_MANGO &&
                    v.id !== ChainId.COINBASE_TESTNET &&
                    v.id !== ChainId.ZetaChain_TESTNET &&
                    v.id !== ChainId.ZKSYNC_ERA &&
                    v.id !== ChainId.ZKSYNC_ERA_TESTNET
                )}
                selectedChain={currentBaseChain}
                onChange={e => updateBuildingDaoKeyData('chainID', e?.id || null)}
                label="*Network"
              />
              <Input
                type="address"
                value={buildingDaoData.tokenAddr}
                errSet={() => updateBuildingDaoKeyData('tokenAddr', '')}
                onChange={e => updateBuildingDaoKeyData('tokenAddr', e.target.value || '')}
                placeholder="0x"
                label="*Token Contract Address"
                rightLabel={<Link underline="none" href={routes.CreatorToken}>{`Create A New Token>`}</Link>}
              />
              <TokenRow totalSupply={govToken?.totalSupply} />
              <InputNumerical
                noDecimals
                label="*Minimum Tokens Needed To Create Proposal"
                placeholder="100,000"
                showFormatWrapper={() =>
                  buildingDaoData.governance[0].createRequire
                    ? toFormatGroup(buildingDaoData.governance[0].createRequire)
                    : ''
                }
                value={buildingDaoData.createProposalMinimum}
                onChange={e => updateBuildingDaoKeyData('createProposalMinimum', e.target.value || '')}
              />
              <InputNumerical
                noDecimals
                label="*Minimum Votes Needed For Proposal To Execute"
                placeholder="100,000"
                showFormatWrapper={() =>
                  buildingDaoData.executeMinimum ? toFormatGroup(buildingDaoData.executeMinimum) : ''
                }
                value={buildingDaoData.executeMinimum}
                onChange={e => updateBuildingDaoKeyData('executeMinimum', e.target.value || '')}
              />
              <DateTimeSet
                value={buildingDaoData.votingPeriod}
                onUpdate={num => updateBuildingDaoKeyData('votingPeriod', num)}
              />
              <VotingTypesSelect
                value={buildingDaoData.votingType}
                onChange={e => updateBuildingDaoKeyData('votingType', e.target.value)}
              />

              {nextBuildHandler.error ? (
                <Alert severity="error">{nextBuildHandler.error}</Alert>
              ) : (
                <Alert severity="info">You will create a DAO in {chainId ? ChainListMap[chainId]?.name : '--'}</Alert>
              )}

              <Box mt={20} display="flex" justifyContent={{ sm: 'center', xs: 'space-evenly' }} gap="40px">
                <OutlineButton
                  noBold
                  width={isSmDown ? '130px' : '166px'}
                  height={36}
                  onClick={() => setStep(CreateGovernanceStep.BASE_INFO)}
                >
                  Back
                </OutlineButton>
                <BlackButton
                  width={isSmDown ? '138px' : '166px'}
                  disabled={nextBuildHandler.disabled}
                  onClick={nextBuildHandler.handler}
                >
                  Add DAO
                </BlackButton>
              </Box>
            </Box>
          )}
        </Box>
      </StyledBody>
    </Modal>
  )
}
