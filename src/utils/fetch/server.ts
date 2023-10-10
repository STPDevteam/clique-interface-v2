import { isAddress } from 'utils'
import { Axios } from 'utils/axios'
import { CategoriesTypeProp } from 'state/buildingGovDao/actions'
import { VoteParamsProp } from 'hooks/useBackedProposalServer'

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
  return Axios.get('stpdao/v3/user/left')
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
      req.categoryId = '6'
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

export function applyReview(isPass: boolean, jobsApplyId: number) {
  return Axios.post('stpdao/v3/jobs/apply/review', {
    isPass,
    jobsApplyId
  })
}

export function getApplyList(offset: number, limit: number, daoId: number) {
  return Axios.get('stpdao/v3/jobs/apply/list', {
    daoId,
    offset,
    limit
  })
}

export function getJobsList(daoId: number, offset: number, limit: number) {
  return Axios.get('stpdao/v3/jobs/list', {
    daoId,
    offset,
    limit
  })
}

export function getTaskList(
  offset: number,
  limit: number,
  spacesId: number | undefined,
  status: string | undefined,
  priority: string | undefined
) {
  return Axios.get('stpdao/v3/task/list', {
    offset,
    limit,
    spacesId,
    status,
    priority
  })
}

export function jobsApply(jobPublishId: number, message: string) {
  return Axios.post('stpdao/v3/jobs/apply', {
    jobPublishId,
    message
  })
}

export function joinDAO(daoId: number) {
  return Axios.post(`stpdao/v3/user/join/${daoId}`, {})
}

export function changeAdminRole(account: string, changeToLevel: number, daoId: number) {
  return Axios.post('stpdao/v3/jobs/alter', {
    account,
    changeToLevel,
    daoId
  })
}

