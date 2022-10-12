import { Box, Typography, Switch, styled } from '@mui/material'
import { RowCenter } from '../Proposal/ProposalItem'
import Checkbox from 'components/Checkbox'
import { useCallback } from 'react'
import Input from 'components/Input'

const StyledItem = styled(Box)(({ theme }) => ({
  padding: '4px 12px',
  borderBottom: `1px solid ${theme.bgColor.bg2}`
}))

interface AirdropCollectFieldProp {
  checked: boolean
  name: string
  required: boolean
}

export default function InputField({
  fieldList,
  onFieldList
}: {
  fieldList: AirdropCollectFieldProp[]
  onFieldList: (list: AirdropCollectFieldProp[]) => void
}) {
  const onFieldListItem = useCallback(
    (index: number, item: AirdropCollectFieldProp) => {
      const list = [...fieldList]
      list[index] = item
      onFieldList(list)
    },
    [fieldList, onFieldList]
  )

  return (
    <Box>
      {fieldList.map((item, index) => (
        <StyledItem key={index}>
          <RowCenter>
            <RowCenter>
              <Checkbox
                checked={item.checked}
                onChange={e => onFieldListItem(index, Object.assign(item, { checked: e.target.checked }))}
              />
              {index === fieldList.length - 1 ? (
                <Input
                  style={{ fontSize: 12, padding: '0 10px' }}
                  height={26}
                  value={item.name}
                  onChange={e => onFieldListItem(index, Object.assign(item, { name: e.target.value }))}
                  onBlur={() => {
                    if (item.name.trim() === '') {
                      onFieldListItem(index, Object.assign(item, { name: 'Other' }))
                    }
                  }}
                />
              ) : (
                <Typography fontSize={12} fontWeight={600}>
                  {item.name}
                </Typography>
              )}
            </RowCenter>
            <Switch
              checked={item.required}
              onChange={e => onFieldListItem(index, Object.assign(item, { required: e.target.checked }))}
            />
          </RowCenter>
        </StyledItem>
      ))}
    </Box>
  )
}
