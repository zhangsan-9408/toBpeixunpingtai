<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">
        <span>ETP</span>
      </div>
      <nav class="menu">
        <router-link to="/dashboard" class="menu-item">
          <span>首页</span>
        </router-link>
        <router-link to="/courses" class="menu-item">
          <span>课程学习</span>
        </router-link>
        <router-link to="/exams" class="menu-item">
          <span>我的考试</span>
        </router-link>
        <router-link v-if="userStore.isAdmin" to="/admin/courses" class="menu-item">
          <span>课程管理</span>
        </router-link>
      </nav>
      <div class="user-info">
        <span>{{ userStore.userInfo?.real_name }}</span>
        <button @click="logout">退出</button>
      </div>
    </aside>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 200px;
  background: #1a1a2e;
  color: white;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu {
  flex: 1;
  padding: 16px 0;
}

.menu-item {
  display: block;
  padding: 12px 24px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
}

.menu-item:hover,
.menu-item.router-link-active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.user-info {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info button {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.main-content {
  flex: 1;
  padding: 24px;
  overflow: auto;
}
</style>
