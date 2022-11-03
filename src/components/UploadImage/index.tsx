import { styled, Box, Theme, Snackbar, Alert } from '@mui/material'
import { SxProps } from '@mui/system'
import axios from 'axios'
import { useState } from 'react'
import { serverUploadImage } from '../../constants'
import Image from '../Image'

const StyledUpload = styled(Box)(({ theme, size }: { theme?: any; size: number }) => ({
  '& input': {
    width: 0,
    height: 0,
    position: 'absolute'
  },
  '.upload': {
    cursor: 'pointer',
    margin: 'auto',
    width: size,
    height: size,
    border: `1px solid ${theme.bgColor.bg2}`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& img': {
      width: '100%',
      height: '100%',
      borderRadius: '50%'
    }
  }
}))

async function save(
  file: File
): Promise<{
  data: string
  result: boolean
}> {
  if (file.size > 1024 * 1024 * 2) {
    return {
      data: 'Image must smaller than 2M!',
      result: false
    }
  }
  const params = new FormData()
  params.append('file', file)
  try {
    const res = await axios.post(serverUploadImage, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if (!res.data.data) {
      throw res
    }
    const data = res.data.data.path as string
    return {
      data: data,
      result: true
    }
  } catch (error) {
    const err = error as any
    return {
      data: err?.data?.msg || err?.message || 'upload failed',
      result: false
    }
  }
}

export default function Index({
  value,
  size,
  sx,
  disabled,
  onChange
}: {
  value?: string
  size: number
  disabled?: boolean
  sx?: SxProps<Theme>
  onChange?: (val: string) => void
}) {
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [errorMsg, setErrorMsg] = useState('Upload failed')
  return (
    <StyledUpload
      sx={sx}
      size={size}
      onDragOver={e => {
        e.preventDefault()
      }}
      onDrop={async event => {
        event.preventDefault()
        const file = event.dataTransfer?.files?.[0]
        if (file) {
          const ret = await save(file)
          if (ret.result) {
            onChange && onChange(ret.data)
          } else {
            setErrorMsg(ret.data)
            setOpenSnackbar(true)
          }
        }
        const el = document.getElementById('upload') as HTMLInputElement
        el.value = ''
      }}
    >
      <input
        id="upload"
        type="file"
        accept="image/png,image/jpg,image/jpeg"
        onChange={async event => {
          const file = event.target?.files?.[0]
          if (file) {
            const ret = await save(file)
            if (ret.result) {
              onChange && onChange(ret.data)
            } else {
              setErrorMsg(ret.data)
              setOpenSnackbar(true)
            }
          }
          event.target.value = ''
        }}
      />
      <label className="upload" htmlFor={!disabled ? 'upload' : undefined}>
        {value ? (
          <Image src={value} />
        ) : (
          <svg width={'48%'} height={'48%'} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M48.0002 53.3332H10.6668V15.9998H34.6668V10.6665H10.6668C7.7335 10.6665 5.3335 13.0665 5.3335 15.9998V53.3332C5.3335 56.2665 7.7335 58.6665 10.6668 58.6665H48.0002C50.9335 58.6665 53.3335 56.2665 53.3335 53.3332V29.3332H48.0002V53.3332ZM27.2268 44.8798L22.0002 38.5865L14.6668 47.9998H44.0002L34.5602 35.4398L27.2268 44.8798ZM53.3335 10.6665V2.6665H48.0002V10.6665H40.0002C40.0268 10.6932 40.0002 15.9998 40.0002 15.9998H48.0002V23.9732C48.0268 23.9998 53.3335 23.9732 53.3335 23.9732V15.9998H61.3335V10.6665H53.3335Z"
              fill="#E4E4E4"
            />
          </svg>
        )}
      </label>
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error">{errorMsg}</Alert>
      </Snackbar>
    </StyledUpload>
  )
}
