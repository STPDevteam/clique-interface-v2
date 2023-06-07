import { isAddress } from 'utils'
import { Axios } from 'utils/axios'
import { CategoriesTypeProp } from 'state/buildingGovDao/actions'

export function getHomeContributorsList(offset: number, count: number) {
  return Axios.get('stpdao/v2/account/top/list', {
    offset,
    count
  })
}

export function commitErrorMsg(title: string, content: string, func: string, params: string) {
  return Axios.post('error', {
    title,
    content,
    func,
    params
  })
}

export function getMyJoinedDao() {
  return Axios.get('stpdao/v2/jobs/left')
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
  return Axios.get('stpdao/v3/dao/list', {
    ...req,
    offset,
    count
  })
}

export function getDaoList(
  { keyword, categoryId }: { keyword: string; categoryId: string },
  offset: number,
  limit: number
) {
  const req: any = {}

  if (keyword.trim()) req.keyword = keyword.trim()
  // if (categoryId.trim()) {
  //   req.category = categoryId === CategoriesTypeProp.ALL ? '' : categoryId
  // }
  switch (categoryId.trim()) {
    case CategoriesTypeProp.Social:
      req.categoryId = '1'
      break
    case CategoriesTypeProp.Protocol:
      req.categoryId = '2'
      break
    case CategoriesTypeProp.NFT:
      req.categoryId = '3'
      break
    case CategoriesTypeProp.Metaverse:
      req.categoryId = '4'
      break
    case CategoriesTypeProp.Gaming:
      req.categoryId = '5'
      break
    // case CategoriesTypeProp.Dapp:
    //   req.category = '6'
    //   break
    case CategoriesTypeProp.Other:
      req.categoryId = '7'
      break
    default:
      req.categoryId = ''
      break
  }

  return Axios.get('stpdao/v3/dao/list', {
    ...req,
    offset,
    limit
  })
}

export function Login(account: string, message: string, signature: string) {
  return Axios.post('stpdao/v3/user/signIn', {
    account,
    message,
    signature
  })
}

export function checkIsJoin(daoId: number) {
  return Axios.get(`stpdao/v3/user/identity/${daoId}`)
}

export function switchJoinDao(
  account: string,
  chainId: number,
  daoAddress: string,
  isJoin: boolean,
  signature: string,
  expireTimestamp: number
) {
  return Axios.post('stpdao/v2/dao/member', {
    params: {
      timestamp: expireTimestamp,
      chainId,
      daoAddress,
      joinSwitch: isJoin ? 'join' : 'quit'
    },
    sign: {
      account,
      signature
    }
  })
}

export function getSpaceId(chainId: number, daoAddress: string) {
  return Axios.get('stpdao/v2/spaces/list', {
    chainId,
    daoAddress
  })
}

export function applyReview(chainId: number, daoAddress: string, isPass: boolean, jobsApplyId: number) {
  return Axios.post('stpdao/v2/jobs/apply/review', {
    chainId,
    daoAddress,
    isPass,
    jobsApplyId
  })
}

export function getApplyList(offset: number, count: number, chainId: number, daoAddress: string) {
  return Axios.get('stpdao/v2/jobs/apply/list', {
    offset,
    count,
    chainId,
    daoAddress
  })
}

export function getJobsList(exceptLevel: string, offset: number, count: number, chainId: number, daoAddress: string) {
  return Axios.get('stpdao/v2/jobs/list', {
    exceptLevel,
    offset,
    count,
    chainId,
    daoAddress
  })
}

export function getTaskList(
  offset: number,
  count: number,
  spacesId: number | undefined,
  status: string | undefined,
  priority: string | undefined
) {
  return Axios.get('stpdao/v2/task/list', {
    offset,
    count,
    spacesId,
    status,
    priority
  })
}

export function jobsApply(jobPublishId: number, message: string) {
  return Axios.post('stpdao/v2/jobs/apply', {
    jobPublishId,
    message
  })
}

export function joinDAO(chainId: number, daoAddress: string) {
  return Axios.post('stpdao/v2/jobs/join/member', {
    chainId,
    daoAddress
  })
}

export function changeAdminRole(chainId: number, changeTo: string, daoAddress: string, jobId: number) {
  return Axios.post('stpdao/v2/jobs/alter', {
    chainId,
    changeTo,
    daoAddress,
    jobId
  })
}

export function removeTask(spacesId: number, taskId: number[]) {
  return Axios.post('stpdao/v2/task/remove', {
    spacesId,
    taskId
  })
}

