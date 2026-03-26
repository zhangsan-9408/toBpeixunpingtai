<template>
  <div class="dashboard">
    <h1>欢迎回来，{{ userStore.userInfo?.real_name }}</h1>
    <div class="stats-cards">
      <div class="card">
        <h3>在学课程</h3>
        <p class="number">3</p>
      </div>
      <div class="card">
        <h3>已完成</h3>
        <p class="number">5</p>
      </div>
      <div class="card">
        <h3>考试次数</h3>
        <p class="number">12</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.dashboard h1 {
  margin-bottom: 24px;
  color: #333;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card h3 {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.card .number {
  font-size: 36px;
  font-weight: bold;
  color: #667eea;
}
</style>
