// 课程相关 API - GitHub Pages Mock 版本
import request from './request'

export const getCourses = (params) => request.get('/courses', params)

export const getCourseDetail = (id) => request.get(`/courses/${id}`)

export const createCourse = (data) => {
  console.log('创建课程:', data)
  return Promise.resolve({ code: 200, message: '创建成功' })
}