export function updateTask(
  assignAccount: string,
  content: string,
  deadline: number,
  isDrag: boolean,
  priority: string,
  proposalId: number,
  reward: string,
  spacesId: number,
  status: string,
  taskId: number,
  taskName: string,
  weight: number
) {
  return Axios.post('stpdao/v2/task/update', {
    assignAccount,
    content,
    deadline,
    isDrag,
    priority,
    proposalId,
    reward,
    spacesId,
    status,
    taskId,
    taskName,
    weight
  })
}

export function createTask(
  assignAccount: string,
  content: string,
  deadline: number | undefined,
  priority: string,
  proposalId: number,
  reward: string,
  spacesId: number,
  status: string,
  taskName: string
) {
  return Axios.post('stpdao/v2/task/create', {
    assignAccount,
    content,
    deadline,
    priority,
    proposalId,
    reward,
    spacesId,
    status,
    taskName
  })
}

export function getTaskDetail(taskId: number) {
  return Axios.get(`stpdao/v2/task/detail/${taskId}`)
}

export function getMembersCount(daoAddress: string, chainId: number) {
  return Axios.get('stpdao/v2/dao/one', {
    daoAddress,
    chainId
  })
}

// export function getDaoInfo(account: string | undefined, daoAddress: string, chainId: number) {
//   return Axios.get('stpdao/v2/dao/info', {
//     account: account || '',
//     daoAddress,
//     chainId
//   })
// }

