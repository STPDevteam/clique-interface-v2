import { Alert, styled, Typography, Box, useTheme, MenuItem, Link } from '@mui/material'
import soulboundBgimg from 'assets/images/soulbound_bg.png'
import { ReactComponent as CalendarIcon } from 'assets/svg/calendar_icon.svg'
import Input from 'components/Input'
import UploadFile from 'components/UploadFile'
import { useState, useMemo, useCallback } from 'react'
import Select from 'components/Select/Select'
import DateTimePicker from 'components/DateTimePicker'
import { BlackButton } from 'components/Button/Button'
import Button from 'components/Button/Button'
import Back from 'components/Back'
import Image from 'components/Image'
import { ChainList, ChainId, ChainListMap } from 'constants/chain'
import { useMemberDaoList, useCreateSbtCallback } from 'hooks/useBackedSbtServer'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useActiveWeb3React } from 'hooks'

const InputTitleStyle = styled(Typography)(() => ({
  fontSize: 14,
  lineHeight: '16px',
  color: '#80829F'
}))
const ContentHintStyle = styled(Typography)(() => ({
  fontSize: 14,
  lineHeight: '16px',
  color: '#B5B7CF'
}))
const ContentBoxStyle = styled(Box)(() => ({
  padding: '30px 120px 70px 70px'
}))

const DateBoxStyle = styled(Box)(() => ({
  padding: '0 10px',
  width: '100%',
  height: 40,
  border: '1px solid #D4D7E2',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& .MuiInputBase-input': {
    height: 40,
    backgroundColor: 'transparent',
    color: '#3F5170',
    cursor: 'pointer',
    '&::placeholder': {
      color: '#80829F',
      textAlign: 'center'
    }
  }
}))

const UploadButtonStyle = styled(Button)(() => ({
  width: 158,
  height: 36,
  background: ' #FFFFFF',
  border: ' 1px solid #0049C6',
  borderRadius: ' 8px',
  color: '#0049C6',
  '&:hover': {
    color: '#fff',
    background: ' #0049C6'
  }
}))

