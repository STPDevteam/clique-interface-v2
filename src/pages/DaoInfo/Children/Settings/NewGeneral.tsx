import { Box, Stack, styled, Typography, useTheme, Checkbox, MenuItem } from '@mui/material'
import { BlackButton } from 'components/Button/Button'
import CategoriesSelect from 'components/Governance/CategoriesSelect'
import Input from 'components/Input'
import UploadImage from 'components/UploadImage'
import Button from 'components/Button/Button'
import { DaoInfoProp } from 'hooks/useDaoInfo'
import { ChainId } from 'constants/chain'
import { Dots } from 'theme/components'
import Tooltip from 'components/Tooltip'
import ToggleButtonGroup from 'components/ToggleButtonGroup'
import Select from 'components/Select/Select'
import { useState } from 'react'
// import { useActiveWeb3React } from 'hooks'
// import { useAdminSetInfoCallback } from 'hooks/useGovernanceDaoCallback'
// import useModal from 'hooks/useModal'
// import MessageBox from 'components/Modal/TransactionModals/MessageBox'
// import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
// import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
// import { useCallback, useMemo, useState } from 'react'
// import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
// import { removeEmoji } from 'utils'
// import { triggerSwitchChain } from 'utils/triggerSwitchChain'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 24,
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'unset',
    padding: '20px'
  }
}))

const InputStyle = styled(Input)(() => ({
  height: 40
}))

export default function General({ daoInfo, daoChainId }: { daoInfo: DaoInfoProp; daoChainId: ChainId }) {
  const ListItem = [
    { label: 'Anyone', value: 'Anyone' },
    { label: 'Holding token or NFT', value: 'Holding token or NFT' }
  ]
  const [checked, setChecked] = useState(false)
  const checkedChange = (event: any) => {
    setChecked(event.target.checked)
  }
  const [ToggleValue, setToggleValue] = useState('Anyone')
  const theme = useTheme()
  return (
    <Box>
      <Wrapper>
        <Stack
          spacing={19}
          sx={{
            '& .MuiInputBase-input': {
              height: '40!important',
              padding: '0 15px 0 0!important'
            },
            '& .MuiSelect-select.MuiInputBase-input': {
              paddingLeft: '20px!important'
            }
          }}
        >
          <Box sx={{ display: 'flex', gap: 42, mt: 20, mb: 10 }}>
            <UploadImage onChange={val => console.log(val)} size={124}></UploadImage>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <Typography sx={{ width: '150px', lineHeight: '17px', fontWeight: 400, color: '#80829F' }}>
                File types supported: JPG, PNG, GIF.
              </Typography>
              <Button width="125px" height="40px" style={{ marginTop: 25 }}>
                + Upload
              </Button>
            </Box>
          </Box>
          <Input
            label="Introduction"
            placeholderSize="14px"
            maxLength={200}
            endAdornment={
              <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2">
                0/200
              </Typography>
            }
            placeholder="Add a brief description about your project."
            value={''}
          />
          <CategoriesSelect style={{ height: '42px!important' }} value={''} />
          <Input label="Twitter" value={''} />
        </Stack>
        <Box
          display={'grid'}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'space-between',
            gap: 20,
            '& .MuiInputBase-input': {
              height: '40!important',
              padding: '0 15px 0 0!important'
            }
          }}
        >
          <Input
            label="Organization Name"
            placeholderSize="14px"
            maxLength={20}
            endAdornment={
              <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2">
                0/20
              </Typography>
            }
            placeholder="Organization Name"
            value={''}
          />
          <Box>
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                mb: 10,
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '16px',
                color: '#80829F'
              }}
            >
              Organize Username
              <Tooltip value="Organize username must be between 4-20 characters and contain letters, numbers and underscores only." />
            </Typography>
            <Input
              maxLength={20}
              endAdornment={
                <Typography color={theme.palette.text.secondary} fontWeight={500} variant="body2">
                  0/20
                </Typography>
              }
              value={''}
            />
          </Box>
          <Input label="Github" placeholderSize="14px" placeholder="e.c. bitcoin" value={''} />
          <Input label="Discord" placeholderSize="14px" placeholder="e.c. bitcoin" value={''} />
          <Input label="Website" value={''} />
        </Box>
      </Wrapper>
      <Box sx={{ mt: 20, display: 'flex', gap: 38, alignItems: 'center' }}>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '16px',
            color: '#80829F'
          }}
        >
          Who can join the DAO
        </Typography>
        <ToggleButtonGroup itemWidth={150} Props={ListItem} setToggleValue={setToggleValue} />
      </Box>

      {ToggleValue == 'Anyone' ? (
        ''
      ) : (
        <Box
          sx={{
            mt: 20,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 16
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '16px',
                color: '#80829F',
                mb: 10
              }}
            >
              Token preview
            </Typography>
            <Select
              noBold
              placeholder=""
              style={{ fontWeight: 500, fontSize: 14 }}
              height={40}
              value={ListItem[0].value}
              // onChange={e => setCurrentProposalStatus(e.target.value)}
            >
              {ListItem.map(item => (
                <MenuItem
                  key={item.value}
                  sx={{ fontWeight: 500, fontSize: '14px !important', color: '#3F5170' }}
                  value={item.value}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <InputStyle label="Token Contract Address" placeholderSize="14px" placeholder="0x..." value={''} />
          <InputStyle label="Number" placeholderSize="14px" placeholder="0" value={''} />
          <Box>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '16px',
                color: '#80829F'
              }}
            >
              Token preview
            </Typography>

            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '20px',
                color: '#3F5170',
                mt: 10
              }}
            >
              <Checkbox sx={{ borderRadius: '50%', color: '#D9D9D9' }} checked={checked} onChange={checkedChange} /> STP
              Network (STPT)
            </Typography>
          </Box>
        </Box>
      )}

      <Box mt={30} display="flex" justifyContent={'flex-end'}>
        <BlackButton width="270px" height="40px" onClick={() => console.log(checked, daoChainId, daoInfo, ToggleValue)}>
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
