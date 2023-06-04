import { FormControlProps, InputLabel, FormControl, FormHelperText, Stack, Box } from '@mui/material'
import { FieldMetaProps, FieldProps } from 'formik'
import { Field, useFormikContext } from 'formik'
import React, { cloneElement } from 'react'

export type IFormItemType = 'custom' | 'text'

export type IFormItemProps = {
  label?: React.ReactNode
  name?: string
  children: React.ReactNode
  tips?: React.ReactNode
  fieldType?: IFormItemType
  startAdornment?: React.ReactNode
} & FormControlProps

const CloneChildren = (children: any, { field }: FieldProps) => {
  const props = children.props
  if (!!props.name || props.type === 'hidden') {
    return children
  }

  return cloneElement(children, { ...props, ...field })
}

export type IFormFieldProps = { name?: string; component: React.ReactNode }
const FormField: React.FC<IFormFieldProps> = ({ name, component }) => {
  if (!name) {
    return <>{component}</>
  }

  return (
    <Field name={name}>
      {(fieldProps: FieldProps) => {
        return CloneChildren(component, fieldProps)
      }}
    </Field>
  )
}

const FormItem: React.FC<IFormItemProps> = ({
  label,
  name = '',
  tips,
  children,
  fieldType = 'text',
  sx,
  startAdornment,
  ...rest
}) => {
  const formik = useFormikContext<any>()

  // No <Formik /> on the upper level
  const { submitCount, getFieldMeta } = formik || { submitCount: 0, getFieldMeta: (v: string) => v }

  const meta = (name ? getFieldMeta(name) : { error: '', touched: false }) as FieldMetaProps<any>
  const error = meta.error
    ? typeof meta.error === 'string'
      ? meta.error
      : // eslint-disable-next-line @typescript-eslint/ban-types
        Object.values((meta.error as unknown) as object)[0]
    : ''
  const showError = (meta.touched || submitCount > 0) && !!error
  const showTips = showError || !!tips

  return (
    <Stack
      error={showError}
      component={FormControl}
      {...rest}
      sx={{
        '& .MuiFormLabel-asterisk': {
          display: 'none'
        },
        ...sx
      }}
    >
      {label && <InputLabel sx={{ left: startAdornment ? 50 : '' }}>{label}</InputLabel>}
      <Stack direction="row" sx={{ position: 'relative' }}>
        {startAdornment && (
          <Box
            sx={{
              position: 'absolute',
              left: 10,
              top: '50%',
              zIndex: 9,
              maxWidth: 40,
              maxHeight: 40,
              borderRadius: '50%',
              overflow: 'hidden',
              transform: 'translateY(-50%)'
            }}
          >
            {startAdornment}
          </Box>
        )}
        <Box sx={{ '&>div:first-of-type': { pl: startAdornment ? 50 : '', width: '100%' }, width: '100%' }}>
          {fieldType === 'custom' || !formik ? children : <FormField name={name} component={children} />}
        </Box>
      </Stack>
      {showTips && <FormHelperText>{showError ? error : tips}</FormHelperText>}
    </Stack>
  )
}

export default FormItem
