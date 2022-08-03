import { signMessage } from '../../constants'
import { isAddress } from 'utils'
import { Axios } from 'utils/axios'

export function commitErrorMsg(title: string, content: string, func: string, params: string) {
  return Axios.post('error', {
    title,
    content,
    func,
    params
  })
}

export function getMyJoinedDao(account: string) {
  return Axios.get('stpdao/v2/dao/left', {
    account
  })
}

export function getHomeDaoList(
  { account, keyword, category }: { account: string; keyword: string; category: string },
  offset: number,
  count: number
) {
  const req: any = {}
  if (account && isAddress(account)) req.account = account
  if (keyword.trim()) req.keyword = keyword
  if (category.trim()) req.category = category
  return Axios.get('stpdao/v2/dao/list', {
    ...req,
    offset,
    count
  })
}

export function switchJoinDao(
  account: string,
  chainId: number,
  daoAddress: string,
  isJoin: boolean,
  signature: string
) {
  return Axios.post('stpdao/v2/dao/member', {
    params: {
      account,
      chainId,
      daoAddress,
      joinSwitch: isJoin ? 1 : 0
    },
    sign: {
      account,
      message: signMessage,
      signature
    }
  })
}

export function getDaoInfo(account: string | undefined, daoAddress: string, chainId: number) {
  return Axios.get('stpdao/v2/dao/info', {
    account: account || '',
    daoAddress,
    chainId
  })
}
