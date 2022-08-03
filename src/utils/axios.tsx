import axios, { AxiosResponse, AxiosPromise } from 'axios'
import { clearAllSignStoreSync } from 'state/userInfo/hooks'
import { serverBaseUrl } from '../constants'

const axiosInstance = axios.create({
  baseURL: serverBaseUrl,
  timeout: 10000,
  headers: { 'content-type': 'application/json', accept: 'application/json' }
})

axiosInstance.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    if (JSON.parse(JSON.stringify(error)).status === 401) {
      alert('signature error')
      clearAllSignStoreSync()
    }
    return Promise.reject(error)
  }
)

export const Axios = {
  get<T = any>(url: string, params: { [key: string]: any } = {}): AxiosPromise<ResponseType<T>> {
    return axiosInstance.get(url, { params })
  },
  post<T = any>(url: string, data: { [key: string]: any }, params = {}): AxiosPromise<ResponseType<T>> {
    return axiosInstance.post(url, data, { params })
  }
}

export type AxiosResponseType<T = any, D = any> = AxiosResponse<T, D>

export interface ResponseType<T = any> {
  msg: string
  code: number
  data: T
}
