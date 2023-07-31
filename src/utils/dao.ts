import toFormat from 'toformat'
import _Big from 'big.js'
import BigNumber from 'bignumber.js'
import moment from 'moment'

export function timeStampToFormat(timeStamp: number | Date | undefined, format = 'Y-MM-DD HH:mm:ss') {
  if (!timeStamp) return '--'
  if (timeStamp instanceof Date) {
    return moment(timeStamp).format(format)
  }
  timeStamp = timeStamp.toString().length <= 10 ? timeStamp * 1000 : timeStamp
  return moment(timeStamp).format(format)
}

export function toFormatGroup(n: number | string, fixed?: number): string {
  try {
    const Big = toFormat(_Big)
    const x = new Big(n || 0)
    return x.toFormat(fixed !== undefined ? fixed : undefined)
  } catch (error) {
    console.error(error)
    return ''
  }
}

export function amountAddDecimals(amount: string, decimals = 18) {
  return amount + new Array(decimals).fill('0').join('')
}

export function getCurrentTimeStamp() {
  return Number((new Date().getTime() / 1000).toFixed())
}

export function titleCase(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()
}

export function shortenHashAddress(hash: string, chars = 4): string {
  return `${hash.substring(0, chars + 2)}...${hash.substring(hash.length - chars)}`
}

export function isURL(url: string) {
  const strRegex = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
  const re = new RegExp(strRegex)
  if (re.test(url)) {
    return true
  } else {
    return false
  }
}

export function getVotingTimestampByNumber(day: number, hour: number, minute: number) {
  return day * 86400 + hour * 3600 + minute * 60
}

export function getVotingNumberByTimestamp(timestamp: number) {
  const day = Math.floor(timestamp / 86400)
  const hour = Math.floor((timestamp % 86400) / 3600)
  const minute = Math.floor((timestamp % 3600) / 60)
  return { day, hour, minute }
}

export function isSocialUrl(name: 'discord' | 'twitter' | string, url: string) {
  switch (name) {
    case 'discord':
      return new RegExp(/^https:\/\/(www\.)?discord.com/).test(url)
    case 'twitter':
      return new RegExp(/^https:\/\/(www\.)?twitter.com/).test(url)
    case 'github':
      return new RegExp(/^https:\/\/(www\.)?github.com/).test(url)
    case 'opensea':
      return new RegExp(/^https:\/\/(www\.)?opensea.io/).test(url)
    case 'youtube':
      return new RegExp(/^https:\/\/(www\.)?youtube.com/).test(url)
    default:
      return isURL(url)
  }
}

export function getPerForAmount(tokenSupply: string | number, amount: string | number | undefined) {
  if (!tokenSupply || !amount) return 0
  return Number(
    new BigNumber(amount)
      .dividedBy(tokenSupply)
      .multipliedBy(100)
      .toFormat(4)
  )
  // const _amount = JSBI.multiply(JSBI.BigInt(amount), JSBI.BigInt(10000))
  // let ret = JSBI.divide(_amount, JSBI.BigInt(tokenSupply)).toString()
  // ret = (Number(ret) / 100).toFixed(2)
  // return ret
}

export function getAmountForPer(tokenSupply: string | number, per: number | undefined) {
  if (!tokenSupply || !per) return '0'
  return new BigNumber(tokenSupply)
    .multipliedBy(per)
    .dividedBy(100)
    .toFixed(0)
  // const _per = JSBI.BigInt((per * 100).toFixed(0))
  // return JSBI.divide(JSBI.multiply(_per, JSBI.BigInt(tokenSupply)), JSBI.BigInt(10000)).toString()
}

// min 6 up
export function calcTotalAmountValue(amount: number | string | undefined, unitPrice: number | string | undefined) {
  if (!amount || !Number(amount) || !unitPrice) return ''
  const _amount = amount.toString().split('.')[0]
  if (!_amount) return ''
  return new BigNumber(amount).multipliedBy(unitPrice).toFixed(6, 0)
  // const ret = JSBI.divide(
  //   JSBI.multiply(JSBI.BigInt((Number(unitPrice) * 1000000).toFixed()), JSBI.BigInt(_amount)),
  //   JSBI.BigInt(1000000)
  // )
  // return JSBI.GE(ret, JSBI.BigInt(1)) ? ret.toString() : '1'
}

export function getCurrentInputMaxAmount(
  remainderTotal: string,
  exclude: string | number,
  currentInput: string | number
) {
  if (!remainderTotal || !currentInput) return ''
  const max = new BigNumber(remainderTotal).plus(exclude || 0)
  if (max.gt(currentInput || '0')) return currentInput
  return max.toString()
}

export function getCurrentInputMaxPer(
  tokenSupply: string,
  remainderTotal: string,
  exclude: string | number,
  currentInputPer: number
) {
  if (!remainderTotal || !currentInputPer) return 0
  const amount = getAmountForPer(tokenSupply, currentInputPer)
  const maxAmount = getCurrentInputMaxAmount(remainderTotal, exclude, amount)
  if (new BigNumber(maxAmount).gte(amount)) {
    return currentInputPer
  }
  return getPerForAmount(tokenSupply, maxAmount)
}

export function isValidAmount(value: string | number | undefined) {
  if (!value || !value.toString().trim()) return false
  // .
  const _val = value.toString().split('.')
  if (_val.length > 1) return false
  if (new BigNumber(value).gt(0)) return true
  return false
}

export function formatMillion(value: number, fractionDigits = 1) {
  if (value / 1_000_000 >= 1) {
    return Number((value / 1_000_000).toFixed(fractionDigits)).toLocaleString() + 'M'
  }
  if (value / 1_000 >= 1) {
    return Number((value / 1_000).toFixed(fractionDigits)).toLocaleString() + 'k'
  }
  return Number(value.toFixed(fractionDigits)).toLocaleString()
}

export function formatNumber(num: string | number) {
  const bigNum = new BigNumber(num.toString())
  const formattedNumber = bigNum.decimalPlaces(2, BigNumber.ROUND_DOWN)

  if (bigNum.isGreaterThan(1_000_000)) {
    return formattedNumber.div(1_000_000).toFormat(2, BigNumber.ROUND_DOWN) + 'M'
  } else if (bigNum.isGreaterThan(1_000)) {
    return formattedNumber.div(1_000).toFormat(2, BigNumber.ROUND_DOWN) + 'K'
  } else {
    return formattedNumber.toFixed()
  }
}

export function getSocialUrlEnd(link: string) {
  const arr = link.split('/').reverse()
  return arr[0] || arr[1] || ''
}
