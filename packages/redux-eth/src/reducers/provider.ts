import { getType } from 'typesafe-actions'
import * as ethers from 'ethers'
import { provider, ProviderAction } from '../actions'
import { request } from 'https'

type ProviderState = {
  instance?: ethers.providers.Web3Provider
  network?: ethers.utils.Network
  string?: number
  address?: string
  transactionCount?: number
  blockNumber?: number
  blocks: ethers.providers.Block[]
  transactions: ethers.providers.TransactionResponse[]
  errors: {
    [event: string]: Error | null
  }
  loading: {
    [event: string]: boolean
  }
}

export default (
  state: ProviderState = {
    blocks: [],
    transactions: [],
    errors: {},
    loading: {}
  },
  action: ProviderAction
) => {
  const [_base, event, _type] = action.type.split('/').map(s => s.toLowerCase())
  const { loading, errors } = state
  loading[event] = false
  errors[event] = null

  switch (action.type) {
    case getType(provider.request.connect.request):
    case getType(provider.request.network.request):
    case getType(provider.request.gasPrice.request):
    case getType(provider.request.balance.request):
    case getType(provider.request.address.request):
    case getType(provider.request.blockNumber.request):
    case getType(provider.request.transactionCount.request):
    case getType(provider.request.block.request):
    case getType(provider.request.transaction.request):
      loading[event] = true
      return { ...state, loading, errors }
    case getType(provider.request.connect.failure):
    case getType(provider.request.network.failure):
    case getType(provider.request.gasPrice.failure):
    case getType(provider.request.balance.failure):
    case getType(provider.request.address.failure):
    case getType(provider.request.blockNumber.failure):
    case getType(provider.request.transactionCount.failure):
    case getType(provider.request.block.failure):
    case getType(provider.request.transaction.failure):
      errors[event] = action.payload
      return { ...state, loading, errors }
    case getType(provider.request.connect.success):
      return {
        ...state,
        instance: action.payload,
        loading,
        errors
      }
    case getType(provider.request.network.success):
      return {
        ...state,
        network: action.payload,
        loading,
        errors
      }
    case getType(provider.request.gasPrice.success):
      return {
        ...state,
        gasPrice: action.payload.toString(),
        loading,
        errors
      }
    case getType(provider.request.balance.success):
      return {
        ...state,
        balance: action.payload.toString(),
        loading,
        errors
      }
    case getType(provider.request.address.success):
      return {
        ...state,
        address: action.payload,
        loading,
        errors
      }
    case getType(provider.request.blockNumber.success):
      return {
        ...state,
        blockNumber: action.payload,
        loading,
        errors
      }
    case getType(provider.request.transactionCount.success):
      return {
        ...state,
        transactionCount: action.payload,
        loading,
        errors
      }
    case getType(provider.request.block.success):
      const blocks = [...state.blocks, action.payload]
        .filter(
          (value, index, self) =>
            index === self.findIndex(b => b.number === value.number)
        )
        .sort((a, b) => b.number - a.number)
      return {
        ...state,
        blocks,
        loading,
        errors
      }
    case getType(provider.request.transaction.success):
      const transactions = [...state.transactions, action.payload].filter(
        (value, index, self) =>
          index === self.findIndex(t => t.hash === value.hash)
      )
      return {
        ...state,
        transactions,
        loading,
        errors
      }
    default:
      return state
  }
}
