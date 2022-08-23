import { Box, Stack, styled, Typography, useTheme } from '@mui/material'
import { RowCenter } from '../ProposalItem'
import CheckBox from 'components/Checkbox'
import { BlackButton } from 'components/Button/Button'
import { ProposalDetailProp } from 'hooks/useProposalInfo'
import { VotingTypes } from 'state/buildingGovDao/actions'
import { useCallback, useState } from 'react'

export const VoteWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: theme.borderRadius.default,
  boxShadow: theme.boxShadow.bs2,
  padding: '32px'
}))

export default function Vote({ proposalInfo }: { proposalInfo: ProposalDetailProp }) {
  const theme = useTheme()

  const [checkList, setCheckList] = useState<boolean[]>(proposalInfo.proposalOptions.map(() => false))
  const setCheckListIndex = useCallback(
    (index: number, value: boolean) => {
      if (proposalInfo.votingType === VotingTypes.SINGLE) {
        const _checkList = checkList.map(() => false)
        _checkList[index] = value
        setCheckList(_checkList)
      } else {
        const _checkList = [...checkList]
        _checkList[index] = value
        setCheckList(_checkList)
      }
    },
    [checkList, proposalInfo.votingType]
  )

  return (
    <VoteWrapper>
      <RowCenter>
        <Typography variant="h6" fontWeight={500}>
          Cast your vote
        </Typography>
        <Typography fontSize={13} color={theme.palette.text.secondary}>
          {proposalInfo.votingType === VotingTypes.SINGLE ? 'Single Vote' : 'Multi Vote'}
        </Typography>
      </RowCenter>
      <Stack spacing={20} mt={24} mb={24}>
        {proposalInfo.proposalOptions.map(({ name }, index) => (
          <CheckBox
            key={index}
            checked={checkList[index]}
            onChange={(e: any) => {
              setCheckListIndex(index, e.target.checked)
            }}
            label={name}
          />
        ))}
      </Stack>
      <BlackButton height="44px" disabled={checkList.filter(i => i).length === 0} width="112px">
        Vote Now
      </BlackButton>
    </VoteWrapper>
  )
}
