import { Box, Alert, Stack, Typography, useTheme } from '@mui/material'
import { ContainerWrapper, CreatorBox } from '../StyledCreate'
import UploadImage from 'components/UploadImage'
import Input from 'components/Input'
import { BlackButton } from 'components/Button/Button'
import { useCreateTokenDataCallback } from 'state/createToken/hooks'
import { removeEmoji } from 'utils'
import { useMemo } from 'react'
import ChainSelect from 'components/Select/ChainSelect'
import { ChainList, ChainListMap } from 'constants/chain'
import InputNumerical from 'components/Input/InputNumerical'
import { toFormatGroup } from 'utils/dao'

export default function Basic({ next }: { next: () => void }) {
  const theme = useTheme()
  const { createTokenData, updateTokenBasicKeyData } = useCreateTokenDataCallback()
  const createTokenBaseData = createTokenData.basic

  const nextHandler = useMemo(() => {
    if (!createTokenBaseData.tokenSymbol.trim()) {
      return {
        disabled: true,
        error: 'Token symbol required'
      }
    }
    if (!createTokenBaseData.tokenName.trim()) {
      return {
        disabled: true,
        error: 'Token name required'
      }
    }
    if (!createTokenBaseData.tokenPhoto) {
      return {
        disabled: true,
        error: 'Token logo required'
      }
    }
    if (!createTokenBaseData.tokenSupply) {
      return {
        disabled: true,
        error: 'Token supply required'
      }
    }
    if (!createTokenBaseData.tokenDecimals) {
      return {
        disabled: true,
        error: 'Token decimals required'
      }
    }
    if (!createTokenBaseData.baseChainId) {
      return {
        disabled: true,
        error: 'Blockchain required'
      }
    }
    return {
      disabled: false,
      handler: next
    }
  }, [
    createTokenBaseData.baseChainId,
    createTokenBaseData.tokenDecimals,
    createTokenBaseData.tokenName,
    createTokenBaseData.tokenPhoto,
    createTokenBaseData.tokenSupply,
    createTokenBaseData.tokenSymbol,
    next
  ])

  const currentBaseChain = useMemo(
    () => (createTokenBaseData.baseChainId ? ChainListMap[createTokenBaseData.baseChainId] || null : null),
    [createTokenBaseData.baseChainId]
  )

  return (
    <ContainerWrapper maxWidth={644}>
      <CreatorBox>
        <Stack spacing={20}>
          <Box display={'flex'} alignItems="flex-end">
            <UploadImage
              onChange={val => updateTokenBasicKeyData('tokenPhoto', val)}
              value={createTokenBaseData.tokenPhoto}
              size={124}
            />
            <Typography
              variant="body2"
              color={theme.textColor.text1}
              fontSize={14}
              ml={20}
            >{`Supports JPG, PNG, and size <2MB.`}</Typography>
          </Box>
          <ChainSelect
            chainList={ChainList}
            selectedChain={currentBaseChain}
            onChange={e => updateTokenBasicKeyData('baseChainId', e?.id || null)}
            label="*Blockchain"
          />
          <Input
            label="*Token Symbol"
            maxLength={16}
            endAdornment={
              <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2">
                {createTokenBaseData.tokenSymbol.length}/16
              </Typography>
            }
            placeholder="1-16 chars"
            value={createTokenBaseData.tokenSymbol}
            onChange={e => updateTokenBasicKeyData('tokenSymbol', removeEmoji(e.target.value || ''))}
          />
          <Input
            label="*Token Name"
            maxLength={64}
            endAdornment={
              <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2">
                {createTokenBaseData.tokenName.length}/64
              </Typography>
            }
            placeholder="1-64 chars"
            value={createTokenBaseData.tokenName}
            onChange={e => updateTokenBasicKeyData('tokenName', removeEmoji(e.target.value || ''))}
          />
          <Stack spacing={36} direction="row">
            <InputNumerical
              noDecimals
              showFormatWrapper={() =>
                createTokenBaseData.tokenSupply ? toFormatGroup(createTokenBaseData.tokenSupply) : ''
              }
              value={createTokenBaseData.tokenSupply}
              onChange={e => updateTokenBasicKeyData('tokenSupply', e.target.value || '')}
              label="*Token Supply"
              placeholder="100,000"
            />
            <InputNumerical
              noDecimals
              label="*Decimals"
              maxLength={64}
              placeholder="18"
              value={createTokenBaseData.tokenDecimals.toFixed()}
              onChange={e => updateTokenBasicKeyData('tokenDecimals', Number(e.target.value))}
            />
          </Stack>
        </Stack>
      </CreatorBox>
      {nextHandler.error && <Alert severity="error">{nextHandler.error}</Alert>}
      <Box display="flex" justifyContent="center" mt={20}>
        <BlackButton width="252px" disabled={nextHandler.disabled} onClick={nextHandler.handler}>
          Next
        </BlackButton>
      </Box>
    </ContainerWrapper>
  )
}