export function removeTask(spacesId: number, taskId: number[]) {
  return Axios.post('stpdao/v3/task/remove', {
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
  return Axios.post('stpdao/v3/task/update', {
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
  return Axios.post('stpdao/v3/task/create', {
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
  return Axios.get(`stpdao/v3/task/detail/${taskId}`)
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
  return Axios.get(`stpdao/v3/dao/info/${daoId}`)
}

export function getDaoAdmins(daoAddress: string, chainId: number) {
  return Axios.get('stpdao/v2/dao/admins', {
    daoAddress,
    chainId
  })
}

export function getTokenList(chainId: number | string, creator: string, offset: number, limit: number) {
  return Axios.get('stpdao/v3/token/list', {
    chainId,
    creator,
    offset,
    limit
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

export function getProposalList(daoId: number | string, status: string | undefined, offset: number, limit: number) {
  return Axios.get(`stpdao/v3/proposal/list/${daoId}`, {
    status: status || '',
    offset,
    limit
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
  proposalId: number,
  offset: number,
  limit: number,
  status?: string,
  voter?: string | undefined | null
) {
  return Axios.get('stpdao/v3/vote/list', {
    voter,
    status,
    proposalId,
    offset,
    limit
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
  account: string,
  airdropId: number,
  daoId: number,
  address: string[],
  amount: string[],
  sign: {
    message: string
    signature: string
  }
) {
  return Axios.post('stpdao/v3/airdrop/address', {
    account,
    airdropId,
    array: {
      address,
      amount
    },
    daoId,
    ...sign
  })
}

export function getActivityList(daoId: number | undefined, status: string | undefined, offset: number, limit: number) {
  return Axios.get('stpdao/v3/airdrop/list', {
    daoId,
    status,
    offset,
    limit
  })
}

export function getAirdropProof(airdropId: number) {
  return Axios.get('stpdao/v3/airdrop/proof', {
    airdropId
  })
}

export function getTokenLogo(tokenAddress: string, tokenChainId: number) {
  return Axios.get('stpdao/v3/token/img', {
    tokenChainId,
    tokenAddress
  })
}

export function getNotificationListInfo(account: string, offset: number, limit: number) {
  return Axios.get('stpdao/v3/notification/list', {
    account,
    offset,
    limit
  })
}

export function getNotificationUnreadTotal() {
  return Axios.get('stpdao/v3/notification/unread/total')
}

export function notificationToRead(notificationId: number, readAll: boolean) {
  return Axios.post('stpdao/v3/notification/read', {
    notificationId,
    readAll
  })
}

export function userProfile(account: string) {
  return Axios.get('stpdao/v3/user/info', {
    account
  })
}

export function userProfileUpdate(
  accountLogo: string,
  country: string,
  discord: string,
  email: string,
  // github: string,
  introduction: string,
  nickname: string,
  opensea: string,
  twitter: string,
  youtube: string
) {
  return Axios.post('stpdao/v3/user/edit', {
    accountLogo,
    country,
    discord,
    email,
    github: '',
    introduction,
    nickname,
    opensea,
    twitter,
    youtube
  })
}

export function userFollowAccount(isFollow: boolean, targetAccount: string) {
  return Axios.post('stpdao/v3/user/follow/alter', {
    isFollow,
    targetAccount
  })
}

export function userFollowStatus(myself: string, others: string) {
  return Axios.get('stpdao/v2/account/relation', {
    myself,
    others
  })
}

export function getAccountNFTs(chainId: number, index: number, size: number) {
  return Axios.get('stpdao/v3/user/nfts', {
    chainId,
    size,
    index
  })
}
export function getAccountNFTsByScan(
  account: string,
  chainId: number,
  index: number,
  size: number,
  ercType: 'erc721' | 'erc1155'
) {
  return Axios.get('stpdao/v3/user/nftscan', {
    chainId,
    cursor: (index - 1) * size + 1,
    limit: size,
    account,
    ercType
  })
}

export function getRecentNftList(chainId: number) {
  return Axios.get('stpdao/v3/nft6551/latestTxs', {
    chainId
  })
}

export function getNftAccountList(chainId: number, salt: string, implementation: string | undefined, account: string) {
  return Axios.get(`stpdao/v3/nft6551/${chainId}/${salt}/${implementation}/${account}`)
}

export function getMyCreateNftAccountList(account: string, offset: number, limit: number) {
  return Axios.get(`stpdao/v3/nft6551/list`, { account, offset, limit })
}

export function getNftAccountInfo(contract_address: string, chainId: number | undefined) {
  return Axios.get(`stpdao/v3/user/nfts/collections/${chainId}/${contract_address}`)
}

export function getAccountFollowersList(userId: number, limit: number, offset: number) {
  return Axios.get('stpdao/v3/user/followers/list', {
    userId,
    limit,
    offset
  })
}
export function getAccountFollowingList(userId: number | undefined, limit: number, offset: number) {
  return Axios.get('stpdao/v3/user/following/list', {
    userId,
    limit,
    offset
  })
}

// 'stpdao/v3/user/top/list'
export function getAccountSendRecordList(offset: number, limit: number) {
  return Axios.get('stpdao/v3/user/record/list', {
    offset,
    limit
  })
}

export function daoHandleQuery(handle: string) {
  return Axios.get('stpdao/v3/dao/handle/check', {
    handle
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
  airdropEndTime: number,
  airdropStartTime: number,
  collectInformation: { name: string; required: boolean }[],
  description: string,
  endTime: number,
  maxAirdropAmount: string,
  sign: {
    account: string
    daoId: number
    message: string
    signature: string
  },
  startTime: number,
  title: string,
  tokenAddress: string,
  tokenChainId: number
) {
  return Axios.post('stpdao/v3/airdrop/create', {
    airdropEndTime,
    airdropStartTime,
    collectInformation,
    description,
    endTime,
    maxAirdropAmount,
    sign,
    startTime,
    title,
    tokenAddress,
    tokenChainId
  })
}

export function getAirdropDescData(airdropId: number) {
  return Axios.get(`stpdao/v3/airdrop/info/${airdropId}`)
}

export function airdropSaveUserCollect(account: string, airdropId: number, userSubmit: string) {
  return Axios.post('stpdao/v3/airdrop/submit/data', {
    account,
    airdropId,
    userSubmit
  })
}

export function airdropDownloadUserCollect(account: string, airdropId: number, message: string, signature: string) {
  return Axios.post('stpdao/v3/airdrop/download/data', {
    account,
    airdropId,
    message,
    signature
  })
}

export function getAirdropAccountList(airdropId: number) {
  return Axios.get('stpdao/v3/airdrop/address/list', {
    airdropId
  })
}

export function getHomeOverview() {
  return Axios.get('stpdao/v3/overview/total')
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

export function createNewJob(daoId: number, jobBio: string, level: number, title: string) {
  return Axios.post('stpdao/v3/jobs/publish', {
    daoId,
    jobBio,
    level,
    title
  })
}

export function updateNewJob(jobBio: string, jobPublishId: number, level: number, title: string) {
  return Axios.post('stpdao/v3/jobs/publish/edit', {
    jobBio,
    jobPublishId,
    level,
    title
  })
}

export function deleteJob(publishId: number) {
  return Axios.delete(`stpdao/v3/jobs/publish/${publishId}`)
}

export function publishList(daoId: number, offset: number, limit: number) {
  return Axios.get('stpdao/v3/jobs/publish/list', { daoId, offset, limit })
}

export function leftSpacesList(daoId: number, offset: number, limit: number) {
  return Axios.get(`stpdao/v3/spaces/list/${daoId}`, {
    offset,
    limit
  })
}

export function getWorkspaceInfo(spacesId: number) {
  return Axios.get(`stpdao/v3/spaces/info/${spacesId}`)
}

export interface WeightPops {
  createRequire: string
  voteTokenId: number
  votesWeight: number
}

export function setDaoGovernance(
  daoId: number,
  proposalThreshold: number,
  votingPeriod: number,
  votingType: number,
  weight: WeightPops[]
) {
  return Axios.post('stpdao/v3/dao/setting/governance', { daoId, proposalThreshold, votingPeriod, votingType, weight })
}

export function updateDaoGeneral(
  bio: string,
  category: string[],
  daoId: number,
  daoLogo: string,
  daoName: string,
  discord: string,
  github: string,
  join:
    | {
        chainId: number
        decimals: number
        holdAmount: string
        symbol: string
        tokenAddress: string
        tokenLogo: string
        tokenName: string
        tokenType: string
        totalSupply: string
      }
    | undefined,
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

export type VoteWeightProp = {
  createRequire: string
  voteTokenId: number
  votesWeight: number
}

export function updateGovernance(
  daoId: number,
  proposalThreshold: number,
  votingPeriod: number,
  votingType: number,
  weight: VoteWeightProp[]
) {
  return Axios.post('stpdao/v3/dao/setting/governance', { daoId, proposalThreshold, votingPeriod, votingType, weight })
}

export function getV3DaoInfo(daoId: number) {
  return Axios.get(`stpdao/v3/dao/info/${daoId}`)
}

export function createDao(bio: string, category: string[], daoLogo: string, daoName: string, handle: string) {
  return Axios.post('stpdao/v3/dao/create', { bio, category, daoLogo, daoName, handle })
}

export function joinV3Dao(daoId: number) {
  return Axios.post(`stpdao/v3/user/join/${daoId}`, {})
}

export function cancelProposal(proposalId: number | undefined) {
  return Axios.post(`stpdao/v3/proposal/cancel/${proposalId}`, {})
}

export function createProposal(
  content: string,
  daoId: number,
  endTime: number,
  introduction: string,
  isChain: boolean,
  options: string[],
  startTime: number,
  title: string,
  voteTokenId: number[],
  voteType: number
) {
  return Axios.post('stpdao/v3/proposal/create', {
    content,
    daoId,
    endTime,
    introduction,
    isChain,
    options,
    startTime,
    title,
    voteTokenId,
    voteType
  })
}

export function getProposalDetail(proposalId: number) {
  return Axios.get(`stpdao/v3/proposal/info/${proposalId}`)
}

export function toVote(voteParams: VoteParamsProp[]) {
  return Axios.post('stpdao/v3/vote/voting', voteParams)
}

export function deleteGovToken(voteTokenId: number) {
  return Axios.delete(`stpdao/v3/vote/delete/${voteTokenId}`)
}

export function addGovToken(
  chainId: number,
  createRequire: string,
  daoId: number,
  decimals: number,
  symbol: string,
  tokenAddress: string,
  tokenLogo: string,
  tokenName: string,
  tokenType: string,
  totalSupply: string,
  votesWeight: number
) {
  return Axios.post('stpdao/v3/vote/add/token', {
    chainId,
    createRequire,
    daoId,
    decimals,
    symbol,
    tokenAddress,
    tokenLogo,
    tokenName,
    tokenType,
    totalSupply,
    votesWeight
  })
}

export function getSpacesList(daoId: number, offset: number, limit: number) {
  return Axios.get(`stpdao/v3/spaces/list/${daoId}`, {
    offset,
    limit
  })
}

export function deleteSpace(spacesId: number) {
  return Axios.post('stpdao/v3/spaces/delete', {
    spacesId
  })
}

export function addDaoMember(account: string, spacesId: number) {
  return Axios.post('stpdao/v3/spaces/member/add', {
    account,
    spacesId
  })
}

export function addWorkspace(access: string, bio: string, daoId: number, title: string) {
  return Axios.post('stpdao/v3/spaces/create', {
    access,
    bio,
    daoId,
    title
  })
}

export function updateWorkspace(access: string, bio: string, spacesId: number, title: string) {
  return Axios.post('stpdao/v3/spaces/update', {
    access,
    bio,
    spacesId,
    title
  })
}

export function deleteWorkspace(spacesId: number) {
  return Axios.post('stpdao/v3/spaces/remove', {
    spacesId
  })
}

export function addSpacesMember(account: string, spacesId: number) {
  return Axios.post('stpdao/v3/spaces/member/add', {
    account,
    spacesId
  })
}

export function removeSpacesMember(workspaceJoinId: number) {
  return Axios.post('stpdao/v3/spaces/member/delete', {
    workspaceJoinId
  })
}

export function transferSpacesMember(spacesId: number, transferToAccount: string) {
  return Axios.post('stpdao/v3/spaces/member/transfer', {
    spacesId,
    transferToAccount
  })
}

export function getSpacesMemberList(spacesId: number, offset: number, limit: number) {
  return Axios.get('stpdao/v3/spaces/member/list', {
    spacesId,
    offset,
    limit
  })
}

export function getUserQuitDao(daoId: number) {
  return Axios.delete(`stpdao/v3/user/quit/${daoId}`)
}

export function createSbt(
  daoId: number,
  fileUrl: string,
  itemName: string,
  startTime: number,
  tokenChainId: number,
  totalSupply: number,
  way: string,
  symbol: string,
  endTime: number,
  introduction?: string,
  account?: string[]
) {
  return Axios.post('/stpdao/v3/sbt/create', {
    daoId,
    endTime,
    fileUrl,
    itemName,
    startTime,
    tokenChainId,
    totalSupply,
    way,
    symbol,
    introduction,
    whitelist: {
      account
    }
  })
}

export function getMemberDaoList(exceptLevel: string) {
  return Axios.get('stpdao/v3/jobs/left', {
    exceptLevel
  })
}

export function getSbtList(offset: number, limit: number, daoId?: number, chainId?: number, status?: string) {
  return Axios.get('stpdao/v3/sbt/list', {
    daoId,
    offset,
    limit,
    chainId,
    status
  })
}

export function getSbtDetail(sbtId: number) {
  return Axios.get(`stpdao/v3/sbt/detail/${sbtId}`)
}

export function getSbtIsClaim(sbtId: number) {
  return Axios.get(`stpdao/v3/sbt/claim/${sbtId}`)
}

export function getSbtClaimList(offset: number, limit: number, sbtId: number) {
  return Axios.get(`stpdao/v3/sbt/claim/list`, {
    offset,
    limit,
    sbtId
  })
}

export function getNftRefresh(contractAddress: string, tokenId: string) {
  return Axios.post('stpdao/v3/user/nftscan/refresh', {
    contractAddress,
    tokenId
  })
}
