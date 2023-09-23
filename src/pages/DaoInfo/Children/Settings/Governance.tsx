import {
  Box,
  Typography,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  useTheme
} from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import Input from 'components/Input/InputNumerical'
import Button from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import ToggleButtonGroup from 'components/ToggleButtonGroup'
import defaultLogo from 'assets/images/create-token-ball.png'
import { ReactComponent as Bar } from 'assets/svg/bar.svg'
import AddTokenModal from '../AddTokenModal'
import EditTokenModal from '../EditTokenModal'
import Image from 'components/Image'
import useModal from 'hooks/useModal'
import { Dots } from 'theme/components'
import { useCallback, useMemo, useState } from 'react'
import { govList } from 'state/buildingGovDao/actions'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useUpdateGovernance } from 'hooks/useBackedDaoServer'
import { toast } from 'react-toastify'
import { ChainListMap } from 'constants/chain'
import { useDeleteGovToken } from 'hooks/useBackedProposalServer'
import { useBuildingDaoDataCallback, useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
import { useTokenByChain } from 'state/wallet/hooks'
import { isAddress } from 'ethers/lib/utils'
import EmptyData from 'components/EmptyData'
import Tooltip from 'components/Tooltip'
import useBreakpoint from 'hooks/useBreakpoint'

const InputTitleStyle = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '16px',
  fontFamily: 'Inter',
  color: '#80829F'
}))
const InputStyle = styled(Input)(() => ({
  height: 40
}))
const GridLayoutff = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
  [theme.breakpoints.down('sm')]: {
    display: 'grid',
    gridTemplateColumns: 'auto'
  }
}))

const Row = styled(Box)(() => ({
  display: 'flex'
}))

