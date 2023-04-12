import { useEffect, useState } from 'react'
import { getHomeContributorsList } from '../utils/fetch/server'

export interface homeTopListProp {
  account: string
  avatar: string
  fansNum: string
  nickname: string
}

export function useHomeTopList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 4
  const [result, setResult] = useState<homeTopListProp[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getHomeContributorsList((currentPage - 1) * pageSize, pageSize)
        const data = res.data.data as any

        if (!data) {
          setResult([])
          setTotal(0)
          return
        }
        setTotal(data.total)
        const list: homeTopListProp[] = data
        setResult(list)
      } catch (error) {
        setResult([])
        setTotal(0)
        console.error('getHomeContributorsList', error)
      }
    })()
  }, [currentPage])

  return {
    page: {
      setCurrentPage,
      currentPage,
      total,
      totalPage: Math.ceil(total / pageSize),
      pageSize
    },
    result: result
  }
}
