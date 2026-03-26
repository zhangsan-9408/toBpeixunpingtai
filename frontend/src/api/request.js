// API 请求封装 - GitHub Pages 版本使用 Mock 数据

import { mockUser, mockCourses, mockCategories, mockExams, mockStats } from './mock'

// 模拟延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API 请求
const mockRequest = {
  async post(url, data) {
    await delay(300)
    
    if (url === '/auth/login') {
      const { username, password } = data
      if ((username === 'admin' || username === 'admin@company.com') && password === '123456') {
        return {
          code: 200,
          message: '登录成功',
          data: mockUser
        }
      }
      if ((username === 'student1' || username === 'student1@company.com') && password === '123456') {
        return {
          code: 200,
          message: '登录成功',
          data: { ...mockUser, username: 'student1', real_name: '李明', role: 'student' }
        }
      }
      throw new Error('用户名或密码错误')
    }
    
    throw new Error('API 未实现')
  },
  
  async get(url, params) {
    await delay(200)
    
    if (url === '/courses') {
      return {
        code: 200,
        data: {
          list: mockCourses,
          pagination: { page: 1, limit: 10, total: mockCourses.length }
        }
      }
    }
    
    if (url.startsWith('/courses/')) {
      const id = parseInt(url.split('/')[2])
      const course = mockCourses.find(c => c.id === id)
      if (course) {
        return {
          code: 200,
          data: { ...course, materials: [] }
        }
      }
      throw new Error('课程不存在')
    }
    
    if (url === '/auth/profile') {
      return {
        code: 200,
        data: mockUser
      }
    }
    
    throw new Error('API 未实现')
  }
}

// 导出请求方法
export default mockRequest

// 为了兼容性，导出常用方法
export const login = (data) => mockRequest.post('/auth/login', data)
export const getProfile = () => mockRequest.get('/auth/profile')
export const getCourses = (params) => mockRequest.get('/courses', params)
export const getCourseDetail = (id) => mockRequest.get(`/courses/${id}`)
