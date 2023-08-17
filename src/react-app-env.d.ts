/// <reference types="react-scripts" />

declare module 'fortmatic'

interface Window {
  ethereum?: {
    isMetaMask?: true
    on?: (...args: any[]) => void
    send: (...args: any[]) => void
    request?: (...args: any[]) => Promise<any>
    removeListener?: (...args: any[]) => void
    isBraveWallet?: true
    isRabby?: true
    isTrust?: true
    isLedgerConnect?: true
    isCoinbaseWallet?: true
  }
  okxwallet?: {
    isMetaMask?: false
    on?: (...args: any[]) => void
    send: (...args: any[]) => Promise<any>
    enable: (...args: any[]) => Promise<any>
    request?: (...args: any[]) => Promise<any>
    removeListener?: (...args: any[]) => void
    autoRefreshOnNetworkChange?: any
    cachedResults?: any
    isDapper?: boolean
    chainId?: number
    netVersion?: number
    networkVersion?: number
    _chainId?: number
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  web3?: {
    isMetaMask?: false
    on?: (...args: any[]) => void
    send: (...args: any[]) => Promise<any>
    enable: (...args: any[]) => Promise<any>
    request?: (...args: any[]) => Promise<any>
    removeListener?: (...args: any[]) => void
    autoRefreshOnNetworkChange?: any
    cachedResults?: any
    isDapper?: boolean
    chainId?: number
    netVersion?: number
    networkVersion?: number
    _chainId?: number
    currentProvider: any
  }
}

declare module 'content-hash' {
  declare function decode(x: string): string
  declare function getCodec(x: string): string
}

declare module 'multihashes' {
  declare function decode(buff: Uint8Array): { code: number; name: string; length: number; digest: Uint8Array }
  declare function toB58String(hash: Uint8Array): string
}
declare module '*.mp4' {
  const src: string
  export default src
}
declare module 'react-copy-to-clipboard'
declare module 'react-toastify'
declare namespace JSX {
  interface IntrinsicElements {
    'lottie-player': any
  }
}
