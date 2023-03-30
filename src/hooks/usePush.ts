import { useCallback, useEffect, useMemo, useState } from 'react'
import * as PushAPI from '@pushprotocol/restapi'
import { useActiveWeb3React } from 'hooks'
import { PUSH_CONFIG } from '../constants'

function useSubscribe() {
  const { account, library } = useActiveWeb3React()
  const subscribe = useCallback(
    (channelAddress: string = PUSH_CONFIG.channelAddress) => {
      if (!library || !account) return undefined

      return PushAPI.channels.subscribe({
        signer: library.getSigner(account),
        channelAddress: `eip155:5:${channelAddress}`, // channel address in CAIP
        userAddress: `eip155:5:${account}`, // user address in CAIP
        onSuccess: () => {
          console.log('opt in success')
        },
        onError: () => {
          console.error('opt in error')
        },
        env: PUSH_CONFIG.env
      })
    },
    [account, library]
  )
  const unSubscribe = useCallback(
    (channelAddress: string = PUSH_CONFIG.channelAddress) => {
      if (!library || !account) return undefined

      return PushAPI.channels.unsubscribe({
        signer: library.getSigner(account),
        channelAddress: `eip155:5:${channelAddress}`, // channel address in CAIP
        userAddress: `eip155:5:${account}`, // user address in CAIP
        onSuccess: () => {
          console.log('opt in success')
        },
        onError: () => {
          console.error('opt in error')
        },
        env: PUSH_CONFIG.env
      })
    },
    [account, library]
  )

  return { unSubscribe, subscribe }
}

function useQuerySubscribeList() {
  const { account } = useActiveWeb3React()
  const [subscribeList, setSubscribeList] = useState<{ channel: string }[]>([])

  useEffect(() => {
    PushAPI.user
      .getSubscriptions({
        user: `eip155:5:${account}`, // user address in CAIP
        env: PUSH_CONFIG.env
      })
      .then(res => setSubscribeList(res))
      .catch(() => setSubscribeList([]))
  }, [account])

  return subscribeList
}

function useIsSubscribe(channel: string) {
  const list = useQuerySubscribeList()

  return useMemo(() => !!list.find(i => i.channel === channel), [channel, list])
}

interface FeedsProp {
  cta: string
  title: string
  message: string
  icon: string
  url: string
  sid: string
  app: string
  image: string
  blockchain: string
  notification: {
    body: string
    title: string
  }
  secret: string
}

function useUserFeeds(account: string | undefined, spam?: boolean) {
  const pageSize = 100
  const [result, setResult] = useState<FeedsProp[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await PushAPI.user.getFeeds({
          page: 1,
          limit: pageSize,
          spam: spam || false,
          user: `eip155:5:${account}`, // user address in CAIP
          env: PUSH_CONFIG.env
        })
        // The last 100 items include the second app
        setResult(res.filter((i: FeedsProp) => i.app === PUSH_CONFIG.app))
      } catch (error) {
        setResult([])
      }
    })()
  }, [account, spam])

  return {
    result
  }
}

const Push = {
  useSubscribe,
  useQuerySubscribeList,
  useIsSubscribe,
  useUserFeeds
}

export default Push
