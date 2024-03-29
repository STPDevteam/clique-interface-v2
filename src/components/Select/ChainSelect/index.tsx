import { MenuItem, SxProps, Theme } from '@mui/material'
import Select from 'components/Select/Select'
import LogoText from 'components/LogoText'
import InputLabel from 'components/Input/InputLabel'
import { useCallback, useMemo } from 'react'
import { Chain } from 'models/chain'

export default function ChainSelect({
  label,
  disabled,
  chainList,
  onChange,
  selectedChain,
  width,
  height,
  active,
  empty,
  placeholder,
  style
}: {
  label?: string
  disabled?: boolean
  chainList: Chain[]
  selectedChain: Chain | null
  onChange?: (chain: Chain | null) => void
  width?: string
  height?: number
  active?: boolean
  empty?: boolean
  placeholder?: string
  value?: number
  style?: React.CSSProperties | SxProps<Theme>
}) {
  const handleChange = useCallback(
    (e: { target: { value: string } }) => {
      const chain = chainList.find(chain => chain.symbol === e.target.value && chain.id) ?? null
      onChange && onChange(chain)
    },
    [chainList, onChange]
  )
  const currentList = useMemo(() => {
    if (!empty) return chainList
    return [
      {
        logo: '',
        symbol: 'All chains',
        id: null,
        name: 'All chains'
      },
      ...chainList
    ]
  }, [chainList, empty])

  return (
    <div style={{ width }}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        noBold
        defaultValue={selectedChain?.symbol}
        value={selectedChain?.symbol ?? ''}
        disabled={disabled}
        height={height || 48}
        onChange={handleChange}
        placeholder={placeholder ?? 'Select Chain'}
        // width={'100%'}
        primary={active}
        style={style}
      >
        {currentList.map(option => (
          <MenuItem
            sx={{
              justifyContent: 'space-between'
            }}
            value={option.symbol}
            key={option.symbol}
            selected={selectedChain?.symbol === option.symbol}
          >
            <LogoText logo={option.logo} text={option.symbol} />
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}
