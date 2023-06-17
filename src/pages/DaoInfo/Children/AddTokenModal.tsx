import Modal from 'components/Modal/index'
import { Alert, Box, Typography, styled } from '@mui/material'
import Input from 'components/Input/index'
import OutlineButton from 'components/Button/OutlineButton'
import Button from 'components/Button/Button'
import useModal from 'hooks/useModal'
import { useCallback, useMemo, useState } from 'react'
import { useAddGovToken } from 'hooks/useBackedProposalServer'
import { useTokenByChain } from 'state/wallet/hooks'
import { isAddress } from 'ethers/lib/utils'
import { ChainId, ChainList, ChainListMap } from 'constants/chain'
import ChainSelect from 'components/Select/ChainSelect'
import NumericalInput from 'components/Input/InputNumerical'
import { toast } from 'react-toastify'
import { updateCreateDaoData } from 'state/buildingGovDao/actions'
import UploadImage from 'components/UploadImage'
import { useGetDaoInfo } from 'hooks/useBackedDaoServer'
import { useDispatch } from 'react-redux'

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
  color: '#3F5170'
}))

const InputStyle = styled(NumericalInput)(() => ({
  height: 40
}))
export default function AddTokenModal({ daoId }: { daoId: number }) {
  const { hideModal } = useModal()
  const dispatch = useDispatch()
  const [tokenAddress, setTokenAddress] = useState('')
  const [baseChainId, setBaseChainId] = useState<any>('')
  const [requirementAmount, setRequirementAmount] = useState('')
  const [avatar, setAvatar] = useState('')
  const createDaoData = useGetDaoInfo(Number(daoId))
  const currentBaseChain = useMemo(() => (baseChainId ? ChainListMap[baseChainId] || null : null), [baseChainId])
  const govToken = useTokenByChain(
    isAddress(tokenAddress) ? tokenAddress : undefined,
    currentBaseChain?.id ?? undefined
  )
  const addToken = useAddGovToken()
  const addCB = useCallback(() => {
    if (!govToken || !govToken.token.symbol || !govToken.token.name || !govToken.totalSupply) return
    addToken(
      govToken.token.chainId,
      requirementAmount,
      daoId,
      govToken.token.decimals,
      govToken.token.symbol,
      govToken.token.address,
      avatar,
      govToken.token.name,
      'erc20',
      govToken.totalSupply.toSignificant(),
      1
    ).then(res => {
      if (res.data.code !== 200) {
        toast.error(res.data.msg || 'network error')
        return
      }
      createDaoData && dispatch(updateCreateDaoData({ createDaoData }))
      toast.success('Add success')
      hideModal()
    })
  }, [addToken, avatar, createDaoData, daoId, dispatch, govToken, hideModal, requirementAmount])

  const voteBtn: {
    disabled: boolean
    error?: undefined | string | JSX.Element
  } = useMemo(() => {
    if (!avatar) {
      return {
        disabled: true,
        error: 'Please upload token logo'
      }
    }
    if (!requirementAmount) {
      return {
        disabled: true,
        error: 'Please enter createRequire amount'
      }
    }
    if (!govToken) {
      return {
        disabled: true,
        error: 'Token is invaild'
      }
    }
    if (!tokenAddress) {
      return {
        disabled: true,
        error: 'Please enter token contract address'
      }
    }
    return {
      disabled: false
    }
  }, [avatar, govToken, requirementAmount, tokenAddress])

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
          Add Governanve Token
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
              <UploadImage value={avatar} size={124} onChange={val => setAvatar(val)} />
            </Box>
          </Box>
          <Box sx={{ maxWidth: '253px', width: '100%' }}>
            <ContentTitleStyle sx={{ mb: 10 }}>Network</ContentTitleStyle>
            <ChainSelect
              height={40}
              chainList={ChainList.filter(
                v =>
                  v.id !== ChainId.POLYGON_MANGO &&
                  v.id !== ChainId.COINBASE_TESTNET &&
                  v.id !== ChainId.ZetaChain_TESTNET &&
                  v.id !== ChainId.ZKSYNC_ERA &&
                  v.id !== ChainId.ZKSYNC_ERA_TESTNET
              )}
              selectedChain={currentBaseChain}
              onChange={e => {
                setBaseChainId(e?.id || null)
              }}
              label=""
            />
            <ContentTitleStyle sx={{ mt: 10, mb: 10 }}>Token Contract Address</ContentTitleStyle>
            <Input
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
          <Box>
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
            onChange={e => setRequirementAmount(e.target.value)}
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
          {voteBtn.error && (
            <Alert sx={{ marginTop: 15 }} severity="error">
              {voteBtn.error}
            </Alert>
          )}
          <Box sx={{ mt: 32, mb: 20, display: 'flex', justifyContent: 'space-between' }}>
            <OutlineButton
              style={{ border: '1px solid #0049C6', color: '#0049C6' }}
              width={125}
              height={40}
              onClick={hideModal}
            >
              Close
            </OutlineButton>
            <Button width="125px" height="40px" onClick={addCB} disabled={voteBtn.disabled}>
              Add
            </Button>
          </Box>
        </Box>
      </BodyBoxStyle>
    </Modal>
  )
}
