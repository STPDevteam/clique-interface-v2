import { ChainId, ChainListMap } from 'constants/chain'
import { useMemo } from 'react'
import LogoText from '.'

export default function ChainText({ chainId }: { chainId?: ChainId }) {
  const currentChain = useMemo(() => (chainId ? ChainListMap[chainId] : undefined), [chainId])
  return currentChain ? (
    <LogoText
      center
      logo={currentChain.logo}
      text={currentChain.symbol}
      gapSize={'small'}
      fontSize={14}
      fontWeight={600}
    />
  ) : null
}