export default function General({ daoId }: { daoId: number }) {
  const { showModal } = useModal()
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')
  const { buildingDaoData: daoInfo } = useBuildingDaoDataCallback()
  const [loading, setLoading] = useState(false)
  const [fixTime, setFixtime] = useState((daoInfo.votingPeriod / 3600).toString())
  const PeriodList = [
    { label: 'Fix time', value: 'Fixtime' },
    { label: 'Customization', value: 'Customization' }
  ]
  const TypesList = [
    { label: 'Any', value: '0' },
    { label: 'Single-voting', value: '1' },
    { label: 'Multi-voting', value: '2' }
  ]
  const { createDaoData } = useUpdateDaoDataCallback()
  const [startValite, setStartValite] = useState(false)
  const [PeriodValue, setPeriodValue] = useState(daoInfo.votingPeriod > 0 ? 'Fixtime' : 'Customization')
  const [TypesValue, setTypesValue] = useState(TypesList[daoInfo.votingType].value)
  const [proposalThreshold, setProposalThreshold] = useState(daoInfo.proposalThreshold || '')
  const navigate = useNavigate()
  const weight = useMemo(
    () =>
      daoInfo.governance.map(item => ({
        createRequire: item.createRequire,
        voteTokenId: item.voteTokenId,
        votesWeight: item.weight,
        chainId: item.chainId,
        tokenAddress: item.tokenAddress
      })),
    [daoInfo.governance]
  )

  const govToken = useTokenByChain(
    isAddress(weight[0]?.tokenAddress) ? weight[0]?.tokenAddress : undefined,
    weight[0]?.chainId ?? undefined
  )
  const cb = useUpdateGovernance()

  const saveBtn: {
    disabled: boolean
    text?: string
    error?: undefined | string | JSX.Element
  } = useMemo(() => {
    if (!proposalThreshold || Number(proposalThreshold) < 1) {
      return {
        disabled: true,
        text: 'threshold',
        error: 'Please enter proposalThershold'
      }
    }
    if (Number(fixTime) < 72 && PeriodValue === 'Fixtime') {
      return {
        disabled: true,
        text: 'time',
        error: 'Minium voting period is 72 hours'
      }
    }
    if (createDaoData && createDaoData.governance.length < 1) {
      return {
        disabled: true,
        text: 'governance',
        error: 'A governance token needs to be added'
      }
    }

    return {
      disabled: false,
      text: ''
    }
  }, [PeriodValue, createDaoData, fixTime, proposalThreshold])

  const { updateDaoBaseData } = useUpdateDaoDataCallback()

  const updateGovernance = useCallback(() => {
    setStartValite(true)
    if (saveBtn?.error || !weight) return
    setLoading(true)
    const time = PeriodValue === 'Fixtime' ? Number(fixTime) * 3600 : 0
    cb(Number(daoId), Number(proposalThreshold), time, Number(TypesValue), weight)
      .then(res => {
        setLoading(false)
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'Network error')
          return
        }
        updateDaoBaseData()
        toast.success('Update success')
        setStartValite(false)
      })
      .catch(err => {
        toast.error(err || 'Network error')
        setLoading(false)
      })
  }, [PeriodValue, TypesValue, cb, daoId, fixTime, proposalThreshold, saveBtn?.error, updateDaoBaseData, weight])

  return (
    <Box>
      <Row sx={{ gap: 10, mb: 14 }}>
        {createDaoData && createDaoData.governance.length < 1 && (
          <Button
            style={{ maxWidth: 184, height: isSmDown ? 32 : 36, fontSize: isSmDown ? '13px' : '14px' }}
            onClick={() => {
              if (createDaoData && createDaoData.governance.length >= 1) {
                toast.error('There can only be one governance token, if you want to modify it, please remove it first')
                return
              }

              showModal(<AddTokenModal updater={updateDaoBaseData} daoId={daoId} setRand={() => {}} />)
            }}
          >
            Add Governance Token
          </Button>
        )}
        <OutlineButton
          style={{
            maxWidth: 184,
            height: isSmDown ? 32 : 36,
            fontSize: isSmDown ? '13px' : '14px',
            color: '#3F5170',
            border: '1px solid #3F5170'
          }}
          onClick={() => navigate(routes.CreatorToken)}
        >
          Create New Token
        </OutlineButton>
      </Row>
      {!!createDaoData?.governance.length && (
        <BasicTable
          updater={updateDaoBaseData}
          setRand={() => {}}
          governance={createDaoData?.governance}
          daoId={daoId}
          proposalThreshold={Number(createDaoData?.proposalThreshold)}
          votingPeriod={createDaoData?.votingPeriod}
          votingType={createDaoData?.votingType}
        />
      )}
      {!loading && !createDaoData?.governance.length && <EmptyData sx={{ marginTop: 10 }}>No data</EmptyData>}

      <Box sx={{ display: 'grid', flexDirection: 'column', gap: 20, mt: 25 }}>
        <GridLayoutff>
          <Box>
            <InputTitleStyle mb={10} sx={{ height: 20, display: 'flex', gap: 5, lineHeight: '20px' }}>
              Threshold <Tooltip value={'Minimum votes needed for proposal to execute'} />
            </InputTitleStyle>
            <InputStyle
              style={{
                borderColor: startValite && saveBtn.error && saveBtn.text === 'threshold' ? '#E46767' : '#D4D7E2'
              }}
              placeholderSize="14px"
              placeholder={'0'}
              endAdornment={
                <Typography color="#8D8EA5" lineHeight="20px" variant="body1">
                  Votes
                </Typography>
              }
              onChange={e => {
                if (
                  (Number(e.target.value) <= Number(govToken?.totalSupply.toSignificant(18)) &&
                    /^[1-9]\d*$/.test(e.target.value)) ||
                  !e.target.value
                ) {
                  setProposalThreshold(e.target.value)
                } else {
                  setProposalThreshold(proposalThreshold)
                }
              }}
              value={proposalThreshold}
            />
            {startValite && saveBtn.text === 'threshold' && <Typography color={'#E46767'}>{saveBtn.error}</Typography>}
            <Row
              sx={{
                maxWidth: 463,
                justifyContent: 'space-between',
                mt: 20,
                [theme.breakpoints.down('sm')]: {
                  display: 'grid',
                  gap: 10
                }
              }}
            >
              <InputTitleStyle>Voting Types</InputTitleStyle>
              <ToggleButtonGroup initIndex={daoInfo.votingType} Props={TypesList} setToggleValue={setTypesValue} />
            </Row>
          </Box>

          <Row sx={{ maxWidth: 463, gap: 10, flexDirection: 'column' }}>
            <Row
              sx={{
                justifyContent: 'space-between',
                [theme.breakpoints.down('sm')]: {
                  display: 'grid',
                  gap: 10
                }
              }}
            >
              <InputTitleStyle>Voting Period</InputTitleStyle>
              <ToggleButtonGroup
                initIndex={daoInfo.votingPeriod > 0 ? 0 : 1}
                Props={PeriodList}
                setToggleValue={setPeriodValue}
              />
            </Row>
            {PeriodValue === 'Fixtime' ? (
              <Row sx={{ flexDirection: 'column' }}>
                <InputStyle
                  placeholderSize="14px"
                  style={{
                    borderColor: startValite && saveBtn.error && saveBtn.text === 'time' ? '#E46767' : '#D4D7E2'
                  }}
                  placeholder={'0'}
                  endAdornment={
                    <Typography color="#8D8EA5" lineHeight="20px" variant="body1">
                      Hours
                    </Typography>
                  }
                  value={fixTime}
                  noDecimals
                  onChange={e => {
                    setFixtime(e.target.value)
                  }}
                />
                {startValite && saveBtn.text === 'time' && <Typography color={'#E46767'}>{saveBtn.error}</Typography>}
              </Row>
            ) : (
              <Typography
                variant="body1"
                sx={{
                  color: '#8D8EA5',
                  lineHeight: '40px',
                  paddingLeft: 20,
                  [theme.breakpoints.down('sm')]: {
                    lineHeight: '20px',
                    paddingLeft: 0
                  }
                }}
              >
                Customize the voting time when creating a proposal
              </Typography>
            )}
          </Row>
        </GridLayoutff>
      </Box>
      {startValite && saveBtn.error && saveBtn.text === 'governance' && (
        <Alert sx={{ marginTop: 15 }} severity="error">
          {saveBtn.error}
        </Alert>
      )}
      <Box mt={30} display="flex" justifyContent={'flex-end'} mb={20}>
        <BlackButton
          width={isSmDown ? '200px' : '270px'}
          height={isSmDown ? '36px' : '40px'}
          onClick={updateGovernance}
        >
          {loading ? (
            <>
              Saving
              <Dots />
            </>
          ) : (
            'Save'
          )}
        </BlackButton>
      </Box>
    </Box>
  )
}

