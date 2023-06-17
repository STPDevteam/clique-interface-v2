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
  Alert
} from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import Input from 'components/Input/InputNumerical'
import Button from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import ToggleButtonGroup from 'components/ToggleButtonGroup'
import defaultLogo from 'assets/images/create-token-ball.png'
import AddTokenModal from '../AddTokenModal'
import Image from 'components/Image'
import useModal from 'hooks/useModal'
import { Dots } from 'theme/components'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { CreateDaoDataProp, govList } from 'state/buildingGovDao/actions'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useUpdateGovernance } from 'hooks/useBackedDaoServer'
import { toast } from 'react-toastify'
import { ChainListMap } from 'constants/chain'
import { useDeleteGovToken } from 'hooks/useBackedProposalServer'

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
const GridLayoutff = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16
}))

const Row = styled(Box)(() => ({
  display: 'flex'
}))

export default function General({ daoInfo, daoId }: { daoInfo: CreateDaoDataProp; daoId: number }) {
  const { showModal } = useModal()
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
  const [PeriodValue, setPeriodValue] = useState(PeriodList[0].value)
  const [TypesValue, setTypesValue] = useState(daoInfo.votingType || TypesList[0].value)
  const [cGovernance, setCGovernance] = useState([...daoInfo.governance])
  const [proposalThreshold, setProposalThreshold] = useState(daoInfo.proposalThreshold || '')
  const history = useHistory()
  const weight = useMemo(
    () =>
      cGovernance.map(item => ({
        createRequire: item.createRequire,
        voteTokenId: item.voteTokenId,
        votesWeight: item.weight
      })),
    [cGovernance]
  )
  const cb = useUpdateGovernance()
  const updateGovernance = useCallback(() => {
    setLoading(true)
    const time = PeriodValue === 'Fixtime' ? Number(fixTime) * 3600 : 0
    cb(Number(daoId), Number(proposalThreshold), time, Number(TypesValue), weight)
      .then(res => {
        setLoading(false)
        if (res.data.code !== 200) {
          toast.error(res.data.msg || 'network error')
          return
        }
        toast.success('Update success')
      })
      .catch(err => {
        toast.error(err || 'network error')
        setLoading(false)
      })
  }, [PeriodValue, TypesValue, cb, daoId, fixTime, proposalThreshold, weight])

  const saveBtn: {
    disabled: boolean
    error?: undefined | string | JSX.Element
  } = useMemo(() => {
    if (Number(fixTime) < 72 && PeriodValue === 'Fixtime') {
      return {
        disabled: true,
        error: 'Mininum voting period is 72 hours'
      }
    }
    if (cGovernance.length < 1) {
      return {
        disabled: true,
        error: 'Mininum token amount is 1'
      }
    }
    if (!proposalThreshold) {
      return {
        disabled: true,
        error: 'Please enter proposalThershold'
      }
    }
    return {
      disabled: false
    }
  }, [PeriodValue, cGovernance.length, fixTime, proposalThreshold])

  return (
    <Box>
      <Row sx={{ gap: 10, mb: 14 }}>
        <Button
          disabled={cGovernance.length >= 1}
          style={{ maxWidth: 184, height: 36 }}
          onClick={() => {
            showModal(<AddTokenModal daoId={daoId} />)
          }}
        >
          Add Governance Token
        </Button>
        <OutlineButton
          style={{ maxWidth: 184, height: 36, color: '#3F5170', border: '1px solid #3F5170' }}
          onClick={() => history.push(routes.CreatorToken)}
        >
          Create new token
        </OutlineButton>
      </Row>
      <BasicTable daoId={daoId} governance={cGovernance} setCGovernance={setCGovernance} />
      <Box sx={{ display: 'grid', flexDirection: 'column', gap: 20 }}>
        <Typography
          sx={{
            mt: 23,
            fontWeight: 500,
            fontSize: 14,
            lineHeight: '20px',
            color: '#B5B7CF'
          }}
        >
          Governance setting
        </Typography>
        <Box>
          <InputTitleStyle mb={8}>Threshold</InputTitleStyle>
          <GridLayoutff>
            <Row sx={{ gap: 10, flexDirection: 'column' }}>
              <InputTitleStyle style={{ lineHeight: '20px' }}>
                Minimum Votes Needed For Proposal To Execute
              </InputTitleStyle>
              <InputStyle
                placeholderSize="14px"
                placeholder={'0'}
                endAdornment={
                  <Typography color="#B5B7CF" lineHeight="20px" variant="body1">
                    Votes
                  </Typography>
                }
                onChange={e => setProposalThreshold(e.target.value)}
                value={proposalThreshold}
              />
            </Row>
            <Row sx={{ maxWidth: 463, gap: 10, flexDirection: 'column' }}>
              <Row sx={{ justifyContent: 'space-between' }}>
                <InputTitleStyle>Voting period</InputTitleStyle>
                <ToggleButtonGroup Props={PeriodList} setToggleValue={setPeriodValue} />
              </Row>
              {PeriodValue === 'Fixtime' ? (
                <InputStyle
                  placeholderSize="14px"
                  placeholder={'0'}
                  endAdornment={
                    <Typography color="#B5B7CF" lineHeight="20px" variant="body1">
                      Hours
                    </Typography>
                  }
                  value={fixTime}
                  onChange={e => {
                    // if (e.target.value && Number(e.target.value) < 72) return
                    setFixtime(e.target.value)
                  }}
                />
              ) : (
                <InputStyle
                  readOnly
                  value={''}
                  placeholderSize="14px"
                  placeholder="Customize the voting time when creating a proposal"
                />
              )}
            </Row>
          </GridLayoutff>
        </Box>
        <GridLayoutff>
          <Box>
            <Row sx={{ maxWidth: 463, justifyContent: 'space-between', mb: 10 }}>
              <InputTitleStyle>Voting Types</InputTitleStyle>
              <ToggleButtonGroup Props={TypesList} setToggleValue={setTypesValue} />
            </Row>
          </Box>
        </GridLayoutff>
      </Box>
      {saveBtn.error && (
        <Alert sx={{ marginTop: 15 }} severity="error">
          {saveBtn.error}
        </Alert>
      )}
      <Box mt={30} display="flex" justifyContent={'flex-end'}>
        <BlackButton width="270px" height="40px" onClick={updateGovernance} disabled={saveBtn.disabled}>
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
  color: '#B5B7CF',
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
  daoId,
  governance,
  setCGovernance
}: {
  daoId: number
  governance: govList[]
  setCGovernance: Dispatch<SetStateAction<govList[]>>
}) {
  console.log(daoId)
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

  const delItem = useCallback(
    (index: number) => {
      const newArray = [...governance]
      newArray.splice(index, 1)
      setCGovernance(newArray)
    },
    [governance, setCGovernance]
  )

  const deleteToken = useCallback(
    (voteTokenId: number, index: number) => {
      deleteTokenCB(voteTokenId).then(res => {
        if (res.data.code !== 200) {
          toast.error('network error')
          return
        }
        delItem(index)
        toast.success('Remove success')
      })
    },
    [delItem, deleteTokenCB]
  )

  return (
    <TableContainer sx={{ border: '1px solid #D4D7E2', borderRadius: '8px' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableContentTitle sx={{ pl: 30 }}>Token</TableContentTitle>
            <TableContentTitle>Network</TableContentTitle>
            <TableContentTitle>Requirement</TableContentTitle>
            <TableContentTitle>Voting weight</TableContentTitle>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.symbol + index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableContentStyle sx={{ pl: 30, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Image src={row.logo || defaultLogo} width={32} />
                {row.name}({row.symbol})
              </TableContentStyle>
              <TableContentStyle>{ChainListMap[row.id].name}</TableContentStyle>
              <TableContentStyle>{row.require}</TableContentStyle>
              <TableContentStyle>{row.weight}</TableContentStyle>
              <TableContentStyle sx={{ width: 200 }}>
                <Box sx={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center' }}>
                  <TextButtonStyle onClick={() => deleteToken(row.voteTokenId, index)}>Remove</TextButtonStyle>
                </Box>
              </TableContentStyle>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
