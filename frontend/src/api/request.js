import axios from 'axios'
import { useUserStore } from '../stores/user'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 30000
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // 业务错误处理
    if (data.code !== 200) {
      alert(data.message || '请求失败')
      return Promise.reject(new Error(data.message))
    }
    
    return data.data
  },
  (error) => {
    const { response } = error
    
    if (response?.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      window.location.href = '/login'
      alert('登录已过期，请重新登录')
    } else {
      alert(error.message || '网络错误')
    }
    
    return Promise.reject(error)
  }
)

export default request
