import { Alert, styled, Typography, Box, useTheme, MenuItem, Link } from '@mui/material'
import SoulTokenBgImg from 'assets/images/soulbound_bg.png'
import { ReactComponent as CalendarIcon } from 'assets/svg/calendar_icon.svg'
import Input from 'components/Input'
import UploadFile from 'components/UploadFile'
import { useState, useMemo, useCallback, useEffect } from 'react'
import Select from 'components/Select/Select'
import DateTimePicker from 'components/DateTimePicker'
import { BlackButton } from 'components/Button/Button'
import Back from 'components/Back'
import Image from 'components/Image'
import { ChainList, ChainListMap } from 'constants/chain'
import { useCreateSbtCallback, ClaimWay } from 'hooks/useBackedSbtServer'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useActiveWeb3React } from 'hooks'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useUserInfo } from 'state/userInfo/hooks'
import { isAddress } from 'utils'
import Editor from 'pages/DaoInfo/Children/Proposal/Editor'
import { UserProfileAdminProps, useUserProfileInfo } from 'hooks/useBackedProfileServer'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { Dots } from 'theme/components'

export interface DaoMemberProp {
  accountLevel: number
  activeProposals: number
  bio: string
  daoId: number
  daoLogo: string
  daoName: string
  handle: string
  isApprove: boolean
  members: number
  totalProposals: number
}

