<template>
  <div class="courses-page">
    <div class="header">
      <h1>课程学习</h1>
    </div>
    
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else class="course-list">
      <div v-for="course in courses" :key="course.id" class="course-card" @click="goToDetail(course.id)">
        <div class="cover">
          <img v-if="course.cover_image" :src="course.cover_image" :alt="course.title">
          <div v-else class="placeholder">暂无封面</div>
        </div>
        <div class="info">
          <h3>{{ course.title }}</h3>
          <p class="desc">{{ course.description }}</p>
          <div class="meta">
            <span>{{ course.category_name }}</span>
            <span>{{ course.material_count }} 个资料</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="!loading && courses.length === 0" class="empty">
      暂无课程
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCourses } from '../api/courses'

const router = useRouter()
const courses = ref([])
const loading = ref(true)

const fetchCourses = async () => {
  try {
    const data = await getCourses()
    courses.value = data.list || []
  } catch (error) {
    console.error('获取课程失败:', error)
  } finally {
    loading.value = false
  }
}

const goToDetail = (id) => {
  router.push(`/courses/${id}`)
}

onMounted(fetchCourses)
</script>

<style scoped>
.courses-page {
  max-width: 1200px;
}

.header {
  margin-bottom: 24px;
}

.header h1 {
  color: #333;
}

.course-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.course-card:hover {
  transform: translateY(-4px);
}

.cover {
  height: 160px;
  background: #f0f0f0;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.info {
  padding: 16px;
}

.info h3 {
  margin-bottom: 8px;
  color: #333;
}

.desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

.loading,
.empty {
  text-align: center;
  padding: 60px;
  color: #999;
}
</style>
