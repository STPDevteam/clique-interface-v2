import { Suspense, useEffect } from 'react'
import BigNumber from 'bignumber.js'
BigNumber.config({ EXPONENTIAL_AT: [-7, 40] })
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { styled, useTheme } from '@mui/material'
import Header from '../components/Header'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
// import WarningModal from '../components/Modal/WarningModal'
// import ComingSoon from './ComingSoon'
import { ModalProvider } from 'context/ModalContext'
import { routes } from 'constants/routes'
import Governance from 'pages/Governance/GovernanceContainer'
import GovernanceHome from 'pages/Governance'
import DaoInfoLayout from 'pages/DaoInfo/DaoInfoLayout'
import ProposalList from 'pages/DaoInfo/Children/Proposal'
// import Creator from 'pages/Creator'
// import CreatorDao from 'pages/Creator/CreatorDao'
import CreateDao from 'pages/Creator/CreateDao'
import { useDispatch } from 'react-redux'
import CreatorToken from 'pages/Creator/CreatorToken'
// import AiChat from 'pages/AiChat'

// swap
// import CreateSales from 'pages/CreateSales'
// import SaleDetail from 'pages/CreateSales/Details'
// import SaleList from 'pages/CreateSales/SalesList'

// import CreateSales from 'pages/CreateSales'
// import SaleDetail from 'pages/CreateSales/Details'
// import SaleList from 'pages/CreateSales/SalesList'
// import TokenList from 'pages/TokenList'
import CreateSoulToken from 'pages/CreateSoulToken'
import SoulTokenDetail from 'pages/Activity/Children/SoulTokenDetail'
import Activity from 'pages/Activity'
import Profile from 'pages/Profile'
import CreateProposal from 'pages/DaoInfo/Children/Proposal/CreateProposal'
import ProposalDetail from 'pages/DaoInfo/Children/Proposal/ProposalDetail'
import CreateAirdrop from 'pages/DaoInfo/Children/Activity/CreateAirdrop'
import About from 'pages/DaoInfo/Children/About'
// import CreatePublicSale from 'pages/DaoInfo/Children/Activity/CreatePublicSale'
import ActivityAirdropDetail from 'pages/Activity/Children/Airdrop'
// import ActivitySaleDetail from 'pages/Activity/Children/PublicSale'
import Notification from 'pages/NotificationPage'
// import Push from 'pages/Notification'
import GoogleAnalyticsReporter from 'components/analytics/GoogleAnalyticsReporter'
import { fetchUserLocation } from 'utils/fetch/location'
import store from 'state'
// import Home from './Home'
import Member from './Member'
// const Task = lazy(() => import('./Task'))
import Task from './Task'
import ComingSoon from './ComingSoon'
import AboutSetting from './AboutSetting'
import DaoBounty from './daoBounty'
import DappStore from './TokenList/DappStore'
import LoginModal from 'components/Header/LoginModal'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DaoInfoUpdater from '../state/buildingGovDao/updater'
import { useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'
import { removeCreateDaoData } from 'state/buildingGovDao/actions'
import { NftGenerator } from './Nft/NftGenerator'
import { NftSelect } from './Nft/NftSelect'
import { useDaoInfoLeftSidedOpenStatus } from 'state/application/hooks'
import { NftAccounts } from './Nft/NftAccounts'

const AppWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  overflowX: 'hidden',
  background: theme.palette.background.paper,
  [`& .border-tab-item`]: {
    position: 'relative',
    '&.active': {
      '&:after': {
        content: `''`,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        height: 4,
        backgroundColor: theme.palette.text.primary,
        borderRadius: '2px 2px 0px 0px'
      }
    }
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: '100vh'
  }
}))

const ContentWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  maxHeight: '100vh',
  overflow: 'auto',
  alignItems: 'center',
  '& .toast-container': {
    width: 446,
    zIndex: 199999,
    '& .Toastify__toast': {
      borderRadius: '10px',
      border: '1px solid #97B7EF',
      height: 50
    },
    '& .Toastify__toast-body': {
      justifyContent: 'center',
      color: '#3F5170',
      fontWeight: 500,
      fontSize: 14
    }
  },
  [theme.breakpoints.down('sm')]: {
    '& .toast-container': {
      width: '90vw',
      margin: 'auto',
      left: 0,
      right: 0
    }
  }
}))

const BodyWrapper = styled('div')(({}) => ({
  // paddingTop: theme.height.header,
  minHeight: '100vh'
  // [theme.breakpoints.down('md')]: {
  //   minHeight: `${theme.height.mobileHeader} - 50px)`
  // }
}))

