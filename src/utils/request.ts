import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'

// 定义响应数据的通用格式
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  // Apifox Mock 服务器地址
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:4523/m1/7866867-7616552-default',
  // 请求超时时间
  timeout: 15000,
  // 请求头
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    
    return config
  },
  (error: AxiosError) => {
    // 对请求错误做些什么 
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 对响应数据做点什么
    const res = response.data

    // 根据你的 API 返回格式调整
    // 假设 API 返回格式为：{ code: 200, data: {...}, message: 'success' }
    if (res.code && res.code !== 200) {
      console.error('API 错误：', res.message || 'Error')
      return Promise.reject(new Error(res.message || 'Error'))
    }

    // 返回实际数据
    return res.data || res
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    console.error('响应错误：', error.message)
    
    // 处理不同的 HTTP 状态码
    if (error.response) {
      console.error('响应错误', error)

      switch (error.response.status) {
        case 401:
          console.error('未授权，请重新登录')
          break
        case 403:
          console.error('拒绝访问')
          break
        case 404:
          console.error('请求错误，未找到该资源')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error(`连接错误：${error.response.status}`)
      }
    } else {
      console.error('连接服务器失败')
    }
    
    return Promise.reject(error)
  }
)

// 导出封装好的请求方法
export default service