const TableContentTitle = styled(TableCell)(() => ({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '13px',
  lineHeight: ' 16px',
  color: '#8D8EA5',
  padding: '7px 0',
  borderBottom: 'none'
}))
const TableContentStyle = styled(TableCell)(() => ({
  height: 60,
  padding: 0,
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: ' 20px',
  color: '#3F5170',
  borderTop: '1px solid #D4D7E2'
}))
const TextButtonStyle = styled(Typography)(() => ({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '20px',
  color: '#E46767',
  cursor: 'pointer',
  userSelect: 'none'
}))

function BasicTable({
  setRand,
  governance,
  daoId,
  proposalThreshold,
  votingPeriod,
  votingType,
  updater
}: {
  setRand: () => void
  governance: govList[]
  daoId: number
  proposalThreshold: number
  votingPeriod: number
  votingType: number
  updater: () => void
}) {
  const { updateBuildingDaoKeyData } = useBuildingDaoDataCallback()
  const deleteTokenCB = useDeleteGovToken()
  const rows = governance.map(item => ({
    name: item.tokenName,
    symbol: item.symbol,
    require: item.createRequire,
    weight: item.weight,
    id: item.chainId,
    logo: item.tokenLogo,
    voteTokenId: item.voteTokenId,
    token: item
  }))
  const { showModal } = useModal()

  // const delItem = useCallback(
  //   (index: number) => {
  //     const newArray = [...governance]
  //     newArray.splice(index, 1)
  //     setCGovernance(newArray)
  //   },
  //   [governance, setCGovernance]
  // )

  const deleteToken = useCallback(
    (voteTokenId: number) => {
      deleteTokenCB(voteTokenId).then(res => {
        if (res.data.code !== 200) {
          toast.error('Network error')
          return
        }
        toast.success('Remove success')
        setRand()
      })
    },
    [deleteTokenCB, setRand]
  )

  return (
    <TableContainer sx={{ border: '1px solid #D4D7E2', borderRadius: '8px' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableContentTitle sx={{ pl: 30 }}>Token</TableContentTitle>
            <TableContentTitle>Network</TableContentTitle>
            <TableContentTitle>Requirement</TableContentTitle>
            {/* <TableContentTitle>Voting weight</TableContentTitle> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.symbol + index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableContentStyle sx={{ pl: 30, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Image src={row.logo || defaultLogo} width={32} style={{ borderRadius: '50%' }} />
                {row.name}({row.symbol})
              </TableContentStyle>
              <TableContentStyle>{ChainListMap[row.id].name}</TableContentStyle>
              <TableContentStyle>{row.require}</TableContentStyle>
              {/* <TableContentStyle>{row.weight}</TableContentStyle> */}
              <TableContentStyle sx={{ width: 200 }}>
                <Box sx={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center' }}>
                  <TextButtonStyle
                    sx={{ color: '#3F5170' }}
                    onClick={() => {
                      showModal(
                        <EditTokenModal
                          updater={updater}
                          daoInfo={row}
                          daoId={daoId}
                          proposalThreshold={proposalThreshold}
                          votingPeriod={votingPeriod}
                          votingType={votingType}
                        />
                      )
                    }}
                  >
                    Edit
                  </TextButtonStyle>
                  <Bar />
                  <TextButtonStyle
                    onClick={() => {
                      updateBuildingDaoKeyData('governance', [])
                      deleteToken(row.voteTokenId)
                    }}
                  >
                    Remove
                  </TextButtonStyle>
                </Box>
              </TableContentStyle>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
