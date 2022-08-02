import toFormat from 'toformat'
import _Big from 'big.js'

// export function timeStampToFormat(timeStamp: number | Date | undefined, format = 'Y-MM-DD HH:mm:ss') {
//   if (!timeStamp) return '--'
//   if (timeStamp instanceof Date) {
//     return moment(timeStamp).format(format)
//   }
//   timeStamp = timeStamp.toString().length <= 10 ? timeStamp * 1000 : timeStamp
//   return moment(timeStamp).format(format)
// }

export function toFormatGroup(n: number | string, fixed = 0): string {
  try {
    const Big = toFormat(_Big)
    const x = new Big(n || 0)
    return x.toFormat(fixed)
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