const InputTitleStyle = styled(Typography)(() => ({
  fontSize: 14,
  lineHeight: '16px',
  color: '#80829F'
}))
const ContentHintStyle = styled(Typography)(() => ({
  fontSize: 14,
  lineHeight: '16px',
  color: '#8D8EA5'
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

const UploadLabel = styled('label')({
  border: ' 1px solid #0049C6',
  width: 158,
  height: 36,
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  display: 'flex',
  textAlign: 'center',
  color: '#0049C6',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: ' 8px',
  '&:hover': {
    color: '#fff',
    background: ' #0049C6'
  }
})

const eligibilityList = [
  { id: 1, value: ClaimWay.AnyOne, label: 'Anyone' },
  { id: 2, value: ClaimWay.Joined, label: 'DAO Members' },
  { id: 3, value: ClaimWay.WhiteList, label: 'Upload Addresses' }
]

export default function Index() {
  const { library, account, chainId } = useActiveWeb3React()
  const theme = useTheme()
  const [whitelistBoole, setWhitelistBoole] = useState<boolean>(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [accountList, setAccountList] = useState<string[]>([])
  const [eligibilityValue, setEligibilityValue] = useState(eligibilityList[0].value)

  const [eventStartTime, setEventStartTime] = useState<number>()
  const [eventEndTime, setEventEndTime] = useState<number>()
  const [fileValue, setFileValue] = useState('')
  const { result: userInfo } = useUserProfileInfo(account || undefined)
  const daoMemberList = useMemo(() => {
    if (!userInfo?.adminDao) return
    const daoList = userInfo?.adminDao.filter(v => Number(v.accountLevel) === 1 || Number(v.accountLevel) === 0)
    return daoList
  }, [userInfo?.adminDao])
  const { claimSubmitted: createIng } = useUserHasSubmittedClaim(`${account}_create_sbt`)
  const [daoValue, setDaoValue] = useState<UserProfileAdminProps | null>(null)

  const [symbolValue, setSymbolValue] = useState('')
  const [itemName, setItemName] = useState('')
  const [Introduction, setIntroduction] = useState('')
  const [totalSupply, setTotalSupply] = useState<string>('')
  const { CreateSbtCallback } = useCreateSbtCallback()

  const { showModal, hideModal } = useModal()
  const history = useHistory()
  const userSignature = useUserInfo()
  const SubmitCreate = useCallback(() => {
    showModal(<TransacitonPendingModal />)
    CreateSbtCallback(
      daoValue?.daoId,
      account || undefined,
      fileValue,
      itemName,
      eventStartTime,
      chainId,
      parseFloat(totalSupply),
      eligibilityValue,
      symbolValue,
      eventEndTime,
      Introduction,
      accountList
    )
      .then(res => {
        hideModal()
        console.log(res)
        showModal(
          <TransactionSubmittedModal
            hideFunc={() => {
              history.push(routes._SoulTokenDetail + '/' + daoValue?.daoId + '/' + res.sbtId)
            }}
            hash={res.hash}
          />
        )
      })
      .catch((err: any) => {
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [
    showModal,
    CreateSbtCallback,
    daoValue?.daoId,
    account,
    fileValue,
    itemName,
    eventStartTime,
    chainId,
    totalSupply,
    eligibilityValue,
    symbolValue,
    eventEndTime,
    Introduction,
    accountList,
    hideModal,
    history
  ])

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
    if (Introduction.trim().length > 2000) {
      return {
        disabled: true,
        error: 'Introduction is too long'
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
    if (Number(totalSupply) > 100000) {
      return {
        disabled: true,
        error: 'Total supply cannot exceed 100,000'
      }
    }
    if (!eligibilityValue) {
      return {
        disabled: true,
        error: 'Token Eligibility required'
      }
    }
    if (!eventStartTime || !eventEndTime) {
      return {
        disabled: true,
        error: 'StartTime required'
      }
    }
    if (eventEndTime && eventEndTime < eventStartTime) {
      return {
        disabled: true,
        error: 'Date error'
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
    symbolValue,
    totalSupply,
    Introduction,
    eligibilityValue,
    eventEndTime,
    eventStartTime,
    SubmitCreate
  ])
  useEffect(() => {
    if (!account || !userSignature) {
      history.push(routes.Governance)
    }
  }, [account, history, userSignature])

  const insertLine = useCallback((list: string[], newItem: string) => {
    const _ret = list.filter(item => item.toLowerCase() !== newItem.toLowerCase())
    _ret.push(newItem)
    return _ret
  }, [])

  const uploadCSV = useCallback(() => {
    const el = document.getElementById('upload_CSV') as HTMLInputElement
    if (!el || !el.files) return
    const reader = new FileReader()
    reader.onload = function() {
      const ret: string[] = []
      const textInput = reader.result as string
      const allRows = textInput.split(/\r?\n|\r/)
      for (let i = 0; i < allRows.length; i++) {
        const splitTextInput = allRows[i].split(',')
        if (!splitTextInput[0]?.trim()) {
          continue
        }
        if (!isAddress(splitTextInput[0]?.trim())) {
          setOpenSnackbar(true)
          el.value = ''
          return
        }
        ret.push(splitTextInput[0].trim())
      }
      el.value = ''
      let newList: string[] = []
      for (const item of ret) {
        newList = insertLine(newList, item)
        setAccountList(newList)
      }
    }
    reader.readAsBinaryString(el.files[0])
  }, [insertLine])
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
          src={SoulTokenBgImg}
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
        <Box sx={{ mt: 15, display: 'grid', flexDirection: 'column', maxWidth: '565px' }}>
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
              value={daoValue?.daoId || ''}
              onChange={e => {
                setDaoValue(daoMemberList?.find(v => v.daoId === e.target.value) || null)
              }}
            >
              {daoMemberList && daoMemberList?.length > 0 ? (
                daoMemberList.map((item, index) => (
                  <MenuItem
                    key={index}
                    sx={{
                      fontWeight: 500,
                      fontSize: '14px !important'
                    }}
                    value={item?.daoId}
                    selected={daoValue?.daoId === item?.daoId}
                  >
                    <Box sx={{ display: 'flex', gap: 10, flexGrow: 1 }}>
                      <Image
                        style={{ height: 20, width: 20, backgroundColor: '#f5f5', borderRadius: '50%' }}
                        src={item.daoLogo}
                      />
                      {item.daoName}
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled sx={{ fontWeight: 500, fontSize: '14px !important', color: '#808191' }}>
                  No more options are available
                </MenuItem>
              )}
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
                setFileValue(e)
              }}
            />
          </Box>
          <Box sx={{ display: 'grid', flexDirection: 'column', gap: 15, mb: 20 }}>
            <Input
              value={itemName}
              label="Item Name"
              placeholder="Write a description"
              onChange={e => setItemName(e.target.value)}
              maxLength={50}
              endAdornment={
                <Typography color={theme.palette.text.secondary} lineHeight={'20px'} variant="body1">
                  {itemName.length}/50
                </Typography>
              }
            />
            <Box sx={{ mb: 60, maxWidth: '565px' }}>
              <InputTitleStyle sx={{ mb: 10 }}>Introduction (Optional)</InputTitleStyle>

              <Editor content={Introduction} setContent={setIntroduction} />
            </Box>
            <Input
              value={symbolValue}
              onChange={e => {
                setSymbolValue(e.target.value)
              }}
              label="symbol"
              placeholder="Enter Symbol"
              maxLength={50}
              endAdornment={
                <Typography color={theme.palette.text.secondary} lineHeight={'20px'} variant="body1">
                  {symbolValue.length}/50
                </Typography>
              }
            />

            <Input
              value={totalSupply}
              type="text"
              onChange={e => {
                const regex = /^([1-9]\d*|0)$/
                const value = e.target.value
                if (!value || (value && value != '0' && regex.test(value))) {
                  setTotalSupply(value)
                }
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
                  setEligibilityValue(e.target.value)
                  if (e.target.value === 'whitelist') {
                    setWhitelistBoole(true)
                  } else {
                    setWhitelistBoole(false)
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
                    {accountList.length > 0 ? (
                      <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <Typography variant="body1" lineHeight="20px" color="#0049C6">
                            Filename001
                          </Typography>
                          <Typography variant="body1" lineHeight="20px">
                            Total {accountList.length} addresses
                          </Typography>
                        </Box>
                        <input
                          accept=".csv"
                          type="file"
                          onChange={uploadCSV}
                          id="upload_CSV"
                          style={{ width: 0, height: 0 }}
                        />
                        <UploadLabel htmlFor="upload_CSV">Re-upload</UploadLabel>
                      </>
                    ) : (
                      <>
                        <Typography variant="body1" lineHeight={'20px'}>
                          Download this{' '}
                          <Link href="/template/sbt-list.csv" sx={{ cursor: 'pointer' }}>
                            Reference template.
                          </Link>
                        </Typography>

                        <input
                          accept=".csv"
                          type="file"
                          onChange={uploadCSV}
                          id="upload_CSV"
                          style={{ width: 0, height: 0 }}
                        />
                        <UploadLabel htmlFor="upload_CSV">Upload File </UploadLabel>
                      </>
                    )}
                  </UploadBoxStyle>
                </>
              )}
            </Box>
            {openSnackbar && <Alert severity="error">Address format error, please download the template.</Alert>}
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
                  disabled={eventStartTime ? false : true}
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
            {createIng ? (
              <BlackButton
                disabled={createIng}
                onClick={nextHandler.handler}
                style={{ width: 270, height: 40, display: 'flex' }}
              >
                CreateIng
                <Dots />
              </BlackButton>
            ) : (
              <BlackButton
                disabled={nextHandler.disabled}
                onClick={nextHandler.handler}
                style={{ width: 270, height: 40 }}
              >
                Create Now
              </BlackButton>
            )}
          </Box>
        </Box>
      </ContentBoxStyle>
    </Box>
  )
}
