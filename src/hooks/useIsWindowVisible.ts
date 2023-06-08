import { useCallback, useEffect, useState } from 'react'

const VISIBILITY_STATE_SUPPORTED = 'visibilityState' in document

function isWindowVisible() {
  return !VISIBILITY_STATE_SUPPORTED || document.visibilityState !== 'hidden'
}

/**
 * Returns whether the window is currently visible to the user.
 */
export default function useIsWindowVisible(): boolean {
  const [focused, setFocused] = useState<boolean>(isWindowVisible())
  const listener = useCallback(() => {
    setFocused(isWindowVisible())
  }, [setFocused])

  useEffect(() => {
    if (!VISIBILITY_STATE_SUPPORTED) return undefined

    document.addEventListener('visibilitychange', listener)
    return () => {
      document.removeEventListener('visibilitychange', listener)
    }
  }, [listener])

  return focused
}

export function useIsWindowFocus(): boolean {
  const [focused, setFocused] = useState<boolean>(true)

  useEffect(() => {
    const focusListener = () => {
      setFocused(true)
    }
    const blurListener = () => {
      setFocused(false)
    }

    window.addEventListener('focus', focusListener)
    window.addEventListener('blur', blurListener)
    return () => {
      window.removeEventListener('focus', focusListener)
      window.removeEventListener('blur', blurListener)
    }
  }, [])

  return focused
}
