import React from 'react'
import { Button, styled } from '@mui/material'
import { ExternalLink } from 'theme/components'
import LogoText from 'components/LogoText'

const GreenCircle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'center',
  alignItems: 'center',
  '& div ': {
    height: 8,
    width: 8,
    marginRight: 8,
    backgroundColor: theme.palette.success.main,
    borderRadius: '50%'
  }
}))

export default function Option({
  link = null,
  clickable = true,
  onClick = null,
  header,
  icon,
  active = false,
  id
}: {
  link?: string | null
  clickable?: boolean
  onClick?: (() => void) | null
  header: React.ReactNode
  icon: string
  active?: boolean
  id: string
}) {
  const content = (
    <>
      <Button
        key={id}
        variant="outlined"
        fullWidth
        onClick={onClick || undefined}
        disabled={!clickable || active}
        sx={{
          border: '1px solid #D4D7E2',
          justifyContent: 'flex-start',
          paddingLeft: '24px',
          color: active ? '#fff' : '#3F5170',
          '&:hover': {
            borderColor: '#97B7EF',
            color: '#0049C6',
            boxShadow: '0px 2px 8px rgba(35, 38, 132, 0.15)'
          }
        }}
      >
        {active ? (
          <GreenCircle>
            <div />
          </GreenCircle>
        ) : null}
        <LogoText fontWeight={600} logo={icon} text={header} size="40px" />
      </Button>
    </>
  )
  if (link) {
    return <ExternalLink href={link}>{content}</ExternalLink>
  }
  return content
}
