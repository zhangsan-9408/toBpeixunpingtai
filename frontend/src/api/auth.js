// 认证相关 API - GitHub Pages Mock 版本
import request from './request'

export const login = (data) => request.post('/auth/login', data)

export const getProfile = () => request.get('/auth/profile')
