<template>
  <div class="course-detail">
    <div v-if="loading" class="loading">加载中...</div>
    
    <template v-else-if="course">
      <div class="header">
        <h1>{{ course.title }}</h1>
        <p class="desc">{{ course.description }}</p>
        <div class="meta">
          <span>分类：{{ course.category_name }}</span>
          <span>创建者：{{ course.creator_name }}</span>
        </div>
      </div>
      
      <div class="materials">
        <h2>课程内容</h2>
        <div v-if="course.materials?.length" class="material-list">
          <div v-for="material in course.materials" :key="material.id" class="material-item">
            <span class="type">{{ getTypeLabel(material.type) }}</span>
            <span class="title">{{ material.title }}</span>
          </div>
        </div>
        <div v-else class="empty">暂无课程内容</div>
      </div>
      
      <div class="actions">
        <button class="btn-primary" @click="startExam">开始考试</button>
      </div>
    </template>
    
    <div v-else class="error">课程不存在</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourseDetail } from '../api/courses'

const route = useRoute()
const router = useRouter()

const course = ref(null)
const loading = ref(true)

const typeLabels = {
  video: '视频',
  pdf: 'PDF',
  doc: '文档',
  ppt: 'PPT',
  image: '图片',
  text: '文本'
}

const getTypeLabel = (type) => typeLabels[type] || type

const fetchCourse = async () => {
  try {
    const data = await getCourseDetail(route.params.id)
    course.value = data
  } catch (error) {
    console.error('获取课程详情失败:', error)
  } finally {
    loading.value = false
  }
}

const startExam = () => {
  router.push('/exams')
}

onMounted(fetchCourse)
</script>

<style scoped>
.course-detail {
  max-width: 800px;
}

.header {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.header h1 {
  margin-bottom: 12px;
  color: #333;
}

.desc {
  color: #666;
  margin-bottom: 16px;
  line-height: 1.6;
}

.meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #999;
}

.materials {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.materials h2 {
  margin-bottom: 16px;
  color: #333;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.type {
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.loading,
.empty,
.error {
  text-align: center;
  padding: 60px;
  color: #999;
}
</style>
