import { signMessage } from '../../constants'
import { isAddress } from 'utils'
import { Axios } from 'utils/axios'
import { CategoriesTypeProp } from 'state/buildingGovDao/actions'

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
  if (keyword.trim()) req.keyword = keyword.trim()
  if (category.trim()) {
    req.category = category === CategoriesTypeProp.ALL ? '' : category
  }
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

export function getDaoAdmins(daoAddress: string, chainId: number) {
  return Axios.get('stpdao/v2/dao/admins', {
    daoAddress,
    chainId
  })
}

export function getTokenList(chainId: number | string, creator: string, offset: number, count: number) {
  return Axios.get('stpdao/v2/token/list', {
    chainId,
    creator,
    offset,
    count
  })
}

export function sign(chainId: number, account: string, daoAddress: string, signType: number, proposalId: number) {
  return Axios.post('stpdao/v2/sign/create', {
    chainId,
    account,
    daoAddress,
    signType: signType.toString(),
    proposalId: proposalId
  })
}

export function saveProposalContent(content: string) {
  return Axios.post('stpdao/v2/proposal/save', {
    content
  })
}

export function getProposalContent(uuid: string) {
  return Axios.get('stpdao/v2/proposal/query', {
    uuid
  })
}

export function getProposalList(
  chainId: number | string,
  daoAddress: string,
  status: number | undefined,
  offset: number,
  count: number
) {
  return Axios.get('stpdao/v2/proposal/list', {
    chainId,
    daoAddress,
    status: status || '',
    offset,
    count
  })
}

export function getProposalSnapshot(chainId: number, daoAddress: string, proposalId: number) {
  return Axios.get('stpdao/v2/proposal/snapshot', {
    chainId,
    daoAddress,
    proposalId
  })
}

export function getProposalVotesList(
  chainId: number | string,
  daoAddress: string,
  proposalId: number,
  offset: number,
  count: number
) {
  return Axios.get('stpdao/v2/votes/list', {
    chainId,
    daoAddress,
    proposalId,
    offset,
    count
  })
}

export function saveAirdropAddress(address: string[], amount: string[], title: string) {
  return Axios.post('stpdao/v2/airdrop/address', {
    array: {
      address,
      amount
    },
    title
  })
}

export function getActivityList(
  chainId: number,
  daoAddress: string,
  status: number | undefined,
  types: 'Airdrop' | 'PublicSale' | '',
  offset: number,
  count: number
) {
  return Axios.get('stpdao/v2/activity/list', {
    chainId,
    daoAddress,
    status: status || '',
    types,
    offset,
    count
  })
}

export function getAirdropProof(address: string, activityId: number) {
  return Axios.get('stpdao/v2/airdrop/proof', {
    address,
    id: activityId
  })
}

export function getTokenLogo(tokenAddress: string, tokenChainId: number) {
  return Axios.get('stpdao/v2/token/img', {
    tokenAddress,
    tokenChainId
  })
}

export function getNotificationListInfo(account: string, offset: number, count: number) {
  return Axios.get('stpdao/v2/notification/list', {
    account,
    offset,
    count
  })
}

export function getNotificationUnreadTotal(account: string) {
  return Axios.get('stpdao/v2/notification/unread/total', {
    account
  })
}

export function notificationToRead(account: string, notificationId: number, readAll: boolean) {
  return Axios.post('stpdao/v2/notification/read', {
    account,
    notificationId,
    readAll
  })
}
