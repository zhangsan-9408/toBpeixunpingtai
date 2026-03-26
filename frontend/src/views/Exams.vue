<template>
  <div class="exams-page">
    <h1>我的考试</h1>
    <div class="exam-list">
      <div class="exam-card">
        <h3>JavaScript 基础测试</h3>
        <p>题目数量：10题 | 总分：100分</p>
        <button class="btn">开始考试</button>
      </div>
      <div class="exam-card">
        <h3>产品知识考核</h3>
        <p>题目数量：20题 | 总分：100分</p>
        <button class="btn">开始考试</button>
      </div>
    </div>
  </div>
</template>

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
  margin-bottom: 16px;
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
