export const routes = {
  Governance: '/governance',

  _DaoInfo: '/governance/daoInfo',
  DaoInfo: '/governance/daoInfo/:chainId/:address',
  Proposal: '/governance/daoInfo/:chainId/:address/proposal',
  CreateProposal: '/governance/daoInfo/:chainId/:address/proposal/create',
  ProposalDetail: '/governance/daoInfo/:chainId/:address/proposal/detail/:proposalId',
  DaoInfoActivity: '/governance/daoInfo/:chainId/:address/active_info',
  CreatePublicSale: '/governance/daoInfo/:chainId/:address/active_info/create_sale',
  CreateAirdrop: '/governance/daoInfo/:chainId/:address/active_info/create_airdrop',
  DaoInfoAbout: '/governance/daoInfo/:chainId/:address/about',
  DaoInfoSettings: '/governance/daoInfo/:chainId/:address/settings',

  Activity: '/activity',
  _ActivityAirdropDetail: '/activity/airdrop',
  ActivityAirdropDetail: '/activity/airdrop/:chainId/:address/:id',
  _ActivitySaleDetail: '/activity/sale',
  ActivitySaleDetail: '/activity/sale/:chainId/:address/:id',
  Tokens: '/tokens',

  Creator: '/creator',
  CreatorDao: '/creator/dao',
  CreatorToken: '/creator/token',

  Notification: '/notification',

  Profile: '/profile/:address',
  _Profile: '/profile'
}
