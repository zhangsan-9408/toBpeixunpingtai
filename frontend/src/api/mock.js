// Mock 数据 - 用于 GitHub Pages 演示

export const mockUser = {
  id: 1,
  username: 'admin',
  email: 'admin@company.com',
  real_name: '系统管理员',
  role: 'admin',
  token: 'mock-token-12345'
}

export const mockCourses = [
  {
    id: 1,
    title: 'JavaScript 基础入门',
    description: '从零开始学习 JavaScript 编程语言，掌握前端开发基础',
    category_name: '技术技能',
    cover_image: null,
    material_count: 5,
    question_count: 10,
    status: 'published',
    creator_name: '张老师'
  },
  {
    id: 2,
    title: 'Python 数据分析',
    description: '使用 Python 进行数据分析和可视化，适合数据科学入门',
    category_name: '技术技能',
    cover_image: null,
    material_count: 8,
    question_count: 15,
    status: 'published',
    creator_name: '李老师'
  },
  {
    id: 3,
    title: 'React 前端开发',
    description: '现代 React 开发实战教程，包含 Hooks、Router 等',
    category_name: '技术技能',
    cover_image: null,
    material_count: 12,
    question_count: 20,
    status: 'published',
    creator_name: '王老师'
  },
  {
    id: 4,
    title: '销售沟通技巧',
    description: '提升销售沟通能力的实用技巧，适合销售团队培训',
    category_name: '销售技巧',
    cover_image: null,
    material_count: 6,
    question_count: 8,
    status: 'published',
    creator_name: '陈老师'
  },
  {
    id: 5,
    title: '团队管理基础',
    description: '新晋管理者的必备技能，提升团队管理能力',
    category_name: '管理能力',
    cover_image: null,
    material_count: 7,
    question_count: 12,
    status: 'published',
    creator_name: '刘老师'
  }
]

export const mockCategories = [
  { id: 1, name: '新员工入职', description: '新员工入职培训课程' },
  { id: 2, name: '产品知识', description: '公司产品相关知识培训' },
  { id: 3, name: '销售技巧', description: '销售技能提升课程' },
  { id: 4, name: '管理能力', description: '管理层培训课程' },
  { id: 5, name: '技术技能', description: '技术岗位专业培训' }
]

export const mockExams = [
  {
    id: 1,
    title: 'JavaScript 基础测试',
    description: '题目数量：10题 | 总分：100分',
    status: 'ongoing'
  },
  {
    id: 2,
    title: '产品知识考核',
    description: '题目数量：20题 | 总分：100分',
    status: 'completed',
    score: 85
  }
]

export const mockStats = {
  learning: 3,
  completed: 5,
  exams: 12
}
