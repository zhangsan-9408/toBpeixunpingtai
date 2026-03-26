import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../views/Layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'courses',
        name: 'Courses',
        component: () => import('../views/Courses.vue'),
        meta: { title: '课程学习' }
      },
      {
        path: 'courses/:id',
        name: 'CourseDetail',
        component: () => import('../views/CourseDetail.vue'),
        meta: { title: '课程详情' }
      },
      {
        path: 'exams',
        name: 'Exams',
        component: () => import('../views/Exams.vue'),
        meta: { title: '我的考试' }
      },
      {
        path: 'admin/courses',
        name: 'AdminCourses',
        component: () => import('../views/admin/Courses.vue'),
        meta: { title: '课程管理', requiresAdmin: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 公开页面直接通过
  if (to.meta.public) {
    next()
    return
  }
  
  // 检查登录
  if (!userStore.token) {
    next('/login')
    return
  }
  
  // 检查管理员权限
  if (to.meta.requiresAdmin && userStore.userInfo?.role !== 'admin') {
    next('/')
    return
  }
  
  next()
})

export default router
