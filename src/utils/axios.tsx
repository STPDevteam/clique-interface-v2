import axios, { AxiosResponse, AxiosPromise } from 'axios'
import { clearAllSignStoreSync } from 'state/userInfo/hooks'
import { serverBaseUrl } from '../constants'
import store from 'state'

const axiosInstance = axios.create({
  baseURL: serverBaseUrl,
  timeout: 30000
})

function MakeHeaders() {
  const address = store.getState().application.curAddress
  const _token = store.getState().userInfo[address]?.loggedToken

  return {
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      Authorization: _token ? `Bearer ${_token}` : ''
    }
  }
}

axiosInstance.interceptors.response.use(
  async response => {
    if (response.data.code === 401) {
      clearAllSignStoreSync()
    }
    return response
  }
  // function(error) {
  //   if (JSON.parse(JSON.stringify(error)).status === 401) {
  //     alert('signature error')
  //     clearAllSignStoreSync()
  //   }

  //   return Promise.reject(error)
  // }
)

export const Axios = {
  get<T = any>(url: string, params: { [key: string]: any } = {}): AxiosPromise<ResponseType<T>> {
    return axiosInstance.get(url, Object.assign(MakeHeaders(), { params }))
  },
  post<T = any>(url: string, data: { [key: string]: any }, params = {}): AxiosPromise<ResponseType<T>> {
    return axiosInstance.post(url, data, Object.assign(MakeHeaders(), { params }))
  }
}

export type AxiosResponseType<T = any, D = any> = AxiosResponse<T, D>

export interface ResponseType<T = any> {
  msg: string
  code: number
  data: T
}
