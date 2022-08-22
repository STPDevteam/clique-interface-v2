import BigNumber from 'bignumber.js'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import {
  updateCreateTokenDataBasic,
  updateCreateTokenDataDistribution,
  removeCreateTokenData,
  CreateTokenDataBasic,
  CreateTokenDataDistribution
} from './actions'

const defaultReservedHolder: CreateTokenDataDistribution = {
  address: '',
  tokenNumber: '',
  per: undefined,
  lockDate: undefined
}

type CreateTokenDataBasicKey = keyof CreateTokenDataBasic
type CreateTokenDataDistributionKey = keyof CreateTokenDataDistribution

export function useCreateTokenDataCallback() {
  const createTokenData = useSelector((state: AppState) => state.createTokenData)

  const dispatch = useDispatch<AppDispatch>()
  const updateDistribution = useCallback(
    (createTokenDataDistribution: CreateTokenDataDistribution[]) => {
      dispatch(updateCreateTokenDataDistribution({ createTokenDataDistribution }))
    },
    [dispatch]
  )
  const updateBasic = useCallback(
    (createTokenDataBasic: CreateTokenDataBasic) => {
      if (createTokenDataBasic.tokenSupply !== createTokenData.basic.tokenSupply) {
        // reset Distribution token number and per
        const _newDistribution: CreateTokenDataDistribution[] = createTokenData.distribution.map(item =>
          Object.assign({ ...item }, { tokenNumber: undefined, per: undefined })
        )
        dispatch(updateCreateTokenDataDistribution({ createTokenDataDistribution: _newDistribution }))
      }
      dispatch(updateCreateTokenDataBasic({ createTokenDataBasic }))
    },
    [createTokenData.basic.tokenSupply, createTokenData.distribution, dispatch]
  )
  const updateTokenBasicKeyData = useCallback(
    (key: CreateTokenDataBasicKey, value: any) => {
      const _updateData = (Object.assign(
        { ...createTokenData.basic },
        { [key]: value }
      ) as unknown) as CreateTokenDataBasic
      updateBasic(_updateData)
    },
    [createTokenData.basic, updateBasic]
  )
  const updateTokenDistributionKeyData = useCallback(
    (index: number, k: CreateTokenDataDistributionKey, v: string | number | undefined) => {
      const _holders = createTokenData.distribution.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            [k]: v
          }
        }
        return item
      })
      updateDistribution(_holders)
    },
    [createTokenData.distribution, updateDistribution]
  )
  const removeCreateTokenDataCallback = useCallback(() => {
    dispatch(removeCreateTokenData())
  }, [dispatch])
  const addReservedRowCallback = useCallback(() => {
    const _holders = [...createTokenData.distribution, defaultReservedHolder]
    updateDistribution(_holders)
  }, [createTokenData.distribution, updateDistribution])

  const removeReservedRowCallback = useCallback(
    (index: number) => {
      const _holders = [...createTokenData.distribution]
      _holders.splice(index, 1)
      updateDistribution(_holders)
    },
    [createTokenData.distribution, updateDistribution]
  )

  return {
    updateTokenBasicKeyData,
    updateTokenDistributionKeyData,
    removeCreateTokenDataCallback,
    addReservedRowCallback,
    removeReservedRowCallback,
    createTokenData
  }
}

export function useRemainderTokenAmount(): string {
  const createTokenData = useSelector((state: AppState) => state.createTokenData)
  const { distribution, basic } = createTokenData

  const currentUsedTokenAmount = useMemo(
    () =>
      distribution.length
        ? distribution
            .map(item => item.tokenNumber)
            .reduce((pre, cur) => new BigNumber(pre || '0').plus(cur || '0').toString()) || '0'
        : '0',
    [distribution]
  )

  return useMemo(() => {
    const ret = new BigNumber(basic.tokenSupply || '0').minus(currentUsedTokenAmount)
    return ret.gt(0) ? ret.toFixed(0) : '0'
  }, [basic.tokenSupply, currentUsedTokenAmount])
}
