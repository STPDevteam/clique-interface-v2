import React, { useEffect, useState } from 'react'
import Logo from './LogoBase'
import { Currency } from '../../../constants/token/currency'
import { Token } from '../../../constants/token/token'
import { getTokenLogo } from 'utils/fetch/server'

// export const getTokenLogoURL = (address: string) =>
//   `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const [srcs, setSrcs] = useState<string[]>([])
  const [args, setArgs] = useState<{ address: string; chainId: number }>()
  // const srcs: string[] = useMemo(() => {
  //   if (currency instanceof Token) {
  //     return [getTokenLogoURL(currency.address)]
  //   }
  //   return []
  // }, [currency])

  useEffect(() => {
    if (currency instanceof Token) {
      if (args?.address !== currency.address && args?.chainId !== currency.chainId) {
        setArgs({
          address: currency.address,
          chainId: currency.chainId
        })
      }
    } else {
      setArgs(undefined)
    }
  }, [args, currency])

  useEffect(() => {
    ;(async () => {
      if (args) {
        try {
          const res = await getTokenLogo(args.address, args.chainId)
          setSrcs([res.data.data.thumb || res.data.data.ownImg || ''])
        } catch (error) {
          setSrcs([])
        }
      } else {
        setSrcs([])
      }
    })()
  }, [args])

  return (
    <Logo
      style={{
        ...style,
        width: size,
        height: size,
        borderRadius: size
        // boxShadow: ' 0px 6px 10px rgba(0, 0, 0, 0.075)'
      }}
      srcs={srcs}
      // alt={`${currency?.symbol ?? 'token'} logo`}
    />
  )
}
