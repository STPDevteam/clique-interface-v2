import { Suspense } from 'react'
import BigNumber from 'bignumber.js'
BigNumber.config({ EXPONENTIAL_AT: [-7, 40] })
import { Redirect, Route, Switch } from 'react-router-dom'
import { styled } from '@mui/material'
import Header from '../components/Header'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
import Web3ReactManager from '../components/essential/Web3ReactManager'
import WarningModal from '../components/Modal/WarningModal'
import ComingSoon from './ComingSoon'
import { ModalProvider } from 'context/ModalContext'
import { routes } from 'constants/routes'
import Governance from 'pages/Governance/GovernanceContainer'
import GovernanceHome from 'pages/Governance'
import DaoInfoBase from 'pages/DaoInfo'
import ProposalList from 'pages/DaoInfo/Children/Proposal'
import DaoInfoActivity from 'pages/DaoInfo/Children/Activity'
import DaoInfoSettings from 'pages/DaoInfo/Children/Settings'
import DaoInfoAbout from 'pages/DaoInfo/Children/About'
import Creator from 'pages/Creator'
import CreatorDao from 'pages/Creator/CreatorDao'
import TokenList from 'pages/TokenList'

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
  minHeight: `calc(100vh - ${theme.height.header})`,
  [theme.breakpoints.down('md')]: {
    minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.mobileHeader})`
  }
}))

export default function App() {
  return (
    <Suspense fallback={null}>
      <ModalProvider>
        <AppWrapper id="app">
          <ContentWrapper>
            <Header />
            <BodyWrapper id="body">
              <Popups />
              <Polling />
              <WarningModal />
              <Web3ReactManager>
                <Switch>
                  <Route
                    strict
                    path={routes.Governance}
                    render={() => (
                      <Governance>
                        <Switch>
                          <Route path={routes.Governance} exact strict component={GovernanceHome} />
                          <Route
                            strict
                            path={routes.DaoInfo}
                            render={() => (
                              <DaoInfoBase>
                                <Switch>
                                  <Route path={routes.DaoInfo} exact strict component={ProposalList} />
                                  <Route path={routes.DaoInfoActivity} exact strict component={DaoInfoActivity} />
                                  <Route path={routes.DaoInfoAbout} exact strict component={DaoInfoAbout} />
                                  <Route path={routes.DaoInfoSettings} exact strict component={DaoInfoSettings} />
                                </Switch>
                              </DaoInfoBase>
                            )}
                          />
                        </Switch>
                      </Governance>
                    )}
                  />
                  <Route exact strict path={routes.Activity} component={ComingSoon} />
                  <Route exact strict path={routes.Tokens} component={TokenList} />
                  <Route exact strict path={routes.Creator} component={Creator} />
                  <Route exact strict path={routes.CreatorDao} component={CreatorDao} />
                  <Route exact path="/" render={() => <Redirect to={routes.Governance} />} />
                </Switch>
              </Web3ReactManager>
            </BodyWrapper>
          </ContentWrapper>
        </AppWrapper>
      </ModalProvider>
    </Suspense>
  )
}
