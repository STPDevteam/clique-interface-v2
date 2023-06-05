import {
  Box,
  Typography,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import Input from 'components/Input'
import Button from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import ToggleButtonGroup from 'components/ToggleButtonGroup'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import AddTokenModal from '../AddTokenModal'
import { DaoInfoProp } from 'hooks/useDaoInfo'
import useModal from 'hooks/useModal'
import { ChainId } from 'constants/chain'
import { Dots } from 'theme/components'
import { useState } from 'react'

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

export default function General({ daoInfo, daoChainId }: { daoInfo: DaoInfoProp; daoChainId: ChainId }) {
  const { showModal } = useModal()
  const PeriodList = [
    { label: 'Fix time', value: 'Fix time' },
    { label: 'Customization', value: 'Customization' }
  ]
  const TypesList = [
    { label: 'Any', value: 'Any' },
    { label: 'Single-voting', value: 'Single-voting' },
    { label: 'Multi-voting', value: 'Multi-voting' }
  ]
  const [PeriodValue, setPeriodValue] = useState(PeriodList[0].value)
  const [TypesValue, setTypesValue] = useState(TypesList[0].value)

  return (
    <Box>
      <Row sx={{ gap: 10, mb: 14 }}>
        <Button
          style={{ maxWidth: 184, height: 36 }}
          onClick={() => {
            showModal(<AddTokenModal />)
          }}
        >
          Add Governance Token
        </Button>
        <OutlineButton style={{ maxWidth: 184, height: 36, color: '#3F5170', border: '1px solid #3F5170' }}>
          Create new token
        </OutlineButton>
      </Row>
      <BasicTable />

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
              <InputTitleStyle style={{ lineHeight: '20px' }}>Voting period</InputTitleStyle>
              <InputStyle
                placeholderSize="14px"
                placeholder={PeriodValue}
                endAdornment={
                  <Typography color="#B5B7CF" lineHeight="20px" variant="body1">
                    Votes
                  </Typography>
                }
                value={''}
              />
            </Row>
            <Row sx={{ maxWidth: 463, gap: 10, flexDirection: 'column' }}>
              <Row sx={{ justifyContent: 'space-between' }}>
                <InputTitleStyle>Voting period</InputTitleStyle>
                <ToggleButtonGroup Props={PeriodList} setToggleValue={setPeriodValue} />
              </Row>
              <InputStyle
                placeholderSize="14px"
                placeholder={PeriodValue}
                endAdornment={
                  <Typography color="#B5B7CF" lineHeight="20px" variant="body1">
                    Hours
                  </Typography>
                }
                value={''}
              />
            </Row>
          </GridLayoutff>
        </Box>
        <GridLayoutff>
          <Box>
            <Row sx={{ maxWidth: 463, justifyContent: 'space-between', mb: 10 }}>
              <InputTitleStyle>Voting Types</InputTitleStyle>
              <ToggleButtonGroup Props={TypesList} setToggleValue={setTypesValue} />
            </Row>
            <Typography>{TypesValue}</Typography>
          </Box>
        </GridLayoutff>
      </Box>

      <Box mt={30} display="flex" justifyContent={'flex-end'}>
        <BlackButton
          width="270px"
          height="40px"
          onClick={() => console.log(daoChainId, daoInfo, PeriodValue, TypesValue)}
        >
          {false ? (
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
  color: '#3F5170',
  cursor: 'pointer',
  userSelect: 'none'
}))

function BasicTable() {
  const { showModal } = useModal()
  const rows = [
    {
      token: 'Loot (LOOT)',
      network: 'Ethereum',
      requir: '111',
      weight: '1STP=1 Votes'
    },
    {
      token: 'Loot (LOOT)',
      network: 'Ethereum',
      requir: '111',
      weight: '1STP=1 Votes'
    }
  ]
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
            <TableRow key={row.token + index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableContentStyle sx={{ pl: 30, display: 'flex', alignItems: 'center', gap: 12 }}>
                <CurrencyLogo size="32px" /> {row.token}
              </TableContentStyle>
              <TableContentStyle>{row.network}</TableContentStyle>
              <TableContentStyle>{row.requir}</TableContentStyle>
              <TableContentStyle>{row.weight}</TableContentStyle>
              <TableContentStyle sx={{ width: 200 }}>
                <Box sx={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <TextButtonStyle
                    onClick={() => {
                      showModal(<AddTokenModal />)
                    }}
                  >
                    Edit
                  </TextButtonStyle>
                  <Box
                    sx={{
                      width: 0,
                      height: 14,
                      border: '1px solid #D4D7E2'
                    }}
                  ></Box>
                  <TextButtonStyle sx={{ color: '#E46767' }}>Remove</TextButtonStyle>
                </Box>
              </TableContentStyle>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
