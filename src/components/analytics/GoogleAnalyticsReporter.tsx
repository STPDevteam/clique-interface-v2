import { useEffect } from 'react'
import ReactGA from 'react-ga4'
import { useParams } from 'react-router-dom'

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID)
} else {
  ReactGA.initialize('test', { testMode: true })
}

// fires a GA pageview every time the route changes
export default function GoogleAnalyticsReporter(): null {
  const { pathname, search } = useParams()
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: `${pathname}${search}` })
  }, [pathname, search])
  return null
}
