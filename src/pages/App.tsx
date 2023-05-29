import { Suspense, lazy, useEffect } from 'react'
import BigNumber from 'bignumber.js'
BigNumber.config({ EXPONENTIAL_AT: [-7, 40] })
import { Redirect, Route, Switch } from 'react-router-dom'
import { styled } from '@mui/material'
import Header from '../components/Header'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
import Web3ReactManager from '../components/essential/Web3ReactManager'
// import WarningModal from '../components/Modal/WarningModal'
// import ComingSoon from './ComingSoon'
import { ModalProvider } from 'context/ModalContext'
import { routes } from 'constants/routes'
import Governance from 'pages/Governance/GovernanceContainer'
import GovernanceHome from 'pages/Governance'
import DaoInfoLayout from 'pages/DaoInfo/DaoInfoLayout'
import ProposalList from 'pages/DaoInfo/Children/Proposal'
import Creator from 'pages/Creator'
import CreatorDao from 'pages/Creator/CreatorDao'
import CreateDao from 'pages/Creator/CreateDao'

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
import Activity from 'pages/Activity'
import Profile from 'pages/Profile'
import CreateProposal from 'pages/DaoInfo/Children/Proposal/CreateProposal'
import ProposalDetail from 'pages/DaoInfo/Children/Proposal/ProposalDetail'
import CreateAirdrop from 'pages/DaoInfo/Children/Activity/CreateAirdrop'
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
// import Task from './Task'
const Task = lazy(() => import('./Task'))
import ComingSoon from './ComingSoon'
import Page from './RedirectPage'
import AboutSetting from './AboutSetting'
import DaoBounty from './daoBounty'
import DappStore from './TokenList/DappStore'

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

const ContentWrapper = styled('div')({
  width: '100%',
  maxHeight: '100vh',
  overflow: 'auto',
  alignItems: 'center'
})

const BodyWrapper = styled('div')(({ theme }) => ({
  paddingTop: theme.height.header,
  minHeight: '100vh',
  [theme.breakpoints.down('md')]: {
    minHeight: `${theme.height.mobileHeader} - 50px)`
  }
}))

export default function App() {
  useEffect(() => {
    fetchUserLocation().then(res => {
      store.dispatch({
        type: 'application/setUserLocation',
        payload: res.data || null
      })
    })
  }, [])

  return (
    <Suspense fallback={null}>
      <ModalProvider>
        <AppWrapper id="app">
          <Route component={GoogleAnalyticsReporter} />
          <Route path={routes.Page} component={Page} />
          <ContentWrapper>
            <Header />
            {/* <AiChat /> */}
            <BodyWrapper id="body">
              <Popups />
              <Polling />
              {/* <WarningModal /> */}
              <Web3ReactManager>
                <Switch>
                  <Route
                    strict
                    path={routes.DaoInfo}
                    render={() => (
                      <DaoInfoLayout>
                        <Switch>
                          <Route path={routes.DaoMember} exact strict component={Member} />
                          <Route path={routes.DaoTreasury} exact strict component={ComingSoon} />
                          <Route path={routes.DaoIdea} exact strict component={ComingSoon} />
                          <Route path={routes.DaoInfoActivity} exact strict component={DaoBounty} />
                          <Route path={routes.DaoAboutSetting} exact strict component={AboutSetting} />
                          <Route path={routes.DaoTeamMeetings} exact strict component={ComingSoon} />
                          <Route path={routes.DaoTeamDocs} exact strict component={ComingSoon} />
                          <Route path={routes.DaoTeamTask} exact strict component={Task} />
                          <Route path={routes.DaoTeamCalendar} exact strict component={ComingSoon} />
                          <Route path={routes.DaoTeamTrash} exact strict component={ComingSoon} />
                          <Route path={routes.Proposal} exact strict component={ProposalList} />
                          <Route path={routes.CreateProposal} exact strict component={CreateProposal} />
                          <Route path={routes.ProposalDetail} exact strict component={ProposalDetail} />
                          <Route path={routes.CreateAirdrop} exact strict component={CreateAirdrop} />

                          <Route
                            exact
                            path={routes.DaoInfo}
                            render={() => <Redirect to={location.pathname + '/proposal'} />}
                          />
                        </Switch>
                      </DaoInfoLayout>
                    )}
                  />
                  <Route strict path={routes.DappStore} component={DappStore} />
                  <Route
                    strict
                    path={routes.Governance}
                    render={() => (
                      <Governance>
                        <GovernanceHome />
                      </Governance>
                    )}
                  />
                  <Route exact strict path={routes.Activity} component={Activity} />
                  <Route exact strict path={routes.ActivityAirdropDetail} component={ActivityAirdropDetail} />
                  {/* <Route exact strict path={routes.ActivitySaleDetail} component={ActivitySaleDetail} /> */}
                  {/* <Route exact strict path={routes.Tokens} component={TokenList} /> */}
                  <Route exact strict path={routes.Creator} component={Creator} />
                  <Route exact strict path={routes.CreatorDao} component={CreatorDao} />
                  <Route exact strict path={routes.CreateDao} component={CreateDao} />
                  <Route exact strict path={routes.CreatorToken} component={CreatorToken} />
                  <Route exact strict path={routes.Notification} component={Notification} />
                  {/* <Route exact strict path={routes.PushList} component={PushList} /> */}
                  <Route exact strict path={routes.Profile} component={Profile} />
                  <Route exact strict path={routes._Profile} component={Profile} />
                  {/* <Route exact strict path={routes.CreateSales} component={CreateSales} /> */}
                  {/* <Route exact strict path={routes.SaleDetails} component={SaleDetail} /> */}
                  {/* <Route exact strict path={routes.Home} component={Home} /> */}
                  <Route exact path="/governance" render={() => <Redirect to={routes.Governance} />} />
                  <Route exact path="/" render={() => <Redirect to={routes.Governance} />} />
                  {/* <Route exact strict path={routes.CreateSales} component={CreateSales} />
                  <Route exact strict path={routes.SaleDetails} component={SaleDetail} />
                  <Route exact strict path={routes.SaleList} component={SaleList} />
                  <Route exact strict path={routes.Push} component={Push} /> */}
                  {/* <Route exact path="/" render={() => <Redirect to={routes.Governance} />} /> */}
                </Switch>
              </Web3ReactManager>
            </BodyWrapper>
          </ContentWrapper>
        </AppWrapper>
      </ModalProvider>
    </Suspense>
  )
}