export function getDaoInfo(daoId: number) {
  return Axios.get('stpdao/v3/dao/info/' + { daoId })
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

export function getPublicSaleList(
  status: string | undefined,
  saleId: string | undefined,
  offset: number,
  limit: number
) {
  return Axios.get('stpdao/v2/swap/list', {
    status: status || '',
    saleId: saleId || '',
    offset,
    limit
  })
}

export function getTransactionList(saleId: string, offset: number, limit: number) {
  return Axios.get('stpdao/v2/swap/transactions', {
    saleId,
    offset,
    limit
  })
}

export function getTokenPrices(chainId: number, tokens?: string) {
  return Axios.get('stpdao/v2/swap/prices', {
    chainId,
    tokens
  })
}

export function toPurchase(account: string, buyAmount: string, saleId: number) {
  return Axios.post('stpdao/v2/swap/purchased', {
    account,
    buyAmount,
    saleId
  })
}

export function getIsWhiteList(account: string, saleId: number) {
  return Axios.get('stpdao/v2/swap/isWhite', {
    account,
    saleId
  })
}

export function getIsCreatorWhite(account: string) {
  return Axios.get('stpdao/v2/swap/isCreatorWhite', {
    account
  })
}

export function toCreatePublicSale(
  about: string,
  chainId: number,
  creator: string | undefined,
  endTime: string | number,
  limitMax: string,
  limitMin: string,
  receiveToken: string,
  saleAmount: string | number,
  salePrice: string | number,
  saleToken: string,
  saleWay: string,
  startTime: number | string,
  title: string,
  whiteList: string[]
) {
  return Axios.post('stpdao/v2/swap/create', {
    about,
    chainId,
    creator,
    endTime,
    limitMax,
    limitMin,
    receiveToken,
    saleAmount,
    salePrice,
    saleToken,
    saleWay,
    startTime,
    title,
    whiteList
  })
}

export function saveAirdropAddress(
  address: string[],
  amount: string[],
  sign: {
    account: string
    chainId: number
    daoAddress: string
    airdropId: number
    message: string
    signature: string
  }
) {
  return Axios.post('stpdao/v2/airdrop/address', {
    array: {
      address,
      amount
    },
    ...sign
  })
}

export function getActivityList(
  chainId: number,
  daoAddress: string,
  status: string | undefined,
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

export function userProfile(account: string) {
  return Axios.post('stpdao/v2/account/query', {
    account
  })
}

export function userProfileUpdate(
  accountLogo: string,
  nickname: string,
  introduction: string,
  discord: string,
  twitter: string,
  country: string,
  email: string,
  opensea: string,
  youtube: string
) {
  return Axios.post('stpdao/v2/account/update', {
    param: {
      accountLogo,
      discord,
      github: '',
      introduction,
      nickname,
      country,
      email,
      opensea,
      youtube,
      twitter
    }
  })
}

export function userFollowAccount(followAccount: string, status: boolean) {
  return Axios.post('stpdao/v2/account/update/follow', {
    params: {
      followAccount,
      status
    }
  })
}

export function userFollowStatus(myself: string, others: string) {
  return Axios.get('stpdao/v2/account/relation', {
    myself,
    others
  })
}

export function getAccountNFTs(chainId: number, account: string, index: number, size: number) {
  return Axios.get('stpdao/v2/account/nfts', {
    chainId,
    account,
    index,
    size
  })
}

export function getAccountFollowersList(account: string, offset: number, count: number) {
  return Axios.get('stpdao/v2/account/followers/list', {
    account,
    offset,
    count
  })
}
export function getAccountFollowingList(account: string, offset: number, count: number) {
  return Axios.get('stpdao/v2/account/following/list', {
    account,
    offset,
    count
  })
}

export function getAccountSendRecordList(account: string, offset: number, count: number) {
  return Axios.get('stpdao/v2/account/record', {
    account,
    offset,
    count
  })
}

export function daoHandleQuery(handle: string, account: string, chainId: number) {
  return Axios.get('stpdao/v2/sign/query/handle', {
    handle,
    account,
    chainId
  })
}

export function daoHandleMakeSign(handle: string, account: string, chainId: number) {
  return Axios.post('stpdao/v2/sign/lock/handle', {
    handle,
    account,
    chainId
  })
}

export function createAirdropOne(
  title: string,
  description: string,
  tokenChainId: number,
  tokenAddress: string,
  maxAirdropAmount: string,
  startTime: number,
  endTime: number,
  airdropStartTime: number,
  airdropEndTime: number,
  sign: {
    account: string
    chainId: number
    daoAddress: string
    message: string
    signature: string
  },
  collectInformation: { name: string; required: boolean }[]
) {
  return Axios.post('stpdao/v2/airdrop/create', {
    title,
    description,
    tokenChainId,
    tokenAddress,
    maxAirdropAmount,
    startTime,
    endTime,
    airdropStartTime,
    airdropEndTime,
    sign,
    collectInformation
  })
}

export function getAirdropDescData(activityId: number) {
  return Axios.get('stpdao/v2/airdrop/collect', {
    id: activityId
  })
}

export function airdropSaveUserCollect(account: string, airdropId: number, userSubmit: string) {
  return Axios.post('stpdao/v2/airdrop/save/user', {
    account,
    airdropId,
    userSubmit
  })
}

export function airdropDownloadUserCollect(account: string, airdropId: number, message: string, signature: string) {
  return Axios.post('stpdao/v2/airdrop/user/download', {
    account,
    airdropId,
    message,
    signature
  })
}

export function getAirdropAccountList(airdropId: number) {
  return Axios.get('stpdao/v2/airdrop/address/list', {
    airdropId
  })
}

export function getHomeOverview() {
  return Axios.get('stpdao/v2/overview/total')
}

export function getJoinDaoMembersLogs(chainId: number, daoAddress: string, offset: number, count: number) {
  return Axios.get('stpdao/v2/account/sign/list', {
    chainId,
    daoAddress,
    offset,
    count
  })
}

export function sendAiChat(content: string[]) {
  return Axios.post('stpdao/v2/ai', {
    content
  })
}

export function createNewJob(access: string, chainId: number, daoAddress: string, jobBio: string, title: string) {
  return Axios.post('stpdao/v2/jobs/publish', {
    access,
    chainId,
    daoAddress,
    jobBio,
    title
  })
}

export function updateNewJob(jobBio: string, jobPublishId: number, title: string) {
  return Axios.post('stpdao/v2/jobs/publish/edit', {
    jobBio,
    jobPublishId,
    title
  })
}

export function deleteJob(publishId: number) {
  return Axios.delete(`stpdao/v2/jobs/publish/${publishId}`)
}

export function publishList(chainId: number, daoAddress: string) {
  return Axios.get('stpdao/v2/jobs/publish/list', { chainId, daoAddress })
}

export function updateDaoGeneral(
  bio: string,
  category: string[],
  daoId: number,
  daoLogo: string,
  daoName: string,
  discord: string,
  github: string,
  join: {
    chainId: number
    holdAmount: string
    tokenAddress: string
    tokenType: string
  },
  twitter: string,
  website: string
) {
  return Axios.post('stpdao/v3/dao/setting/general', {
    bio,
    category,
    daoId,
    daoLogo,
    daoName,
    discord,
    github,
    join,
    twitter,
    website
  })
}

export function getV3DaoInfo(daoId: number) {
  return Axios.get(`/stpdao/v3/dao/info/${daoId}`)
}

export function createDao(bio: string, category: string[], daoLogo: string, daoName: string, handle: string) {
  return Axios.post('/stpdao/v3/dao/create', { bio, category, daoLogo, daoName, handle })
}
