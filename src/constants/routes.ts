export const routes = {
  Governance: '/daos',

  _DaoInfo: '/governance/daoInfo',
  DaoInfo: '/governance/daoInfo/:chainId/:address',
  Proposal: '/governance/daoInfo/:chainId/:address/proposal',
  CreateProposal: '/governance/daoInfo/:chainId/:address/proposal/create',
  ProposalDetail: '/governance/daoInfo/:chainId/:address/proposal/detail/:proposalId',
  DaoInfoActivity: '/governance/daoInfo/:chainId/:address/active_info',
  CreatePublicSale: '/governance/daoInfo/:chainId/:address/active_info/create_sale',
  CreateAirdrop: '/governance/daoInfo/:chainId/:address/active_info/create_dao_drop',
  DaoInfoAbout: '/governance/daoInfo/:chainId/:address/about',
  DaoInfoSettings: '/governance/daoInfo/:chainId/:address/settings',

  Activity: '/activity',
  _ActivityAirdropDetail: '/activity/dao_drop',
  ActivityAirdropDetail: '/activity/dao_drop/:chainId/:address/:id',
  _ActivitySaleDetail: '/activity/sale',
  ActivitySaleDetail: '/activity/sale/:chainId/:address/:id',
  Tokens: '/tokens',

  Creator: '/creator',
  CreatorDao: '/creator/dao',
  CreatorToken: '/creator/token',

  Notification: '/notification',
  PushList: '/notification/push/list',

  Profile: '/profile/:address',
  _Profile: '/profile',
  CreateSales: '/createSale',
  SaleDetails: '/saleList/saleDetails/:saleId',
  _SaleDetails: '/saleList/saleDetails',
  SaleList: '/saleList',

  Push: '/push'
}