const UploadBoxStyle = styled(Box)(() => ({
  marginTop: 15,
  height: 87,
  background: 'rgba(0, 91, 198, 0.06)',
  borderRadius: '8px',
  padding: '20px 27px 20px 40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

export default function Index() {
  const { library, account, chainId } = useActiveWeb3React()
  const theme = useTheme()
  const eligibilityList = [
    { id: 1, value: 'anyone', label: 'Anyone' },
    { id: 2, value: 'joined', label: 'DAO Members' },
    { id: 3, value: 'whitelist', label: 'Upload Addresses' }
  ]
  const [whitelistBoole, setwhitelistBoole] = useState<boolean>(false)
  const [whitelistValue, setwhitelistValue] = useState<string[]>([])
  const [eligibilityValue, seteligibilityValue] = useState(eligibilityList[0].value)

  const [eventStartTime, setEventStartTime] = useState<number>()
  const [eventEndTime, setEventEndTime] = useState<number>()
  const [fileValue, setfileValue] = useState('')
  const { result: daoList } = useMemberDaoList('C_member')
  const daoMemberList = useMemo(() => {
    if (!daoList) return
    return daoList
  }, [daoList])
  const [daoValue, setdaoValue] = useState('')
  const [symbolValue, setsymbolValue] = useState('')
  const [itemName, setitemName] = useState('')
  const [Introduction, setIntroduction] = useState('')
  const [totalSupply, settotalSupply] = useState<string>('')
  const [daoAddress, setdaoAddress] = useState('')
  const [daoChainId, setdaoChainId] = useState<ChainId>()
  const CreateSbtCallback = useCreateSbtCallback(
    daoChainId,
    daoAddress,
    eventEndTime,
    fileValue,
    Introduction,
    itemName,
    eventStartTime,
    chainId,
    parseFloat(totalSupply),
    eligibilityValue,
    symbolValue
  )
  const { showModal, hideModal } = useModal()

  const SubmitCreate = useCallback(() => {
    showModal(<TransacitonPendingModal />)
    CreateSbtCallback()
      .then(hash => {
        hideModal()
        console.log(hash)
      })
      .catch((err: any) => {
        hideModal()
        console.error(err)
      })
  }, [CreateSbtCallback, hideModal, showModal])

  const nextHandler = useMemo(() => {
    if (!daoValue) {
      return {
        disabled: true,
        error: 'Dao required'
      }
    }
    if (!chainId) {
      return {
        disabled: true,
        error: 'Blockchain required'
      }
    }
    if (!fileValue) {
      return {
        disabled: true,
        error: 'File required'
      }
    }
    if (!itemName.trim()) {
      return {
        disabled: true,
        error: 'Item Name required'
      }
    }
    if (!Introduction.trim()) {
      return {
        disabled: true,
        error: 'Introduction required'
      }
    }
    if (!symbolValue.trim()) {
      return {
        disabled: true,
        error: 'Symbol required'
      }
    }
    if (!totalSupply.trim()) {
      return {
        disabled: true,
        error: 'Total supply required'
      }
    }
    if (!eligibilityValue) {
      return {
        disabled: true,
        error: 'Token Eligibility required'
      }
    }
    if (!eventEndTime || !eventStartTime) {
      return {
        disabled: true,
        error: 'Claimable Period required'
      }
    }
    return {
      disabled: false,
      handler: SubmitCreate
    }
  }, [
    daoValue,
    chainId,
    fileValue,
    itemName,
    Introduction,
    symbolValue,
    totalSupply,
    eligibilityValue,
    eventEndTime,
    eventStartTime,
    SubmitCreate
  ])

  return (
    <Box sx={{ display: 'flex', maxWidth: '1440px', width: '100%' }}>
      <Box
        sx={{
          width: 600,
          // height: 'calc(100% - 80px)',
          display: 'flex',
          flexGrow: 1
        }}
      >
        <img
          src={soulboundBgimg}
          alt=""
          style={{
            width: 600,
            height: '100%'
          }}
        />
      </Box>
      <ContentBoxStyle>
        <Back />
        <Typography style={{ marginTop: 30 }} variant="h3" lineHeight={'56px'} fontWeight={'700'}>
          Create Soulbound Token of DAO
        </Typography>
        <Typography variant="body1" fontWeight={'400'} fontSize={16}>
          The SBT only represents a status symbol, cannot be transferred, and has no financial attributes.
        </Typography>
        <Box
          sx={{
            mt: 20,
            display: 'grid',
            flexDirection: 'column',
            gap: 10
          }}
        >
          <InputTitleStyle>Select a DAO</InputTitleStyle>
          <ContentHintStyle>An identity token based on the DAO</ContentHintStyle>
          <Select
            placeholder="select Dao"
            noBold
            value={daoValue}
            onChange={e => {
              setdaoValue(e.target.value)
              setdaoAddress(e.target.value.daoAddress)
              setdaoChainId(e.target.value.chainId)
            }}
          >
            {daoMemberList &&
              daoMemberList.map((item: any, index: any) => (
                <MenuItem
                  key={index}
                  sx={{
                    fontWeight: 500,
                    fontSize: '14px !important'
                  }}
                  value={item}
                >
                  <Box sx={{ display: 'flex', gap: 10, flexGrow: 1 }}>
                    <Image
                      style={{ height: 20, width: 20, backgroundColor: '#f5f5', borderRadius: '50%' }}
                      src={item.daoLogo}
                    />
                    {item.daoName}
                  </Box>
                </MenuItem>
              ))}
          </Select>
        </Box>
        <Box sx={{ mt: 15, display: 'grid', flexDirection: 'column', gap: 10 }}>
          <Select
            placeholder="select Chain"
            noBold
            label="Blockchain"
            value={chainId || undefined}
            onChange={e => {
              account && triggerSwitchChain(library, e.target.value, account)
            }}
          >
            {ChainList.map(item => (
              <MenuItem
                key={item.id}
                sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                value={item.id}
              >
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ mt: 20, mb: 20 }}>
          <UploadFile
            size={150}
            value={fileValue}
            onChange={e => {
              setfileValue(e)
            }}
          />
        </Box>
        <Box sx={{ display: 'grid', flexDirection: 'column', gap: 15, mb: 20 }}>
          <Input
            value={itemName}
            label="Item Name"
            placeholder="Write a description"
            onChange={e => setitemName(e.target.value)}
            maxLength={50}
            endAdornment={
              <Typography color={theme.palette.text.secondary} lineHeight={'20px'} variant="body1">
                {itemName.length}/50
              </Typography>
            }
          />
          <Input
            value={Introduction}
            rows={5}
            multiline
            label="Introduction (Optional)"
            placeholder="Write a description"
            maxLength={2000}
            endAdornment={
              <Typography color={theme.palette.text.secondary} lineHeight={'20px'} variant="body1">
                {Introduction.length}/2000
              </Typography>
            }
            onChange={e => {
              setIntroduction(e.target.value)
            }}
          />

          <Input
            value={symbolValue}
            onChange={e => {
              setsymbolValue(e.target.value)
            }}
            label="symbol"
            placeholder="Enter Symbol"
          />

          <Input
            value={totalSupply}
            type="number"
            onChange={e => {
              settotalSupply(e.target.value)
            }}
            label="Total supply"
            placeholder="Enter Total"
          />
          <Box>
            <Select
              noBold
              label="Set Token Eligibility"
              value={eligibilityValue}
              onChange={e => {
                seteligibilityValue(e.target.value)
                if (e.target.value === 'whitelist') {
                  setwhitelistBoole(true)
                } else {
                  setwhitelistBoole(false)
                }
              }}
            >
              {eligibilityList.map(item => (
                <MenuItem
                  key={item.id}
                  sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                  value={item.value}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            {whitelistBoole && (
              <>
                <UploadBoxStyle>
                  {whitelistValue.length > 0 ? (
                    <>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <Typography variant="body1" lineHeight="20px" color="#0049C6">
                          Filename001
                        </Typography>
                        <Typography variant="body1" lineHeight="20px">
                          Total {whitelistValue.length} addresses
                        </Typography>
                      </Box>
                      <UploadButtonStyle onClick={() => console.log(whitelistValue)}>Re-upload</UploadButtonStyle>
                    </>
                  ) : (
                    <>
                      <Typography variant="body1" lineHeight={'20px'}>
                        Download this <Link sx={{ cursor: 'pointer' }}>Reference template.</Link>
                      </Typography>
                      <UploadButtonStyle onClick={() => setwhitelistValue(['1', '3', '4'])}>
                        Upload File
                      </UploadButtonStyle>
                    </>
                  )}
                </UploadBoxStyle>
              </>
            )}
          </Box>
          <Box sx={{ display: 'grid', flexDirection: 'column', gap: 10 }}>
            <InputTitleStyle>Claimable Period</InputTitleStyle>
            <ContentHintStyle>Items outside the time frame will stop being claimed</ContentHintStyle>
            <DateBoxStyle>
              <CalendarIcon />
              <DateTimePicker
                label={'Start time'}
                value={eventStartTime ? new Date(eventStartTime * 1000) : null}
                onValue={timestamp => setEventStartTime(timestamp)}
              />
              <ContentHintStyle style={{ whiteSpace: 'nowrap' }}>--</ContentHintStyle>
              <DateTimePicker
                label={'End time'}
                minDateTime={eventStartTime ? new Date(eventStartTime * 1000) : undefined}
                value={eventEndTime ? new Date(eventEndTime * 1000) : null}
                onValue={timestamp => setEventEndTime(timestamp)}
              />
            </DateBoxStyle>
          </Box>
        </Box>
        {nextHandler.error ? (
          <Alert severity="error">{nextHandler.error}</Alert>
        ) : (
          <Alert severity="info">You will create a SBT in {chainId ? ChainListMap[chainId]?.name : '--'}</Alert>
        )}
        <Box sx={{ display: 'flex', mt: 20, justifyContent: 'flex-end' }}>
          <BlackButton disabled={nextHandler.disabled} onClick={nextHandler.handler} style={{ width: 270, height: 40 }}>
            Create Now
          </BlackButton>
        </Box>
      </ContentBoxStyle>
    </Box>
  )
}
