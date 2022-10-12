import { Alert, Link, Snackbar, Stack, styled, Typography } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import { RowCenter } from '../Proposal/ProposalItem'
import DownloadIcon from '@mui/icons-material/Download'
import Input from 'components/Input'
import InputNumerical from 'components/Input/InputNumerical'
import { useCallback, useState } from 'react'
import { toFormatGroup } from 'utils/dao'
import BigNumber from 'bignumber.js'
import { isAddress } from 'utils'

const Root = styled('div')(
  ({ theme }) => `
  table {
    border-collapse: collapse;
    width: 100%;
    background: ${theme.bgColor.bg4}
  }

  td,
  th {
    font-size: 12px;
    border: 1px solid ${theme.bgColor.bg2};
    text-align: left;
    font-weight: 600;
    padding: 10px 32px;
  }
  th {
    color: ${theme.palette.text.secondary};
    font-size: 14
  }
`
)
const StyledText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 12,
  fontWeight: 500
}))

const UploadLabel = styled('label')({
  border: '1px solid',
  width: 127,
  height: 20,
  fontWeight: 500,
  fontSize: 12,
  cursor: 'pointer',
  display: 'inline-block',
  textAlign: 'center',
  borderRadius: '16px'
})

interface ItemProp {
  address: string
  amount: string
}

const insertLine = (list: ItemProp[], newItem: ItemProp) => {
  const _ret = list.filter(({ address }) => address.toLowerCase() !== newItem.address.toLowerCase())
  _ret.push(newItem)
  return _ret
}

export default function AirdropTable({
  airdropList,
  setAirdropList,
  readonly,
  totalInputAmount
}: {
  airdropList: ItemProp[]
  setAirdropList: (val: ItemProp[]) => void
  readonly?: boolean
  totalInputAmount: string
}) {
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const addLine = useCallback(() => {
    if (!address || new BigNumber(amount || 0).isLessThanOrEqualTo(0)) return
    setAirdropList(insertLine(airdropList, { address, amount }))
    setAddress('')
    setAmount('')
  }, [address, airdropList, amount, setAirdropList])

  const uploadCSV = useCallback(() => {
    const el = document.getElementById('upload_CSV') as HTMLInputElement
    if (!el || !el.files) return
    const reader = new FileReader()
    reader.onload = function() {
      const ret: ItemProp[] = []
      const textInput = reader.result as string
      const allRows = textInput.split(/\r?\n|\r/)
      for (let i = 0; i < allRows.length; i++) {
        const splitTextInput = allRows[i].split(',')
        if (!splitTextInput[0].trim() || !splitTextInput[1].trim()) {
          continue
        }
        if (!isAddress(splitTextInput[0].trim())) {
          setOpenSnackbar(true)
          el.value = ''
          return
        }
        ret.push({
          address: splitTextInput[0].trim(),
          amount: splitTextInput[1].trim()
        })
      }
      el.value = ''
      let newList: ItemProp[] = [...airdropList]
      for (const item of ret) {
        newList = insertLine(newList, item)
      }
      setAirdropList(newList)
    }
    reader.readAsBinaryString(el.files[0])
  }, [airdropList, setAirdropList])

  return (
    <Stack spacing={10} mt={20}>
      <RowCenter>
        <RowCenter>
          <StyledText mr={10}>DAOdrop addresses</StyledText>
          {readonly ? null : (
            <div>
              <input accept=".csv" type="file" onChange={uploadCSV} id="upload_CSV" style={{ width: 0, height: 0 }} />
              <UploadLabel htmlFor="upload_CSV">Upload CSV file</UploadLabel>
            </div>
          )}
        </RowCenter>
        <Link href="/template/daodrop-list.csv">
          <Typography display={'flex'} alignItems="center" fontSize={12}>
            Download Templates
            <DownloadIcon sx={{ height: 16 }} />
          </Typography>
        </Link>
      </RowCenter>
      <Root>
        <table aria-label="custom pagination table">
          <thead>
            <tr>
              <th>Address</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {airdropList.map((row, index) => (
              <tr key={index}>
                <td>{row.address}</td>
                <td style={{ width: 160 }} align="right">
                  {toFormatGroup(row.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Root>
      {!readonly && (
        <Stack spacing={'20px'} direction="row">
          <Input
            value={address}
            onChange={e => setAddress(e.target.value)}
            errSet={() => setAddress('')}
            height={40}
            type="address"
            placeholder="0x"
            label="Wallet address"
          />
          <InputNumerical height={40} value={amount} onChange={e => setAmount(e.target.value)} label="DAOdrop amount" />
        </Stack>
      )}
      <RowCenter>
        {readonly ? (
          <div />
        ) : (
          <OutlineButton
            onClick={addLine}
            width="155px"
            height="20px"
            fontWeight={500}
            fontSize={12}
            style={{ borderWidth: 1 }}
          >
            Add new wallet
          </OutlineButton>
        )}
        <Typography>
          Total addresses: {airdropList.length}, Total amount: {totalInputAmount}
        </Typography>
      </RowCenter>
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error">Address format error, please download the template.</Alert>
      </Snackbar>
    </Stack>
  )
}
