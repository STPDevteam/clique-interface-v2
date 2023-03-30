import React, { useEffect, useState } from 'react'
import Logo from './LogoBase'
import { Currency } from '../../../constants/token/currency'
import { getTokenLogo } from 'utils/fetch/server'
import isZero from 'utils/isZero'
import { ChainListMap } from 'constants/chain'

// export const getTokenLogoURL = (address: string) =>
//   `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

const logos: { [key in string]: string[] } = {}

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
    if (currency) {
      if (currency.logo) {
        setSrcs([currency.logo])
        return
      } else if (args?.address !== currency.address && args?.chainId !== currency.chainId) {
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
      if (args && srcs.length === 0) {
        const key = `${args.chainId}_${args.address}`
        try {
          if (logos[key]) {
            setSrcs(logos[key])
            return
          }
          if (isZero(args.address)) {
            setSrcs([ChainListMap[args.chainId].logo])
            return
          }
          const res = await getTokenLogo(args.address, args.chainId)
          setSrcs([res.data.data.small || res.data.data.ownImg || ''])
          logos[key] = [res.data.data.small || res.data.data.ownImg || '']
        } catch (error) {
          setSrcs([])
        }
      }
    })()
  }, [args, srcs.length])

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
