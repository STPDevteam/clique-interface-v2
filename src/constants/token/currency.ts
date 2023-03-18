import { ChainId, SUPPORTED_NETWORKS } from 'constants/chain'
import JSBI from 'jsbi'
import { SolidityType } from './constants'
import { validateSolidityTypeInstance } from './utils'

/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */
export class Currency {
  public readonly chainId: ChainId
  public readonly address: string
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string
  public readonly logo?: string

  /**
   * The only instance of the base class `Currency`.
   */
  public static readonly ETHER: Currency = new Currency(
    1,
    '0x0000000000000000000000000000000000000000',
    18,
    'ETH',
    'Ether'
  )

  public static get_ETH_TOKEN(chainId: ChainId) {
    const chain = SUPPORTED_NETWORKS[chainId]
    if (!chain) return undefined
    return new Currency(
      chainId,
      '0x0000000000000000000000000000000000000000',
      chain.nativeCurrency.decimals,
      chain.nativeCurrency.symbol,
      chain.nativeCurrency.name
    )
  }

  /**
   * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  protected constructor(
    chainId: number,
    address: string,
    decimals: number,
    symbol?: string,
    name?: string,
    logo?: string
  ) {
    validateSolidityTypeInstance(JSBI.BigInt(decimals), SolidityType.uint8)

    this.chainId = chainId
    this.address = address
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
    this.logo = logo
  }
}

const ETHER = Currency.ETHER
export { ETHER }
