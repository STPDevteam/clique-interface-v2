import Modal from 'components/Modal/index'
import { Box, Typography, styled } from '@mui/material'
import Input from 'components/Input/index'
import OutlineButton from 'components/Button/OutlineButton'
import Button from 'components/Button/Button'
import useModal from 'hooks/useModal'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTokenByChain } from 'state/wallet/hooks'
import { isAddress } from 'ethers/lib/utils'
import { ChainListMap } from 'constants/chain'
// import ChainSelect from 'components/Select/ChainSelect'
import NumericalInput from 'components/Input/InputNumerical'
// import UploadImage from 'components/UploadImage'
import Image from 'components/Image'
import { useSetDaoGovernance } from 'hooks/useBackedDaoServer'
import { toast } from 'react-toastify'

const BodyBoxStyle = styled(Box)(() => ({
  padding: '13px 28px'
}))

const ContentTitleStyle = styled(Typography)(() => ({
  fontweight: 500,
  fontSize: 14,
  lineHeight: '20px',
  color: '#80829F'
}))

const ContentStyle = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: 16,
  lineHeight: '16px',
  color: '#3F5170',
  wordBreak: 'break-word'
}))

const InputStyle = styled(NumericalInput)(() => ({
  height: 40
}))
const RedText = styled(Typography)({
  color: '#E46767'
})

export interface daoInfoPops {
  name: string
  symbol: string
  require: string
  weight: number
  id: number
  logo: string
  voteTokenId: number
  token: any
}

