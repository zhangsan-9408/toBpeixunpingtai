<template>
  <div class="exams-page">
    <h1>我的考试</h1>
    <div class="exam-list">
      <div v-for="exam in mockExams" :key="exam.id" class="exam-card">
        <h3>{{ exam.title }}</h3>
        <p>{{ exam.description }}</p>
        <div v-if="exam.status === 'completed'" class="score">
          得分: {{ exam.score }}分
        </div>
        <button class="btn" @click="startExam(exam)">
          {{ exam.status === 'completed' ? '查看详情' : '开始考试' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { mockExams } from '../api/mock'

const startExam = (exam) => {
  alert(`开始考试: ${exam.title}`)
}
</script>

<style scoped>
.exams-page h1 {
  margin-bottom: 24px;
  color: #333;
}

.exam-list {
  display: grid;
  gap: 16px;
}

.exam-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.exam-card h3 {
  margin-bottom: 8px;
  color: #333;
}

.exam-card p {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}

.score {
  color: #667eea;
  font-weight: bold;
  margin-bottom: 12px;
}

.btn {
  padding: 8px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
