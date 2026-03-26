import request from './request'

export const getCourses = (params) => {
  return request.get('/courses', { params })
}

export const getCourseDetail = (id) => {
  return request.get(`/courses/${id}`)
}

export const createCourse = (data) => {
  return request.post('/courses', data)
}