export default function EditTokenModal({
  daoInfo,
  daoId,
  proposalThreshold,
  votingPeriod,
  votingType,
  updater
}: {
  daoInfo: daoInfoPops
  daoId: number
  proposalThreshold: number
  votingPeriod: number
  votingType: number
  updater: () => void
}) {
  const { hideModal } = useModal()
  const [tokenAddress, setTokenAddress] = useState('')
  const [requirementAmount, setRequirementAmount] = useState('')
  const [avatar, setAvatar] = useState('')
  const SetDaoGovernance = useSetDaoGovernance()
  const currentBaseChain = useMemo(() => (daoInfo?.id ? ChainListMap[daoInfo?.id] || null : null), [daoInfo?.id])

  const govToken = useTokenByChain(
    isAddress(daoInfo.token.tokenAddress) ? daoInfo.token.tokenAddress : undefined,
    daoInfo?.id ?? undefined
  )
  useEffect(() => {
    setAvatar(daoInfo.logo)
    setTokenAddress(daoInfo.token.tokenAddress)
    setRequirementAmount(daoInfo.require)
  }, [daoInfo])
  const weight = useMemo(() => {
    return {
      createRequire: requirementAmount,
      voteTokenId: daoInfo.voteTokenId,
      votesWeight: daoInfo.weight
    }
  }, [requirementAmount, daoInfo.voteTokenId, daoInfo.weight])

  const EditTokenFn = useCallback(() => {
    try {
      SetDaoGovernance(daoId, proposalThreshold, votingPeriod, votingType, [weight]).then(res => {
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'Network error')
          return
        }
        updater()
        toast.success('Update success')
        hideModal()
      })
    } catch (error) {
      toast.error(error || 'Network error')
    }
  }, [SetDaoGovernance, daoId, proposalThreshold, votingPeriod, votingType, weight, updater, hideModal])
  const voteBtn = useMemo(() => {
    if (!requirementAmount) {
      return {
        disabled: true,
        text: 'requirement',
        error: 'Please enter createRequire amount'
      }
    }
    return {
      disabled: false,
      text: ''
    }
  }, [requirementAmount])

  return (
    <Modal maxWidth="480px" width="100%" closeIcon>
      <BodyBoxStyle>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: 14,
            lineHeight: '24px',
            color: '#3F5170'
          }}
        >
          Edit Governanve Token
        </Typography>

        <Box sx={{ mt: 27, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <ContentTitleStyle sx={{ mb: 5 }}>Token logo</ContentTitleStyle>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 124,
                height: 124,
                border: '1px solid #D4D7E2',
                borderRadius: '50%'
              }}
            >
              <Image src={avatar} alt="" height={124} width={124} style={{ borderRadius: '50%' }} />
              {/* <UploadImage value={avatar} size={124} onChange={val => setAvatar(val)} /> */}
            </Box>
          </Box>
          <Box sx={{ maxWidth: '253px', width: '100%' }}>
            <ContentTitleStyle sx={{ mb: 10 }}>Network</ContentTitleStyle>
            {/* <ChainSelect             
              chainList={ChainList.filter(
                v =>
                  v.id !== ChainId.POLYGON_MANGO &&
                  v.id !== ChainId.COINBASE_TESTNET &&
                  v.id !== ChainId.ZetaChain_TESTNET &&
                  v.id !== ChainId.ZKSYNC_ERA &&
                  v.id !== ChainId.ZKSYNC_ERA_TESTNET
              )}
              selectedChain={currentBaseChain}
              label=""
            /> */}
            <Box
              sx={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                pl: 20,
                borderRadius: '8px',
                border: ' 1px solid #D4D7E2'
              }}
              height={40}
            >
              <Image src={currentBaseChain?.logo || ''} alt="" height={20} width={20} />
              <Typography sx={{ font: '600 16px/23px "Inter"' }}>{currentBaseChain?.name}</Typography>
            </Box>
            <ContentTitleStyle sx={{ mt: 10, mb: 10 }}>Token Contract Address</ContentTitleStyle>
            <Input
              readOnly
              height={40}
              placeholderSize="14px"
              placeholder={'0x...'}
              value={tokenAddress}
              onChange={e => setTokenAddress(e.target.value)}
            />
          </Box>
        </Box>
        <Box sx={{ mt: 25, display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
          <Box>
            <ContentTitleStyle sx={{ mb: 20 }}>Token name </ContentTitleStyle>
            <ContentStyle>{govToken?.token.name || '--'}</ContentStyle>
          </Box>
          <Box>
            <ContentTitleStyle sx={{ mb: 20 }}>Symbol </ContentTitleStyle>
            <ContentStyle>{govToken?.token.symbol || '--'}</ContentStyle>
          </Box>
          <Box maxWidth={'130px'}>
            <ContentTitleStyle sx={{ mb: 20 }}>Total supply</ContentTitleStyle>
            <ContentStyle>{govToken?.totalSupply.toSignificant(18, { groupSeparator: ',' }) || '--'}</ContentStyle>
          </Box>
        </Box>
        <ContentTitleStyle sx={{ mt: 14 }}>Requirement</ContentTitleStyle>
        <Box sx={{ mt: 4, display: 'grid', flexDirection: 'column', gap: 8 }}>
          <Typography variant="body1" color={'#B5B7CF'} lineHeight={'20px'}>
            Minimum Tokens Needed To Create Proposal
          </Typography>
          <InputStyle
            placeholderSize="14px"
            placeholder={'--'}
            endAdornment={
              <Typography color="#B5B7CF" lineHeight="20px" variant="body1">
                {govToken?.token.symbol}
              </Typography>
            }
            onChange={e => {
              if (Number(e.target.value) > Number(govToken?.totalSupply.toSignificant(18))) {
                setRequirementAmount(requirementAmount)
              } else {
                setRequirementAmount(e.target.value)
              }
            }}
            value={requirementAmount}
          />
          <Box
            sx={{
              height: 40,
              width: '100%',
              display: 'flex',
              border: '1px solid #D4D7E2',
              borderRadius: '8px'
            }}
          >
            <Box sx={{ display: 'flex', padding: '10px 0 10px 20px', alignItems: 'center' }}>
              <ContentTitleStyle sx={{ whiteSpace: 'nowrap' }}>Voting Weight</ContentTitleStyle>
              <Box sx={{ ml: 25, width: 0, height: 20, border: ' 0.5px solid #D4D7E2' }}></Box>
              <Typography variant="body1" sx={{ ml: 50, whiteSpace: 'nowrap', color: '#B5B7CF', lineHeight: '16px' }}>
                {govToken?.token.symbol && `1 ${govToken?.token.symbol} = `}
              </Typography>
            </Box>
            <InputStyle
              readOnly
              value={govToken?.token.symbol ? '1' : ''}
              placeholder=" "
              sx={{ border: 'none !important', background: 'transparent !important' }}
              endAdornment={
                <Typography color="#B5B7CF" lineHeight="20px" variant="body1">
                  {govToken?.token.symbol ? 'Votes' : '-'}
                </Typography>
              }
            />
          </Box>
          {voteBtn.text === 'requirement' && <RedText>{voteBtn.error}</RedText>}
          <Box sx={{ mt: 32, mb: 20, display: 'flex', justifyContent: 'space-between' }}>
            <OutlineButton
              style={{ border: '1px solid #0049C6', color: '#0049C6' }}
              width={125}
              height={40}
              onClick={hideModal}
            >
              Close
            </OutlineButton>
            <Button disabled={voteBtn.disabled} width="125px" height="40px" onClick={EditTokenFn}>
              Edit
            </Button>
          </Box>
        </Box>
      </BodyBoxStyle>
    </Modal>
  )
}
