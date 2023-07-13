import { styled, Box, Theme, Snackbar, Alert, Typography } from '@mui/material'
import { SxProps } from '@mui/system'
import { Axios } from 'utils/axios'
import { useCallback, useState } from 'react'
import { serverUploadImage } from '../../constants'
import Image from '../Image'
import Button from 'components/Button/Button'

const StyledUpload = styled(Box)(({ theme, size }: { theme?: any; size: number }) => ({
  gap: 40,
  flexDirection: 'row',
  display: 'flex',
  '& input': {
    width: 0,
    height: 0,
    position: 'absolute'
  },
  '.upload': {
    cursor: 'pointer',
    // margin: 'auto',
    width: size,
    height: size,
    border: `1px solid ${theme.bgColor.bg2}`,
    borderRadius: '8px',
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
    const res = await Axios.post(serverUploadImage, params)
    if (!res.data.data) {
      throw res
    }
    const data = res.data.data as string
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
  const handleClick = useCallback(() => {
    const el = document.getElementById('upload')
    el && el.click()
  }, [])
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
        // accept="image/png,image/jpg,image/jpeg"
        accept=".jpg, .jpeg, .png"
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
          <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M33.8667 34.2167H4.23333V4.58333H23.2833V0.35H4.23333C1.905 0.35 0 2.255 0 4.58333V34.2167C0 36.545 1.905 38.45 4.23333 38.45H33.8667C36.195 38.45 38.1 36.545 38.1 34.2167V15.1667H33.8667V34.2167ZM17.3778 27.5068L13.2292 22.5115L7.40833 29.9833H30.6917L23.1987 20.0138L17.3778 27.5068ZM32.1 6.35V0H27.8667V6.35H21.5167C21.5378 6.37117 21.5167 10.5833 21.5167 10.5833H27.8667V16.9122C27.8878 16.9333 32.1 16.9122 32.1 16.9122V10.5833H38.45V6.35H32.1Z"
              fill="#97B7EF"
            />
          </svg>
        )}
      </label>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography variant="body1" color={'#80829F'}>
          Upload file
        </Typography>
        <Typography sx={{ width: '180px', lineHeight: '21px', fontWeight: 500, color: '#B5B7CF' }}>
          Supported: JPG, PNG, Max size:100 MB
        </Typography>
        <Button width="125px" height="40px" style={{ marginTop: 25 }} onClick={handleClick}>
          + Upload
        </Button>
      </Box>
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