export default function App() {
  const { headerLinkIsShow } = useUpdateDaoDataCallback()
  const setSidedStatusCallBack = useDaoInfoLeftSidedOpenStatus()
  const { pathname } = useLocation()
  const theme = useTheme()
  const dispatch = useDispatch()
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') return
    fetchUserLocation().then(res => {
      store.dispatch({
        type: 'application/setUserLocation',
        payload: res.data || null
      })
    })
  }, [])

  useEffect(() => {
    if (!pathname.includes('/governance/daoInfo')) {
      dispatch(removeCreateDaoData())
    }
    setSidedStatusCallBack(false)
  }, [dispatch, pathname, setSidedStatusCallBack])

  const makeDaoInfo = (route: string) => route.replace(routes.DaoInfo, '')

  return (
    <Suspense fallback={null}>
      <ModalProvider>
        <AppWrapper id="app">
          <LoginModal />
          <GoogleAnalyticsReporter />
          <ContentWrapper>
            <Header />
            {/* <AiChat /> */}
            <ToastContainer
              className={'toast-container'}
              hideProgressBar
              position="top-center"
              pauseOnFocusLoss={false}
            />
            <BodyWrapper
              id="body"
              sx={{
                minHeight: headerLinkIsShow ? 'calc(100vh - 50px)' : '100vh',
                paddingTop: pathname === routes.CreateDao ? 0 : theme.height.header,
                [theme.breakpoints.down('md')]: {
                  paddingTop: pathname === routes.CreateDao ? 0 : 20,
                  minHeight: `${theme.height.mobileHeader} - 50px`
                }
              }}
            >
              <Popups />
              <Polling />
              <Routes>
                <Route
                  path={routes.DaoInfo + '/*'}
                  element={
                    <DaoInfoLayout>
                      <DaoInfoUpdater />
                      <Routes>
                        <Route path={makeDaoInfo(routes.DaoInfoAbout)} element={<About />} />
                        <Route path={makeDaoInfo(routes.DaoMember)} element={<Member />} />
                        <Route path={makeDaoInfo(routes.DaoTreasury)} element={<ComingSoon />} />
                        <Route path={makeDaoInfo(routes.DaoIdea)} element={<ComingSoon />} />
                        <Route path={makeDaoInfo(routes.DaoInfoActivity)} element={<DaoBounty />} />
                        <Route path={makeDaoInfo(routes.DaoAboutSetting)} element={<AboutSetting />} />
                        <Route path={makeDaoInfo(routes.DaoTeamMeetings)} element={<ComingSoon />} />
                        <Route path={makeDaoInfo(routes.DaoTeamDocs)} element={<ComingSoon />} />
                        <Route path={makeDaoInfo(routes._DaoTeamTask)} element={<Task />} />
                        <Route path={makeDaoInfo(routes.DaoTeamCalendar)} element={<ComingSoon />} />
                        <Route path={makeDaoInfo(routes.DaoTeamTrash)} element={<ComingSoon />} />
                        <Route path={makeDaoInfo(routes.Proposal)} element={<ProposalList />} />
                        <Route path={makeDaoInfo(routes.CreateProposal)} element={<CreateProposal />} />
                        <Route path={makeDaoInfo(routes.ProposalDetail)} element={<ProposalDetail />} />
                        <Route path={makeDaoInfo(routes.CreateAirdrop)} element={<CreateAirdrop />} />
                        <Route path={'*'} element={<Navigate replace to={'proposal'} />} />
                      </Routes>
                    </DaoInfoLayout>
                  }
                />
                <Route path={routes.DappStore} element={<DappStore />} />
                <Route
                  path={routes.Governance}
                  element={
                    <Governance>
                      <GovernanceHome />
                    </Governance>
                  }
                />
                <Route path={routes.Activity} element={<Activity />} />
                <Route path={routes.NftGenerator} element={<NftGenerator />} />
                <Route path={routes.NftSelect} element={<NftSelect />} />
                <Route path={routes.NftAssets} element={<NftAccounts />} />
                <Route path={routes._CreateSoulToken} element={<CreateSoulToken />} />
                <Route path={routes.CreateSoulToken} element={<CreateSoulToken />} />
                <Route path={routes.SoulTokenDetail} element={<SoulTokenDetail />} />
                <Route path={routes.ActivityAirdropDetail} element={<ActivityAirdropDetail />} />
                <Route path={routes.CreateDao} element={<CreateDao />} />
                <Route path={routes.CreatorToken} element={<CreatorToken />} />
                <Route path={routes.Notification} element={<Notification />} />
                <Route path={routes.Profile} element={<Profile />} />
                <Route path={routes._Profile} element={<Profile />} />
                <Route path={routes.Soon} element={<ComingSoon />} />
                <Route path="/governance" element={<Navigate replace to={routes.Governance} />} />
                <Route path="*" element={<Navigate replace to={routes.Governance} />} />
              </Routes>
            </BodyWrapper>
          </ContentWrapper>
        </AppWrapper>
      </ModalProvider>
    </Suspense>
  )
}
