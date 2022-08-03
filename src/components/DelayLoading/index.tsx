import { useEffect, useState } from 'react'

export default function DelayLoading({
  children,
  delay = 200,
  loading
}: {
  children: any
  delay?: number
  loading: boolean
}) {
  const [childrenShow, setChildrenShow] = useState(false)
  const [int, setInt] = useState<any>()

  useEffect(() => {
    if (loading) {
      const _int = setTimeout(() => setChildrenShow(true), delay)
      setInt(_int)
    } else {
      setChildrenShow(false)
      clearTimeout(int)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, loading])

  return childrenShow && loading ? <>{children}</> : null
}
